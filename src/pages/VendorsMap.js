import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AnimatePresence } from 'framer-motion';
import StoreProfileForUser from './StoreProfileForUser';
import defaultImage from '../assets/defaultimage.png';

const VendorsMap = () => {
    const [vendors, setVendors] = useState([]);

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const[selectedVendorType, setSelectedVendorType] = useState(null);
    const [vendorDetailsOpen, setVendorDetailsOpen] = useState(false);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default map center
    const mapRef = useRef(null);
    const [mapType, setMapType] = useState("streets");
    const [viewSet, setViewSet] = useState(false); // Track if view has been set
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(()=>{
        const fetchVendors = async () => {
            try {
                const response = await fetch('https://ryupunch.com/leafly/api/User/get_all_active_vendors');
                const data = await response.json();
                
                if (response.status && data.vendors.length > 0) {
                    data.vendors.forEach(vendor => {
                        vendor.isGlobalVendor = false;
                    });
                    setVendors(data.vendors);
                }
            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
        };
    
        fetchVendors();
    },[])

    const LocationCircle = ({ location }) => {
        const map = useMap();
        
    
        useEffect(() => {
            if (location) {
                const circle = L.circle([location.latitude, location.longitude], {
                    color: 'blue',
                    fillColor: '#3388ff',
                    fillOpacity: 0.2,
                    radius: 5000,
                }).addTo(map);
    
                // Set view only once
                if (!viewSet) {
                    map.setView([location.latitude, location.longitude], 10);
                    setViewSet(true);
                }
    
                return () => map.removeLayer(circle);
            }
        }, [location, map, viewSet]);
    
        return null;
    };
    

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setError(null);
                    fetchNearbyStores(position.coords.latitude, position.coords.longitude);
                },
                () => setError("Location access denied. Click to retry."),
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);

    const createCustomIcon = (imageUrl) => {
        return new L.Icon({
            iconUrl: imageUrl && imageUrl != '' ? 'https://ryupunch.com/leafly/uploads/vendors/' + imageUrl : defaultImage,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
            className: 'rounded-full border-2 border-white shadow-md'
        });
    };

    // Add this new function for user location marker
    const createUserLocationIcon = () => {
        return new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    };

    const tileLayers = {
        streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        hybrid: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    };

    const handlePopupClick = (vendor) => {
        console.log(vendor);
        if (mapRef.current) {
            setMapCenter([vendor.latitude, vendor.longitude]); // Move the map to the vendor
            mapRef.current.flyTo([vendor.latitude, vendor.longitude], 12); // Smooth zoom-in effect
        }

        setSelectedVendor(vendor);
        setSelectedVendorType(vendor.isGlobalVendor);
        setVendorDetailsOpen(true);
    };

    useEffect(() => {
        if (mapRef.current && !vendorDetailsOpen) {
            mapRef.current.setView(mapCenter, mapRef.current.getZoom());
        }
    }, [vendorDetailsOpen]);

    // Function to fetch nearby stores from OpenStreetMap
    const fetchNearbyStores = async (latitude, longitude) => {
        try {
            setIsLoading(true);
            
            const query = `
                [out:json][timeout:25];
                (
                    node["shop"~"cannabis|hemp|cbd"](around:50000, ${latitude}, ${longitude});
                    way["shop"~"cannabis|hemp|cbd"](around:50000, ${latitude}, ${longitude});
                    node["amenity"="dispensary"](around:50000, ${latitude}, ${longitude});
                    way["amenity"="dispensary"](around:50000, ${latitude}, ${longitude});
                );
                out body;
                >;
                out skel qt;
            `;

            const response = await fetch(`https://overpass-api.de/api/interpreter`, {
                method: 'POST',
                body: query
            });
            const data = await response.json();
            console.log(data);
            // Create a map of nodes for quick lookup
            const nodesMap = new Map();
            data.elements.forEach(element => {
                if (element.type === 'node') {
                    nodesMap.set(element.id, element);
                }
            });

            const osmStores = data.elements
                .filter(element => {
                    // Only include elements that have tags
                    return (element.type === 'node' || element.type === 'way') && 
                           element.tags && 
                           (element.tags.shop || element.tags.amenity);
                })
                .map((place) => {
                    let latitude, longitude;

                    if (place.type === 'node') {
                        // For nodes, use direct lat/lon
                        latitude = place.lat;
                        longitude = place.lon;
                    } else if (place.type === 'way' && place.nodes && place.nodes.length > 0) {
                        // For ways, calculate center point from nodes
                        let sumLat = 0, sumLon = 0, count = 0;
                        place.nodes.forEach(nodeId => {
                            const node = nodesMap.get(nodeId);
                            if (node) {
                                sumLat += node.lat;
                                sumLon += node.lon;
                                count++;
                            }
                        });
                        if (count > 0) {
                            latitude = sumLat / count;
                            longitude = sumLon / count;
                        }
                    }

                    // Only return the store if we have valid coordinates
                    if (latitude && longitude) {
                        // Try to get image from various OSM image tags
                        const image = place.tags.image ||
                            place.tags['image:url'] ||
                            place.tags.photo ||
                            place.tags['wikimedia_commons'] ||
                            place.tags.picture ||
                            null;

                        return {
                            id: `osm_${place.id}`,
                            company_name: place.tags.name || 'Unnamed Store',
                            latitude,
                            longitude,
                            image: image,
                            address: place.tags['addr:housenumber'] 
                                ? `${place.tags['addr:housenumber']} ${place.tags['addr:street']}, ${place.tags['addr:city'] || ''}`
                                : place.tags['addr:street'] || 'Address not available',
                            type: place.tags.shop || place.tags.amenity,
                            website: place.tags.website || null,
                            isOsmPlace: true
                        };
                    }
                    return null;
                })
                .filter(store => store !== null); // Remove any null entries

            setVendors(prevVendors => {
                const newVendors = [...prevVendors];
                osmStores.forEach(store => {
                    store.isGlobalVendor = true;
                    // Check if store already exists to avoid duplicates
                    if (!newVendors.some(v => 
                        Math.abs(v.latitude - store.latitude) < 0.0001 && 
                        Math.abs(v.longitude - store.longitude) < 0.0001
                    )) {
                        newVendors.push(store);
                    }
                });
                return newVendors;
            });
        } catch (error) {
            console.error('Error fetching nearby stores:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Update the Marker popup to show OSM-specific information
    const MarkerPopup = ({ vendor }) => (
        <div
            className='bg-white cursor-pointer px-2 py-1'
            onClick={() => handlePopupClick(vendor)}
        >
            <div className="font-semibold">{vendor.company_name}</div>
            {vendor.isOsmPlace && (
                <>
                    {vendor.address && (
                        <div className="text-sm text-gray-600">{vendor.address}</div>
                    )}
                    {vendor.type && (
                        <div className="text-sm text-gray-600">Type: {vendor.type}</div>
                    )}
                </>
            )}
        </div>
    );

    return (
        <div style={{ position: 'relative' }} className='mt-16 md:mt-8'>
            {/* Map Type Selector */}
            <select
                onChange={(e) => setMapType(e.target.value)}
                value={mapType}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: "1000",
                    padding: "5px",
                    background: "#fff",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                }}
                className='form-control form-select w-24 w-25'
            >
                <option value="streets">Streets</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
            </select>

            {/* Leaflet Map */}
            <MapContainer
                center={mapCenter}
                zoom={5}
                style={{ height: '600px', width: '100%', zIndex: 99999 }}
                attributionControl={false}
                whenCreated={(map) => { mapRef.current = map; }}
            >
                <TileLayer url={tileLayers[mapType]} attribution="&copy; OpenStreetMap contributors" />

                {isLoading && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-4 rounded-lg shadow-lg">
                        Loading nearby stores...
                    </div>
                )}

                {vendors.map((vendor) => (
                    <Marker 
                        key={vendor.id} 
                        position={[vendor.latitude, vendor.longitude]}
                        icon={createCustomIcon(vendor.image)}
                    >
                        <Popup autoPan={true}>
                            <MarkerPopup vendor={vendor} />
                        </Popup>
                    </Marker>
                ))}

                {location && (
                    <>
                        <LocationCircle location={location} />
                        <Marker icon={createUserLocationIcon()} position={[location.latitude, location.longitude]}>
                            <Popup autoPan={true}><b>Your Location</b></Popup>
                        </Marker>
                    </>
                )}
            </MapContainer>

            <AnimatePresence>
                {vendorDetailsOpen && (
                    <StoreProfileForUser
                        storeId={selectedVendor}
                        onClose={() => setVendorDetailsOpen(false)}
                        vendorType={selectedVendorType}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorsMap;

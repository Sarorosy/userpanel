import { useEffect, useState } from "react";
import { HeartHandshake, Smile, ThumbsDown, ThumbsUp, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, useParams } from "react-router-dom";
import StrainReviews from "./StrainReviews";
import Carousel from "../components/Carousel";

const StrainDetails = () => {
    const { id } = useParams();
    const [strain, setStrain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, setFavourites } = useAuth();
    const [userFavourites, setUserFavourites] = useState([]);
    const navigate = useNavigate();
    const [favCount, setFavCount] = useState(0);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    useEffect(() => {
        const fetchFavs = () =>{
            if(user && user.favourites){
                setUserFavourites(user.favourites)
            }
        }
        const fetchStrainDetails = async () => {
            try {
                const response = await fetch(
                    "https://ryupunch.com/leafly/api/Strains/get_strain_details/",
                    {
                        method: "POST",
                        body: JSON.stringify({ id: id }),
                    }
                );

                const result = await response.json();
                if (result.status) {
                    setStrain(result.data);
                    setFavCount(result.data.favourite_count)
                } else {
                    setError(result.message || "Failed to fetch strain details");
                }
            } catch (error) {
                setError("Error fetching strain details");
            } finally {
                setLoading(false);
            }
        };
        fetchFavs();
        if (id) {
            fetchStrainDetails();
        }
    }, [id]);

    if (!id) return null;

    const handleFavorite = async (strainId) => {
        if (user && user.email) {
            try {
                const response = await fetch(`https://ryupunch.com/leafly/api/User/toggle_favourite`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ prod_id: strainId })
                });
                const data = await response.json();
                if (data.status) {
                    setFavourites(data.favourites);
                    setUserFavourites(data.favourites);
                    setFavCount(data.favourite_count)
                }
            } catch (error) {
                console.error('Error adding favorite:', error);
            }
        } else {
            navigate('/signin');
        }
    };

    return (
        <div className="container mx-auto p-2 sm:p-4 mt-4 md:mt-2 ">
            <div className="bg-white rounded-xl  relative backdrop-blur-sm border border-green-100">
                {loading ? (
                    <div className="space-y-6">
                        <Skeleton height={40} width="60%" className="mx-auto" />
                        <div className="flex space-x-6">
                            {/* Image skeleton */}
                            <div className="w-1/2">
                                <Skeleton height={300} className="rounded-lg" />
                            </div>
                            {/* Description skeleton */}
                            <div className="w-1/2">
                                <Skeleton count={4} height={20} className="mb-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <Skeleton height={30} />
                            <Skeleton height={30} />
                            <Skeleton height={30} />
                            <Skeleton height={30} />
                        </div>

                        <div className="space-y-3 mt-6">
                            <Skeleton height={25} width="80%" />
                            <Skeleton height={25} width="85%" />
                            <Skeleton height={25} width="75%" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200 text-center">
                            <X size={32} className="text-red-500 mx-auto mb-2" />
                            <p className="text-red-500 text-center font-medium">{error}</p>
                            <button 
                                onClick={() => navigate('/')}
                                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition duration-300"
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white shadow-lg rounded-xl p-4 sm:p-8 text-gray-800 w-full max-w-full md:max-w-4xl mx-auto border-t-4 border-green-700"
                        >
                            {/* Header Section with Title and Favorite */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-green-100">
                                <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3 sm:mb-0">
                                    {strain.name}
                                </h2>
                                <motion.button 
                                    
                                    onClick={() => handleFavorite(strain.id)} 
                                    className="flex items-center gap-2 bg-white hover:bg-green-50 text-green-700 border-2 border-green-700 rounded-full py-2 px-4 transition-all duration-300 shadow-sm"
                                >
                                    {userFavourites.includes(strain.id) ? (
                                        <>
                                            <svg className="w-5 h-5" fill="red" stroke="red" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span className="font-medium">{favCount} </span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span className="font-medium">{favCount} </span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                            
                            {/* Image & Description Container */}
                            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                                {/* Image Carousel */}
                                <div className="w-full md:w-1/2 mb-6 md:mb-0">
                                    {/* <div className="max-w-[260px] sm:max-w-full mx-auto bg-gray-50 p-4 rounded-lg shadow-inner"> */}
                                    <Carousel name={strain.name} images={JSON.parse(strain.images).map(img => `https://ryupunch.com/leafly/uploads/products/${img}`)} />

                                    {/* </div> */}
                                </div>

                                {/* Description Section */}
                                <div className="w-full md:w-1/2">
                                    <div className="mb-5 flex flex-wrap gap-3 items-center">
                                        <span className="inline-flex items-center justify-center px-4 py-2 bg-teal-100 text-green-600 font-medium rounded-full shadow-sm">
                                            {strain.dominant_terpene}
                                        </span>
                                        
                                        <span className="inline-flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-800 font-medium rounded-full shadow-sm">
                                            <span className="font-bold mr-1">THC</span> {strain.thc}%
                                        </span>
                                        
                                        <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-full shadow-sm">
                                            <span className="font-bold mr-1">CBG</span> {strain.cbg}%
                                        </span>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600 shadow-sm">
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            {strain.description}
                                        </p>
                                    </div>
                                    
                                    {/* Stock Status */}
                                    <div className="mt-5 flex items-center">
                                        <span className="font-semibold text-gray-700 mr-3">Status:</span>
                                        <span
                                            className={`px-4 py-1 rounded-full text-sm font-semibold inline-block ${
                                                strain.stock === "1"
                                                    ? "bg-green-100 text-green-700 border border-green-200"
                                                    : "bg-red-100 text-red-700 border border-red-200"
                                            }`}
                                        >
                                            {strain.stock === "1" ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Effects & Benefits */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm sm:text-base">
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-100"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <Smile size={20} className="text-green-600" />
                                        </div>
                                        <h3 className="font-bold text-green-800">Feelings</h3>
                                    </div>
                                    <p className="text-gray-700 break-words">
                                        {JSON.parse(strain.feelings).join(", ")}
                                    </p>
                                </motion.div>
                                
                                <motion.div 
                                    whileHover={{ y: -5 }} 
                                    className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-100"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <ThumbsUp size={20} className="text-blue-600" />
                                        </div>
                                        <h3 className="font-bold text-blue-800">Helps With</h3>
                                    </div>
                                    <p className="text-gray-700 break-words">
                                        {JSON.parse(strain.helps_with).join(", ")}
                                    </p>
                                </motion.div>
                                
                                <motion.div 
                                    whileHover={{ y: -5 }} 
                                    className="bg-red-50 rounded-lg p-4 shadow-sm border border-red-100"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-red-100 p-2 rounded-full">
                                            <ThumbsDown size={20} className="text-red-600" />
                                        </div>
                                        <h3 className="font-bold text-red-800">Negatives</h3>
                                    </div>
                                    <p className="text-gray-700 break-words">
                                        {JSON.parse(strain.negatives).join(", ")}
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>

                        <StrainReviews strainId={id} strain={strain} />
                    </>
                )}
            </div>
        </div>
    );
};

export default StrainDetails;
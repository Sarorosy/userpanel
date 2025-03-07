import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Smile, Star, ThumbsDown, ThumbsUp, X } from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState('editProfile');
    const [favouriteFetching, setFavouriteFetching] = useState(false);
    const [favouriteFetched, setFavouriteFetched] = useState(false);
    const [strains, setStrains] = useState([]);


    // Add state for form fields
    const [formData, setFormData] = React.useState({
        legal_name: user?.legal_name || '',
        preferred_name: user?.preferred_name || '',
        mobile: user?.mobile || '',
        dob: user?.dob || ''
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.legal_name) {
            toast.error("Legal name is required");
            return;
        }
        if (!formData.preferred_name) {
            toast.error("Preferred name is required");
            return;
        }
        if (!formData.mobile) {
            toast.error("Mobile is required");
            return;
        }
        if (!formData.dob) {
            toast.error("Date of birth is required");
            return;
        }
        if (calculateAge(formData.dob) < 21) {
            toast.error("You must be at least 21 years old");
            return;
        }
        try {
            const response = await fetch('https://ryupunch.com/leafly/api/User/update_profile', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (data.status) {
                toast.success(data.message || 'Profile updated successfully');
                login(data.data)
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.log(error);
        }
    };


    // Redirect to signin if no user or no email
    useEffect(() => {
        if (user) {
            if (!user.email) {
                navigate('/signin');
            }
        }
    }, [user, navigate]);

    if (!user || !user.email) return null;

    const handleFavTabClick = () => {
        setActiveTab('favourites');
        if (!favouriteFetched) {
            fetchFavouriteStrains();
        }
    }

    const fetchFavouriteStrains = async () => {
        try {
            setFavouriteFetching(true);
            const response = await fetch('https://ryupunch.com/leafly/api/User/get_favourite_strains', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (data.status) {
                setStrains(data.data)
            } else {
                toast.error(data.message || 'Failed to fetch Favourite Strains');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setFavouriteFetching(false);
            setFavouriteFetched(true);
        }
    }

    return (
        <div className="container mx-auto py-8 sm:py-20 px-4">
            <div className="bg-white rounded-lg shadow-md w-full md:w-2xl mx-auto">
                <div className="flex border-b">
                    <button
                        className={`px-4 py-2 w-1/2 ${activeTab === 'editProfile' ? 'border-b-2 border-green-500 bg-green-100 font-semibold' : ''}`}
                        onClick={() => setActiveTab('editProfile')}
                    >
                        Edit Profile
                    </button>
                    <button
                        className={`px-4 py-2 w-1/2 ${activeTab === 'favourites' ? 'border-b-2 border-green-500 bg-green-100 font-semibold' : ''}`}
                        onClick={handleFavTabClick}
                    >
                        Favourites
                    </button>
                </div>
                {activeTab === 'editProfile' && (

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md w-full md:w-2xl mx-auto">
                        <div className="p-4 sm:p-6 space-y-4">
                            {/* Form Field Groups */}
                            <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4">
                                <div className="font-semibold sm:col-span-4">Legal Name:</div>
                                <div className="sm:col-span-8">
                                    <input
                                        type="text"
                                        name="legal_name"
                                        value={formData.legal_name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-500 text-sm mt-1" style={{ fontSize: '12px' }}>
                                        Your legal name is needed for checkout
                                    </span>
                                </div>

                            </div>

                            <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4">
                                <div className="font-semibold sm:col-span-4">Preferred Name:</div>
                                <div className="sm:col-span-8">
                                    <input
                                        type="text"
                                        name="preferred_name"
                                        value={formData.preferred_name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-500 text-sm mt-1" style={{ fontSize: '12px' }}>
                                        What should we call you? We'll use this on-site and in other forms of communication between Greenmart and you
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4">
                                <div className="font-semibold sm:col-span-4">Email:</div>
                                <div className="sm:col-span-8">
                                    <input type="email" className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.email} readOnly disabled />
                                    {user.is_verified && user.is_verified == "0" && (
                                        <span className="text-red-500 text-sm mt-1 flex items-center space-x-2">
                                            <X size={16} className='text-red-500 text-xsm' />
                                            <span>Email Not Verified</span>

                                        </span>
                                    )}
                                    <span className="text-gray-500 text-sm mt-1" style={{ fontSize: '12px' }}>

                                        You can use this to login, and stores will see this when you review
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4">
                                <div className="font-semibold sm:col-span-4">Mobile:</div>
                                <div className="sm:col-span-8">
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-500 text-sm mt-1" style={{ fontSize: '12px' }}>
                                        We won’t share this without your permission
                                    </span>
                                </div>

                            </div>

                            <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4">
                                <div className="font-semibold sm:col-span-4">Date of Birth:</div>
                                <div className="sm:col-span-8">
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <br />
                                    <span className="text-gray-500 text-sm mt-1" style={{ fontSize: '12px' }}>
                                        This helps us understand who’s using Greenmart

                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                {activeTab === 'favourites' && (
                    favouriteFetching ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="bg-white rounded-lg p-3 space-y-2 shadow ">
                                    <div className="flex items-start justify-between gap-2 mt-2">
                                        {/* Skeleton image */}
                                        <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0" />

                                        {/* Skeleton content */}
                                        <div className="flex-1">
                                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                                            <div className="flex gap-2">
                                                <div className="h-4 bg-gray-200 rounded w-20" />
                                                <div className="h-4 bg-gray-200 rounded w-16" />
                                            </div>
                                        </div>

                                        {/* Skeleton favorite button */}
                                        <div className="w-7 h-7 bg-gray-200 rounded-full flex-shrink-0" />
                                    </div>

                                    {/* Skeleton stats */}
                                    <div className="mt-3 space-y-2">
                                        <div className="flex gap-3">
                                            <div className="h-4 bg-gray-200 rounded w-16" />
                                            <div className="h-4 bg-gray-200 rounded w-16" />
                                        </div>

                                        {/* Skeleton effects */}
                                        <div className="flex justify-around mt-2">
                                            <div className="h-6 bg-gray-200 rounded w-20" />
                                            <div className="h-6 bg-gray-200 rounded w-20" />
                                            <div className="h-6 bg-gray-200 rounded w-20" />
                                        </div>
                                    </div>

                                    {/* Skeleton button */}
                                    <div className="flex items-center justify-center w-full">
                                        <div className="h-8 bg-gray-200 rounded-full w-full mt-3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-1 md:p-4">
                            {strains.map((strain) => (
                                <div key={strain.id} className="relative bg-white rounded-lg p-3 space-y-2 shadow hover:shadow-md max-w-80 cursor-pointer" onClick={() => navigate(`/straindetails/${strain.id}/${strain.name.toLowerCase().replace(/ /g, '-')}`)}>
                                    <div className="flex items-start justify-between gap-2 mt-2">
                                        {/* Left side with image */}
                                        <img
                                            src={`https://ryupunch.com/leafly/uploads/products/${strain.images ? JSON.parse(strain.images)[0] : ''
                                                }`}
                                            alt={strain.name}
                                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                        />

                                        {/* Middle content */}
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg font-semibold truncate">{strain.name}</h2>
                                            {strain.alternate_names && (
                                                <p className="text-xs text-gray-500 truncate">aka {strain.alternate_names}</p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                                    {strain.dominant_terpene || 'Hybrid'}
                                                </span>
                                                {strain.rating ? (
                                                    <div className="flex items-center text-sm">
                                                        <span className="font-medium">{strain.rating}</span>
                                                        <span className="text-yellow-400 ml-1"><Star size={15} fill='#fbd22a' /></span>
                                                        {strain.num_reviews && (
                                                            <span className="text-xs text-gray-500 ml-1">({strain.num_reviews})</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-sm">
                                                        <span className="font-medium">4.5</span>
                                                        <span className="text-yellow-400 ml-1"><Star size={15} fill='#fbd22a' /></span>

                                                        <span className="text-xs text-gray-500 ml-1">(66)</span>

                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                    </div>

                                    {/* Stats and effects section */}
                                    <div className="mt-3 space-y-2">
                                        {/* THC/CBG stats */}
                                        <div className="flex gap-3">
                                            {strain.thc && (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xs text-gray-600">THC</span>
                                                    <span className="text-sm font-semibold">{strain.thc}%</span>
                                                </div>
                                            )}
                                            {strain.cbg && (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xs text-gray-600">CBG</span>
                                                    <span className="text-sm font-semibold">{strain.cbg}%</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Effects, Helps With, Side Effects */}
                                        <div className=" flex mt-2 space-x-2 items-center justify-around">
                                            {strain.feelings && (
                                                <div className="flex items-center">
                                                    <span className="text-xs text-gray-600 mr-1"><Smile size={16} /></span>
                                                    <div className="flex flex-wrap gap-1 mt-0.5">

                                                        <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                                                            {JSON.parse(strain.feelings)[0]}
                                                        </span>

                                                    </div>
                                                </div>
                                            )}

                                            {strain.helps_with && (
                                                <div className="flex items-center">
                                                    <span className="text-xs text-gray-600 mr-1"><ThumbsUp size={16} /></span>
                                                    <div className="flex flex-wrap gap-1 ">

                                                        <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                                            {JSON.parse(strain.helps_with)[0]}
                                                        </span>

                                                    </div>
                                                </div>
                                            )}

                                            {strain.negatives && (
                                                <div className="flex items-center">
                                                    <span className="text-xs text-gray-600 mr-1"><ThumbsDown size={16} /></span>
                                                    <div className="flex flex-wrap gap-1">

                                                        <span className="text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                                                            {JSON.parse(strain.negatives)[0]}
                                                        </span>

                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default UserProfile;

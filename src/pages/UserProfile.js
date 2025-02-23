import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {login} = useAuth();

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
                toast.error(data.message || 'Failed to update profile'  );
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

    return (
        <div className="container mx-auto py-8 sm:py-20 px-0 md:px-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md w-full md:w-2xl mx-auto">
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h4 className="text-lg sm:text-xl font-semibold">Edit Profile</h4>
                </div>
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
                            <input type="email" className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' value={user.email} readOnly disabled/>
                            {user.is_verified && user.is_verified == "0" && (
                                <span className="text-red-500 text-sm mt-1 flex items-center space-x-2">
                                    <X size={16}  className='text-red-500 text-xsm'/>
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
                            <br/>
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
        </div>
    );
};

export default UserProfile;

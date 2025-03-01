import { useEffect, useState } from "react";
import { HeartHandshake, Smile, ThumbsDown, ThumbsUp, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "react-router-dom";

const StrainDetails = () => {
    const { id } = useParams();
    const [strain, setStrain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
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
                } else {
                    setError(result.message || "Failed to fetch strain details");
                }
            } catch (error) {
                setError("Error fetching strain details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStrainDetails();
        }
    }, [id]);

    if (!id) return null;

    return (
        <div className="container mx-auto p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-lg p-1 sm:p-4 relative">


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
                    <p className="text-red-500 text-center font-medium">{error}</p>
                ) : (
                    <div className="bg-white shadow-lg rounded-lg p-3 sm:p-6 text-gray-800 w-full max-w-full md:max-w-3xl mx-auto">
                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6">{strain.name}</h2>

                        {/* Image & Description Container */}
                        <div className="flex flex-col md:flex-row items-start gap-2 md:space-x-6">
                            {/* Image Carousel */}
                            <div className="w-full md:w-1/2 mb-5 md:mb-0">
                                <div className="max-w-[260px] sm:max-w-full mx-auto">
                                    <Slider {...sliderSettings} className="mx-auto">
                                        {JSON.parse(strain.images).map((img, index) => (
                                            <div key={index} className="flex justify-center px-2">
                                                <img
                                                    src={`https://ryupunch.com/leafly/uploads/products/${img}`}
                                                    alt={strain.name}
                                                    className="w-auto max-h-[200px] sm:max-h-[256px] object-contain rounded-md shadow-md mx-auto"
                                                    onError={(e) =>
                                                        (e.target.src = "https://placehold.co/300x200?text=No+Image")
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="w-full md:w-1/2">
                                <div className="mb-4 flex gap-3 items-center">
                                    <p className="font-semibold border border-gray-300 p-1 rounded-md">{strain.dominant_terpene}</p>
                                    <p><span className="font-semibold">THC</span> {strain.thc}%</p>
                                    <p><span className="font-semibold">CBG</span> {strain.cbg}%</p>
                                </div>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{strain.description}</p>
                            </div>
                        </div>
  
                        {/* Effects & Benefits */}
                        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-sm sm:text-base">
                            <p className="flex items-center gap-2">
                                <Smile size={16} className="text-green-500 flex-shrink-0" />
                                <span className="font-semibold">Feelings:</span>
                                <span className="text-gray-600 break-words">{JSON.parse(strain.feelings).join(", ")}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <ThumbsUp size={16} className="text-blue-500 flex-shrink-0" />
                                <span className="font-semibold">Helps With:</span>
                                <span className="text-gray-600 break-words">{JSON.parse(strain.helps_with).join(", ")}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <ThumbsDown size={16} className="text-red-500 flex-shrink-0" />
                                <span className="font-semibold">Negatives:</span>
                                <span className="text-gray-600 break-words">{JSON.parse(strain.negatives).join(", ")}</span>
                            </p>
                        </div>

                        {/* Stock Status */}
                        <div className="mt-4 sm:mt-6">
                            <p className="font-semibold">Stock Status:</p>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block mt-2 ${strain.stock === "1"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {strain.stock === "1" ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};

export default StrainDetails;
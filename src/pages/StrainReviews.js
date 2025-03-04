import { useEffect, useState } from "react";
import { Star, Eye, Smile, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StrainReviews = ({ strainId, strain }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStrainReviews = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://ryupunch.com/leafly/api/User/strain_reviews/${strainId}`);
                const data = await response.json();
                if (data.status) {
                    setReviews(data.data);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStrainReviews();
    }, [strainId]);

    return (
        <div className="mt-6 w-full max-w-full md:max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{strain?.name} Reviews</h1>
            <button
                className="mt-4 w-full px-4 py-2 text-white bg-green-700 rounded-lg shadow-md hover:bg-green-800"
                onClick={() => user ? navigate('/write-review/' + strainId) : navigate("/signin")}
            >
                Write a Review
            </button>
            <h3 className="mt-6 text-lg font-semibold text-gray-800 dark:text-white">Reviews</h3>
            {loading && <Skeleton count={3} height={100} className="mt-4" />}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {!loading && reviews.length === 0 && <p className="text-gray-500 mt-4 text-center">No reviews yet. Be the first to write one!</p>}
            {!loading && reviews.length > 0 && (
                <div className="mt-4 space-y-4">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                        size={15}
                                        key={i}
                                        className={i < review.stars ? "text-yellow-500" : "text-gray-400"}
                                        fill={i < review.stars ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">{new Date(review.created_on).toDateString()}</span>
                            </div>
                            <span className="text-gray-900 dark:text-white font-semibold">{review.preferred_name}</span>
                            <div className="mt-2 flex gap-2 text-sm">
                                {JSON.parse(review.effects || "[]").map((effect, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{effect}</span>
                                ))}
                            </div>
                            <p className="mt-2 text-gray-800 dark:text-gray-200">{review.experience.length > 100 ? review.experience.slice(0, 100) + "..." : review.experience}</p>
                            {review.experience.length > 100 && <button className="text-blue-500 text-sm">read full review</button>}
                            <div className="mt-3 flex items-center gap-4">
                                <button className="flex items-center text-sm text-gray-500 hover:text-black"><ThumbsUp className="mr-1" size={16} /> Helpful</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StrainReviews;

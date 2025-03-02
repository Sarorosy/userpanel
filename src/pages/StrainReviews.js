import { useEffect, useState } from "react";
import { HeartHandshake, Smile, ThumbsDown, ThumbsUp, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import WriteReviewComponent from "./WriteReviewComponent";

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

    const handleWriteReview = () => {
        if (user && user.email) {
            navigate('/write-review/' + strainId);
        } else {
            navigate("/signin");
        }
    };

    return (
        <div className="mt-6 w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{strain && strain.name} Reviews</h1>
            <button
                className="mt-4 w-full px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                onClick={handleWriteReview}
            >
                Write a Review
            </button>

            <h3 className="mt-6 text-lg font-semibold text-gray-800 dark:text-white">Reviews</h3>

            {loading && <Skeleton count={3} height={100} className="mt-4" />}

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {!loading && !error && reviews.length === 0 && (
                <p className="text-gray-500 mt-4 text-center">No reviews yet. Be the first to write one!</p>
            )}

            {!loading && reviews.length > 0 && (
                <div className="mt-4 space-y-4">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow"
                        >
                            <p className="text-gray-800 dark:text-gray-200">{review.comment}</p>
                            <p className="mt-2 text-sm text-gray-500">- {review.user_name}</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StrainReviews;

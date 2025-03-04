import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TermsOfUse = () => {
    const [value, setValue] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTermsOfUse = async () => {
            try {
                const response = await axios.get(
                    "https://ryupunch.com/leafly/api/User/get_termsofuse"
                );

                if (response.data.status) {
                    setValue(response.data.data);
                    setCreatedAt(response.data.created_at);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Failed to fetch Terms of Use!");
            } finally {
                setLoading(false);
            }
        };

        fetchTermsOfUse();
    }, []);

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-lg shadow-lg mt-8 md:mt-12">
            {/* Header */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Terms Of Use
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
                Last Updated:{" "}
                <span className="font-semibold text-gray-700">{createdAt}</span>
            </p>

            {/* Content */}
            {loading ? (
                <p className="text-gray-500 text-center">Loading...</p>
            ) : (
                <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: value }}
                ></div>
            )}
        </div>
    );
};

export default TermsOfUse;

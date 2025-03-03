import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftCircleIcon, MinusCircle, Plus, PlusCircle, Star } from "lucide-react";
import anxious from '../assets/reviews/anxious.svg';
import aroused from '../assets/reviews/aroused.svg';
import creative from '../assets/reviews/idea.svg';
import dizzy from '../assets/reviews/dizzy.svg';
import dryeyes from '../assets/reviews/eye.svg';
import mouth from '../assets/reviews/mouth.svg';
import energetic from '../assets/reviews/energy.svg';
import euphoric from '../assets/reviews/star.svg';
import focused from '../assets/reviews/target.svg';
import giggly from '../assets/reviews/giggly.svg';
import happy from '../assets/reviews/smile.svg';
import headache from '../assets/reviews/headache.svg';
import hungry from '../assets/reviews/stomach.svg';
import paranoid from '../assets/reviews/shocked.svg';
import relaxed from '../assets/reviews/natural.svg';
import sleepy from '../assets/reviews/sleep.svg';
import talkative from '../assets/reviews/talkative.svg';
import tingly from '../assets/reviews/spark.svg';
import uplifted from '../assets/reviews/up.svg';
import toast, { Toaster } from "react-hot-toast";

const effectIcons = {
    "Anxious": anxious,
    "Aroused": aroused,
    "Creative": creative,
    "Dizzy": dizzy,
    "Dry eyes": dryeyes,
    "Dry mouth": mouth,
    "Energetic": energetic,
    "Euphoric": euphoric,
    "Focused": focused,
    "Giggly": giggly,
    "Happy": happy,
    "Headache": headache,
    "Hungry": hungry,
    "Paranoid": paranoid,
    "Relaxed": relaxed,
    "Sleepy": sleepy,
    "Talkative": talkative,
    "Tingly": tingly,
    "Uplifted": uplifted
};

const options = {
    effects: [
        "Anxious", "Aroused", "Creative", "Dizzy", "Dry eyes", "Dry mouth", "Energetic", "Euphoric", "Focused", "Giggly", "Happy", "Headache", "Hungry", "Paranoid", "Relaxed", "Sleepy", "Talkative", "Tingly", "Uplifted"
    ],
    flavors: [
        "Ammonia", "Apple", "Apricot", "Berry", "Blueberry", "Blue Cheese", "Butter", "Cheese", "Chemical", "Chestnut", "Citrus", "Coffee", "Diesel", "Earthy", "Flowery", "Grape", "Grapefruit", "Honey"
    ],
    helpsWith: [
        "ADD/ADHD", "Alzheimer's", "Anorexia", "Anxiety", "Arthritis", "Asthma", "Bipolar disorder", "Cachexia", "Cancer", "Cramps", "Crohn's disease", "Depression", "Epilepsy", "Eye pressure", "Fatigue", "Fibromyalgia", "Gastrointestinal disorder", "Glaucoma", "HIV/AIDS", "Headaches", "Hypertension", "Inflammation", "Insomnia", "Lack of appetite", "Migraines", "Multiple sclerosis", "Muscle spasms", "Muscular dystrophy", "Nausea", "PMS", "PTSD", "Pain", "Parkinson's", "Phantom limb pain", "Seizures", "Spasticity", "Spinal cord injury", "Stress", "Tinnitus", "Tourette's syndrome"
    ]
};

const WriteReviewComponent = () => {
    const { strainId } = useParams();
    const [stars, setStars] = useState(0);
    const [selectedEffects, setSelectedEffects] = useState([]);
    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [selectedHelpsWith, setSelectedHelpsWith] = useState([]);
    const navigate = useNavigate();
    const [flavourOpen, setFlavourOpen] = useState(false);
    const [helpsWithOpen, setHelpsWithOpen] = useState(false);

    const [reviewText, setReviewText] = useState("");
    const { user } = useAuth();

    const handleSelection = (setState, selectedArray, value) => {
        if (selectedArray.includes(value)) {
            setState(selectedArray.filter(item => item !== value));
        } else if (selectedArray.length < 4) {
            setState([...selectedArray, value]);
        }
    };

    const handleEffectSelection = (effect) => {
        setSelectedEffects(prev => {
            if (prev.includes(effect)) {
                return prev.filter(e => e !== effect);
            }
            if (prev.length < 4) {
                return [...prev, effect];
            }
            return prev;
        });
    };

    const handleSubmit = async () => {
        try {
            if(stars == 0){
                toast.error("Please provide Star Rating!",{
                    style: {
                        background: '#333',
                        color: '#fff',
                      },
                });
                return;
            }
            if(!reviewText){
                toast.error("Please write your experience",{
                    style: {
                        background: '#333',
                        color: '#fff',
                      },
                });
                return;
            }
            const response = await fetch("https://ryupunch.com/leafly/api/User/submit_review", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    star: stars,
                    effect: selectedEffects,
                    flavor: selectedFlavors,
                    helpswith: selectedHelpsWith,
                    experience: reviewText,
                    prod_id: strainId ,
                }),
            });
    
            const data = await response.json();
    
            if (data.status) {
                toast.success(data.message || "Review submitted successfully!",{
                    style: {
                        background: '#333',
                        color: '#fff',
                      },
                });
                navigate('strains')
            } else {
                toast.error(data.message || "Error submitting review",{
                    style: {
                        background: '#333',
                        color: '#fff',
                      },
                });
            }
        } catch (e) {
            console.error("Fetch error:", e);
        }
    };

    
    return (
        <div className="mt-6 w-full max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <p className=" cursor-pointer flex items-center hover:text-green-700" onClick={()=>navigate(-1)}> <ArrowLeftCircleIcon size={18} className="mr-2" /> Back</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Write a Review</h1>

            {/* Star Rating */}
            <div className="my-4 border rounded p-2 w-full max-w-sm flex flex-col items-center">
                <h3 className="text-lg font-semibold text-center">How many stars would you like to give?</h3>
                <div className="flex space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => setStars(num)}
                            className="p-1"
                        >
                            <Star
                                size={32}
                                className={`transition-all ${num <= stars ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Effects */}
            <div className="my-6">
                <h3 className="text-lg font-semibold">Which effects did you feel? <span className="text-sm text-gray-400">(Choose up to 4)</span></h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                {Object.entries(effectIcons).map(([effect, icon]) => (
                    <button
                        key={effect}
                        onClick={() => handleEffectSelection(effect)}
                        className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                            selectedEffects.includes(effect) ? 'bg-green-50' : ''
                        }`}
                        style={{border : selectedEffects.includes(effect) ? '1px solid #15803d ' : '1px solid #c1c6cd'}}
                    >
                        <img src={icon} alt={effect} className="w-5 h-5" />
                        <span className="text-xs mt-1">{effect}</span>
                    </button>
                ))}
                </div>
            </div>

            <hr />
            {/* Flavor & Smell */}
            <div className="my-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Describe the flavor & smell? <span className="text-sm text-gray-400">(Choose up to 4)</span></h3>
                    <button onClick={() => { setFlavourOpen(!flavourOpen) }}>
                        {flavourOpen ? <MinusCircle size={18} /> : <PlusCircle size={18} />}
                    </button>
                </div>
                {flavourOpen && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                        {options.flavors.map(flavor => (
                            <button key={flavor} className={`px-4 py-2 border rounded-lg ${selectedFlavors.includes(flavor) ? 'border-green-600 bg-green-100' : 'border-gray-300'}`} onClick={() => handleSelection(setSelectedFlavors, selectedFlavors, flavor)}>
                                {flavor}
                            </button>
                        ))}
                    </div>

                )}
            </div>

            <hr />
            {/* Helps With */}
            <div className="my-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Helps with? <span className="text-sm text-gray-400">(Choose up to 4)</span></h3>
                    <button onClick={() => { setHelpsWithOpen(!helpsWithOpen) }}>
                        {helpsWithOpen ? <MinusCircle size={18} /> : <PlusCircle size={18} />}
                    </button>
                </div>
                {helpsWithOpen && (

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                        {options.helpsWith.map(help => (
                            <button key={help} className={`px-4 py-2 border rounded-lg ${selectedHelpsWith.includes(help) ? 'border-red-600 bg-red-100' : 'border-gray-300'}`} onClick={() => handleSelection(setSelectedHelpsWith, selectedHelpsWith, help)}>
                                {help}
                            </button>
                        ))}
                    </div>

                )}
            </div>

                <hr/>

            {/* Review Text */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold">Share your experience</h3>
                <textarea className="w-full mt-2 p-3 border rounded-lg border-gray-300" rows="5" placeholder="Write your review here..." value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmit} className="mt-4 w-full px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 ">
                Submit Review
            </button>
            <Toaster position="bottom-left" />
        </div>
    );
};

export default WriteReviewComponent;
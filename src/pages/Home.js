import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Smile, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
const Home = () => {


  const [weedData, setWeedData] = useState([]);
  const [userFavourites, setUserFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setFavourites } = useAuth();
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch("https://ryupunch.com/leafly/api/User/getallads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const result = await response.json();
      if (result.status) {

        setAds(result.data);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };
  const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  if (!ads || ads.length === 0) return;

  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  }, 5000); // Change ad every 5 seconds

  return () => clearInterval(interval);
}, [ads]);

  useEffect(() => {
    const fetchWeedData = async () => {
      setLoading(true);
      const response = await fetch(`https://ryupunch.com/leafly/api/Strains/get_all_strains`);
      const data = await response.json();
      if (data.status) {
        setWeedData(data.data.slice(0, 3));
      }
      setLoading(false);
    };
    fetchWeedData();

    const updateUserFavourites = async () => {
      if (user && user.email) {
        setUserFavourites(user.favourites ?? [])
      }
    }
    updateUserFavourites();
  }, []);

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
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    } else {
      navigate('/signin');
    }
  };

  return (
    <section className='bg-gray-100 mt-16 md:mt-8'>
      <section className="w-full h-[250px] md:h-[250px] lg:h-[250px] overflow-hidden relative">
  <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
    {ads.map((ad) => (
      <div key={ad.id} className="w-full h-full flex-shrink-0 relative">
        <img
          src={ad.background_image ? `https://ryupunch.com/leafly/uploads/ads/${ad.background_image}` : "/mnt/data/image.png"}
          alt="Ad Image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center items-start px-6 sm:px-12">
          <p className="text-sm sm:text-base text-white font-light">{ad.small_heading || "The Herbal Care"}</p>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">{ad.large_heading || "New Deals & Fresh Drops Every Week"}</h2>
          <a href={ad.link || "#"} target='_blank' className="mt-3 bg-black text-white px-4 py-2 rounded-lg text-sm sm:text-base font-semibold">{ad.button_text}</a>
        </div>
      </div>
    ))}
  </div>
</section>


      <div className="container mb-5">
        <h1 className="text-3xl font-bold text-center">Great weed you can find today.</h1>
        <h2 className="text-center my-1">These are all found near <a href="#" className='font-semibold text-green-700'>{user && user.location && (user.location.name ?? "Allow location to find strains near you")}</a></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {loading ? (
            // Skeleton loaders
            [...Array(3)].map((_, index) => (
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

                <div className="flex items-center justify-center w-full">
                  <div className="h-8 bg-gray-200 rounded-full w-full mt-3" />
                </div>
              </div>
            ))
          ) : (
            weedData.map((strain) => (
              <div key={strain.id} className=" mt-3 relative bg-white rounded-lg p-3 space-y-2 shadow hover:shadow-md max-w-80 cursor-pointer" >
                <div className="flex items-start justify-between gap-2 mt-2">
                  {/* Left side with image */}
                  <img
                    src={`https://ryupunch.com/leafly/uploads/products/${strain.images ? JSON.parse(strain.images)[0] : ''
                      }`}
                    alt={strain.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    onClick={() => navigate(`/straindetails/${strain.id}/${strain.name.toLowerCase().replace(/ /g, '-')}`)}
                  />

                  {/* Middle content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold truncate"
                      onClick={() => navigate(`/straindetails/${strain.id}/${strain.name.toLowerCase().replace(/ /g, '-')}`)}
                    >{strain.name}</h2>

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

                  {/* Right side favorite button */}
                  <button onClick={() => handleFavorite(strain.id)} className="text-teal-600 hover:text-teal-700 border border-teal-600 rounded-full p-1 flex-shrink-0 hover:scale-105 transition-all duration-300">
                    {userFavourites.includes(strain.id) ? (
                      <svg className="w-5 h-5" fill="red" stroke="red" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ) : (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>)}
                  </button>
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
                <div className='flex items-center justify-center w-full'>
                  <button onClick={() => navigate(`/straindetails/${strain.id}/${strain.name.toLowerCase().replace(/ /g, '-')}`)} className='bg-green-600 text-white px-3 py-1 rounded-full mt-3 w-full'>Learn More</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-center my-10">
        <h1 className="text-4xl font-bold mb-6">Welcome to Leafly</h1>
        <p className="text-xl mb-12">A great place to discover cannabis.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-3">A weed community</h3>
            <p className="text-gray-600">11,000+ articles. 5,000+ strains. 1.3mm+ reviews. Legalization advocates with a social justice and equity mindset.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-3">Making life easy</h3>
            <p className="text-gray-600">Shop by strain, price, deals, dispensary, location, brand, star-rating, or vibes. Find the best legal weed near you.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-3">Buy local, everywhere</h3>
            <p className="text-gray-600">Find the neighborhood dispensaries wherever you are. Place a free online order, pay when you get it.</p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Home;

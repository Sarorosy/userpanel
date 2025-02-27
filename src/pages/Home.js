import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Smile, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
const Home = () => {


  const [weedData, setWeedData] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeedData = async () => {
      const response = await fetch(`https://ryupunch.com/leafly/api/Strains/get_all_strains`);
      const data = await response.json();
      if (data.status) {
        setWeedData(data.data.slice(0, 3));
      }
    };
    fetchWeedData();
  }, []);

  const handleFavorite = (strainId) => {
    console.log(`Favorite button clicked for strain ${strainId}`);
  };

  return (
    <section className='bg-gray-100'>
      <div className="container mb-5">
        <h1 className="text-3xl font-bold text-center">Great weed you can find today.</h1>
        <h2 className="text-center my-1">These are all found near <a href="#" className='font-semibold text-green-700'>{user && (user.location.name ?? "Allow location to find strains near you")}</a></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {weedData.map((strain) => (
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
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
          ))}
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

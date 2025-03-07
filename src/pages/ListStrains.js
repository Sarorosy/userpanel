import { useState, useEffect } from 'react';
import axios from 'axios';
import { Smile, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function ListStrains() {
  const navigate = useNavigate();
  const [strains, setStrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userFavourites, setUserFavourites] = useState([]);
  const { user, setFavourites } = useAuth();

  useEffect(() => {
    const fetchStrains = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ryupunch.com/leafly/api/Strains/get_all_strains');
        setStrains(response.data.data);
      } catch (err) {
        setError('Failed to fetch strains');
      } finally {
        setLoading(false);
      }
    };

    fetchStrains();

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
          toast.success("Success!")
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
    <div className="container mx-auto p-4 mt-4">
      <h1 className="text-2xl font-bold mb-4">Cannabis Strains</h1>
      {loading ? (
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
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

                {/* Right side favorite button */}
                <button onClick={(event) => {
                  event.stopPropagation(); 
                  handleFavorite(strain.id);
                }} className="text-teal-600 hover:text-teal-700 border border-teal-600 rounded-full p-1 flex-shrink-0 hover:scale-105 transition-all duration-300">
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
            </div>
          ))}
        </div>
      )}
    </div>

  );
}

export default ListStrains;

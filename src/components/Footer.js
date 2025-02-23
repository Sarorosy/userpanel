import React from 'react';
import googlePlay from '../assets/google-play.svg';
import appStore from '../assets/app-store.svg';
import { useNavigate } from 'react-router-dom';
const Footer = () => {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://ryupunch.com/leafly/api/user/newsletter_signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Successfully signed up!');
        setEmail('');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Failed to connect. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-white text-black py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Stay In Touch Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-green-900">Stay In Touch</h3>
            <p className="mb-4">Receive updates on new products, special offers, and industry news.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-2 rounded text-gray-800 border border-green-900"
                required
              />
              <button 
                type="submit" 
                className="bg-green-700 hover:bg-green-700 px-4 py-2 rounded w-full text-white disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
              {message && (
                <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-green-900">About Us</h3>
            <ul className="space-y-2">
              <li><a onClick={() => navigate('/about')} className="cursor-pointer hover:text-green-600">About Us</a></li>
              <li><a onClick={() => navigate('/careers')} className="cursor-pointer hover:text-green-600">Careers</a></li>
              <li><a onClick={() => navigate('/contact')} className="cursor-pointer hover:text-green-600">Contact Us</a></li>
              <li><a onClick={() => navigate('/faq')} className="cursor-pointer hover:text-green-600">FAQs</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-green-900">Legal</h3>
            <ul className="space-y-2">
              <li><a onClick={() => navigate('/terms')} className="cursor-pointer hover:text-green-600">Terms of Use</a></li>
              <li><a onClick={() => navigate('/privacy')} className="cursor-pointer hover:text-green-600">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Store & Business Login */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-green-900">For Businesses</h3>
            <ul className="space-y-2">
              <li><a onClick={() => navigate('/store-login')} className="cursor-pointer hover:text-green-600">Store Login</a></li>
              <li><a onClick={() => navigate('/merchant-support')} className="cursor-pointer hover:text-green-600">List Your Store</a></li>
            </ul>
          </div>

          {/* Download App Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Get Our App</h3>
            <div className="space-y-2">
              <a href="#" className="cursor-pointer block hover:opacity-80">
                <img src={appStore} alt="Download on App Store" className="h-10" />
              </a>
              <a href="#" className="cursor-pointer block hover:opacity-80">
                <img src={googlePlay} alt="Get it on Google Play" className="h-10" />
              </a>
            </div>
          </div>
        </div>
        <div className='my-4 text-xsm text-center w-full md:w-2/3 mx-auto' >
          <p className='text-gray-600 italic' style={{fontSize: '12px'}}>
          * Statements made on this website have not been evaluated by the U.S. Food and Drug Administration. These products are not intended to diagnose, treat, cure or prevent any disease. Information provided by this website or this company is not a substitute for individual medical advice.
          </p>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} GreenMart. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isOver21: false,
    receivePromotions: false
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.email){
        toast.error('Email is required');   
        return;
    }
    if(!formData.password){
        toast.error('Password is required');
        return;
    }
    if(!formData.isOver21){
        toast.error('You must be 21 years of age or older to create an account');
        document.getElementById('age-check').style.border = '1px solid red !important';
        return;
    }
    if(formData.password.length < 8){
        toast.error('Password must be at least 8 characters long');
        return;
    }

    try {
      const response = await fetch('https://ryupunch.com/leafly/api/User/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          agecheck: 'yes',
          promotion: formData.receivePromotions ? 'yes' : 'no'
        })
      });

      const data = await response.json();
      if(data.status){
        toast.success(data.message || 'Account created successfully!');
        login(data.data);
        navigate('/');
      }else{
        toast.error(data.message || 'Failed to create account. Please try again.');
      }

      // You might want to redirect to login page or handle successful signup
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
      console.error('Signup error:', error);
    }
  };
  return (
    <div className="custom-scrollbar min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className='text-center text-3xl font-extrabold text-green-700'>GreenMart</h1>
        <h2 className=" text-center text-md font-semibold text-gray-900">
          Create an account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder='Enter your password'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">8 characters or more</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="age-check"
                  name="age-check"
                  type="checkbox"
                  checked={formData.isOver21}
                  onChange={() => setFormData({ ...formData, isOver21: !formData.isOver21 })}
                  className="h-4 w-4 text-green-600 rounded"
                />
                <label htmlFor="age-check" className="ml-2 block text-sm text-gray-900">
                  I affirm that I am 21 years of age or older.
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="promotions"
                  name="promotions"
                  type="checkbox"
                  checked={formData.receivePromotions}
                  onChange={() => setFormData({ ...formData, receivePromotions: !formData.receivePromotions })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="promotions" className="ml-2 block text-sm text-gray-900">
                  I'd like to receive exclusive deals, promotions, personalized recommendations, and news.
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-500">
            By using GreenMart, I agree to the{' '}
            <a href="#" className="text-green-600 hover:text-green-500">
              Terms of Use
            </a>{' '}
            and{' '}
            <a href="#" className="text-green-600 hover:text-green-500">
              Privacy Policy
            </a>
            .
          </p>

          <p className="mt-2 text-xs text-center text-gray-500">
            GreenMart will never post without your permission.
          </p>

          <p className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

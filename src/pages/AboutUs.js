import React from 'react';

const AboutUs = () => {
  const stats = [
    { number: '10,000+', description: 'Happy Customers Served' },
    { number: '500+', description: 'Premium Products' },
    { number: '50+', description: 'Expert Budtenders' },
    { number: '15+', description: 'Years of Experience' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Your Trusted Cannabis Partner</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to GreenMart, where quality meets expertise in the world of cannabis.
          As your premier destination for premium cannabis products, we're committed to
          providing a safe, welcoming, and educational experience for both newcomers
          and connoisseurs alike.
        </p>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-2">{stat.number}</h2>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          At GreenMart, we believe in the power of cannabis to enhance lives and promote
          wellness. Our mission is to provide safe, high-quality cannabis products while
          educating our community about responsible consumption and the benefits of
          natural alternatives.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-3 text-green-600">Quality Assurance</h3>
            <p className="text-gray-600">Every product in our inventory is lab-tested and verified for quality and safety.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-3 text-green-600">Education First</h3>
            <p className="text-gray-600">Our knowledgeable staff is here to guide you through your cannabis journey.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-3 text-green-600">Community Focus</h3>
            <p className="text-gray-600">We're committed to giving back and supporting our local community.</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-2">Sarah Johnson</h3>
            <p className="text-gray-600">Chief Executive Officer</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-2">Michael Chen</h3>
            <p className="text-gray-600">Chief Operations Officer</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-2">Dr. Emily Rodriguez</h3>
            <p className="text-gray-600">Head of Product Development</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

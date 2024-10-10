'use client';
import React, { useEffect, useState } from 'react';
import FormOne from '../forms/FormOne';
import FormTwo from '../forms/FormTwo';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const LandingPage = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [makersFeed, setMakersFeed] = useState<{ imageUrl: string, description: string, type: string, color: string, quantity: string }[]>([]);
  const [collectorsFeed, setCollectorsFeed] = useState<{ imageUrl: string, description: string, type: string, color: string, quantity: string }[]>([]);

  // Load existing feeds from localStorage
  useEffect(() => {
    const savedMakersFeed = localStorage.getItem('makersFeed');
    const savedCollectorsFeed = localStorage.getItem('collectorsFeed');

    if (savedMakersFeed) {
      setMakersFeed(JSON.parse(savedMakersFeed));
    }
    if (savedCollectorsFeed) {
      setCollectorsFeed(JSON.parse(savedCollectorsFeed));
    }
  }, []);

  // Function to add a new listing to the makers feed
  const addToMakersFeed = (newListing: any) => {
    const updatedFeed = [...makersFeed, newListing];
    setMakersFeed(updatedFeed);
    localStorage.setItem('makersFeed', JSON.stringify(updatedFeed)); // Save to localStorage
  };

  // Function to add a new listing to the collectors feed
  const addToCollectorsFeed = (newListing: any) => {
    const updatedFeed = [...collectorsFeed, newListing];
    setCollectorsFeed(updatedFeed);
    localStorage.setItem('collectorsFeed', JSON.stringify(updatedFeed)); // Save to localStorage
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-center text-3xl font-bold">NowhereCollective</h1>
      </header>

      {/* Sub-header */}
      <div className="text-center p-6 bg-white border-b border-gray-300">
        <h1 className="text-4xl font-semibold">Choose an Option</h1>
        <p className="text-lg mt-2">Makers & Collectors Platform</p>
      </div>

      {/* Forms and Feeds */}
      <div className="flex flex-grow">
        {/* Makers Side */}
        <div className="w-1/2 p-8 bg-gray-50 border-r border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Makers: Image Upload & Description</h2>
          <button
            onClick={() => setSelectedForm("form1")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Select Makers Form
          </button>

          {/* Always Display Makers Feed Below */}
          <div className="mt-8">
            {selectedForm === "form1" && <FormOne addToFeed={addToMakersFeed} />} {/* Makers form */}

            {/* Makers Feed Carousel */}
            <div className="mt-6 p-4">
              <h3 className="text-xl font-bold">Makers Feed</h3>
              <Swiper spaceBetween={20} slidesPerView={1} navigation pagination={{ clickable: true }}>
                {makersFeed.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-gray-200 p-4 rounded-lg">
                      <img
                        src={item.imageUrl}
                        alt={item.description}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <p><strong>Description:</strong> {item.description}</p>
                      <p><strong>Type:</strong> {item.type}</p>
                      <p><strong>Color:</strong> {item.color}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* Collectors Side */}
        <div className="w-1/2 p-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Collectors: Other Form</h2>
          <button
            onClick={() => setSelectedForm("form2")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Select Collectors Form
          </button>

          {/* Always Display Collectors Feed Below */}
          <div className="mt-8">
            {selectedForm === "form2" && <FormTwo addToFeed={addToCollectorsFeed} />} {/* Collectors form */}

            {/* Collectors Feed Carousel */}
            <div className="mt-6 p-4">
              <h3 className="text-xl font-bold">Collectors Feed</h3>
              <Swiper spaceBetween={20} slidesPerView={1} navigation pagination={{ clickable: true }}>
                {collectorsFeed.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-gray-200 p-4 rounded-lg">
                      <img
                        src={item.imageUrl}
                        alt={item.description}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <p><strong>Description:</strong> {item.description}</p>
                      <p><strong>Type:</strong> {item.type}</p>
                      <p><strong>Color:</strong> {item.color}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

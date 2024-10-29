"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormOne from "../forms/FormOne";
import FormTwo from "../forms/FormTwo";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const LandingPage = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [makersFeed, setMakersFeed] = useState<
    { id: string; imageUrl: string; description: string; type: string; color: string; quantity: string }[]
  >([]);
  const [collectorsFeed, setCollectorsFeed] = useState<
    { id: string; imageUrl: string; description: string; type: string; color: string; quantity: string }[]
  >([]);
  const router = useRouter();

  // Load feed data from localStorage on mount
  useEffect(() => {
    const savedMakersFeed = localStorage.getItem("makersFeed");
    const savedCollectorsFeed = localStorage.getItem("collectorsFeed");

    if (savedMakersFeed) {
      setMakersFeed(JSON.parse(savedMakersFeed));
    }
    if (savedCollectorsFeed) {
      setCollectorsFeed(JSON.parse(savedCollectorsFeed));
    }
  }, []);

  // Add listing with unique ID and save to localStorage
  const addToMakersFeed = (newListing: any) => {
    const listingWithId = { ...newListing, id: Date.now().toString() };
    const updatedFeed = [...makersFeed, listingWithId];
    setMakersFeed(updatedFeed);
    localStorage.setItem("makersFeed", JSON.stringify(updatedFeed));
  };

  const addToCollectorsFeed = (newListing: any) => {
    const listingWithId = { ...newListing, id: Date.now().toString() };
    const updatedFeed = [...collectorsFeed, listingWithId];
    setCollectorsFeed(updatedFeed);
    localStorage.setItem("collectorsFeed", JSON.stringify(updatedFeed));
  };

  // Delete a listing and update localStorage
  const deleteFromMakersFeed = (id: string) => {
    const updatedFeed = makersFeed.filter((item) => item.id !== id);
    setMakersFeed(updatedFeed);
    localStorage.setItem("makersFeed", JSON.stringify(updatedFeed));
  };

  const deleteFromCollectorsFeed = (id: string) => {
    const updatedFeed = collectorsFeed.filter((item) => item.id !== id);
    setCollectorsFeed(updatedFeed);
    localStorage.setItem("collectorsFeed", JSON.stringify(updatedFeed));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-center text-3xl font-bold">NowhereCollective</h1>
      </header>

      <div className="text-center p-6 bg-white border-b border-gray-300">
        <h1 className="text-4xl font-semibold">Choose an Option</h1>
        <p className="text-lg mt-2">Makers & Collectors Platform</p>
      </div>

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

          <div className="mt-8">
            {selectedForm === "form1" && <FormOne addToFeed={addToMakersFeed} />}
            <div className="mt-6 p-4">
              <h3 className="text-xl font-bold">Makers Feed</h3>
              <Swiper spaceBetween={20} slidesPerView={1} navigation pagination={{ clickable: true }}>
                {makersFeed.map((item, index) => (
                  <SwiperSlide key={item.id}>
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
                      <button
                        onClick={() => deleteFromMakersFeed(item.id)}
                        className="mt-2 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete Listing
                      </button>
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
          <div className="mt-8">
            {selectedForm === "form2" && <FormTwo addToFeed={addToCollectorsFeed} />}
            <div className="mt-6 p-4">
              <h3 className="text-xl font-bold">Collectors Feed</h3>
              <Swiper spaceBetween={20} slidesPerView={1} navigation pagination={{ clickable: true }}>
                {collectorsFeed.map((item, index) => (
                  <SwiperSlide key={item.id}>
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
                      <button
                        onClick={() => deleteFromCollectorsFeed(item.id)}
                        className="mt-2 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete Listing
                      </button>
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

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
    { 
      id: string; 
      imageUrl: string; 
      description: string; 
      type: string; 
      color: string; 
      quantity: string; 
      firstName: string; 
      businessName: string; 
    }[]
  >([]);
  const [collectorsFeed, setCollectorsFeed] = useState<
  { 
    id: string; 
    imageUrl: string; 
    description: string; 
    type: string; 
    color: string; 
    quantity: string; 
    firstName: string; 
    email: string; 
    marketStatus: string; 
  }[]
>([]);

  //const [marketStatus, setMarketStatus] = useState<string>("");
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

  const updateMarketStatus = (id: string, status: string) => {
    const updatedFeed = collectorsFeed.map(item =>
      item.id === id ? { ...item, marketStatus: status } : item
    );
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
      <img src="/image.png" width="200" height="200" alt="logo" />
      </header>

      <div className="text-center p-6 bg-white border-b border-gray-300">
        <h1 className="text-4xl font-semibold">Join our Trashy Market material collection!</h1>
        <p className="text-lg mt-2">These REmakers are accepting specific reusable materials at
           the Trashy Market (Nov 29-30). These materials will be transformed into one-of-a-kind 
           goods. Attendees are invited to collect and donate reusable materials to the REmakers 
           at the Trashy Market. 
        </p>
      </div>

      <div className="flex flex-grow">
        {/* Makers Side */}
        <div className="w-1/2 p-8 bg-gray-50 border-r border-gray-300">
          <h2 className="text-2xl font-bold mb-4">REMAKER: Material Requests</h2>
          <p className="text-base text-gray-800 mb-24">
            If you are a REmaker accepting materials at the Trashy Market, fill out the form below to post your material request.
          </p>
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
              {/* Replacing the Swiper with a scrollable div */}
              <div className="space-y-6 overflow-y-auto max-h-96">
                {makersFeed.map((item) => (
                  <div key={item.id} className="bg-gray-200 p-4 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.description}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p><strong>Business Name:</strong> {item.businessName}</p>
                    <p><strong>First Name:</strong> {item.firstName}</p>
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Collectors Side */}
        <div className="w-1/2 p-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">COLLECTOR: Material Offers</h2>
          <p className="text-base text-gray-800 mb-6">
          Scroll through the REmaker material requests to see if you have materials that match. 
          If you have a potential material match, complete the form at the top of the COLLECTOR 
          feed. The REmaker will approve or reject your match by November 28. If your material is
          approved, bring it to the REmaker at the Trashy Market 
          (Mrs. Murphy's Irish Bistro 3905 N Lincoln Ave).
          </p>
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

              {/* Replacing the Swiper with a scrollable div */}
              <div className="space-y-6 overflow-y-auto max-h-96">
                {collectorsFeed.map((item) => (
                  <div key={item.id} className="bg-gray-200 p-4 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.description}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p><strong>First Name:</strong> {item.firstName}</p>
                    <p><strong>Email:</strong> {item.email}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Type:</strong> {item.type}</p>
                    <p><strong>Color:</strong> {item.color}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Market Status:</strong> {item.marketStatus}</p>

                    <div className="mt-2">
                      <p className="font-medium">Market Status:</p>
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="radio"
                          value="Accepted! Bring to the Market"
                          checked={item.marketStatus === "Accepted! Bring to the Market"}
                          onChange={() => updateMarketStatus(item.id, "Accepted! Bring to the Market")}
                          className="mr-2"
                        />
                        Accepted! Bring to the Market
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="Not this time"
                          checked={item.marketStatus === "Not this time"}
                          onChange={() => updateMarketStatus(item.id, "Not this time")}
                          className="mr-2"
                        />
                        Not this time
                      </label>
                    </div>
                    <button
                      onClick={() => deleteFromCollectorsFeed(item.id)}
                      className="mt-2 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete Listing
                    </button>
                  </div>
                ))}
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

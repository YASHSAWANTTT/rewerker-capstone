"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormOne from "../forms/FormOne";
import FormTwo from "../forms/FormTwo";

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
      claimedBy: string | null; 
      firstNameClaimed?: string; 
    }[] 
  >([]);

  const router = useRouter();

  // Load feed data from localStorage on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/makers-feed');
        const data = await response.json();
        console.log('Fetched data:', data); // Check the data structure here
        setMakersFeed(Array.isArray(data) ? data : data.makers || []);
      } catch (error) {
        console.error("Failed to fetch makers feed:", error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/collectors-feed');
        const data = await response.json();
        console.log('Fetched data:', data); // Check the data structure here
        setCollectorsFeed(Array.isArray(data) ? data : data.collectors || []);
      } catch (error) {
        console.error("Failed to fetch makers feed:", error);
      }
    };
  
    fetchData();
  }, []);
  

  // Add listing with unique ID and save to localStorage
  const addToMakersFeed = async (newListing: object) => {
    const listingWithId = { ...newListing, id: Date.now().toString() };
    try {
      const response = await fetch('/api/makers-feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingWithId),
      });
  
      if (response.ok) {
        const addedListing = await response.json();
        setMakersFeed((prevFeed) => [...prevFeed, addedListing]);
      } else {
        console.error('Failed to add new listing');
      }
    } catch (error) {
      console.error('Error adding new listing:', error);
    }
  };
  

  const addToCollectorsFeed = async (newListing: object) => {
    const listingWithId = { ...newListing, id: Date.now().toString() };
    try {
      const response = await fetch('/api/collectors-feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingWithId),
      });
  
      if (response.ok) {
        const addedListing = await response.json();
        setCollectorsFeed((prevFeed) => [...prevFeed, addedListing]);
      } else {
        console.error('Failed to add new listing');
      }
    } catch (error) {
      console.error('Error adding new listing:', error);
    }
  };
  

  const updateMarketStatus = (id: string, status: string, claimedBy: string) => {
    const item = collectorsFeed.find((item) => item.id === id);
    
    const updatedFeed = collectorsFeed.map((item) =>
      item.id === id ? { ...item, marketStatus: status, claimedBy } : item
    );
    setCollectorsFeed(updatedFeed);
    localStorage.setItem("collectorsFeed", JSON.stringify(updatedFeed));
  
    if (item) {
      sendClaimEmailNotification(claimedBy, item.email, item.firstName, item.id);
    }
  };
  
  const sendClaimEmailNotification = async (claimedBy: string, recipientEmail: string, firstName: string, itemId: string) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail,
          claimedBy,
          firstName,
          itemId,
        }),
      });
  
      if (response.ok) {
        console.log('Email sent successfully');
        alert(`An email has been sent to notify ${firstName} that their item has been claimed.`);
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  

  // Delete a listing and update localStorage
  const deleteFromMakersFeed = async (id: string) => {
    try {
      const response = await fetch(`/api/makersFeed/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setMakersFeed((prevFeed) => prevFeed.filter(item => item.id !== id));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  

  const deleteFromCollectorsFeed = (id: string) => {
    const updatedFeed = collectorsFeed.filter((item) => item.id !== id);
    setCollectorsFeed(updatedFeed);
    localStorage.setItem("collectorsFeed", JSON.stringify(updatedFeed));
  };

  // Handle changes to the claim name for each collector's feed item
  const handleClaimFirstNameChange = (id: string, name: string) => {
    setCollectorsFeed(prevFeed =>
      prevFeed.map(item => 
        item.id === id ? { ...item, firstNameClaimed: name } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="bg-[rgba(240,191,34,0.5)] p-4">
        <img src="/image.png" width="200" height="200" alt="logo" />
      </header>
      <div className="text-center p-6 bg-[rgba(240,191,34,0.5)] border-b border-gray-300">
        <h1 className="text-4xl font-semibold">Join our Trashy Market material collection!</h1>
        <p className="text-lg mt-2">These REmakers are accepting specific reusable materials at
           the Trashy Market (Nov 29-30). These materials will be transformed into one-of-a-kind 
           goods. Attendees are invited to collect and donate reusable materials to the REmakers 
           at the Trashy Market. 
        </p>
      </div>

      <div className="flex flex-grow">
        {/* Makers Side */}
        <div className="w-1/2 p-8 bg-white border-r border-gray-300">
          <h2 className="text-2xl font-bold mb-4">REMAKER: Material Requests</h2>
          <p className="text-base text-gray-800 mb-6">
            If you are a REmaker accepting materials at the Trashy Market, fill out the form below to post your material request.
            Check in on the Collectors feed to claim your materials!
          </p>
          <a
  href="#"
  onClick={(e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setSelectedForm("form1");
  }}
  className="text-[#1F5D53] font-bold text-xl underline hover:opacity-80"
>
  Makers Form
</a>



          <div className="mt-8">
            {selectedForm === "form1" && <FormOne addToFeed={addToMakersFeed} />}
            <div className="mt-6 p-6 max-w-4xl mx-auto shadow-md">
              <h3 className="text-xl font-bold">Makers Feed</h3>
              <div className="space-y-6 overflow-y-auto max-h-96">
                {makersFeed.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-center mb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.description}
                      className="w-full sm:w-80 md:w-96 lg:w-[400px] xl:w-[500px] h-auto object-cover rounded-lg"
                    />
                    </div>
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
        <div className="w-1/2 p-8 bg-white">
          <h2 className="text-2xl font-bold mb-4">COLLECTOR: Material Offers</h2>
          <p className="text-base text-gray-800 mb-6">
            Scroll through the REmaker material requests to see if you have materials that match. 
            If you have a potential material match, complete the form at the top of the COLLECTOR 
            feed. The REmaker will approve or reject your match by November 28. If your material is
            approved, bring it to the REmaker at the Trashy Market 
            (Mrs. Murphy's Irish Bistro 3905 N Lincoln Ave).
          </p>
          <a
  href="#"
  onClick={(e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setSelectedForm("form2");
  }}
  className="text-[#1F5D53] font-bold text-xl underline hover:opacity-80"
>
  Collectors Form
</a>


          <div className="mt-8">
            {selectedForm === "form2" && <FormTwo addToFeed={addToCollectorsFeed} />}
            <div className="mt-6 p-6 max-w-4xl mx-auto shadow-md">
              <h3 className="text-xl font-bold">Collectors Feed</h3>
              <div className="space-y-6 overflow-y-auto max-h-96">
                {collectorsFeed.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                    
                    <div className="flex justify-center mb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.description}
                      className="w-full sm:w-80 md:w-96 lg:w-[400px] xl:w-[500px] h-auto object-cover rounded-lg"

                    />
                    </div>
                    <p><strong>First Name:</strong> {item.firstName}</p>
                    <p><strong>Email:</strong> {item.email}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Type:</strong> {item.type}</p>
                    <p><strong>Color:</strong> {item.color}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Market Status:</strong> {item.marketStatus || "Still Available"}</p>

                    {item.claimedBy ? (
                      <div>
                        <p className="font-medium text-green-500">Claimed by: {item.claimedBy}</p>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <label className="block mb-2">
                          Accept this item! Enter your name to claim:
                        </label>

                        {/* Input for first name when item is unclaimed */}
                        {!item.claimedBy && (
                          <div className="mb-4">
                            <input
                              type="text"
                              placeholder="Your First Name"
                              value={item.firstNameClaimed || ""}
                              onChange={(e) => handleClaimFirstNameChange(item.id, e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        )}

                        {/* Confirm button */}
                        <button
                          onClick={() => updateMarketStatus(item.id, "Accepted! Bring to the Market", item.firstNameClaimed || "")}
                          disabled={!item.firstNameClaimed}
                          className="px-4 py-2 text-white rounded-lg hover:bg-blue-600 transition"
                          style={{ backgroundColor: '#3856DE' }}
                        >
                          Confirm
                        </button>
                      </div>
                    )}
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
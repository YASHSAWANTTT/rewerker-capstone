"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormOne from "../forms/FormOne";
import FormTwo from "../forms/FormTwo";

type MakerItem = {
  id: string;
  imageUrl: string;
  description: string;
  type: string;
  color: string;
  quantity: string;
  firstName: string;
  businessName: string;
};

type CollectorItem = {
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
};

const LandingPage: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [makersFeed, setMakersFeed] = useState<MakerItem[]>([]);
  const [collectorsFeed, setCollectorsFeed] = useState<CollectorItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for deletion
  const [itemIdToDelete, setItemIdToDelete] = useState<{ feedType: 'makers' | 'collectors'; id: string } | null>(null);

  const [deletionSuccess, setDeletionSuccess] = useState(false); 

  const router = useRouter();
  
  const correctAccessCode = "57833";

  // Load makers feed
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/makers-feed');
        const data = await response.json();
        setMakersFeed(Array.isArray(data) ? data : data.makers || []);
      } catch (error) {
        console.error("Failed to fetch makers feed:", error);
      }
    };
    fetchData();
  }, []);

  // Load collectors feed
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/collectors-feed');
        const data = await response.json();
        setCollectorsFeed(Array.isArray(data) ? data : data.collectors || []);
      } catch (error) {
        console.error("Failed to fetch collectors feed:", error);
      }
    };
    fetchData();
  }, []);

  const addToMakersFeed = async (newListing: MakerItem) => {
    try {
      const response = await fetch('/api/add-to-makers-feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newListing),
      });
      if (response.ok) {
        const addedListing = await response.json();
        setMakersFeed((prevFeed) => [...prevFeed, addedListing.listing]);
      } else if (response.status === 409) {
        console.error('Duplicate listing detected');
      } else {
        console.error('Failed to add new listing');
      }
    } catch (error) {
      console.error('Error adding new listing:', error);
    }
  };

  const addToCollectorsFeed = async (newListing: CollectorItem) => {
    try {
      const response = await fetch('/api/add-to-collectors-feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newListing),
      });
      if (response.ok) {
        const addedListing = await response.json();
        setCollectorsFeed((prevFeed) => [...prevFeed, addedListing]);
      } else if (response.status === 409) {
        console.error('Duplicate listing detected');
      } else {
        console.error('Failed to add new listing');
      }
    } catch (error) {
      console.error('Error adding new listing:', error);
    }
  };

  const updateMarketStatus = async (id: string, status: string, claimedBy: string) => {
    const item = collectorsFeed.find((item) => item.id === id);

    // Update local state
    const updatedFeed = collectorsFeed.map((item) =>
      item.id === id ? { ...item, marketStatus: status, claimedBy } : item
    );
    setCollectorsFeed(updatedFeed);
    localStorage.setItem("collectorsFeed", JSON.stringify(updatedFeed));

    // Send the claim email notification
    if (item) {
        sendClaimEmailNotification(claimedBy, item.email, item.firstName, item.id);
    }

    // Make a backend request to update the database
    try {
        const response = await fetch('/api/update-market-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, marketStatus: status, claimedBy }),
        });

        if (!response.ok) {
            console.error("Failed to update market status in the database");
        }
    } catch (error) {
        console.error("Error updating market status:", error);
    }
};


  const sendClaimEmailNotification = async (
    claimedBy: string,
    recipientEmail: string,
    firstName: string,
    itemId: string
  ) => {
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

  const deleteFromMakersFeed = async (id: string) => {
    try {
      const response = await fetch('/api/makers-feed', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setMakersFeed((prevFeed) => prevFeed.filter(item => item.id !== id));
        console.log('Listing deleted successfully');
      } else {
        console.error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };


  const deleteFromCollectorsFeed = async (id: string) => {
    try {
      const response = await fetch('/api/collectors-feed', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setCollectorsFeed((prevFeed) => prevFeed.filter(item => item.id !== id));
        console.log('Listing deleted successfully');
      } else {
        console.error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const closePopUp = () => {
    if (isModalOpen) {
    setIsModalOpen(false);
    setAccessCode("");
    setError("");
    setDeletionSuccess(false);
    setItemIdToDelete(null); // Reset on close
    }
  };



  const handleConfirmDelete = async () => {

    console.log("Confirm delete triggered for ID:", itemIdToDelete?.id); // Add log here

    if (accessCode === correctAccessCode && itemIdToDelete) {
      setIsLoading(true);
      try {

        console.log("Deleting item with ID:", itemIdToDelete.id, "from feed:", itemIdToDelete.feedType);

        if (itemIdToDelete.feedType === 'makers') {

          await deleteFromMakersFeed(itemIdToDelete.id);
        } else if (itemIdToDelete.feedType === 'collectors') {
          await deleteFromCollectorsFeed(itemIdToDelete.id);
        }
        setDeletionSuccess(true);
        setTimeout(() => closePopUp(), 1000);
      } catch (error) {
        console.error("Error deleting item:", error);
        setError("Failed to delete item. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Invalid access code. Please try again.");
      setAccessCode("");  // Reset access code on failure
    }
  };

  const handleDeleteClickMakers = (id: string) => {
    console.log("Deleting item with ID:", id);  // Add this log to check if the function is triggered
    console.log("Setting itemIdToDelete:", { feedType: 'makers', id });
    setItemIdToDelete({ feedType: 'makers', id });
    setIsModalOpen(true);
  };

  const handleDeleteClickCollectors = (id: string) => {
    setItemIdToDelete({ feedType: 'collectors', id });
    setIsModalOpen(true);
  };


  const handleClaimFirstNameChange = (id: string, name: string) => {
    setCollectorsFeed(prevFeed =>
      prevFeed.map(item =>
        item.id === id ? { ...item, firstNameClaimed: name } : item
      )
    );
  };

  const closeModal = () => setSelectedForm(null);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="bg-white p-4">
        <img src="/image.png" width="200" height="200" alt="logo" />
      </header>
      <div className="text-center p-6 bg-[rgba(240,191,34,0.5)] border-b border-gray-300">
        <h1 className="text-4xl font-semibold">Join the Junky Jamboree with Our Material Collection!</h1>
        <p className="text-lg mt-2">Our Trash Smashing artisans are accepting specific reusable materials 
          at the Trashy Holiday Market (Nov 29-30). Accepted Materials will be transformed into future 
          one-of-a-kind goods. Attendees are invited to gather and give requested materials to the Makers 
          at the Trashy Market. This material matching site is a new experiment for us, so if you run into 
          any technical issues or have feedback, please contact Katy (at) nowhere-collective.com.
        </p>
      </div>

      <div className="flex flex-grow">
        {/* Makers Side */}
        <div className="w-1/2 p-8 bg-white border-r border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Trashy Makers: Material Requests  </h2>
          <p className="text-base text-gray-800 mb-6">
          If you are a Trashy Maker, fill out the form below to post your material requests. 
          Check the Offers feed by November 28 to claim your materials and notify the Giver 
          that you will accept their materials!
          </p>
          <button
          onClick={(e) => {
                e.preventDefault();
                setSelectedForm("form1");
             }}
            className="bg-[#FC4F31] text-white font-bold text-xl hover:opacity-80 px-6 py-3 rounded-md border-none cursor-pointer"
              >Makers Form</button>

          <div className="mt-8">
            {selectedForm === "form1" && <FormOne addToFeed={addToMakersFeed} closeModal={closeModal} />}
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
                          onClick={() => handleDeleteClickMakers(item.id)}
                          className="mt-2 bg-red-500 text-white px-3 py-0.5 rounded-lg hover:bg-red-600 transition"                        >
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
          <h2 className="text-2xl font-bold mb-4">Gather & Give: Material Offerss</h2>
          <p className="text-base text-gray-800 mb-6">
          Attention Attendees of Trashy Holiday! Scroll through the Trashy Makers' 
          material requests (on the left). If you potentially have material that 
          match their request, complete the form below. If you have materials that
           aren't a match but might be intriguing, feel free to post too. By November 
           28th, the Trashy Makers will claim their preferred materials. 
           If your material is claimed, you will receive an email inviting you to 
           bring it to the Maker at the Trashy Market (Mrs. Murphy's Irish Bistro 3905 N Lincoln Ave).
          </p>
          <button
    onClick={(e) => {
        e.preventDefault();
        setSelectedForm("form2");
    }}
    className="bg-[#FC4F31] text-white font-bold text-xl hover:opacity-80 px-6 py-3 rounded-md border-none cursor-pointer">
    Collectors Form
</button>

          <div className="mt-8">
            {selectedForm === "form2" && <FormTwo addToFeed={addToCollectorsFeed} closeModal={closeModal} />}
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
                          Accept this item! Enter your Business Name to claim:
                        </label>
                        <div className="mb-4">
                          <input
                            type="text"
                            placeholder="Business Name"
                            value={item.firstNameClaimed || ""}
                            onChange={(e) => handleClaimFirstNameChange(item.id, e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
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
                          onClick={() => handleDeleteClickCollectors(item.id)}
                          className="mt-2 bg-red-500 text-white px-3 py-0.5 rounded-lg hover:bg-red-600 transition"                        >
                          Delete Listing
                        </button>
                       
{/* Modal */}
{isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                <h3 className="text-xl font-semibold mb-4">Enter Access Code</h3>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter access code"
                  className="mb-4 px-4 py-2 border rounded-lg w-full"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Show loading spinner if it's processing */}
                {isLoading && (
                  <div className="flex justify-center">
                    <div className="spinner-border animate-spin w-8 h-8 border-4 border-blue-500 rounded-full"></div>
                  </div>
                )}

                {/* Show success message after successful deletion */}
                {deletionSuccess && (
                  <div className="text-green-500 font-medium mb-4">
                    Item deleted successfully!
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={closePopUp}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    disabled={isLoading} // Disable button when loading
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}




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

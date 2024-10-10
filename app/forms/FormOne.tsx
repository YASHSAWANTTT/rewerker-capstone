'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const FormOne = ({ addToFeed }: { addToFeed: (item: any) => void }) => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      const tempUrl = URL.createObjectURL(file);
      setImageUrl(tempUrl);
    }
  };

  // Function to call GPT to generate the description
  const handleGPTGeneration = async () => {
    if (!imageUrl) {
      alert('Please upload an image first');
      return;
    }

    setLoading(true);
    try {
      // Replace this with your API call to GPT
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }), // Send the image URL to the backend
      });

      const data = await response.json();

      if (data.error) {
        alert('Error generating description.');
      } else {
        setDescription(data.description);
        setType(data.type);
        setColor(data.color);
        setQuantity(data.quantity);
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('An error occurred while generating the description.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newListing = {
      imageUrl,
      description,
      type,
      color,
      quantity,
    };

    // Add the new listing to the feed
    addToFeed(newListing);

    // Reset form
    setImage(null);
    setDescription('');
    setType('');
    setColor('');
    setQuantity('');
    setImageUrl(null);

    router.push('/landing');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      {/* Exit Button */}
      <button
        onClick={() => router.push('/landing')}
        className="absolute top-2 right-2 text-gray-500 text-xl font-bold"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-4">Image Upload & Description</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-lg font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 block w-full text-gray-700 border border-gray-300 rounded-lg p-2"
          />
          {imageUrl && (
            <div className="mt-4">
              <img src={imageUrl} alt="Uploaded preview" className="w-32 h-32 object-cover rounded-lg" />
            </div>
          )}
        </div>

        {/* Description (generated by GPT) */}
        <div>
          <label className="block text-lg font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description will be generated by GPT"
            className="mt-2 w-full h-20 text-gray-700 border border-gray-300 rounded-lg p-2"
          />
          <button
            type="button"
            onClick={handleGPTGeneration}
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Description with GPT'}
          </button>
        </div>

        {/* Type */}
        <div>
          <label className="block text-lg font-medium">Type</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type will be generated by GPT"
            className="mt-2 w-full text-gray-700 border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-lg font-medium">Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Color will be generated by GPT"
            className="mt-2 w-full text-gray-700 border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-lg font-medium">Quantity</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity will be generated by GPT"
            className="mt-2 w-full text-gray-700 border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg"
          >
            Submit Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormOne;

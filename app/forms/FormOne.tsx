"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FormOne = ({ addToFeed }: { addToFeed: (item: any) => void }) => {
  const [imageBase64, setImageBase64] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const validFormats = ["image/png", "image/jpeg", "image/gif", "image/webp"];
      if (!validFormats.includes(selectedFile.type)) {
        alert("Unsupported image format. Please upload a PNG, JPEG, GIF, or WEBP image.");
        return;
      }

      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGPTGeneration = async () => {
    if (!imageBase64) {
      alert("Please upload an image first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await response.json();

      if (data.error) {
        alert("Error generating description.");
      } else {
        setDescription(data.description);
        setType(data.type);
        setColor(data.color);
        setQuantity(data.quantity);
      }
    } catch (error) {
      console.error("Error generating description:", error);
      alert("An error occurred while generating the description.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation check
    if (!description || !type || !color || !quantity || !businessName || !firstName || !file) {
      alert("Please fill in all fields before submitting the listing.");
      return;
    }

    const formData = new FormData();
    formData.append('image', file as Blob); // Cast to Blob to avoid type issues

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      const newListing = {
        imageUrl: result.secure_url, // Use the URL returned from Cloudinary
        description,
        type,
        color,
        quantity,
        businessName,
        firstName,
      };

      addToFeed(newListing);

      // Reset form
      setImageBase64("");
      setDescription("");
      setType("");
      setColor("");
      setQuantity("");
      setBusinessName("");
      setFirstName("");
      setImageUrl(null);
      setFile(null);

      router.push("/landing");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      <button
        onClick={() => router.push("/landing")}
        className="absolute top-2 right-2 text-gray-500 text-xl font-bold"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-4">Image Upload & Description</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium">Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Business Name"
            className="mt-2 w-full text-gray-700 border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="mt-2 w-full text-gray-700 border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 block w-full text-gray-700 border border-gray-300 rounded-lg p-2"
            required
          />
          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium">Generated Description</label>
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
            {loading ? "Generating..." : "Generate Description with GPT"}
          </button>
        </div>

        <div>
          <label className="block text-lg font-medium">Type</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
            className="mt-2 w-full text-gray-700 border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Color"
            className="mt-2 w-full text-gray-700 border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Quantity</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="mt-2 w-full text-gray-700 border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

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

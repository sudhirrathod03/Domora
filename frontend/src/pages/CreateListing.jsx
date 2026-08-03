import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    images: [""],
    category: "",
  });

  const CATEGORIES = [
    "Trending",
    "Rooms",
    "Beachfront",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
    "Domes",
    "Boats",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      location: formData.location, // Now sending location to backend
      country: formData.country, // Now sending country to backend,
      category: formData.category,
      images: formData.images
        .filter((url) => url.trim() !== "")
        .map((url) => ({ url })),
    };

    try {
      const res = await api.post("/listings", formattedData);
      console.log("Listing created:", res.data);
      navigate("/");
    } catch (error) {
      console.error("Failed to create listing", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Add a New Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-transparent outline-none transition-all"
            placeholder="e.g. Modern Glass Villa in Bali"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            required
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-transparent outline-none transition-all resize-none"
            placeholder="Describe your place..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (City, Area)
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-transparent outline-none transition-all"
              placeholder="e.g. Mumbai, Maharashtra"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-transparent outline-none transition-all"
              placeholder="e.g. India"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per night ($)
          </label>
          <input
            type="number"
            name="price"
            required
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-transparent outline-none transition-all"
            placeholder="150"
          />
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Photos (URLs)
          </label>

          <div className="space-y-3">
            {formData.images.map((url, index) => (
              <input
                key={index}
                type="url"
                required={index === 0}
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-transparent outline-none transition-all"
                placeholder="https://..."
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addImageField}
            className="mt-4 text-sm font-medium text-[#C2185B] hover:text-[#9c1349] transition-colors"
          >
            + Add another image URL
          </button>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-[#C2185B] hover:bg-[#9c1349] text-white font-bold py-3 px-4 rounded-lg transition-colors mt-8"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}

export default CreateListing;

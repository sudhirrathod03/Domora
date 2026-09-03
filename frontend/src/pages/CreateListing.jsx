import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import toast from "react-hot-toast";
function CreateListing() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
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

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    setImageFiles((prevFiles) => {
      const combinedFiles = [...prevFiles, ...newFiles];
      return combinedFiles.slice(0, 5);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
    
    setLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("price", Number(formData.price));
    submitData.append("location", formData.location);
    submitData.append("country", formData.country);
    submitData.append("category", formData.category);

    imageFiles.forEach((file) => {
      submitData.append("images", file);
    });

    try {
      const res = await api.post("/listings", submitData);
      toast.success("Listing created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to create listing", error);
      toast.error(error.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
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
            rows="5"
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

        {/* FILE UPLOAD SECTION */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Property Photos (Max 5)
          </label>
          <input
            type="file"
            multiple
            accept="image/jpeg, image/png, image/jpg, image/webp"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#C2185B] bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C2185B] file:text-white hover:file:bg-[#9c1349]"
            required
          />
          
          {imageFiles.length > 0 && (
            <p className="text-sm text-green-600 mt-2 font-medium">
              {imageFiles.length} file(s) selected for upload.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer bg-[#C2185B] hover:bg-[#9c1349] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-8"
        >
          {loading ? "Uploading & Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;
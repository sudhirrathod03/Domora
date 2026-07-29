import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    images: [''] 
  });

  useEffect(() => {
    async function fetchListingData() {
      try {
        const res = await api.get(`/listings/${id}`);
        const existingListing = res.data;
        const existingImageUrls = existingListing.images?.map(img => img.url) || [];
        
        setFormData({
          title: existingListing.title,
          description: existingListing.description,
          price: existingListing.price,
          images: existingImageUrls.length > 0 ? existingImageUrls : ['']
        });
      } catch (error) {
        console.error("Error fetching listing for edit:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListingData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      images: formData.images.filter(url => url.trim() !== '').map(url => ({ url }))
    };

    try {
      await api.put(`/listings/${id}`, formattedData);
      navigate(`/listings/${id}`); // Redirect back to details page
    } catch (error) {
      console.error('Failed to update listing', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="text-gray-500 text-lg">Loading listing data...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Edit Listing</h1>
      
      <form onSubmit={handleSubmit} className="w-full space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input 
            type="text" 
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E76F2E] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            name="description"
            required
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E76F2E] focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price per night ($)</label>
          <input 
            type="number" 
            name="price"
            required
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E76F2E] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Photos (URLs)</label>
          
          <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
            {formData.images.map((url, index) => (
              <input 
                key={index}
                type="url" 
                required={index === 0} 
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E76F2E] focus:border-transparent outline-none transition-all"
              />
            ))}
          </div>

          <button 
            type="button"
            onClick={addImageField}
            className="mt-4 text-sm font-medium text-[#E76F2E] hover:text-[#d65f24] transition-colors"
          >
            + Add another image URL
          </button>
        </div>

        <div className="flex gap-4 mt-8">
          <button 
            type="button"
            onClick={() => navigate(`/listings/${id}`)}
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="w-2/3 bg-[#E76F2E] hover:bg-[#d65f24] text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditListing;
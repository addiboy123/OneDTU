// src/components/findmyspace/FlatForm.jsx
import { useState, useEffect } from 'react';

function FlatForm({ onSubmit, existingFlat = null, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    pricePerPerson: '',
    distanceFromDtu: '',
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (existingFlat) {
      setFormData({
        title: existingFlat.title,
        description: existingFlat.description,
        address: existingFlat.address,
        pricePerPerson: existingFlat.pricePerPerson,
        distanceFromDtu: existingFlat.distanceFromDtu,
      });
    }
  }, [existingFlat]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (images.length > 0) {
      images.forEach(image => data.append('images', image));
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form Fields for title, description, address, etc. */}
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded" />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="w-full p-2 border rounded" />
      <input type="number" name="pricePerPerson" value={formData.pricePerPerson} onChange={handleChange} placeholder="Price per Person" required className="w-full p-2 border rounded" />
      <input type="number" name="distanceFromDtu" value={formData.distanceFromDtu} onChange={handleChange} placeholder="Distance from DTU (km)" required className="w-full p-2 border rounded" />
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Images (up to 6)</label>
        <input type="file" name="images" onChange={handleImageChange} multiple accept="image/*" className="mt-1 block w-full" />
      </div>
      
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {existingFlat ? 'Update Flat' : 'Create Flat'}
        </button>
      </div>
    </form>
  );
}

export default FlatForm;
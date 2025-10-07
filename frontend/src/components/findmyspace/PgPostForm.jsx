// src/components/findmyspace/PgPostForm.jsx
import { useState, useEffect } from 'react';

function PgPostForm({ onSubmit, existingPost = null, pgId, onCancel }) {
  const [formData, setFormData] = useState({ title: '', description: '', roommates_required: '' });
  const [roomImage, setRoomImage] = useState(null);

  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        description: existingPost.description,
        roommates_required: existingPost.roommates_required,
      });
    }
  }, [existingPost]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setRoomImage(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (roomImage) {
      data.append('images', roomImage); // Backend expects 'images' field for multer
    }
    data.append('pgId', pgId); // Crucial for associating with the parent PG
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Room Title (e.g., Single AC Room)" required className="w-full p-2 border rounded" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Room Description" required className="w-full p-2 border rounded" />
      <input type="number" name="roommates_required" value={formData.roommates_required} onChange={handleChange} placeholder="Roommates Required" required className="w-full p-2 border rounded" />
      <div>
        <label className="block text-sm font-medium text-gray-700">Room Image</label>
        <input type="file" name="roomImage" onChange={handleImageChange} accept="image/*" className="mt-1 block w-full" />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {existingPost ? 'Update Room' : 'Add Room'}
        </button>
      </div>
    </form>
  );
}

export default PgPostForm;
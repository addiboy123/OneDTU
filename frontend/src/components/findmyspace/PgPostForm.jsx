// src/components/findmyspace/PgPostForm.jsx
import { useState, useEffect } from 'react';

function PgPostForm({ onSubmit, existingPost = null, pgId, onCancel }) {
  const [formData, setFormData] = useState({ title: '', description: '', roommates_required: '' });
  const [roomImage, setRoomImage] = useState(null);
  const [errorNoImage, setErrorNoImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // require an image for new posts
    if (!existingPost && !roomImage) {
      setErrorNoImage(true);
      return;
    }

    setErrorNoImage(false);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (roomImage) {
      data.append('images', roomImage); // Backend expects 'images' field for multer
    }
    data.append('pgId', pgId); // Crucial for associating with the parent PG

    try {
      setSubmitting(true);
      await Promise.resolve(onSubmit(data));
    } finally {
      setSubmitting(false);
    }
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
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 text-white rounded ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {submitting ? (existingPost ? 'Updating...' : 'Adding...') : (existingPost ? 'Update Room' : 'Add Room')}
        </button>
      </div>
      {errorNoImage && (
        <div className="mt-2 text-sm text-red-500">Please add an image for the room.</div>
      )}
    </form>
  );
}

export default PgPostForm;
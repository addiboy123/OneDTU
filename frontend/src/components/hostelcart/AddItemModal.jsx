import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { X } from "lucide-react";
import getDecodedToken from "../../lib/auth";
import api from "../../api/interceptor";

export function AddItemModal({ isOpen, onClose,onItemAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const decodedUser = getDecodedToken();
  const userId = decodedUser?.userId;

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/category");
      setCategories(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("itemName", name);
      formData.append("itemDescription", description);
      formData.append("itemPrice", price);
      formData.append("itemCategory", category);
      images.forEach((image) => formData.append("images", image));

      const response = await api.post("/user/add-items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status !== 201) throw new Error("Failed to add item");
      
      onItemAdded(response.data.item);
      onClose();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding item");
      alert("Failed to add item. Please reload site and try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImages([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white border border-gray-300 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add New Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-gray-300 focus:border-gray-600 focus:ring-gray-600"
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border-gray-300 focus:border-gray-600 focus:ring-gray-600"
          />

          <Input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border-gray-300 focus:border-gray-600 focus:ring-gray-600"
          />

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-gray-300 rounded-md p-2 focus:border-gray-600 focus:ring-gray-600"
              required
            >
              <option value="" disabled>
                {loading ? "Loading categories..." : "Select Category"}
              </option>
              {error ? (
                <option value="" disabled>{error}</option>
              ) : (
                categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Upload Images</label>
            <Input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-gray-800 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-all"
                    onClick={() => removeImage(index)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
              disabled={uploading}
            >
              {uploading ? "Adding..." : "Add Item"}
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddItemModal;

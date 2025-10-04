import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/interceptor";
import getDecodedToken from "../lib/auth";

const Profile = () => {
  const decoded = getDecodedToken();
  const [name, setName] = useState(decoded?.name || "");
  const [email, setEmail] = useState(decoded?.email || "");
  const [phone, setPhone] = useState(decoded?.phoneNumber || "");
  const [photo, setPhoto] = useState(decoded?.picture || "");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const form = new FormData();
      if (photo && photo instanceof File) form.append("profile", photo);
      form.append("name", name);
      form.append("email", email);
      form.append("phoneNumber", phone);

      const res = await api.patch("/user/update-profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated");
      // Optionally update token or reload
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Profile Photo</label>
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={uploading}>{uploading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;

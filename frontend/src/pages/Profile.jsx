import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/interceptor";
import getDecodedToken from "../lib/auth";
import { updatePhoneNumber } from "../api/user";

const Profile = () => {
  const decoded = getDecodedToken();

  // initialize from decoded token but keep local state updatable
  const [name, setName] = useState(decoded?.name || "");
  const [email, setEmail] = useState(decoded?.email || "");
  const [phone, setPhone] = useState(decoded?.phoneNumber || "");
  const [photo, setPhoto] = useState(decoded?.profile_photo_url || decoded?.picture || "");
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // phone-update specific state
  const [phoneUpdating, setPhoneUpdating] = useState(false);

  // update local state when auth token changes (so UI refreshes after token replacement)
  useEffect(() => {
    const applyDecoded = () => {
      const d = getDecodedToken();
      setName(d?.name || "");
      setEmail(d?.email || "");
      setPhone(d?.phoneNumber || "");
      setPhoto(d?.profile_photo_url || d?.picture || "");
    };

    window.addEventListener("auth-changed", applyDecoded);
    window.addEventListener("storage", applyDecoded);
    // also run on mount to pick up current token
    applyDecoded();

    return () => {
      window.removeEventListener("auth-changed", applyDecoded);
      window.removeEventListener("storage", applyDecoded);
    };
  }, []);

  // update preview whenever a File is selected
  useEffect(() => {
    if (photo && photo instanceof File) {
      const url = URL.createObjectURL(photo);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPhotoPreview(typeof photo === "string" ? photo : "");
  }, [photo]);

  // keep full-profile update disabled for now; only phone update enabled
  const handlePhoneUpdate = async () => {
    if (!phone || !/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10 digit phone number");
      return;
    }
    setPhoneUpdating(true);
    try {
      const data = await updatePhoneNumber(phone);
      // update UI from returned user if present
      const returnedUser = data?.user;
      if (returnedUser?.phoneNumber) {
        setPhone(returnedUser.phoneNumber);
      }
      // update handled by updatePhoneNumber (stores token + dispatches auth-changed)
      alert("Phone number updated");
    } catch (err) {
      console.error("Phone update failed:", err);
      alert(err?.response?.data?.msg || err?.message || "Failed to update phone");
    } finally {
      setPhoneUpdating(false);
    }
  };

  // keep full profile submit UI but disabled (no-op) to avoid accidental use
  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Only phone update is enabled right now.");
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" disabled />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" disabled />
          </div>

          <div>
            <label className="block text-sm">Phone</label>
            <div className="flex gap-2">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="10 digit phone number"
              />
              <button
                type="button"
                onClick={handlePhoneUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={phoneUpdating}
              >
                {phoneUpdating ? "Updating..." : "Update Phone"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm">Profile Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} disabled />
            {photoPreview && (
              <div className="mt-2">
                <img src={photoPreview} alt="preview" className="w-28 h-28 object-cover rounded-full" />
              </div>
            )}
          </div>

          <div>
            <button type="submit" className="px-4 py-2 bg-gray-400 text-white rounded" disabled>
              Save (disabled)
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;

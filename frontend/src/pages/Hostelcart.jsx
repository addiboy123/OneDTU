import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/hostelcart/Sidebar";
import MainContent from "../components/hostelcart/MainContent";
import AddItemModal from "../components/hostelcart/AddItemModal";
import MyItemModal from "../components/hostelcart/MyItemModal";
import OtherItemModal from "../components/hostelcart/OtherItemModal";
import LoginPromptModal from "../components/hostelcart/LoginPromptModal";
import getDecodedToken from "../lib/auth";
import api from "../api/interceptor";

// derive auth from token in localStorage
const isAuthenticated = () => Boolean(getDecodedToken());

const HostelCart = () => {
  const [userItems, setUserItems] = useState([]);
  const [otherItems, setOtherItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isItemDetailsModalOpen, setIsItemDetailsModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const isAuth = isAuthenticated();

  // decode token into currentUser on mount
  useEffect(() => {
    const decoded = getDecodedToken();
    if (decoded) {
      setCurrentUser({
        userId: decoded.userId || decoded.sub || decoded.id,
        name: decoded.name || decoded.fullName || decoded.given_name,
        phoneNumber: decoded.phoneNumber,
        email: decoded.email,
      });
    } else {
      setCurrentUser(null);
    }
  }, []);

  // fetch items depending on auth state
  useEffect(() => {
    let mounted = true;

  const fetchItems = async () => {
      try {
    if (isAuth) {
      const decoded = currentUser ?? getDecodedToken();
      if (!decoded?.userId) {
      setUserItems([]);
      setOtherItems([]);
      return;
      }

            // Fetch my items
      try {
      const myRes = await api.get('/hostelcart/items/');
            if (mounted) {
                setUserItems(myRes?.data?.success ? myRes.data.items : []);
            }
            } catch (err) {
            console.error("Error fetching my items:", err.response?.data?.message || err.message || err);
            if (mounted) setUserItems([]);
            }

            // Fetch other items
      try {
      const otherRes = await api.get('/hostelcart/items/others');
            if (mounted) {
                setOtherItems(otherRes?.data?.success ? otherRes.data.items : []);
            }
            } catch (err) {
            console.error("Error fetching other items:", err.response?.data?.message || err.message || err);
            if (mounted) setOtherItems([]);
            }

        } else {
            // Unauthenticated users → fetch all items
      try {
      const res = await api.get(`/hostelcart/all-items`);
            if (mounted) {
                setOtherItems(res?.data?.success ? res.data.items : []);
                setUserItems([]);
            }
            } catch (err) {
            console.error("Error fetching all items:", err.response?.data?.message || err.message || err);
            if (mounted) {
                setOtherItems([]);
                setUserItems([]);
            }
            }
        }
        } catch (err) {
        console.error("Unexpected error:", err.message || err);
        }

    };

    fetchItems();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.userId]);

  const handleSelectItem = (item, isUserItem) => {
    if (!isAuthenticated()) {
      setIsLoginPromptOpen(true);
      return;
    }
    setSelectedItem(item);
    setIsItemDetailsModalOpen(true);
  };

  const isCurrentUserItem =
    selectedItem && userItems.some((item) => item._id === selectedItem._id);

  return (
    <div>
      <Navbar userName={currentUser?.name} userPhone={currentUser?.phoneNumber} />
      <div className="flex flex-1 overflow-hidden">
        {isAuth && (
          <Sidebar
            items={userItems}
            onSelectItem={(item) => handleSelectItem(item, true)}
            selectedItemId={selectedItem?._id}
            onAddItem={() => {
              if (!isAuthenticated()) {
                setIsLoginPromptOpen(true);
                return;
              }
              setIsAddItemModalOpen(true);
            }}
            currentUserId={currentUser?.userId}
          />
        )}

        <MainContent
            currentUserId={currentUser?.userId}
            allItems={otherItems}
            onSelectItem={(item) => handleSelectItem(item, false)}
            isAuth={isAuth} // pass this new prop
        />

      </div>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onItemAdded={(newItem) => setUserItems((prev) => [...prev, newItem])}
      />

      {isCurrentUserItem ? (
        <MyItemModal
          isOpen={isItemDetailsModalOpen}
          onClose={() => setIsItemDetailsModalOpen(false)}
          item={selectedItem}
          onUpdateItem={(updated) =>
            setUserItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)))
          }
          onDeleteItem={(id) => setUserItems((prev) => prev.filter((i) => i._id !== id))}
        />
      ) : (
        <OtherItemModal
          isOpen={isItemDetailsModalOpen}
          onClose={() => setIsItemDetailsModalOpen(false)}
          item={selectedItem}
        />
      )}

      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
      />
    </div>
  );
};

export default HostelCart;

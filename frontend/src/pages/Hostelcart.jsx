import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu } from "lucide-react"; // ✅ RESPONSIVE: Import menu icon

import Navbar from "../components/Navbar";
import Sidebar from "../components/hostelcart/Sidebar";
import MainContent from "../components/hostelcart/MainContent";
import AddItemModal from "../components/hostelcart/AddItemModal";
import MyItemModal from "../components/hostelcart/MyItemModal";
import OtherItemModal from "../components/hostelcart/OtherItemModal";
import LoginPromptModal from "../components/LoginPromptModal";
import getDecodedToken from "../lib/auth";
import api from "../api/interceptor";

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

  // ✅ RESPONSIVE: State to manage sidebar visibility on mobile/tablet
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const queryClient = useQueryClient();

  const myItemsQuery = useQuery({
    queryKey: ["hostelcart", "myItems", currentUser?.userId],
    queryFn: async () => {
      const res = await api.get("/hostelcart/items/");
      return res?.data?.items ?? [];
    },
    enabled: isAuth && !!currentUser?.userId,
  });

  const otherItemsQuery = useQuery({
    queryKey: ["hostelcart", "otherItems", currentUser?.userId],
    queryFn: async () => {
      const res = await api.get("/hostelcart/items/others");
      return res?.data?.items ?? [];
    },
    enabled: isAuth,
  });

  const publicItemsQuery = useQuery({
    queryKey: ["hostelcart", "publicItems"],
    queryFn: async () => {
      const res = await api.get("/hostelcart/all-items");
      return res?.data?.items ?? [];
    },
    enabled: !isAuth,
  });

  useEffect(() => {
    if (myItemsQuery.data) setUserItems(myItemsQuery.data);
  }, [myItemsQuery.data]);

  useEffect(() => {
    if (isAuth) {
      if (otherItemsQuery.data) setOtherItems(otherItemsQuery.data);
    } else {
      if (publicItemsQuery.data) setOtherItems(publicItemsQuery.data);
    }
  }, [otherItemsQuery.data, publicItemsQuery.data, isAuth]);

  const handleSelectItem = (item, isUserItem) => {
    if (!isAuth) {
      setIsLoginPromptOpen(true);
      return;
    }
    setSelectedItem(item);
    setIsItemDetailsModalOpen(true);
    // ✅ RESPONSIVE: Close sidebar on item selection for better mobile UX
    if (window.innerWidth < 1024) { // Tailwind's 'lg' breakpoint
      setIsSidebarOpen(false);
    }
  };

  const isCurrentUserItem = selectedItem && userItems.some((item) => item._id === selectedItem._id);

  return (
    // ✅ RESPONSIVE: Main container ensures full height layout
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      {/* ✅ RESPONSIVE: Added `relative` to contain the absolutely positioned sidebar on mobile */}
      <div className="flex flex-1 overflow-hidden relative">
        {isAuth && (
          <Sidebar
            items={userItems}
            onSelectItem={(item) => handleSelectItem(item, true)}
            selectedItemId={selectedItem?._id}
            onAddItem={() => setIsAddItemModalOpen(true)}
            currentUserId={currentUser?.userId}
            // ✅ RESPONSIVE: Pass state and handler to Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* ✅ RESPONSIVE: Overlay for mobile view when sidebar is open */}
        {isSidebarOpen && isAuth && (
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            aria-hidden="true"
          />
        )}

        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* ✅ RESPONSIVE: Header with hamburger menu, only shows for logged-in users on mobile */}
          {isAuth && (
            <div className="flex items-center p-2 border-b bg-white lg:hidden sticky top-0 z-10">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-600 rounded-md hover:bg-gray-100 flex items-center gap-2"
                aria-label="Open my items"
              >
                <Menu size={20} />
                <span>My Items</span>
              </button>
            </div>
          )}
          <MainContent
            currentUserId={currentUser?.userId}
            allItems={otherItems}
            onSelectItem={(item) => handleSelectItem(item, false)}
            isAuth={isAuth}
          />
        </main>
      </div>

      {/* --- Modals --- */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onItemAdded={(newItem) => {
          queryClient.setQueryData(["hostelcart", "myItems", currentUser?.userId], (old = []) => [
            ...old,
            newItem,
          ]);
          setUserItems((prev) => [...prev, newItem]);
        }}
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
      <LoginPromptModal isOpen={isLoginPromptOpen} onClose={() => setIsLoginPromptOpen(false)} />
    </div>
  );
};

export default HostelCart;
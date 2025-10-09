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
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  // Use React Query to fetch and cache items so data persists between component switches
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

  // Keep local states in sync with query data for components expecting arrays
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
     <Navbar /> 
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
        onItemAdded={(newItem) => {
          // Update the cached myItems list so UI stays in sync across routes
          queryClient.setQueryData(["hostelcart", "myItems", currentUser?.userId], (old = []) => [
            ...old,
            newItem,
          ]);
          // also update local state immediately for current view
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

      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
      />
    </div>
  );
};

export default HostelCart;

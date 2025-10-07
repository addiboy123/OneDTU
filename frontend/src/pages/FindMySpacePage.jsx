// src/pages/FindMySpacePage.jsx

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Sidebar from "../components/findmyspace/Sidebar";
import PostGrid from "../components/findmyspace/PostGrid";
import PostDetail from "../components/findmyspace/PostDetail";
import HeaderTabs from "../components/findmyspace/HeaderTabs";
import Modal from "../components/findmyspace/Modal";
import FlatForm from "../components/findmyspace/FlatForm";
import PgPostForm from "../components/findmyspace/PgPostForm";
import * as api from "../services/findMySpaceAPI";
import { useAuth } from "../context/AuthContext";

function FindMySpacePage() {
  const { user, token } = useAuth();
  const currentUserId = user?._id;

  const [activeTab, setActiveTab] = useState("FLAT");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // ✅ ADDED: State to handle opening a specific PG room from the sidebar
  const [initialRoom, setInitialRoom] = useState(null);

  // State for Modals
  const [isFlatModalOpen, setIsFlatModalOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState(null);
  const [isPgPostModalOpen, setIsPgPostModalOpen] = useState(false);
  const [editingPgPost, setEditingPgPost] = useState(null);
  const [currentPgId, setCurrentPgId] = useState(null);

  // Use React Query to fetch flats / pgs depending on activeTab
  const { data: rawData, isLoading, isError, refetch } = useQuery({
    queryKey: ["findMySpace", activeTab],
    queryFn: async () => {
      return activeTab === "FLAT" ? await api.getAllFlats() : await api.getAllPGs();
    },
    staleTime: 1000 * 60 * 2,
  });

  // derive posts from the query response and keep selectedPost in sync
  useEffect(() => {
    const response = rawData;
    const newPosts = response
      ? activeTab === "FLAT"
        ? response.data?.flats ?? []
        : response.data?.pgs ?? []
      : [];
    setPosts(newPosts);

    if (selectedPost) {
      const updatedSelectedPost = newPosts.find((p) => p._id === selectedPost._id);
      if (updatedSelectedPost) setSelectedPost(updatedSelectedPost);
      else setSelectedPost(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, activeTab]);

  // --- Handlers ---
  const handleOpenFlatModal = (flat = null) => { setEditingFlat(flat); setIsFlatModalOpen(true); };
  const handleCloseFlatModal = () => { setEditingFlat(null); setIsFlatModalOpen(false); fetchData(); };
  const handleFlatSubmit = async (formData) => {
    // ... (logic is correct, but relies on handleCloseFlatModal to refresh)
  };
  const handleFlatDelete = async (flatId) => {
    // ... (logic is correct, relies on fetchData to refresh)
  };
  const handleOpenPgPostModal = (post = null, pgId) => {
    setEditingPgPost(post);
    setCurrentPgId(pgId);
    setIsPgPostModalOpen(true);
  };
  const handleClosePgPostModal = () => { setEditingPgPost(null); setIsPgPostModalOpen(false); fetchData(); };
  const handlePgPostSubmit = async (formData) => {
    // ... (logic is correct, but relies on handleClosePgPostModal to refresh)
  };
  const handlePgPostDelete = async (postId) => {
    // ... (logic is correct, relies on fetchData to refresh)
  };
  
  // ✅ ADDED: A "smart" handler for all sidebar clicks
  const handleSidebarClick = (item) => {
    // If it's a Flat, just open its detail page
    if (item.images) {
      setSelectedPost(item);
    } 
    // If it's a PG Room, find its parent PG and tell PostDetail to open this specific room
    else if (item.roomImage) {
      const parentPg = posts.find(p => p._id === item.parentPG);
      if (parentPg) {
        setInitialRoom(item); // Tell PostDetail which room to open
        setSelectedPost(parentPg); // Open the parent PG's detail page
      }
    }
  };

  const handlePostClick = (post) => setSelectedPost(post);
  const handleBackToListing = () => { setSelectedPost(null); }; // fetchData is no longer needed here
  
  const userOwnedPosts = (() => {
    if (!currentUserId || posts.length === 0) return [];
    if (activeTab === 'FLAT') {
      return posts.filter(post => post.createdBy === currentUserId);
    } else {
      return posts
        .flatMap(pg => pg.posts || [])
        .filter(room => room.createdBy === currentUserId);
    }
  })();

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          title={activeTab === 'FLAT' ? "Your Flat Posts" : "Your PG Posts"} 
          posts={userOwnedPosts} 
          onSidebarClick={handleSidebarClick} // ✅ CHANGED: Use the new smart handler
          onEditPost={activeTab === 'FLAT' ? handleOpenFlatModal : (post) => handleOpenPgPostModal(post, post.parentPG)}
          onDeletePost={activeTab === 'FLAT' ? handleFlatDelete : handlePgPostDelete}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedPost ? (
            <PostDetail 
              key={selectedPost._id} // Adding key forces re-mount with fresh state
              post={selectedPost} 
              onBack={handleBackToListing} 
              onOpenPgPostModal={handleOpenPgPostModal}
              initialRoom={initialRoom} // ✅ Pass the room to open
              onViewedInitialRoom={() => setInitialRoom(null)} // ✅ Pass function to reset state
            />
          ) : (
            <>
              <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <PostGrid posts={posts} onPostClick={handlePostClick} />
            </>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      {token && activeTab === 'FLAT' && !selectedPost && (
        <button 
          onClick={() => handleOpenFlatModal()} 
          className="fixed bottom-8 right-8 z-10 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"
          title="Add New Flat"
        >
          +
        </button>
      )}
      <Modal isOpen={isFlatModalOpen} onClose={handleCloseFlatModal} title={editingFlat ? 'Edit Flat' : 'Add Flat'}>
        <FlatForm onSubmit={handleFlatSubmit} existingFlat={editingFlat} onCancel={handleCloseFlatModal} />
      </Modal>
      <Modal isOpen={isPgPostModalOpen} onClose={handleClosePgPostModal} title={editingPgPost ? 'Edit Room' : 'Add Room'}>
        <PgPostForm onSubmit={handlePgPostSubmit} existingPost={editingPgPost} pgId={currentPgId} onCancel={handleClosePgPostModal} />
      </Modal>
    </div>
  );
}

export default FindMySpacePage;
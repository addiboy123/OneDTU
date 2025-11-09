// src/pages/FindMySpacePage.jsx

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu } from 'lucide-react'; // ✅ RESPONSIVE: Import icon for hamburger menu

import Navbar from "../components/Navbar";
import Sidebar from "../components/findmyspace/Sidebar";
import PostGrid from "../components/findmyspace/PostGrid";
import PostDetail from "../components/findmyspace/PostDetail";
import HeaderTabs from "../components/findmyspace/HeaderTabs";
import Modal from "../components/findmyspace/Modal";
import FlatForm from "../components/findmyspace/FlatForm";
import PgPostForm from "../components/findmyspace/PgPostForm";
import * as api from "../api/findMySpaceAPI";
import { useAuth } from "../context/AuthContext";
import { createFlat,deleteFlat,createPgPost,deletePgPost } from "../api/findMySpaceAPI.js";

function FindMySpacePage() {
  const { user, token } = useAuth();
  const currentUserId = user?._id;

  const [activeTab, setActiveTab] = useState("FLAT");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [initialRoom, setInitialRoom] = useState(null);
  
  // ✅ RESPONSIVE: State to manage sidebar visibility on mobile/tablet
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for Modals
  const [isFlatModalOpen, setIsFlatModalOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState(null);
  const [isPgPostModalOpen, setIsPgPostModalOpen] = useState(false);
  const [editingPgPost, setEditingPgPost] = useState(null);
  const [currentPgId, setCurrentPgId] = useState(null);

  const { data: rawData, isLoading, isError, refetch } = useQuery({
    queryKey: ["findMySpace", activeTab],
    queryFn: () => activeTab === "FLAT" ? api.getAllFlats() : api.getAllPGs(),
    staleTime: 1000 * 60 * 2,
  });

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
      setSelectedPost(updatedSelectedPost || null);
    }
  }, [rawData, activeTab, selectedPost]);

  // ✅ Auto-close sidebar when user logs out
  useEffect(() => {
    if (!token) {
      setIsSidebarOpen(false);
    }
  }, [token]);


  // --- Handlers ---
  const handleOpenFlatModal = (flat = null) => { setEditingFlat(flat); setIsFlatModalOpen(true); };
  const handleCloseFlatModal = () => { setEditingFlat(null); setIsFlatModalOpen(false); refetch(); };
  const handleFlatSubmit = async (formData) => {
    await createFlat(formData,token);
    handleCloseFlatModal();
  };
  const handleFlatDelete = async (flatId) => {
    await deleteFlat(flatId,token);
    refetch();
  };
  const handleOpenPgPostModal = (post = null, pgId) => {
    setEditingPgPost(post);
    setCurrentPgId(pgId);
    setIsPgPostModalOpen(true);
  };
  const handleClosePgPostModal = () => { setEditingPgPost(null); setIsPgPostModalOpen(false); refetch(); };
  const handlePgPostSubmit = async (formData) => {
    await createPgPost(formData,token)
    handleClosePgPostModal();
  };
  const handlePgPostDelete = async (postId) => {
    await deletePgPost(postId,token);
    refetch();
  };
  
  const handleSidebarClick = (item) => {
    if (item.images) { // It's a Flat
      setSelectedPost(item);
    } else if (item.roomImage) { // It's a PG Room
      const parentPg = posts.find(p => p._id === item.parentPG);
      if (parentPg) {
        setInitialRoom(item);
        setSelectedPost(parentPg);
      }
    }
    // ✅ RESPONSIVE: Close sidebar after a selection is made on mobile
    setIsSidebarOpen(false);
  };

  const handlePostClick = (post) => setSelectedPost(post);
  const handleBackToListing = () => { setSelectedPost(null); };
  
  const userOwnedPosts = (() => {
    if (!currentUserId || posts.length === 0) return [];
    if (activeTab === 'FLAT') {
      return posts.filter(post => post.createdBy === currentUserId);
    }
    return posts
      .flatMap(pg => pg.posts || [])
      .filter(room => room.createdBy === currentUserId);
  })();

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <Navbar />
        <div className="flex flex-1 overflow-hidden relative">
          {/* ✅ Show Sidebar only when user is logged in */}
          {token && (
            <Sidebar 
              title={activeTab === 'FLAT' ? "Your Flat Posts" : "Your PG Posts"} 
              posts={userOwnedPosts} 
              onSidebarClick={handleSidebarClick}
              onEditPost={activeTab === 'FLAT' ? handleOpenFlatModal : (post) => handleOpenPgPostModal(post, post.parentPG)}
              onDeletePost={activeTab === 'FLAT' ? handleFlatDelete : handlePgPostDelete}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}

          {/* ✅ Only show overlay if sidebar is open AND user is logged in */}
         {/* ✅ Only render sidebar if logged in AND explicitly open */}
          {token && isSidebarOpen && (
            <>
              <Sidebar 
                title={activeTab === 'FLAT' ? "Your Flat Posts" : "Your PG Posts"} 
                posts={userOwnedPosts} 
                onSidebarClick={handleSidebarClick}
                onEditPost={activeTab === 'FLAT' ? handleOpenFlatModal : (post) => handleOpenPgPostModal(post, post.parentPG)}
                onDeletePost={activeTab === 'FLAT' ? handleFlatDelete : handlePgPostDelete}
                isOpen={true} // now always true since wrapped in conditional
                onClose={() => setIsSidebarOpen(false)}
              />

              {/* Overlay only shown if sidebar is visible */}
              <div 
                onClick={() => setIsSidebarOpen(false)} 
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                aria-hidden="true"
              />
            </>
          )}


          <main className="flex-1 flex flex-col overflow-y-auto">
            {selectedPost ? (
              <PostDetail 
                key={selectedPost._id}
                post={selectedPost} 
                onBack={handleBackToListing} 
                onOpenPgPostModal={handleOpenPgPostModal}
                initialRoom={initialRoom}
                onViewedInitialRoom={() => setInitialRoom(null)}
              />
            ) : (
              <>
                <div className="flex items-center border-b border-gray-200 bg-white sticky top-0 z-10 px-4">
                  {/* ✅ Disable hamburger if not logged in */}
                  {token && (
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="p-2 mr-2 text-gray-600 lg:hidden"
                      aria-label="Open sidebar"
                    >
                      <Menu size={24} />
                    </button>
                  )}
                  <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <PostGrid posts={posts} onPostClick={handlePostClick} isLoading={isLoading} isError={isError} />
                </div>
              </>
            )}
          </main>
        </div>


      {/* --- Modals --- */}
      {token && activeTab === 'FLAT' && !selectedPost && (
        <button 
          onClick={() => handleOpenFlatModal()} 
          // ✅ RESPONSIVE: Adjusted FAB position for smaller screens
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-10 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"
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
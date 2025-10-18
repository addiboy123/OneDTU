// src/components/findmyspace/PostGrid.jsx

import PostCard from "./PostCard";

// ✅ Added isLoading and isError to handle different states
function PostGrid({ posts, onPostClick, isLoading, isError, onEdit, onDelete, currentUserId }) {

  // --- 1. Loading State ---
  // Shows a skeleton layout that mimics the real content.
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Array(8) creates 8 skeleton cards for the loading state */}
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
            <div className="h-40 w-full bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // --- 2. Error State ---
  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-semibold">An error occurred while fetching posts.</p>
        <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  // --- 3. Empty State ---
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-700 font-semibold">No posts found.</p>
        <p className="text-gray-500 mt-2">Try adjusting your filters or check back later!</p>
      </div>
    );
  }

  // --- 4. Success State (Display Posts) ---
  return (
    // ✅ SIMPLIFIED: Removed the outer div with `flex-1` and `px-6`.
    // ✅ ENHANCED: Added `sm:` and `xl:` breakpoints for better responsiveness.
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onClick={() => onPostClick(post)}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

export default PostGrid;
// src/components/findmyspace/Sidebar.jsx

import { X } from 'lucide-react'; // For the close button

// ✅ RESPONSIVE: Added isOpen and onClose to props
function Sidebar({ title, posts, onSidebarClick, onEditPost, onDeletePost, isOpen, onClose }) {
  return (
    // ✅ RESPONSIVE: Updated classes for responsive behavior
    // - `fixed` on mobile, `relative` on large screens (`lg:`)
    // - Slides in and out based on the `isOpen` state on mobile
    // - `z-30` ensures it's on top of other content
    <aside
      className={`
        fixed top-0 left-0 h-full bg-gray-800 text-white z-30
        w-72 sm:w-80 flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600 shrink-0">
        <h2 className="text-xl font-bold">{title}</h2>
        {/* ✅ RESPONSIVE: Close button, only visible on screens smaller than lg */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        {posts.length === 0 ? (
          <p className="text-gray-400 text-sm">You have not created any posts in this category yet.</p>
        ) : (
          posts.map((post) => {
            const coverImage = post.images?.[0] || post.roomImage?.[0];

            return (
              <div
                key={post._id}
                className="bg-gray-700 rounded-lg p-2 relative cursor-pointer group hover:bg-gray-600 transition-colors"
                onClick={() => onSidebarClick(post)}
              >
                {/* Edit/Delete Buttons */}
                <div className="absolute top-1 right-1 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPost(post);
                    }}
                    className="p-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-gray-600 hover:bg-blue-600 text-xs"
                    title="Edit Post"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePost(post._id);
                    }}
                    className="p-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-gray-600 hover:bg-red-600 text-xs"
                    title="Delete Post"
                  >
                    🗑️
                  </button>
                </div>

                {/* Main Content */}
                <div className="w-full h-24 bg-gray-500 rounded-md mb-2">
                  {coverImage ? (
                    <img src={coverImage} alt={post.title || "Post image"} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                  )}
                </div>
                <h3 className="font-semibold text-sm truncate">{post.title}</h3>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
// src/components/findmyspace/Sidebar.jsx

// ✅ CORRECTED: Changed `onPostClick` to `onSidebarClick` to match the function call below.
function Sidebar({ title, posts, onSidebarClick, onEditPost, onDeletePost }) {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col shrink-0">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-600 pb-2">{title}</h2>
      
      {posts.length === 0 ? (
        <p className="text-gray-400 text-sm">You have not created any posts in this category yet.</p>
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto">
          {posts.map((post) => {
            const coverImage = post.images ? post.images[0] : post.roomImage?.[0];

            return (
              <div 
                key={post._id} 
                className="bg-gray-700 rounded-lg p-2 relative cursor-pointer group hover:bg-gray-600 transition-colors"
                onClick={() => onSidebarClick(post)} // This now correctly calls the prop
              >
                {/* Buttons are positioned relative to this container */}
                <div className="absolute top-1 right-1 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the card's onClick from firing
                      onEditPost(post);
                    }} 
                    className="p-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-gray-600 hover:bg-blue-600 text-xs" 
                    title="Edit Post"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the card's onClick from firing
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
                    <img src={coverImage} alt={post.title} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                  )}
                </div>
                <h3 className="font-semibold text-sm truncate">{post.title}</h3>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
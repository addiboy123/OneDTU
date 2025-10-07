// src/components/findmyspace/PostCard.jsx

function PostCard({ post, onClick }) {
  let coverImage;
  if (post.images) { 
    coverImage = post.images[0]; // It's a Flat
  } else if (post.posts) { 
    coverImage = post.posts[0]?.roomImage; // It's a PG
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group relative">
      <div className="cursor-pointer" onClick={onClick}>
        <div className="w-full h-48 bg-gray-300">
          {coverImage ? (
            <img src={coverImage} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{post.description?.substring(0, 70)}...</p>
        </div>
      </div>
      
      {/* The entire block for the edit and delete buttons has been removed. */}
      
    </div>
  );
}

export default PostCard;
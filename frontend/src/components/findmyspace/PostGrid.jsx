// src/components/findmyspace/PostGrid.jsx
import PostCard from "./PostCard";

function PostGrid({ posts, onPostClick, onEdit, onDelete, currentUserId }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
export default PostGrid;
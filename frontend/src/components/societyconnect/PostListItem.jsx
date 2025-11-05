import { Button } from '../ui/button';

export default function PostListItem({ post, onEdit, onDelete }) {
  return (
    <div className="bg-gradient-to-b from-black to-[#071023] p-4 rounded-xl shadow-lg border border-blue-900">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white">{post.title}</h3>
          <p className="text-gray-300 mt-2 line-clamp-3">{post.description}</p>
          <div className="text-sm text-blue-300 mt-3">Category: {post.postCategory}</div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(post)}>Edit</Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(post)}>Delete</Button>
          </div>
          <div className="text-sm text-gray-400 mt-2">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>
      {post.images && post.images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {post.images.map((url, i) => (
            <img key={i} src={url} alt={`img-${i}`} className="h-32 w-full object-cover rounded-md border border-blue-900" />
          ))}
        </div>
      )}
    </div>
  );
}

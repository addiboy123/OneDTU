import { useEffect, useState, useRef } from "react";
import api from "../../api/interceptor";

export default function PostsModal({ postId, isOpen, onClose }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const commentsRef = useRef(null);

  // Helper to derive a safe display name from a comment's user/author field
  const getCommentAuthorName = (c) => {
    const userField = c?.user ?? c?.author ?? null;
    if (!userField) return "User";
    if (typeof userField === "string") return userField;
    if (typeof userField === "object") return userField.name || userField.profile_photo_url || "User";
    return "User";
  };

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/societyconnect/posts/${postId}`),
          api.get(`/societyconnect/posts/${postId}/comments`),
        ]);

        if (!mounted) return;
        setPost(postRes?.data?.post ?? postRes?.data ?? null);
        setComments(commentsRes?.data?.comments ?? commentsRes?.data ?? []);
        setActiveIndex(0);
      } catch (err) {
        console.error("Failed to fetch post or comments", err);
        if (mounted) setError("Failed to load post");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => (mounted = false);
  }, [isOpen, postId]);

  if (!isOpen) return null;

  // Prefer an images array when present, otherwise fall back to single image
  const images = Array.isArray(post?.images) && post.images.length
    ? post.images
    : post?.image
    ? [post.image]
    : [];

  const prev = () => setActiveIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i >= images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 md:w-4/5 lg:w-3/4 h-[80vh] rounded-lg overflow-hidden flex">
        {/* Left: images + title/description */}
        <div className="flex-1 p-4 overflow-auto">
          {loading ? (
            <div>Loading post…</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : !post ? (
            <div className="text-gray-500">Post not found.</div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1 flex flex-col md:flex-row gap-4">
                <div className="md:flex-1 md:w-2/3 flex flex-col items-center">
                  {/* Image area with simple slider */}
                  <div className="w-full flex-1 flex items-center justify-center mb-3">
                    {images.length === 0 ? (
                      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">No images</div>
                    ) : (
                      <div className="w-full h-64 relative">
                        <img src={images[activeIndex]} alt={`slide-${activeIndex}`} className="w-full h-full object-cover rounded" />
                        {images.length > 1 && (
                          <>
                            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded">‹</button>
                            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded">›</button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                    <p className="text-gray-700">{post.description}</p>
                  </div>
                </div>
                <div className="md:w-1/3">
                  {/* Thumbnails */}
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                      <button key={idx} onClick={() => setActiveIndex(idx)} className={`border ${idx === activeIndex ? 'border-blue-600' : 'border-transparent'}`}>
                        <img src={img} alt={`thumb-${idx}`} className="w-full h-20 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer: likes/comments count */}
              <div className="mt-4 text-sm text-gray-600">
                <span className="mr-4">Likes: {post.likes ?? 0}</span>
                <span>Comments: {comments.length}</span>
              </div>
            </div>
          )}
        </div>
        {/* Right: comments */}
        <div className="w-1/3 border-l overflow-hidden flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Comments</h3>
            <button onClick={onClose} className="text-gray-600">✕</button>
          </div>

          <div ref={commentsRef} className="flex-1 overflow-auto">
            {loading ? (
              <div>Loading comments…</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : comments.length === 0 ? (
              <div className="text-gray-500">No comments yet.</div>
            ) : (
              <ul className="space-y-3">
                {comments.map((c) => (
                  <li key={c._id} className="p-2 bg-gray-50 rounded">
                    <div className="text-sm font-medium">{getCommentAuthorName(c)}</div>
                    <div className="text-sm text-gray-700">{c.text || c.comment || c.body}</div>
                    <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Comment input */}
          <form
            className="mt-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setPostError(null);
              const comment = commentText?.trim();
              if (!comment) return;
              setPosting(true);
              try {
                const res = await api.post(`/societyconnect/posts/${postId}/comments`, { comment });
                const newComment = res?.data?.comment ?? res?.data ?? null;
                if (newComment) {
                  setComments((prev) => [...prev, newComment]);
                  setCommentText("");
                  // scroll to bottom of comments
                  setTimeout(() => {
                    if (commentsRef.current) {
                      commentsRef.current.scrollTo({ top: commentsRef.current.scrollHeight, behavior: "smooth" });
                    }
                  }, 50);
                }
              } catch (err) {
                console.error("Failed to post comment", err);
                setPostError(err?.response?.data?.message || "Failed to post comment");
              } finally {
                setPosting(false);
              }
            }}
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border rounded px-3 py-2 text-sm resize-none"
              rows={3}
            />
            {postError && <div className="text-xs text-red-500 mt-1">{postError}</div>}
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={posting || !commentText.trim()}
                className={`px-3 py-1 rounded bg-blue-600 text-white text-sm ${posting ? 'opacity-60' : ''}`}
              >
                {posting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

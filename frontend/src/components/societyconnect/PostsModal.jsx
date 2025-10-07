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
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liking, setLiking] = useState(false);

  const getCommentAuthorName = (c) => {
    const userField = c?.user ?? c?.author ?? null;
    if (!userField) return "User";
    if (typeof userField === "string") return userField;
    if (typeof userField === "object")
      return userField.name || userField.profile_photo_url || "User";
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
        const fetchedPost = postRes?.data?.post ?? postRes?.data ?? null;
        setPost(fetchedPost);
        setComments(commentsRes?.data?.comments ?? commentsRes?.data ?? []);
        setLikesCount(fetchedPost?.likes ?? 0);
        setLiked(Boolean(fetchedPost?.liked));
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

  const images =
    Array.isArray(post?.images) && post.images.length
      ? post.images
      : post?.image
      ? [post.image]
      : [];

  const prev = () =>
    setActiveIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i >= images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-11/12 md:w-4/5 lg:w-3/4 h-[85vh] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] shadow-2xl border border-neutral-800 flex">
        {/* LEFT: Post Content */}
        <div className="flex-1 flex flex-col p-5 overflow-auto text-gray-200">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-lg animate-pulse">
              Loading post…
            </div>
          ) : error ? (
            <div className="text-red-400 text-center mt-10">{error}</div>
          ) : !post ? (
            <div className="text-gray-500 text-center mt-10">
              Post not found.
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-5">
                {/* Main Image Section */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full relative group">
                    {images.length === 0 ? (
                      <div className="w-full h-64 bg-neutral-800 rounded-lg flex items-center justify-center text-gray-500">
                        No images
                      </div>
                    ) : (
                      <>
                        <img
                          src={images[activeIndex]}
                          alt={`slide-${activeIndex}`}
                          className="w-full h-[380px] object-cover rounded-xl shadow-md transition-all duration-300 group-hover:scale-[1.01]"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={prev}
                              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
                            >
                              ‹
                            </button>
                            <button
                              onClick={next}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
                            >
                              ›
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="w-full mt-3 flex gap-2 justify-center">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveIndex(idx)}
                          className={`w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                            idx === activeIndex
                              ? "border-blue-500 scale-105"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`thumb-${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Title and Description */}
                  <div className="mt-5 text-center">
                    <h2 className="text-2xl font-semibold text-white">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 mt-2 leading-relaxed text-sm">
                      {post.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Likes + Comments Summary */}
              <div className="mt-6 flex items-center justify-center gap-6 border-t border-neutral-800 pt-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (liking) return;
                      setLiking(true);
                      try {
                        if (!liked) {
                          setLiked(true);
                          setLikesCount((n) => n + 1);
                          const res = await api.post(
                            `/societyconnect/posts/${postId}/like`
                          );
                          const updated = res?.data?.post ?? res?.data ?? null;
                          if (
                            updated &&
                            typeof updated.likes === "number"
                          )
                            setLikesCount(updated.likes);
                        } else {
                          setLiked(false);
                          setLikesCount((n) => Math.max(0, n - 1));
                          const res = await api.post(
                            `/societyconnect/posts/${postId}/unlike`
                          );
                          const updated = res?.data?.post ?? res?.data ?? null;
                          if (
                            updated &&
                            typeof updated.likes === "number"
                          )
                            setLikesCount(updated.likes);
                        }
                      } catch (err) {
                        console.error("Failed to toggle like", err);
                      } finally {
                        setLiking(false);
                      }
                    }}
                    aria-pressed={liked}
                    className={`text-2xl transition-transform duration-200 ${
                      liked
                        ? "text-red-500 scale-110"
                        : "text-gray-400 hover:text-gray-200 hover:scale-110"
                    }`}
                    title={liked ? "Unlike" : "Like"}
                  >
                    ♥
                  </button>
                  <span className="text-sm">{likesCount}</span>
                </div>
                <span>💬 {comments.length} comments</span>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Comments Section */}
        <div className="w-[400px] border-l border-neutral-800 flex flex-col bg-[#181818] text-gray-200">
          <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-800">
            <h3 className="font-semibold text-lg text-gray-100">Comments</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none transition"
            >
              ✕
            </button>
          </div>

          <div
            ref={commentsRef}
            className="flex-1 overflow-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
          >
            {loading ? (
              <div className="text-gray-400">Loading comments…</div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : comments.length === 0 ? (
              <div className="text-gray-500 text-center mt-10">
                No comments yet.
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="p-3 bg-neutral-900/60 hover:bg-neutral-900 transition rounded-lg border border-neutral-800"
                >
                  <div className="text-sm font-medium text-gray-100">
                    {getCommentAuthorName(c)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {c.text || c.comment || c.body}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <form
            className="p-4 border-t border-neutral-800 bg-[#141414]"
            onSubmit={async (e) => {
              e.preventDefault();
              setPostError(null);
              const comment = commentText?.trim();
              if (!comment) return;
              setPosting(true);
              try {
                const res = await api.post(
                  `/societyconnect/posts/${postId}/comments`,
                  { comment }
                );
                const newComment = res?.data?.comment ?? res?.data ?? null;
                if (newComment) {
                  setComments((prev) => [...prev, newComment]);
                  setCommentText("");
                  setTimeout(() => {
                    commentsRef.current?.scrollTo({
                      top: commentsRef.current.scrollHeight,
                      behavior: "smooth",
                    });
                  }, 50);
                }
              } catch (err) {
                console.error("Failed to post comment", err);
                setPostError(
                  err?.response?.data?.message || "Failed to post comment"
                );
              } finally {
                setPosting(false);
              }
            }}
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
              rows={3}
            />
            {postError && (
              <div className="text-xs text-red-400 mt-1">{postError}</div>
            )}
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={posting || !commentText.trim()}
                className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  posting || !commentText.trim()
                    ? "bg-blue-600/40 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                } text-white`}
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

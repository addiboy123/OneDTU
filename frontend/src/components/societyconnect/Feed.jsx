import { useEffect, useState } from "react";
import api from "../../api/interceptor";
import PostsModal from "./PostsModal";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/societyconnect/posts`);
        const data = res?.data?.posts ?? res?.data ?? [];
        if (!mounted) return;
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load posts", err);
        if (mounted) setError("Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPosts();
    return () => (mounted = false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200 px-4 py-8 transition-colors duration-300">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh] text-gray-400 text-lg animate-pulse">
          Loading posts…
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-10">{error}</div>
      ) : posts.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh] text-gray-500 text-sm">
          No posts available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const thumb =
              Array.isArray(post.images) && post.images.length
                ? post.images[0]
                : post.image || "";
            const societyName =
              typeof post.society === "string"
                ? post.society
                : post.society?.name ?? "";
            const title = post.title ?? "";
            const desc = post.description ?? "";
            const shortDesc =
              desc.length > 100 ? desc.slice(0, 97) + "..." : desc;

            return (
              <div
                key={post._id}
                onClick={() => setSelectedPostId(post._id)}
                className="cursor-pointer group relative rounded-2xl overflow-hidden bg-neutral-900 shadow-lg shadow-black/30 hover:shadow-blue-600/10 transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={thumb}
                  alt={title || "post"}
                  className="w-full h-60 object-cover transform group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />

                {/* Overlay (untouched per request) */}
                <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white p-3">
                  <div className="text-xs uppercase tracking-wider text-blue-300 font-medium">
                    {societyName}
                  </div>
                  <div className="font-semibold text-sm mt-1">{title}</div>
                  <div className="text-xs text-gray-200 mt-1">{shortDesc}</div>
                </div>

                {/* Hover glow border effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-transparent to-black/30 rounded-2xl pointer-events-none" />
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <PostsModal
        postId={selectedPostId}
        isOpen={Boolean(selectedPostId)}
        onClose={() => setSelectedPostId(null)}
      />
    </div>
  );
}

export default Feed;

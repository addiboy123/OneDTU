import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../api/interceptor";
import Navbar from "../components/Navbar";
import PostsModal from "../components/societyconnect/PostsModal";

export default function Society() {
  const { name } = useParams();
  const location = useLocation();
  const idFromState = location.state?.id;

  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        if (idFromState) {
          const res = await api.get(`/societyconnect/societies/${idFromState}`);
          if (mounted) setSociety(res.data.society ?? res.data);
          return;
        }

        // fallback: fetch all societies and find by name
        const res = await api.get('/societyconnect/societies');
        const list = res.data.societies ?? res.data ?? [];
        const found = list.find((s) => encodeURIComponent(s.name) === encodeURIComponent(name));
        if (mounted) setSociety(found || null);
      } catch (err) {
        console.error('Failed to fetch society', err);
        if (mounted) setError('Failed to fetch society');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => (mounted = false);
  }, [idFromState, name]);

  // Fetch posts when we have a society id (either from state or after society is loaded)
  useEffect(() => {
    let mounted = true;
    const fetchPosts = async (socId) => {
      setPostsLoading(true);
      try {
        const res = await api.get(`/societyconnect/societies/${socId}/posts`);
        const items = res?.data?.posts ?? res?.data ?? [];
        if (mounted) setPosts(items);
      } catch (err) {
        console.error('Failed to fetch posts for society', err);
        if (mounted) setPostsError('Failed to fetch posts');
      } finally {
        if (mounted) setPostsLoading(false);
      }
    };

    const socId = idFromState || society?._id;
    if (socId) fetchPosts(socId);
    return () => (mounted = false);
  }, [idFromState, society]);

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <Link to="/societyconnect" className="text-sm text-blue-600 underline">← Back to societies</Link>
        {loading ? (
          <div className="py-12 text-center">Loading...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">{error}</div>
        ) : !society ? (
          <div className="py-12 text-center">Society not found</div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h1 className="text-2xl font-bold mb-2">{society.name}</h1>
            <p className="text-gray-700 mb-4">{society.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {(society.images || []).map((img, i) => (
                <img key={i} src={img} alt={`${society.name}-${i}`} className="w-full h-48 object-cover rounded" />
              ))}
            </div>
            <div className="text-sm text-gray-600">Achievements: {society.achievements || '—'}</div>
            <div className="text-sm text-gray-600 mt-2">Contact: {society.contactDetails || '—'}</div>
            {/* Posts */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Posts</h2>
              {postsLoading ? (
                <div className="py-6 text-center">Loading posts…</div>
              ) : postsError ? (
                <div className="py-6 text-center text-red-500">{postsError}</div>
              ) : posts.length === 0 ? (
                <div className="py-6 text-center text-gray-500">No posts yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((p) => (
                    <div key={p._id} className="bg-white border rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => { setSelectedPostId(p._id); setIsPostModalOpen(true); }}>
                      <div className="relative">
                        <img
                          src={(p.images && p.images[0]) || '/placeholder.svg'}
                          alt={p.title}
                          className="w-full h-56 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{p.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <PostsModal postId={selectedPostId} isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
    </div>
  );
}

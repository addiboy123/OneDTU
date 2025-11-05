// Updated MaintainSociety page with modern UI theme
import { useEffect, useState, useCallback } from 'react';
import * as societyAdminApi from '../api/societyAdmin';
import PostEditorModal from '../components/societyconnect/PostEditorModal';
import PostListItem from '../components/societyconnect/PostListItem';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';

export default function MaintainSociety() {
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const admin = JSON.parse(localStorage.getItem('admin') || '{}');
        const societyId = admin?.society;
        if (!societyId) {
          setError('No society associated with this admin');
          setLoading(false);
          return;
        }

        const res = await societyAdminApi.getSociety(societyId);
        setSociety(res.society || res || null);

        const postsRes = await societyAdminApi.getPostsBySociety(societyId);
        setPosts(postsRes.posts || []);
      } catch (err) {
        setError(err?.response?.data?.msg || err.message || 'Failed to fetch society');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshPosts = useCallback(async () => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}');
      const societyId = admin?.society;
      if (!societyId) return;
      const postsRes = await societyAdminApi.getPostsBySociety(societyId);
      setPosts(postsRes.posts || []);
    } catch (e) {
      console.error('Failed to refresh posts', e);
    }
  }, []);

  const handleCreate = () => {
    setEditingPost(null);
    setEditorOpen(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditorOpen(true);
  };

  const handleDelete = async (post) => {
    if (!confirm('Delete this post?')) return;
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || '{}');
      const societyId = admin?.society;
      await societyAdminApi.deletePost(societyId, post._id);
      await refreshPosts();
    } catch (err) {
      alert(err?.response?.data?.msg || err.message || 'Delete failed');
    }
  };

  const onSaved = async () => {
    await refreshPosts();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-300">Loading…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#0d1117] text-white py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-[#111827] p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold">Manage Society: {society?.name || society?.title}</h1>
          <p className="text-gray-400 text-sm mt-1">ID: {society?._id}</p>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Posts</h2>
            <Button onClick={handleCreate}>Create Post</Button>
          </div>

          <div className="space-y-4">
            {posts.length === 0 && <div className="text-gray-500">No posts yet</div>}
            {posts.map((p) => (
              <PostListItem key={p._id} post={p} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>

      <PostEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaved={onSaved}
        initialPost={editingPost}
        societyId={society?._id}
        api={societyAdminApi}
      />
      </div>
    </div>
  );
}

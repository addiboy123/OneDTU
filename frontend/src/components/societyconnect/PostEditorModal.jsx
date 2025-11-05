import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

export default function PostEditorModal({ open, onClose, onSaved, initialPost = null, societyId, api }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [postCategory, setPostCategory] = useState('general');
  const [images, setImages] = useState([]); // new File objects
  const [existingImages, setExistingImages] = useState([]); // urls
  const [deletedImages, setDeletedImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    if (initialPost) {
      setTitle(initialPost.title || '');
      setDescription(initialPost.description || '');
      setPostCategory(initialPost.postCategory || 'general');
      setExistingImages(initialPost.images ? [...initialPost.images] : []);
      setDeletedImages([]);
      setImages([]);
    } else {
      setTitle('');
      setDescription('');
      setPostCategory('general');
      setExistingImages([]);
      setDeletedImages([]);
      setImages([]);
    }
    setError(null);
  }, [open, initialPost]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((s) => [...s, ...files]);
  };

  const removeNewImage = (idx) => {
    setImages((s) => s.filter((_, i) => i !== idx));
  };

  const markDeleteExisting = (url) => {
    setExistingImages((s) => s.filter(u => u !== url));
    setDeletedImages((s) => [...s, url]);
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (initialPost && initialPost._id) {
        const payload = {
          postId: initialPost._id,
          title,
          description,
          postCategory,
          deletedImages,
          images,
        };
        const res = await api.updatePost(societyId, payload);
        onSaved && onSaved(res.post || res);
      } else {
        const payload = { title, description, postCategory, images };
        const res = await api.createPost(societyId, payload);
        onSaved && onSaved(res.post || res);
      }
      onClose && onClose();
    } catch (err) {
      setError(err?.response?.data?.msg || err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose && onClose(); }}>
      <DialogContent className="max-w-2xl rounded-xl bg-black/80 border border-blue-900 p-6">
        <DialogHeader>
          <DialogTitle className="text-white">{initialPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div>
          <label className="block text-sm text-gray-300">Title</label>
          <Input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-1 bg-[#0b1220] text-white border-blue-800" required />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Description</label>
          <Textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="mt-1 bg-[#0b1220] text-white border-blue-800" rows={4} required />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Category</label>
          <Input value={postCategory} onChange={(e)=>setPostCategory(e.target.value)} className="mt-1 bg-[#0b1220] text-white border-blue-800" />
        </div>

        <div>
          <label className="block text-sm text-gray-300">Existing Images</label>
          <div className="flex gap-3 mt-3 flex-wrap">
            {existingImages.map((url) => (
              <div key={url} className="relative rounded overflow-hidden">
                <img src={url} alt="img" className="h-28 w-36 object-cover rounded-md border border-blue-900" />
                <button type="button" onClick={()=>markDeleteExisting(url)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2">x</button>
              </div>
            ))}
            {existingImages.length === 0 && <div className="text-gray-400">No existing images</div>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300">Upload Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mt-2 text-sm text-gray-300" />
          <div className="flex gap-3 mt-3 flex-wrap">
            {images.map((f, i) => (
              <div key={i} className="relative rounded overflow-hidden">
                <img src={URL.createObjectURL(f)} alt={f.name} className="h-28 w-36 object-cover rounded-md border border-blue-900" />
                <button type="button" onClick={()=>removeNewImage(i)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2">x</button>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="text-red-400">{error}</div>}

        <DialogFooter>
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" size="sm" onClick={()=>{ onClose && onClose(); }}>Cancel</Button>
            <Button type="submit" variant="default" size="sm" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
    </Dialog>
  );
}

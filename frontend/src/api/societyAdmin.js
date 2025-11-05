import api from './interceptor';
import axios from 'axios';

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function getSociety(societyId) {
  const url = `${base}/societyconnect/societies/${societyId}`;
  const res = await api.get(url);
  return res.data;
}

export async function getPostsBySociety(societyId, page = 1, limit = 20) {
  const url = `${base}/societyconnect/societies/${societyId}/posts?page=${page}&limit=${limit}`;
  const res = await api.get(url);
  return res.data;
}

export async function updateSociety(societyId, payload) {
  // payload may include fields and files (images[]). Use FormData for files.
  const url = `${base}/societyconnect/society/${societyId}`;
  const form = new FormData();
  Object.keys(payload || {}).forEach((key) => {
    const val = payload[key];
    if (key === 'images' && Array.isArray(val)) {
      val.forEach((f) => form.append('images', f));
    } else if (key === 'deletedImages') {
      // backend expects deletedImages possibly as JSON string
      form.append('deletedImages', JSON.stringify(val));
    } else if (val !== undefined && val !== null) {
      form.append(key, val);
    }
  });
  const res = await api.put(url, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function createPost(societyId, { title, description, postCategory, images = [] }) {
  const url = `${base}/societyconnect/societies/${societyId}/posts`;
  const form = new FormData();
  form.append('title', title);
  form.append('description', description);
  form.append('postCategory', postCategory);
  images.forEach((f) => form.append('images', f));
  const res = await api.post(url, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function updatePost(societyId, { postId, title, description, postCategory, deletedImages = [], images = [] }) {
  const url = `${base}/societyconnect/societies/${societyId}/posts`;
  const form = new FormData();
  form.append('postId', postId);
  if (title !== undefined) form.append('title', title);
  if (description !== undefined) form.append('description', description);
  if (postCategory !== undefined) form.append('postCategory', postCategory);
  if (deletedImages && deletedImages.length > 0) form.append('deletedImages', JSON.stringify(deletedImages));
  images.forEach((f) => form.append('images', f));
  const res = await api.put(url, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function deletePost(societyId, postId) {
  const url = `${base}/societyconnect/societies/${societyId}/posts`;
  // axios delete with body: pass data option
  const res = await api.delete(url, { data: { postId } });
  return res.data;
}

export async function deleteCommentAdmin(commentId) {
  const url = `${base}/societyconnect/comments/${commentId}/admin`;
  const res = await api.delete(url);
  return res.data;
}

export default {
  getSociety,
  updateSociety,
  createPost,
  updatePost,
  deletePost,
  deleteCommentAdmin,
};

import api from "../api/interceptor";

export async function getAllPosts(page = 1, limit = 12) {
  const res = await api.get(`/posts?page=${page}&limit=${limit}`);
  return res.data || {};
}

export async function getAllSocieties() {
  const res = await api.get(`/societies`);
  return (res.data && res.data.societies) || [];
}

export async function getFollowedSocieties() {
  // placeholder - backend route not implemented yet; return empty list for now
  try {
    const res = await api.get(`/societies`);
    return (res.data && res.data.societies) || [];
  } catch (err) {
    return [];
  }
}

export default {
  getAllPosts,
  getAllSocieties,
  getFollowedSocieties,
};

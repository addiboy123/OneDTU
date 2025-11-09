// src/services/findMySpaceAPI.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/findmyspace`,
});

// --- Helper to get auth headers ---
const getAuthHeaders = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const getAuthHeadersMultiPart = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});

// --- Read Operations ---
export const getAllFlats = () => apiClient.get('/flats');
export const getAllPGs = () => apiClient.get('/PGs');

// --- User-specific Flat retrieval ---
export const getMyFlats = (token) => {
  return apiClient.get('/my/flats', getAuthHeaders(token));
};

// --- Flat CRUD Operations ---
export const createFlat = (formData, token) => {
  return apiClient.post('/flat', formData, getAuthHeadersMultiPart(token));
};
export const updateFlat = (id, formData, token) => {
  return apiClient.put(`/flat/${id}`, formData, getAuthHeadersMultiPart(token));
};
export const deleteFlat = (id, token) => {
  return apiClient.delete(`/flat/${id}`, getAuthHeaders(token));
};

// --- PG Post (Room) CRUD Operations ---
export const createPgPost = (formData, token) => {
  return apiClient.post('/PGposts', formData, getAuthHeadersMultiPart(token));
};
export const updatePgPost = (postId, formData, token) => {
  return apiClient.put(`/PGposts/${postId}`, formData, getAuthHeadersMultiPart(token));
};
export const deletePgPost = (postId, token) => {
  return apiClient.delete(`/PGposts/${postId}`, getAuthHeaders(token));
};
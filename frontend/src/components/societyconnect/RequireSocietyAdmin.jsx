import { Navigate } from 'react-router-dom';

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch (e) {
    return null;
  }
}

export default function RequireSocietyAdmin({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  const payload = decodeToken(token);
  if (!payload || payload.role !== 'societyAdmin') return <Navigate to="/login" replace />;
  return children;
}

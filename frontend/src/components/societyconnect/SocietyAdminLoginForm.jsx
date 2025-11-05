import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../../api/auth';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function SocietyAdminLoginForm({ onClose }) {
  const [form, setForm] = useState({ phoneNumber: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await authApi.societyAdminLogin(form);
      // expected response: { message, token, admin }
      if (data.token) {
        localStorage.setItem('token', data.token);
        // store admin for convenience
        localStorage.setItem('admin', JSON.stringify(data.admin || {}));
        // navigate to protected maintain page
        navigate('/maintain-society');
      }
    } catch (err) {
      setError(err?.response?.data?.msg || err?.message || 'Login failed');
    } finally {
      setLoading(false);
      if (onClose) onClose();
    }
  };

  return (
    <div className="max-w-md w-full bg-black/80 border border-blue-900 p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-3">Society Admin Login</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300">Phone number</label>
          <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="1234567890" className="mt-1 bg-[#071023] text-white border-blue-800" required />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Password</label>
          <Input name="password" type="password" value={form.password} onChange={handleChange} className="mt-1 bg-[#071023] text-white border-blue-800" required />
        </div>
        {error && <div className="text-red-400">{error}</div>}
        <div className="flex items-center justify-between">
          <Button type="submit" variant="default" size="default" disabled={loading}>{loading ? 'Signing in…' : 'Sign in as maintainer'}</Button>
          <Button variant="ghost" size="sm" onClick={() => onClose && onClose()}>Close</Button>
        </div>
      </form>
    </div>
  );
}

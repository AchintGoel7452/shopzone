import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data, res.data.token);
      toast.success('Welcome back!');
      if (res.data.role === 'SELLER' || res.data.role === 'ADMIN') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5" style={{ background: '#f0f4ff' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="form-card">
              <div className="text-center mb-4">
                <h2 className="fw-bold">🛒 Sign In</h2>
                <p className="text-muted">Welcome back to ShopZone</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input type="email" className="form-control form-control-lg"
                    name="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input type="password" className="form-control form-control-lg"
                    name="password" value={form.password} onChange={handleChange}
                    placeholder="••••••••" required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  Sign In
                </button>
              </form>

              <hr className="my-4"/>
              <div className="text-center">
                <p className="mb-2">Don't have an account?</p>
                <Link to="/register" className="btn btn-outline-primary me-2">Customer Sign Up</Link>
                <Link to="/register/seller" className="btn btn-outline-warning">Seller Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

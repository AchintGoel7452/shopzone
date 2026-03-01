import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', city: '', country: ''
  });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!'); return;
    }
    setLoading(true);
    try {
      const res = await register({ ...form, role: 'CUSTOMER' });
      loginUser(res.data, res.data.token);
      toast.success('Account created! Welcome to ShopZone!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ background: '#f0f4ff' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="form-card">
              <div className="text-center mb-4">
                <h2 className="fw-bold">👤 Create Customer Account</h2>
                <p className="text-muted">Join millions of shoppers on ShopZone</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input className="form-control" name="fullName" value={form.fullName}
                      onChange={handleChange} placeholder="John Doe" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone *</label>
                    <input className="form-control" name="phone" value={form.phone}
                      onChange={handleChange} placeholder="+1 234 567 8900" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Email *</label>
                    <input type="email" className="form-control" name="email" value={form.email}
                      onChange={handleChange} placeholder="you@example.com" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password *</label>
                    <input type="password" className="form-control" name="password" value={form.password}
                      onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Confirm Password *</label>
                    <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword}
                      onChange={handleChange} placeholder="Repeat password" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Address</label>
                    <input className="form-control" name="address" value={form.address}
                      onChange={handleChange} placeholder="123 Main Street" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">City</label>
                    <input className="form-control" name="city" value={form.city}
                      onChange={handleChange} placeholder="New York" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Country</label>
                    <input className="form-control" name="country" value={form.country}
                      onChange={handleChange} placeholder="United States" />
                  </div>
                  <div className="col-12 mt-2">
                    <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                      {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                      Create Account
                    </button>
                  </div>
                </div>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login">Sign In</Link>
                <span className="mx-2 text-muted">|</span>
                <Link to="/register/seller">Become a Seller</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

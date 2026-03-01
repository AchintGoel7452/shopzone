import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerSeller } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function RegisterSeller() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', city: '', country: '',
    businessName: '', businessDescription: '', taxId: ''
  });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match!'); return; }
    setLoading(true);
    try {
      const res = await registerSeller(form);
      loginUser(res.data, res.data.token);
      toast.success('Seller account created! Welcome aboard!');
      navigate('/seller');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ background: '#fffbeb' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center mb-4">
              <span className="badge bg-warning text-dark px-3 py-2 mb-2">Business Account</span>
              <h2 className="fw-bold">🏪 Open Your ShopZone Store</h2>
              <p className="text-muted">Reach millions of customers. Zero listing fees to get started.</p>
            </div>

            {/* Benefits */}
            <div className="row g-3 mb-4">
              {['📦 Easy product management','💰 Competitive fees','📊 Sales analytics','🚀 Instant listing'].map((b, i) => (
                <div key={i} className="col-md-3 col-6">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <small className="fw-semibold">{b}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-card">
              <form onSubmit={handleSubmit}>
                {/* Personal Info */}
                <h5 className="fw-bold mb-3 border-bottom pb-2">Personal Information</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone *</label>
                    <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Email *</label>
                    <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password *</label>
                    <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} minLength={6} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Confirm Password *</label>
                    <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                  </div>
                </div>

                {/* Business Info */}
                <h5 className="fw-bold mb-3 border-bottom pb-2">Business Information</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Business Name *</label>
                    <input className="form-control" name="businessName" value={form.businessName} onChange={handleChange} placeholder="My Awesome Store" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tax ID / Registration No.</label>
                    <input className="form-control" name="taxId" value={form.taxId} onChange={handleChange} placeholder="Optional" />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Business Description</label>
                    <textarea className="form-control" name="businessDescription" value={form.businessDescription} onChange={handleChange} rows={3} placeholder="Tell customers about your business..." />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Business Address</label>
                    <input className="form-control" name="address" value={form.address} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">City</label>
                    <input className="form-control" name="city" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Country</label>
                    <input className="form-control" name="country" value={form.country} onChange={handleChange} />
                  </div>
                </div>

                <div className="alert alert-info small">
                  By creating a seller account, you agree to ShopZone's <a href="#">Seller Terms of Service</a> and <a href="#">Policies</a>.
                </div>

                <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold" disabled={loading}>
                  {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                  🏪 Create Seller Account
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login">Sign In</Link>
                <span className="mx-2 text-muted">|</span>
                <Link to="/register">Customer Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

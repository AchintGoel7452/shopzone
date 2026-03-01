import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shippingAddress: user?.address || '',
    shippingCity: user?.city || '',
    shippingCountry: user?.country || '',
    paymentMethod: 'Credit Card'
  });

  const shipping = cartTotal > 50 ? 0 : 5.99;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity })),
        ...form
      };
      const res = await placeOrder(orderData);
      clearCart();
      toast.success(`Order placed! Order #${res.data.orderNumber}`);
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Checkout</h2>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="form-card">
            <h5 className="fw-bold mb-3">Shipping Address</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Street Address *</label>
                <input className="form-control" name="shippingAddress" value={form.shippingAddress} onChange={handleChange} required />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">City *</label>
                  <input className="form-control" name="shippingCity" value={form.shippingCity} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Country *</label>
                  <input className="form-control" name="shippingCountry" value={form.shippingCountry} onChange={handleChange} required />
                </div>
              </div>

              <h5 className="fw-bold mb-3 mt-4">Payment Method</h5>
              {['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'].map(method => (
                <div key={method} className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="paymentMethod" value={method}
                    checked={form.paymentMethod === method} onChange={handleChange} />
                  <label className="form-check-label">{method}</label>
                </div>
              ))}

              <div className="alert alert-info mt-3 small">
                🔒 This is a demo checkout. No real payment is processed.
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 mt-2" disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                Place Order — ${(cartTotal + shipping).toFixed(2)}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold mb-3">Order Items ({cartItems.length})</h5>
            {cartItems.map(i => (
              <div key={i.id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <div>
                  <p className="mb-0 small fw-semibold">{i.name}</p>
                  <p className="mb-0 text-muted small">Qty: {i.quantity}</p>
                </div>
                <span className="fw-bold">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="d-flex justify-content-between mt-2">
              <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Shipping</span><span className={shipping === 0 ? 'text-success' : ''}>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
            </div>
            <hr/>
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span><span className="text-primary">${(cartTotal + shipping).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

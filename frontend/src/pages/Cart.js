import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 50 ? 0 : 5.99;
  const grandTotal = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: '5rem' }}>🛒</div>
        <h3 className="mt-3">Your cart is empty</h3>
        <p className="text-muted">Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary mt-2">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">🛒 Shopping Cart ({cartItems.length} items)</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          {cartItems.map(item => (
            <div key={item.id} className="card mb-3 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <div style={{ width:80, height:80, background:'#f0f4ff', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', flexShrink:0 }}>
                  🛍️
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-semibold mb-1">{item.name}</h6>
                  <p className="text-muted small mb-1">${item.price?.toFixed(2)} each</p>
                  <div className="input-group" style={{ width: 120 }}>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <input type="number" className="form-control form-control-sm text-center" value={item.quantity}
                      onChange={e => updateQuantity(item.id, +e.target.value)} min={1} />
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="text-end">
                  <p className="fw-bold text-primary mb-2">${(item.price * item.quantity).toFixed(2)}</p>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-outline-secondary btn-sm" onClick={clearCart}>Clear Cart</button>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-success' : ''}>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
            </div>
            {shipping > 0 && <p className="text-muted small">Add ${(50 - cartTotal).toFixed(2)} more for free shipping!</p>}
            <hr/>
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span><span className="text-primary">${grandTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-lg w-100" onClick={() => {
              if (!isAuthenticated()) navigate('/login');
              else navigate('/checkout');
            }}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-outline-secondary w-100 mt-2">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

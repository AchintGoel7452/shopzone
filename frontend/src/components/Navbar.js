import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isSeller } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?keyword=${search}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🛒 ShopZone
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Search Bar */}
        <form className="d-flex mx-3 flex-grow-1" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-warning" type="submit">🔍</button>
          </div>
        </form>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link className="nav-link" to="/products">Shop</Link>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                🛍️ Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            </li>

            {/* Seller Dashboard */}
            {user && isSeller() && (
              <li className="nav-item">
                <Link className="nav-link" to="/seller">
                  📦 Dashboard
                </Link>
              </li>
            )}

            {/* Auth */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" to="/login">Sign In</Link>
                </li>
                <li className="nav-item dropdown">
                  <button className="btn btn-warning btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                    Sign Up
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/register">👤 Customer Account</Link></li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><Link className="dropdown-item" to="/register/seller">🏪 Business / Seller Account</Link></li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button className="btn btn-outline-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                  👤 {user.fullName?.split(' ')[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                  <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                  {isSeller() && <li><Link className="dropdown-item" to="/seller">Seller Dashboard</Link></li>}
                  <li><hr className="dropdown-divider"/></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Sign Out</button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

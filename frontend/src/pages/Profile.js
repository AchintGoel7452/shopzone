import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="form-card text-center">
            <div style={{ width:80, height:80, background:'#dbeafe', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', margin:'0 auto 1rem' }}>
              👤
            </div>
            <h3 className="fw-bold">{user?.fullName}</h3>
            <p className="text-muted">{user?.email}</p>
            <span className={`badge ${user?.role === 'SELLER' ? 'bg-warning text-dark' : 'bg-primary'} mb-3`}>
              {user?.role}
            </span>
            <div className="list-group text-start mt-3">
              <Link to="/orders" className="list-group-item list-group-item-action">📦 My Orders</Link>
              {user?.role === 'SELLER' && <Link to="/seller" className="list-group-item list-group-item-action">🏪 Seller Dashboard</Link>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

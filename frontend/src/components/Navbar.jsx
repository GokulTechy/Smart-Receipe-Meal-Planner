import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, ShoppingCart, Heart, PlusCircle, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
          NutriChef
        </Link>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Home size={20} /> Home
          </Link>
          <Link to="/planner" className={`nav-link ${location.pathname === '/planner' ? 'active' : ''}`}>
            <Calendar size={20} /> Meal Planner
          </Link>
          <Link to="/grocery" className={`nav-link ${location.pathname === '/grocery' ? 'active' : ''}`}>
            <ShoppingCart size={20} /> Grocery List
          </Link>
          <Link to="/favorites" className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}>
            <Heart size={20} /> Favorites
          </Link>
          
          {user ? (
            <>
              <Link to="/add-recipe" className={`nav-link ${location.pathname === '/add-recipe' ? 'active' : ''}`}>
                <PlusCircle size={20} /> Add Recipe
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '20px' }}>
                <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}><User size={18} /> {user}</span>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '20px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

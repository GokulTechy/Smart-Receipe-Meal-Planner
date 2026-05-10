import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Heart, Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const getFavKey = () => `favorites_${localStorage.getItem('user') || 'guest'}`;

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const savedFavs = JSON.parse(localStorage.getItem(getFavKey())) || [];
    if (savedFavs.length > 0) {
      try {
        const res = await axios.get('http://localhost:5001/api/recipes');
        const allRecipes = res.data;
        const filtered = allRecipes.filter(r => savedFavs.includes(r.id));
        setFavorites(filtered);
      } catch (err) {
        console.error(err);
      }
    } else {
      setFavorites([]);
    }
  };

  const removeFavorite = (id) => {
    const updatedFavs = favorites.filter(f => f.id !== id);
    setFavorites(updatedFavs);
    localStorage.setItem(getFavKey(), JSON.stringify(updatedFavs.map(f => f.id)));
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '50px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Heart size={36} color="red" fill="red" /> Your Favorites
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Recipes you've saved for later</p>
      </div>

      <div className="recipe-grid">
        {favorites.map((recipe, i) => (
          <motion.div 
            key={recipe.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            style={{ position: 'relative' }}
          >
            <Link to={`/recipe/${recipe.id}`} className="recipe-card glass">
              <div className="recipe-img-container">
                <img src={recipe.image} alt={recipe.title} className="recipe-img" />
              </div>
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  By: {recipe.author || 'System'}
                </div>
                <div className="recipe-meta">
                  <span className="tooltip-container">
                    <Clock size={16} /> {recipe.prepTime} + {recipe.cookTime}
                  </span>
                  <span className="tooltip-container">
                    <Flame size={16} /> {recipe.calories} kcal
                  </span>
                </div>
              </div>
            </Link>
            <button 
              onClick={(e) => { e.preventDefault(); removeFavorite(recipe.id); }}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
            >
              <Heart size={20} color="red" fill="red" />
            </button>
          </motion.div>
        ))}
        {favorites.length === 0 && (
          <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '50px' }}>
            <h2 style={{ color: 'var(--text-muted)' }}>No favorites yet. Go save some!</h2>
          </div>
        )}
      </div>
    </div>
  );
}

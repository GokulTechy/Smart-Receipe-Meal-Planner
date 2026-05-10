import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, [search]);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/recipes${search ? `?query=${search}` : ''}`);
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="hero">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Healthy & Delicious Recipes
        </motion.h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Find the perfect meal for your goals. Search by ingredients, dietary preferences, or cuisine.
        </p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="input-group">
            <Search color="var(--text-muted)" size={20} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search for recipes, ingredients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe, i) => (
          <motion.div 
            key={recipe.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
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
                    <div className="tooltip">Total Time</div>
                  </span>
                  <span className="tooltip-container">
                    <Flame size={16} /> {recipe.calories} kcal
                    <div className="tooltip">Calories</div>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        {recipes.length === 0 && (
          <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '50px' }}>
            <h2 style={{ color: 'var(--text-muted)' }}>No recipes found</h2>
          </div>
        )}
      </div>
    </div>
  );
}

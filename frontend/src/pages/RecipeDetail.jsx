import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, Flame, Info, CheckCircle, MessageSquare, Heart, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState('');
  const [substitution, setSubstitution] = useState(null);
  const [submittingIng, setSubmittingIng] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const user = localStorage.getItem('user');
  const getFavKey = () => `favorites_${user || 'guest'}`;

  useEffect(() => {
    fetchRecipe();
    const favs = JSON.parse(localStorage.getItem(getFavKey())) || [];
    if (favs.includes(id)) setIsFavorite(true);
  }, [id]);

  const toggleFavorite = () => {
    let favs = JSON.parse(localStorage.getItem(getFavKey())) || [];
    if (favs.includes(id)) {
      favs = favs.filter(f => f !== id);
      setIsFavorite(false);
    } else {
      favs.push(id);
      setIsFavorite(true);
    }
    localStorage.setItem(getFavKey(), JSON.stringify(favs));
  };

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/recipes/${id}`);
      setRecipe(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:5001/api/recipes/${id}`);
        navigate('/');
      } catch (err) {
        console.error(err);
        alert('Failed to delete. Make sure you are logged in.');
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment) return;
    try {
      const res = await axios.post(`http://localhost:5001/api/recipes/${id}/comments`, {
        user: 'Guest User',
        text: comment
      });
      setRecipe(res.data);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const getSubstitution = async (ingredient) => {
    setSubmittingIng(ingredient);
    try {
      const res = await axios.post('http://localhost:5001/api/substitute', { ingredient });
      setSubstitution({ [ingredient]: res.data.substitute });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingIng(null);
    }
  };

  if (!recipe) return <div className="container">Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '50px' }}>
      <div className="glass" style={{ padding: '30px', marginBottom: '30px', position: 'relative' }}>
        <button
          onClick={toggleFavorite}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Heart size={32} color={isFavorite ? "red" : "gray"} fill={isFavorite ? "red" : "transparent"} />
        </button>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <img
            src={recipe.image}
            alt={recipe.title}
            style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{recipe.title}</h1>
              {user && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/edit-recipe/${recipe.id}`} className="btn btn-secondary" style={{ padding: '8px' }}>
                    <Edit size={20} />
                  </Link>
                  <button onClick={handleDelete} className="btn btn-secondary" style={{ padding: '8px', color: 'red', borderColor: 'red' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              By: {recipe.author || 'System'}
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={20} /> Prep: {recipe.prepTime} | Cook: {recipe.cookTime}
              </span>
              <span className="tooltip-container" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Flame size={20} /> {recipe.calories} kcal
                <div className="tooltip">
                  Protein: {recipe.nutrition.protein} | Carbs: {recipe.nutrition.carbs} | Fat: {recipe.nutrition.fat}
                </div>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={20} /> Ingredients
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{ing.amount} {ing.name}</span>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                        onClick={() => getSubstitution(ing.name)}
                        disabled={submittingIng === ing.name}
                      >
                        {submittingIng === ing.name ? 'Asking AI...' : 'AI Substitute'}
                      </button>
                    </li>
                  ))}
                </ul>
                {substitution && Object.keys(substitution).map(key => (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '15px', padding: '10px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid var(--secondary)' }}>
                    <strong>AI Suggestion for {key}:</strong> {substitution[key]}
                  </motion.div>
                ))}
              </div>

              <div>
                <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} /> Step-by-Step
                </h3>
                <ol style={{ paddingLeft: '20px' }}>
                  {recipe.steps.map((step, idx) => (
                    <li key={idx} style={{ padding: '8px 0', lineHeight: '1.5' }}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '30px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} /> Comments & Feedback
        </h3>
        <div style={{ marginBottom: '20px' }}>
          {recipe.comments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first!</p>
          ) : (
            recipe.comments.map((c, i) => (
              <div key={i} style={{ padding: '10px', borderBottom: '1px solid var(--glass-border)', marginBottom: '10px' }}>
                <strong>{c.user}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>- {new Date(c.date).toLocaleDateString()}</span>
                <p style={{ marginTop: '5px' }}>{c.text}</p>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="input-field"
            style={{ flex: 1, border: '1px solid #ccc', borderRadius: '8px' }}
            placeholder="Add your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Post</button>
        </form>
      </div>
    </div>
  );
}


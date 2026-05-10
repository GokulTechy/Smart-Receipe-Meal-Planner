import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddRecipe() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [calories, setCalories] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    
    // Parse ingredients (format: "Amount Name", e.g., "2 cups Flour")
    const ingredients = ingredientsText.split('\n').filter(i => i.trim() !== '').map(line => {
      const parts = line.trim().split(' ');
      const amount = parts[0];
      const name = parts.slice(1).join(' ') || line;
      return { amount, name };
    });

    const steps = stepsText.split('\n').filter(s => s.trim() !== '');

    const newRecipe = {
      title,
      image: image || 'https://images.unsplash.com/photo-1490818387583-1b5f22209849?w=500&auto=format&fit=crop&q=60',
      prepTime,
      cookTime,
      calories: parseInt(calories) || 0,
      nutrition: { protein: '0g', carbs: '0g', fat: '0g' }, // simplified
      ingredients,
      steps,
      author: user
    };

    try {
      await axios.post('http://localhost:5001/api/recipes', newRecipe);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (!localStorage.getItem('user')) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Please login to add a recipe.</div>;
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '50px' }}>
      <div className="glass" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px' }}>Add New Recipe</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Recipe Title</label>
            <input type="text" className="input-field" required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Image URL (Optional)</label>
            <input type="text" className="input-field" value={image} onChange={e => setImage(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Prep Time</label>
              <input type="text" className="input-field" placeholder="e.g. 10 mins" required value={prepTime} onChange={e => setPrepTime(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Cook Time</label>
              <input type="text" className="input-field" placeholder="e.g. 20 mins" required value={cookTime} onChange={e => setCookTime(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Calories</label>
              <input type="number" className="input-field" placeholder="e.g. 350" required value={calories} onChange={e => setCalories(e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Ingredients (One per line: "Amount Name", e.g., "1 cup Milk")</label>
            <textarea className="input-field" rows="5" required value={ingredientsText} onChange={e => setIngredientsText(e.target.value)} style={{ resize: 'vertical' }}></textarea>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Steps (One step per line)</label>
            <textarea className="input-field" rows="5" required value={stepsText} onChange={e => setStepsText(e.target.value)} style={{ resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Recipe</button>
        </form>
      </div>
    </div>
  );
}

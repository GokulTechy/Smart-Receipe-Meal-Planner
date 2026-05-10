import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, MinusCircle } from 'lucide-react';

export default function EditRecipe() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [recipe, setRecipe] = useState({
    title: '',
    image: '',
    prepTime: '',
    cookTime: '',
    calories: '',
    nutrition: { protein: '', carbs: '', fat: '' },
    ingredients: [{ name: '', amount: '' }],
    steps: ['']
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/recipes/${id}`, recipe);
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to edit. Make sure you are logged in.');
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngs = [...recipe.ingredients];
    newIngs[index][field] = value;
    setRecipe({ ...recipe, ingredients: newIngs });
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...recipe.steps];
    newSteps[index] = value;
    setRecipe({ ...recipe, steps: newSteps });
  };

  const addIngredient = () => setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { name: '', amount: '' }] });
  const addStep = () => setRecipe({ ...recipe, steps: [...recipe.steps, ''] });
  
  const removeIngredient = (index) => setRecipe({ ...recipe, ingredients: recipe.ingredients.filter((_, i) => i !== index) });
  const removeStep = (index) => setRecipe({ ...recipe, steps: recipe.steps.filter((_, i) => i !== index) });

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '50px' }}>
      <div className="glass" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Edit Recipe</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Recipe Title</label>
              <div className="input-group">
                <input required type="text" className="input-field" value={recipe.title} onChange={e => setRecipe({...recipe, title: e.target.value})} placeholder="e.g. Tomato Rice" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Image URL</label>
              <div className="input-group">
                <input required type="text" className="input-field" value={recipe.image} onChange={e => setRecipe({...recipe, image: e.target.value})} placeholder="https://..." />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Prep Time</label>
              <div className="input-group">
                <input required type="text" className="input-field" value={recipe.prepTime} onChange={e => setRecipe({...recipe, prepTime: e.target.value})} placeholder="e.g. 10 mins" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Cook Time</label>
              <div className="input-group">
                <input required type="text" className="input-field" value={recipe.cookTime} onChange={e => setRecipe({...recipe, cookTime: e.target.value})} placeholder="e.g. 20 mins" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Calories</label>
              <div className="input-group">
                <input required type="number" className="input-field" value={recipe.calories} onChange={e => setRecipe({...recipe, calories: e.target.value})} placeholder="e.g. 350" />
              </div>
            </div>
          </div>

          <h3 style={{ marginBottom: '15px' }}>Nutrition</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <div className="input-group"><input type="text" className="input-field" value={recipe.nutrition.protein} onChange={e => setRecipe({...recipe, nutrition: {...recipe.nutrition, protein: e.target.value}})} placeholder="Protein (e.g. 12g)" /></div>
            <div className="input-group"><input type="text" className="input-field" value={recipe.nutrition.carbs} onChange={e => setRecipe({...recipe, nutrition: {...recipe.nutrition, carbs: e.target.value}})} placeholder="Carbs (e.g. 45g)" /></div>
            <div className="input-group"><input type="text" className="input-field" value={recipe.nutrition.fat} onChange={e => setRecipe({...recipe, nutrition: {...recipe.nutrition, fat: e.target.value}})} placeholder="Fat (e.g. 10g)" /></div>
          </div>

          <h3 style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
            Ingredients
            <button type="button" onClick={addIngredient} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><PlusCircle size={24} /></button>
          </h3>
          {recipe.ingredients.map((ing, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div className="input-group" style={{ flex: 1 }}><input required type="text" className="input-field" value={ing.amount} onChange={e => handleIngredientChange(i, 'amount', e.target.value)} placeholder="Amount (e.g. 1 cup)" /></div>
              <div className="input-group" style={{ flex: 2 }}><input required type="text" className="input-field" value={ing.name} onChange={e => handleIngredientChange(i, 'name', e.target.value)} placeholder="Ingredient name" /></div>
              {i > 0 && <button type="button" onClick={() => removeIngredient(i)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><MinusCircle size={24} /></button>}
            </div>
          ))}

          <h3 style={{ marginTop: '30px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
            Steps
            <button type="button" onClick={addStep} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><PlusCircle size={24} /></button>
          </h3>
          {recipe.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{i + 1}.</span>
              <div className="input-group" style={{ flex: 1 }}>
                <input required type="text" className="input-field" value={step} onChange={e => handleStepChange(i, e.target.value)} placeholder="Describe this step..." />
              </div>
              {i > 0 && <button type="button" onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}><MinusCircle size={24} /></button>}
            </div>
          ))}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '40px', padding: '15px', fontSize: '1.2rem' }}>
            Update Recipe
          </button>
        </form>
      </div>
    </div>
  );
}

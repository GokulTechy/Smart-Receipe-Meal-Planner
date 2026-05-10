import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GroceryList() {
  const [groceryList, setGroceryList] = useState({});

  useEffect(() => {
    fetchGroceryList();
  }, []);

  const fetchGroceryList = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/meal-plan');
      const plan = res.data;
      
      const list = {};
      Object.values(plan).forEach(dayMeals => {
        dayMeals.forEach(meal => {
          meal.recipe.ingredients.forEach(ing => {
            if (list[ing.name]) {
              list[ing.name].recipes.push(meal.recipe.title);
            } else {
              list[ing.name] = { amount: ing.amount, recipes: [meal.recipe.title], checked: false };
            }
          });
        });
      });
      setGroceryList(list);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCheck = (item) => {
    setGroceryList(prev => ({
      ...prev,
      [item]: { ...prev[item], checked: !prev[item].checked }
    }));
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '50px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingCart size={36} color="var(--primary)" /> Grocery List
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Automatically generated from your meal plan</p>
      </div>

      <div className="glass" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
        {Object.keys(groceryList).length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
            Your grocery list is empty. Add meals to your planner first!
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(groceryList).map(([item, details], i) => (
              <motion.li 
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '15px', 
                  borderBottom: '1px solid var(--glass-border)',
                  opacity: details.checked ? 0.5 : 1,
                  textDecoration: details.checked ? 'line-through' : 'none'
                }}
              >
                <div 
                  onClick={() => toggleCheck(item)}
                  style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--primary)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', cursor: 'pointer',
                    background: details.checked ? 'var(--primary)' : 'transparent'
                  }}
                >
                  {details.checked && <Check size={16} color="white" />}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{item}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>({details.amount})</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Needed for: {details.recipes.join(', ')}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

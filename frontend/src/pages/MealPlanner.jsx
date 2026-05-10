import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanner() {
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recipesRes, planRes] = await Promise.all([
        axios.get('http://localhost:5001/api/recipes'),
        axios.get('http://localhost:5001/api/meal-plan')
      ]);
      setRecipes(recipesRes.data);
      setMealPlan(planRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === 'recipe-list' && destination.droppableId !== 'recipe-list') {
      const day = destination.droppableId;
      try {
        const res = await axios.post('http://localhost:5001/api/meal-plan', { day, recipeId: draggableId });
        setMealPlan(res.data);
      } catch (err) {
        console.error(err);
      }
    } else if (source.droppableId !== 'recipe-list' && destination.droppableId !== 'recipe-list') {
      // Just visually update or ignore if we want to keep it simple
    }
  };

  const removeMeal = async (day, itemId) => {
    try {
      const res = await axios.delete(`http://localhost:5001/api/meal-plan/${day}/${itemId}`);
      setMealPlan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '50px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={36} color="var(--primary)" /> Meal Planner
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Drag recipes into your weekly schedule</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '30px' }}>
          
          <div style={{ width: '300px' }}>
            <div className="glass" style={{ padding: '20px', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '20px' }}>Available Recipes</h3>
              <Droppable droppableId="recipe-list" isDropDisabled={true}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '100px' }}>
                    {recipes.map((recipe, index) => (
                      <Draggable key={recipe.id} draggableId={recipe.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              padding: '10px',
                              marginBottom: '10px',
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              boxShadow: snapshot.isDragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              border: '1px solid var(--glass-border)',
                              ...provided.draggableProps.style
                            }}
                          >
                            <img src={recipe.image} alt={recipe.title} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                            <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{recipe.title}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {DAYS.map(day => (
              <Droppable key={day} droppableId={day}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className="glass"
                    style={{ 
                      padding: '15px', 
                      minHeight: '200px',
                      backgroundColor: snapshot.isDraggingOver ? 'rgba(16, 185, 129, 0.1)' : 'var(--card-bg)',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <h4 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '10px', marginBottom: '15px' }}>{day}</h4>
                    {mealPlan[day].map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={true}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              padding: '10px',
                              marginBottom: '10px',
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              boxShadow: 'var(--shadow-sm)',
                              border: '1px solid var(--glass-border)',
                              position: 'relative',
                              ...provided.draggableProps.style
                            }}
                          >
                            <img src={item.recipe.image} alt={item.recipe.title} style={{ width: '100%', height: '80px', borderRadius: '4px', objectFit: 'cover', marginBottom: '5px' }} />
                            <div style={{ fontSize: '0.8rem', fontWeight: '500', textAlign: 'center' }}>{item.recipe.title}</div>
                            <button 
                              onClick={() => removeMeal(day, item.id)}
                              style={{
                                position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>

        </div>
      </DragDropContext>
    </div>
  );
}

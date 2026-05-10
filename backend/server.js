const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nutrichef', {
  dbName: process.env.DB_NAME || 'smart_recipe_db',
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB via Mongoose!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- MONGOOSE MODELS ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [String]
});
const User = mongoose.model('User', userSchema);

const recipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  prepTime: String,
  cookTime: String,
  calories: Number,
  nutrition: Object,
  ingredients: Array,
  steps: Array,
  comments: Array,
  author: String
});
const Recipe = mongoose.model('Recipe', recipeSchema);

const mealPlanSchema = new mongoose.Schema({
  day: String,
  recipeId: String,
  recipeDetails: Object, // store basic recipe details to avoid complex joins for the prototype
  user: String
});
const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

// --- CUSTOM MIDDLEWARES ---
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(requestLogger);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  jwt.verify(token, process.env.SECRET_KEY || process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
    req.user = user;
    next();
  });
};

// --- AUTH ENDPOINTS ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username _id');
    res.json(users.map(u => ({ id: u._id, username: u.username })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new User({ username, password, favorites: [] });
    await newUser.save();

    const token = jwt.sign({ username: newUser.username }, process.env.SECRET_KEY || process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Registered successfully', user: { username: newUser.username }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY || process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ message: 'Login successful', user: { username: user.username }, token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- RECIPE ENDPOINTS ---
app.get('/api/recipes', async (req, res) => {
  try {
    const { query } = req.query;
    let recipes = await Recipe.find();

    if (query) {
      const lowerQuery = query.toLowerCase();
      recipes = recipes.filter(r =>
        (r.title && r.title.toLowerCase().includes(lowerQuery)) ||
        (r.ingredients && r.ingredients.some(i => i.name && i.name.toLowerCase().includes(lowerQuery)))
      );
    }

    // Convert _id to id for frontend compatibility
    const formatted = recipes.map(r => ({ ...r._doc, id: r._id.toString() }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe) res.json({ ...recipe._doc, id: recipe._id.toString() });
    else res.status(404).json({ message: 'Recipe not found' });
  } catch (err) {
    res.status(404).json({ message: 'Recipe not found' });
  }
});

app.post('/api/recipes', authenticateToken, async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      author: req.user.username,
      comments: []
    });
    await newRecipe.save();
    res.json({ ...newRecipe._doc, id: newRecipe._id.toString() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/recipes/:id', authenticateToken, async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ...updatedRecipe._doc, id: updatedRecipe._id.toString() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/recipes/:id', authenticateToken, async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/recipes/:id/comments', async (req, res) => {
  try {
    const { user, text } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (recipe) {
      recipe.comments.push({ user, text, date: new Date() });
      await recipe.save();
      res.json({ ...recipe._doc, id: recipe._id.toString() });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- MEAL PLAN ENDPOINTS ---
app.get('/api/meal-plan', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.json({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] });
  }

  jwt.verify(token, process.env.SECRET_KEY || process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.json({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] });
    
    try {
      const plans = await MealPlan.find({ user: user.username });
      const formatted = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] };
      plans.forEach(p => {
        if (formatted[p.day]) formatted[p.day].push({ id: p._id.toString(), recipe: p.recipeDetails });
      });
      res.json(formatted);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
});

app.post('/api/meal-plan', authenticateToken, async (req, res) => {
  try {
    const { day, recipeId } = req.body;
    const recipe = await Recipe.findById(recipeId);
    if (recipe) {
      const newPlan = new MealPlan({
        day,
        recipeId,
        recipeDetails: { ...recipe._doc, id: recipe._id.toString() },
        user: req.user.username
      });
      await newPlan.save();

      // Fetch all plans to return updated structure
      const plans = await MealPlan.find({ user: req.user.username });
      const formatted = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] };
      plans.forEach(p => {
        if (formatted[p.day]) {
          formatted[p.day].push({ id: p._id.toString(), recipe: p.recipeDetails });
        }
      });
      res.json(formatted);
    } else {
      res.status(400).json({ message: 'Invalid recipe' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/meal-plan/:day/:itemId', authenticateToken, async (req, res) => {
  try {
    await MealPlan.findOneAndDelete({ _id: req.params.itemId, user: req.user.username });

    // Fetch all plans to return updated structure
    const plans = await MealPlan.find({ user: req.user.username });
    const formatted = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] };
    plans.forEach(p => {
      if (formatted[p.day]) {
        formatted[p.day].push({ id: p._id.toString(), recipe: p.recipeDetails });
      }
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- AI MOCK ---
app.post('/api/substitute', (req, res) => {
  const { ingredient } = req.body;
  const substitutes = {
    'butter': 'Ghee or olive oil',
    'milk': 'Curd or almond milk',
    'sugar': 'Honey or jaggery',
    'paneer': 'Tofu',
    'maida': 'Wheat flour',
    'egg': 'flaxseed meal + water or applesauce',
    'bread': 'lettuce wrap or whole wheat tortilla',
    'white rice': 'Brown rice or quinoa',
    'cream': 'Coconut milk or blended cashews',
    'vegetable oil': 'Coconut oil or avocado oil',
    'mayonnaise': 'Greek yogurt or mashed avocado',
    'pasta': 'Zucchini noodles or whole wheat pasta',
    'potato': 'Sweet potato or cauliflower',
    'salt': 'Lemon juice or fresh herbs',
    'chocolate': 'Dark chocolate (70%+ cocoa) or carob chips'
  };
  const sub = substitutes[ingredient.toLowerCase()];
  if (sub) {
    res.json({ original: ingredient, substitute: sub });
  } else {
    res.json({ original: ingredient, substitute: 'No healthy substitute found, use moderation.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

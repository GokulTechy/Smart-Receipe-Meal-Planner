const mongoose = require('mongoose');
require('dotenv').config();

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

const seedRecipes = [
  // Original 3
  {
    title: 'Tomato Gravy and Chapathi',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60',
    prepTime: '10 mins',
    cookTime: '20 mins',
    calories: 320,
    nutrition: { protein: '5g', carbs: '65g', fat: '8g' },
    ingredients: [
      { name: 'flour', amount: '1 cup' },
      { name: 'Tomato', amount: '3 medium' },
      { name: 'Onion', amount: '1 large' },
      { name: 'Oil', amount: '2 tbsp' }
    ],
    steps: [
      'Cook the rice and set aside.',
      'Heat oil in a pan, sauté onions until golden brown.',
      'Add chopped tomatoes and spices, cook until mushy.',
      'Mix in the cooked rice gently.',
      'Serve hot.'
    ],
    comments: [],
    author: 'Admin'
  },
  {
    title: 'Cheese Omelette Sandwich',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60',
    prepTime: '5 mins',
    cookTime: '5 mins',
    calories: 450,
    nutrition: { protein: '20g', carbs: '35g', fat: '25g' },
    ingredients: [
      { name: 'Bread', amount: '2 slices' },
      { name: 'Egg', amount: '2' },
      { name: 'Cheese', amount: '1 slice' },
      { name: 'Butter', amount: '1 tbsp' }
    ],
    steps: [
      'Beat the eggs with salt and pepper.',
      'Melt butter in a pan, pour in the eggs.',
      'Place cheese slice in the middle and fold the omelette.',
      'Toast bread slices and place the omelette between them.',
      'Serve hot.'
    ],
    comments: [],
    author: 'Admin'
  },
  {
    title: ' boiled Vegetable ',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
    prepTime: '15 mins',
    cookTime: '25 mins',
    calories: 380,
    nutrition: { protein: '8g', carbs: '70g', fat: '10g' },
    ingredients: [
      { name: 'Basmati Rice', amount: '1 cup' },
      { name: 'Mixed Vegetables', amount: '1 cup' },
      { name: 'Ghee', amount: '2 tbsp' },
      { name: 'Spices', amount: 'to taste' }
    ],
    steps: [
      'Wash and soak rice for 20 minutes.',
      'Heat ghee in a cooker, add whole spices and vegetables.',
      'Sauté for 5 minutes, and water.',
      'Cook for 2 whistles.',
      'Fluff with a fork .'
    ],
    comments: [],
    author: 'Admin'
  },
  {
    title: 'Vegetable Soup',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60',
    prepTime: '10 mins',
    cookTime: '20 mins',
    calories: 150,
    nutrition: { protein: '3g', carbs: '25g', fat: '2g' },
    ingredients: [
      { name: 'Carrot', amount: '1 large' },
      { name: 'Cabbage', amount: '1 cup' },
      { name: 'Vegetable Broth', amount: '3 cups' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Black Pepper', amount: '1 tsp' }
    ],
    steps: [
      'Finely chop all the vegetables.',
      'Heat a little oil in a pot and sauté garlic until fragrant.',
      'Add the vegetables and stir-fry for 3 minutes.',
      'Pour in the vegetable broth and bring to a boil.',
      'Season with salt and pepper, simmer for 15 minutes, and serve hot.'
    ],
    comments: [],
    author: 'Admin'
  }
];

mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME || 'smart_recipe_db',
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to DB. Seeding...');
  await Recipe.deleteMany({}); // clear existing
  await Recipe.insertMany(seedRecipes);
  console.log('Recipes added successfully!');
  mongoose.connection.close();
}).catch(err => console.error(err));

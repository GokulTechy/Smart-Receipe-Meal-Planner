# Smart Recipe & Meal Planner

This is a modern web application designed to support cooking and healthy eating with recipe search, meal planning, ingredient-based suggestions, and nutrition tracking. It supports SDG 2 (Zero Hunger) and SDG 3 (Good Health & Well-Being).

## Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

## How to Run the Application

You will need to start both the backend server and the frontend application in separate terminal windows.

### 1. Start the Backend Server

The backend runs on an Express server on port 5000.

1. Open a terminal or command prompt.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *You should see a message saying "Server running on http://localhost:5000". Leave this terminal window open.*

### 2. Start the Frontend App

The frontend is a React application built with Vite running on port 5173.

1. Open a **new** (second) terminal or command prompt.
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *You should see a message indicating the server is ready, typically running on `http://localhost:5173`.*

### 3. Open the App in Your Browser

Once both servers are running, open your web browser and go to:
**[http://localhost:5173](http://localhost:5173)**

## Features
* **Recipe Search**: Browse and search through healthy recipes.
* **Nutritional Information & Guides**: View calories, prep time, macros, and stepwise guides.
* **Drag-and-Drop Meal Planner**: Drag recipes into your weekly schedule to plan your meals.
* **Auto-Generated Grocery List**: Your meal planner automatically syncs up and generates a grocery list for you.
* **AI Ingredient Substitution (Mock)**: Ask the "AI" for healthier alternatives to certain ingredients.

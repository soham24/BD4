const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const PORT = 3000;

let db;

// Initialize the database connection
(async () => {
  db = await open({
    filename: './database1.sqlite', 
    driver: sqlite3.Database,
  });

  console.log('Connected to the SQLite database.');
})();

// Helper functions

// 1. Fetch all restaurants
async function getAllRestaurants() {
  const query = 'SELECT * FROM restaurants';
  return { restaurants: await db.all(query) };
}

// 2. Fetch restaurant by ID
async function getRestaurantById(id) {
  const query = 'SELECT * FROM restaurants WHERE id = ?';
  return { restaurant: await db.get(query, [id]) };
}

// 3. Fetch restaurants by cuisine
async function getRestaurantsByCuisine(cuisine) {
  const query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  return { restaurants: await db.all(query, [cuisine]) };
}

// 4. Fetch restaurants by filter
async function getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  const query = `SELECT * FROM restaurants WHERE 
    isVeg = ? AND 
    hasOutdoorSeating = ? AND 
    isLuxury = ?`;
  return {
    restaurants: await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]),
  };
}

// 5. Fetch restaurants sorted by rating
async function getRestaurantsSortedByRating() {
  const query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  return { restaurants: await db.all(query) };
}

// 6. Fetch all dishes
async function getAllDishes() {
  const query = 'SELECT * FROM dishes';
  return { dishes: await db.all(query) };
}

// 7. Fetch dish by ID
async function getDishById(id) {
  const query = 'SELECT * FROM dishes WHERE id = ?';
  return { dish: await db.get(query, [id]) };
}

// 8. Fetch dishes by filter
async function getDishesByFilter(isVeg) {
  const query = 'SELECT * FROM dishes WHERE isVeg = ?';
  return { dishes: await db.all(query, [isVeg]) };
}

// 9. Fetch dishes sorted by price
async function getDishesSortedByPrice() {
  const query = 'SELECT * FROM dishes ORDER BY price ASC';
  return { dishes: await db.all(query) };
}

// Routes

// 1. Fetch all restaurants
app.get('/restaurants', async (req, res) => {
  try {
    const results = await getAllRestaurants();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants.' });
  }
});

// 2. Fetch restaurant by ID
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    const result = await getRestaurantById(req.params.id);
    if (!result.restaurant) {
      return res
        .status(404)
        .json({ message: `No restaurant found with ID ${req.params.id}.` });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant.' });
  }
});

// 3. Fetch restaurants by cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    const results = await getRestaurantsByCuisine(req.params.cuisine);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants by cuisine.' });
  }
});

// 4. Fetch restaurants by filter
app.get('/restaurants/filter', async (req, res) => {
  try {
    const { isVeg, hasOutdoorSeating, isLuxury } = req.query;
    const results = await getRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants by filter.' });
  }
});

// 5. Fetch restaurants sorted by rating
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const results = await getRestaurantsSortedByRating();
    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch restaurants sorted by rating.' });
  }
});

// 6. Fetch all dishes
app.get('/dishes', async (req, res) => {
  try {
    const results = await getAllDishes();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dishes.' });
  }
});

// 7. Fetch dish by ID
app.get('/dishes/details/:id', async (req, res) => {
  try {
    const result = await getDishById(req.params.id);
    if (!result.dish) {
      return res
        .status(404)
        .json({ message: `No dish found with ID ${req.params.id}.` });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dish.' });
  }
});

// 8. Fetch dishes by filter
app.get('/dishes/filter', async (req, res) => {
  try {
    const { isVeg } = req.query;
    const results = await getDishesByFilter(isVeg);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dishes by filter.' });
  }
});

// 9. Fetch dishes sorted by price
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const results = await getDishesSortedByPrice();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dishes sorted by price.' });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

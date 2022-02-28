import express from "express";
import sql3  from 'better-sqlite3';
import csv from 'csv-parser';
import * as fs from 'fs';
import cors from 'cors';

// This SQL statement is used to query the in memory sqlite instance that we create below ; the database is populated by
// reading and piping CSV files that are contained in this repo. Per the API requirements given, this query will return 
// no more than five distince rows sorted according to the columns: distance, customer ratings, and price. The selected rows
// are found by user provided limits for integer types as well as wild card matching for text.
const GET_RESTAURANTS_SQL_STATEMENT = `
  SELECT DISTINCT restaurants.name as restaurant, customer_rating, distance, price, cuisines.name as cuisine 
  FROM restaurants INNER JOIN cuisines ON cuisines.id = restaurants.cuisine_id 
  WHERE restaurants.name like ? 
    AND customer_rating >= ? AND distance <= ? 
    AND price <= ? 
    AND cuisines.name like ? 
  ORDER BY distance ASC, customer_rating DESC, price ASC LIMIT 5`

// Create express app and sqlite database
const app = express()
app.use(cors());
const db = new sql3('memory.db');

// create tables
db.exec('CREATE TABLE IF NOT EXISTS restaurants ( name TEXT, customer_rating INTEGER, distance REAL, price INTEGER, cuisine_id INTEGER);');
db.exec('CREATE TABLE IF NOT EXISTS cuisines ( id INTEGER, name TEXT);');

const insertRestaurant = db.prepare('insert into restaurants (name, customer_rating, distance, price, cuisine_id) VALUES (?, ?, ?, ?, ?)');
const insertCuisine = db.prepare('insert into cuisines (id, name) VALUES (?, ?)');

// Process CSV files 
fs.createReadStream('./csv/restaurants.csv')
  .pipe(csv())
  .on('data', (row) => {
    
    insertRestaurant.run(row.name, parseInt(row.customer_rating), parseInt(row.distance), parseFloat(row.price), parseInt(row.cuisine_id));
    console.log(row);
  })
  .on('end', () => {
    console.log('Restaurants CSV file successfully processed');
  });

fs.createReadStream('./csv/cuisines.csv')
  .pipe(csv())
  .on('data', (row) => {
    
    insertCuisine.run(parseInt(row.id), row.name);
    console.log(row);
  })
  .on('end', () => {
    console.log('Cuisines CSV file successfully processed');
  });

// Start server
  const HTTP_PORT = 8000 
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Helper function to check if non numerical data have been entered for fields requiring numbers.
const checkInput = (req) => {
  if (req.query.customer_rating && isNaN(parseInt(req.query.customer_rating))) return 'Customer Rating';
  if (req.query.distance && isNaN(parseInt(req.query.distance))) return 'Distance';
  if (req.query.price && isNaN(parseInt(req.query.price))) return 'Price';
};

// Define endpoint
app.get('/api', (req, res, next) => {
  // First pull and process data from query params.

  // Send error if the user sent bad data.
  const invalidInput = checkInput(req);
  if (invalidInput) {
    try {
      throw new Error(`${invalidInput} must be submitted as an integer`)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  const restaurant = req.query.restaurant ? req.query.restaurant : '';
  const customer_rating = req.query.customer_rating ? parseInt(req.query.customer_rating) : 0;
  const distance = req.query.distance ? parseInt(req.query.distance) : 10;
  const price = req.query.price ? parseInt(req.query.price) : 50;
  const cuisine = req.query.cuisine ? req.query.cuisine : '';

  // Prepare and execute SQL statement according API requirements.
  const findRestaurants = db.prepare(GET_RESTAURANTS_SQL_STATEMENT)
  const results = findRestaurants.all(`%${restaurant}%`, customer_rating, distance, price, `%${cuisine}%`);

  // Return data as JSON.
  res.json(results)
});

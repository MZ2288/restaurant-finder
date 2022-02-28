import React, { useState, useEffect } from 'react';

function App() {
  const [results, setResults] = useState();
  const [restaurant, setRestaurant] = useState();
  const [customer_rating, setCustomerRating] = useState();
  const [distance, setDistance] = useState();
  const [price, setPrice] = useState();
  const [cuisine, setCuisine] = useState();
  
  const fetchData = () => {
    let url = 'api';
    const params = { restaurant, customer_rating, distance, price, cuisine }
    let hasQueryString = false
    for (const key in params) {
      if (params[key]) {
        if (!hasQueryString) {
          url += '?';
          hasQueryString = true;
        }
        if (hasQueryString) {
          url += '&';
        }
        url += `${key}=${params[key]}`;
      }
    }
    try {
      fetch(url)
        .then((res) => {
          return res.json();
        }).then((data) => {
          setResults(data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        {JSON.stringify(results)}
      </div>
      <form>
        <label>
          Restaurant:
        </label>
        <input name="restaurant" type="text" value={restaurant} onChange={e => setRestaurant(e.target.value)}/>
        <br></br>
        <label>
          Customer Rating:
        </label>
        <input name="customer_rating" type="text" value={customer_rating} onChange={e => setCustomerRating(e.target.value)}/>
        <br></br>
        <label>
          Distance:
        </label>
        <input name="distance" type="text" value={distance} onChange={e => setDistance(e.target.value)}/>
        <br></br>
        <label>
          Price:
        </label>
        <input name="price" type="text" value={price} onChange={e => setPrice(e.target.value)}/>
        <br></br>
        <label>
        Cuisine:
        </label>
        <input name="cuisine" type="text" value={cuisine} onChange={e => setCuisine(e.target.value)}/>
        <br></br>
        <button type="button" onClick={() => { fetchData() }}>
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default App;

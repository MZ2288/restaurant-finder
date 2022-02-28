# Technical Assessments @ AlphaSights

# Steps To Use

Based on my reading of the prompt, a sensible solution to the issue at hand would be to create a data layer to store the information we have, and a web server that can return the results formatted as JSON. This app is written using express as the web server, and
sqlite as an in memory database that can field queries using sql. Express is written using JavaScript. There is an accompanying UI written in React. The UI makes querying the backend faster than constructing curl requests. However, either are possible. You will need node and a JavaScript package manager (either npm or yarn) to use this app. Start by running: yarn or npm install at the root level to install all dependencies. From there run yarn start or npm start at the root level. You should see some logging statements. When the server is up and running, and you can query the server using curl requests or from the browser using urls like this:
http://localhost:8000/api?restaurant=grill?customerRating=5
The results will be returned as JSON. If you want to use the UI, you can cd into the client directory and run yarn start or npm start. It should open a new browser window with some basic form inputs and a button. Fill in the inputs and hit the button
to query the backend, and you should see the resulting JSON rendered above the inputs. 

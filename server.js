const express = require('express');
const app = express();
const port = 3000;

//Add all styling files to the application
app.use(express.static('overlays'));
// Middleware to parse JSON body
app.use(express.json());
// Middleware to parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Import routes javascript file
const routes = require('./routes/routes');
app.use('/', routes);


//Start the application
app.listen(port, () => {
  console.log('\x1b[32m%s\x1b[0m',`listening at: ${port}`);
});

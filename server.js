const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const session = require('express-session');
const port = 25565;
const fs = require('fs');


//Add all styling files to the application
app.use(express.static(path.join(__dirname, './overlays')));
app.use(express.static(path.join(__dirname, './panel/res')));
// Middleware to parse JSON body
app.use(express.json());
app.use(cors());
// Middleware to parse URL-encoded body
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '355a855f629fc70c82e241ec15369c073b641c6096cda76c6c643b7028f68151',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24*60*60000}
}));

// Import routes javascript file
const routes = require('./routes/routes');

app.use('/', routes);

//Start the application
app.listen(port, () => {
  console.log('\x1b[35m%s\x1b[0m', 'HelValorant Overlays v.0.5.0');
  console.log('\x1b[32m%s\x1b[0m',`Server started on port: ${port}`);
  console.log('Go to ./ to access all the available resources.');
});
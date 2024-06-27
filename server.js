const express = require('express');
const app = express();
const port = 3000;

//Add all styling files to the application
app.use(express.static('overlays'));

// Import routes javascript file
const routes = require('./routes/routes');
app.use('/', routes);


//Start the application
app.listen(port, () => {
  console.log('\x1b[32m%s\x1b[0m',`listening at: ${port}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const GAME_CONFIG_PATH = path.join(__dirname, 'game_config.json');


app.get('/', (req, res) => {
  res.send('Helvetica Valorant Overlay Main')
})

app.get('/get_map_picks', (req, res) => {
  fs.readFile(GAME_CONFIG_PATH, 'utf-8', (error, data) => {
    if (error) res.send({"status": false});
    
    try {
      const jsonData = JSON.parse(data);
      res.send(jsonData.maps[0])
    } catch (error){
      console.log(`Error parsing JSON file: ${error}`);
    }
  })
})



app.listen(PORT, () => {
  console.log(`Helvetica Valorant Overlay Started on port: ${PORT}`)
})
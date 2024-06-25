const express = require('express')
const app = express()
const PORT = 3000
const LOCAL_CONFIG = require('./game_config.json');


app.get('/', (req, res) => {
  res.send('Helvetica Valorant Overlay Main')
})

app.listen(PORT, () => {
  console.log(`Helvetica Valorant Overlay Started on port: ${PORT}`)
})
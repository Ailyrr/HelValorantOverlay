const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Endpoint for Player Stats and inventory information
router.get('/get_player_stats', (req, res) => {
    const path_to_game_config = path.join(__dirname, '../game_config.json');
    fs.readFile(path_to_game_config, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            res.send({
                "status": false
            });
        }
    
        try {
            // Parse the JSON data
            const jsonData = JSON.parse(data);
            res.send({
                "status": true,
                "switch_teams": jsonData.game_state.switch_sides,
                "team_1": jsonData.team_1_players,
                "team_2": jsonData.team_2_players
            });
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.send({
                "status": false
            });
        }
    });
});

module.exports = router;

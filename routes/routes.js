const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();


// Endpoint to get map picks at certain index
router.post('/get_map_pick', (req, res) => {
    const map_picks_object = path.join(__dirname, '../map_picks.json');
    fs.readFile(map_picks_object, 'utf-8', (err, data) => {
        if (err) {
            console.log('Error reading map picks file:', err);
            res.send({
                "status": false
            });
        }
        const map_picks_object = JSON.parse(data);
        const requested_index = req.body;
        console.log(requested_index);
        res.send({
            "status": true,
            "map": map_picks_object['picks'][0][0],
            "action": map_picks_object['picks'][0][1],
            "team_side": map_picks_object['teams'][map_picks_object['picks'][0][2]]
        });
    });

});

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


router.get('/update_player_stats', (res, req) => {

})
router.get('/get_map_pick', (req, res) => {
    let data = req.body;
    
})
module.exports = router;

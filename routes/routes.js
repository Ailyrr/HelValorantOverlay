const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const session = require('express-session');
const upload = multer();

function get_game_token() {
    const data = fs.readFileSync('./app_config.json');
    const json = JSON.parse(data);
    return json.match_token;
}
function get_backend_token(){
    const data = fs.readFileSync('./app_config.json');
    const json = JSON.parse(data);
    return json.backend_key;
}
function get_password(){
    const data = fs.readFileSync('./app_config.json');
    const json = JSON.parse(data);
    return json.admin_key;
}

// Endpoint to get map picks at certain index
router.get('/get_map_picks', (req, res) => {
    const map_picks_object = path.join(__dirname, '../map_picks.json');
    fs.readFile(map_picks_object, 'utf-8', (err, data) => {
        if (err) {
            console.log('Error reading map picks file:', err);
            res.send({
                "status": false
            });
        }
        const map_picks_object = JSON.parse(data);
        res.send(map_picks_object);
        return true
    });

});
// Endpoint for Player Stats and inventory information
router.get('/get_player_stats', (req, res) => {
    const path_to_game_config = path.join(__dirname, '../game_state.json');
    fs.readFile(path_to_game_config, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            res.send({
                "status": false
            });
            return true
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
            return true
        }
    });
});
router.get('/get_timer_info', upload.none(), (req, res) => {
    const path_to_game_config = path.join(__dirname, '../stream_state.json');
    fs.readFile(path_to_game_config, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(400).send({
                "status": false
            });
        }
    
        try {
            // Parse the JSON data
            const jsonData = JSON.parse(data);
            return res.status(200).send({
                "isOn": jsonData.timer.isOn,
                "time": jsonData.timer.time,
                "description": jsonData.timer.description
            });
        } catch (err) {
            return res.status(400).send({
                "status": false
            });
        }
    });
})
router.get('/reset_timer', upload.none(), (req, res) => {
    const path_to_game_config = path.join(__dirname, '../stream_state.json');
    fs.readFile(path_to_game_config, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(400).send({
                "status": false
            });
        }
    
        try {
            // Parse the JSON data
            let jsonData = JSON.parse(data);
            jsonData.timer.isOn = false;
            const updatedFile = JSON.stringify(jsonData, null, 2);
            fs.writeFile(path_to_game_config, updatedFile, 'utf8', (err) => {
                if (err) {
                    console.error('Error reading the file:', err);
                    return res.status(400).send({
                        "status": false
                    });
                }
                res.status(200).send({
                    "status": true
                });
                return 0
            })
        } catch (err) {
            return res.status(400).send({
                "status": false
            });
        }
    });
})

/*
-------------------------
Externally used endpoints
-------------------------
*/

/*
Update player states
Recieve json to update each player's game information, health, weapon, credits, shield, etc...
*/
router.post('/update_player_state', (req, res) => {
    const playerStats = req.body;
    console.log('Player Stats recieved: ', playerStats);

    res.json({ message: 'Stats Recieved' });
});
/*
Update Game state
Send json information to update the game state information, round number, round won/lost, spike planted/defused, etc...
*/
router.post('/update_game_state', upload.none(), (req, res) => {

})
/*
------------
ADMIN ROUTES
------------
*/

//Update map pick at some 
router.post('/set_map_picks', upload.none(), (req, res) => {
    const { index, map, action } = req.body;
    //Check for empty inputs
    if(!index || !map || !action){
        return res.status(400).send({
            "status": false,
            "message": "Missing Arguments"
        });
    }
    const path_to_map_picks = path.join(__dirname, '../map_picks.json');
    fs.readFile(path_to_map_picks, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(400).send({
                "status": false,
                "message": "Failed to read the json file"
            });
        }
    
        try {
            // Parse the JSON data
            let jsonData = JSON.parse(data);
            //Edit the json data
            jsonData['picks'][index] = [map, action]

            const updatedFile = JSON.stringify(jsonData, null, 2);
            fs.writeFile(path_to_map_picks, updatedFile, 'utf8', (err) => {
                if (err) {
                    console.error('Error reading the file:', err);
                    return res.status(400).send({
                        "status": false,
                        "message": "Failed to re-encode the json"
                    });
                }
                res.status(200).send({
                    "status": true,
                    "message": "updated map picks successfully"
                });
                return 0
            })
        } catch (err) {
            return res.status(400).send({
                "status": false,
                "message": "Failed to parse the json"
            });
        }
    });
});
router.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.loggedIn) {
        const target_page = req.query.page || 'prestream';
        switch(target_page){
            case 'prestream':
                return res.status(200).sendFile(path.join(__dirname, '../panel/admin_pre_live.html'));
            case 'stream':
                return res.status(200).sendFile(path.join(__dirname, '../panel/admin_live.html'));
            case 'settings':
                return res.status(200).sendFile(path.join(__dirname, '../panel/admin_settings.html'));
            default:
                return res.status(200).sendFile(path.join(__dirname, '../panel/admin_pre_live.html'));
        }
    } else {
        return res.status(401).send(`<script>location.href = '../auth'</script>`);
    }
})

router.get('/auth', (req, res) => {
    if(req.session && req.session.loggedIn){
        res.sendFile(path.join(__dirname, '../panel/admin_pre_live.html'))
    } else {
        res.sendFile(path.join(__dirname, '../panel/auth.html'));
    }
})

//Main Login Method, create a session cookie for staying connected over multiple pages.
router.post('/authenticate', upload.none(), (req, res) => {
    const { pw } = req.body;

    // Check if the password is provided and not empty
    if (!pw || typeof pw !== 'string' || pw.trim() === '') {
        return res.status(400).json({ message: 'Password is required and cannot be empty' });
    }

    // Check if the provided password matches the admin password
    if (pw === get_password()) {
        req.session.user = { loggedIn: true, backendToken:  get_backend_token()}
        return res.status(200).json({ message: 'Authentication successful' });
    } else {
        return res.status(401).json(
            { message: 'Authentication failed' }
        );
    }
});

//De-authenticates the user and destroys the session cookie
router.post('/deauthenticate', (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err) {
                return res.status(500).json({ message: 'Failed to log out'});
            }

            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'logged out successfully' });
        })
    } else {
        return res.status(400).json({ message: 'No active session found' });
    }
})



module.exports = router;

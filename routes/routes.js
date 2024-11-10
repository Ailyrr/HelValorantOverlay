const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const session = require('express-session');
const upload = multer();
const fileLoader = require('../fileLoader');

const dataBus = new fileLoader();
dataBus.init('./config'); //Init dataBus by loading the config files into the instance of fileLoader()

// Endpoint to get map picks
router.get('/get_map_picks', (req, res) => {
    return res.status(200).send(dataBus.config.mapPicks)
});

// Endpoint for Player Stats and inventory information
router.get('/get_player_stats', (req, res) => {
    // Parse the JSON data
    let responseObject = {
        status: true,
        switch_teams: dataBus.config.gameState.switch_sides,
        team_1: {},
        team_2: {}
    };
    //Reformat the json files to correspond to team_1 and team_2 respectively
    for(let i = 0; i < 5; i++){
        responseObject.team_1[`player_${i}`] = dataBus.config.players[`player_${i}`]['data'];
        responseObject.team_1[`player_${i}`]['is_registered'] =  dataBus.config.players[`player_${i}`].is_registered
    }
    for(let i = 5; i < 10; i++){
        responseObject.team_2[`player_${i-5}`] = dataBus.config.players[`player_${i}`]['data'];
        responseObject.team_2[`player_${i-5}`]['is_registered'] =  dataBus.config.players[`player_${i}`].is_registered
    }
    res.status(200).send(responseObject);
});

//Return the timer information { isOn: bool, time: int, description: str }
router.get('/get_timer_info', upload.none(), (req, res) => {
    return res.status(200).send(dataBus.getTimer());
})

//Sets timer to specified time and descriotion as well as start the timer.
router.post('/set_timer', upload.none(), (req, res) => {
    const { timeMiliseconds, description }  = req.body;
    if(!timeMiliseconds || !description){
        return res.status(406).send({ status: false, message: 'Missing Arguments' });
    }
    dataBus.setTimer(timeMiliseconds, description);
    return res.status(200).send({ status: true });
})

//Get Initual game configuration usually requested once on load of overlay
router.get('/get_game_configuration', (req, res) => {
    return res.status(200).send(dataBus.getGameConfiguration());
})
//Get current game state requested every 200ms
router.get('/get_game_state', (req, res) => {
    return res.status(200).send(dataBus.getGameState());
})
router.post('/change_game_state', upload.none(), (req, res) => {
    const { stage, spike } = req.body;
    console.log(stage)
    let spikeDown = false;
    if(spike == 'down') spikeDown = true;
    dataBus.config.gameState.game_stage = stage;
    dataBus.config.gameState.spike_down = spikeDown;
    return res.status(200).send({ status: true });
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

router.post('/update_player_state', upload.none(), (req, res) => {
    var { playerData } = req.body;
    playerData = JSON.parse(playerData)
    console.log('\x1b[34m%s\x1b[0m', new Date().toLocaleString(), ' | Player Stats recieved by player with token: ', playerData.token);
    let updateSuccess = dataBus.updatePlayerData(playerData);
    if(!updateSuccess){
        return res.status(500).send({ status: false })
    }
    return res.status(200).send({ status: true })
});
/*  
Update Game state
Send json information to update the game state information, round number, round won/lost, spike planted/defused, etc...
*/
router.post('/register_external_user', upload.none(), (req, res) => {
    const { playerToken } = req.body;
    if(!playerToken){
        return res.status(406).send({ status: false, message: 'Missing Arguments!' });
    }
    //Check if token is valid and not yet taken.
    let playerTokenKey = dataBus.checkGameTokenValidity(playerToken);
    if(playerTokenKey.status){
        playerTokenKey = playerTokenKey.key;
        dataBus.config.players[playerTokenKey].is_registered = true;
        dataBus.config.players[playerTokenKey].last_updated = Date.now();
        
        console.log('\x1b[34m%s\x1b[0m', new Date().toLocaleString(), " | Registered user with token:", playerToken);

        return res.status(200).send({ status: true, message: 'User Registerd on offsite server!'});
    } else {
        return res.status(400).send({ status: false, message: playerTokenKey.message});
    }
})
router.post('/clear_external_user', upload.none(), (req, res) => {
    const { playerToken } = req.body;
    if(!playerToken){
        return res.status(406).send({ status: false, message: 'Missing Arguments!' });
    }
    //Check if token is valid and not yet taken.
    let playerTokenKey = dataBus.findPlayerKeyByToken(playerToken);
    if(playerTokenKey.status){
        playerTokenKey = playerTokenKey.key;
        dataBus.config.players[playerTokenKey].is_registered = false;
        
        console.log('\x1b[34m%s\x1b[0m', new Date().toLocaleString(), " | User with token:", playerToken, " has de-registered");

        return res.status(200).send({ status: true, message: 'User cleared from offsite server!'});
    } else {
        return res.status(400).send({ status: false, message: playerTokenKey.message});
    }
})
/*
--------------------------
      ADMIN ROUTES
--------------------------
*/

//Update map pick at some 
router.post('/set_map_picks', upload.none(), (req, res) => {
    const { index, map, action } = req.body;
    //Check for empty inputs
    if(!index || !map || !action){
        return res.status(400).send({
            status: false,
            message: "Missing Arguments"
        });
    }

    dataBus.updateMapPick(index, map, action);
    
    return res.status(200).send({ status: true })
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

router.get('/regenerate_user_tokens', (req, res) => {
    dataBus.regeneratePlayerTokens();
    return res.status(200).send({ status: true });
})
//Main Login Method, create a session cookie for staying connected over multiple pages.
router.post('/authenticate', upload.none(), (req, res) => {
    const { pw } = req.body;

    // Check if the password is provided and not empty
    if (!pw || typeof pw !== 'string' || pw.trim() === '') {
        return res.status(400).json({ message: 'Password is required and cannot be empty' });
    }

    // Check if the provided password matches the admin password
    if (!dataBus.checkPassword(pw)) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
    //Set Session Cookie and respond with 200
    req.session.user = { loggedIn: true }
    return res.status(200).json({ message: 'Authentication successful' });
});

//De-authenticates the user and destroys the session cookie
router.post('/deauthenticate', (req, res) => {
    //Check if there is a session active
    if(!req.session){
        return res.status(400).json({ message: 'No active session found' });
    }
    //clear session
    req.session.destroy(error => {
        if(error) return res.status(500).json({ message: 'Failed to log out'});

        res.clearCookie('connect.sid'); //Default name of express cookie
        return res.status(200).json({ message: 'logged out successfully' });
    })
})

/*
-----------------------------------------
  UTILITY STATE (REMOVE FOR PRODUCTION)
-----------------------------------------
*/

router.get('/print_state', (req, res) => {
    return res.status(200).send(dataBus.config);
})
router.post('/end_round', upload.none(), (req, res) => {
    const { winningTeam } = req.body;
    if(winningTeam == 'team_1'){
        dataBus.config.gameState.team_1_score += 1;
    } else {
        dataBus.config.gameState.team_2_score += 1;
    }
    dataBus.config.gameState.round_over = true;
    return res.status(200).send({ status: true })
})
router.get('/recalculate_maps', (req, res) => {
    dataBus.reCalculateMapFlow();
    return res.status(200).send({ status: true });
})
module.exports = router;

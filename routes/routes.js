const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const session = require('express-session');
const upload = multer();

function findPlayerByToken(players, token) {
    // Loop through each player in the object
    for (const key in players) {
      // Check if the key matches the "player_" pattern and the token matches
      if (key.startsWith("player_") && players[key].token == token) {
        // Check if the player_uuid is empty
        if (players[key].player_uuid == '') {
          // Return the player number (key)
          return key;
        }
      }
    }
    // Return null if no matching player is found
    return null;
  }

class fileLoader{
    constructor(){
        this.isInitialized = false;

        this._adminPassword = null; //Make this private

        this.config = {
            players: null,
            gameState: null,
            mapPicks: null,
            timer: null
        }
    }
    init(configFilesLocation){
        if(this.isInitialized){
            console.log('fileLoader() | Files are already loaded into memory');
            return false;
        }
        //Read in players
        fs.readFile(path.join(__dirname, `${configFilesLocation}/players.json`), 'utf8', (error, data) => {
            if(error){
                console.log('fileLoader() | Target File players.json does not exist.')
                return false;
            }
            const players = JSON.parse(data);
            //Assign new data to main object

            this.config.players = players;
        });
        //Read in Game State
        fs.readFile(path.join(__dirname, `${configFilesLocation}/gameState.json`), 'utf8', (error, data) => {
          if(error){
              console.log('fileLoader() | Target File gameState.json does not exist.')
              return false;
          }
          const gameState = JSON.parse(data);
          //Assign new data to main object

          this.config.gameState = gameState;
        });
        //Read in Map Picks
        fs.readFile(path.join(__dirname, `${configFilesLocation}/mapPicks.json`), 'utf8', (error, data) => {
          if(error){
              console.log('fileLoader() | Target File mapPicks.json does not exist.')
              return false;
          }
          const picks = JSON.parse(data);
          //Assign new data to main object

          this.config.mapPicks = picks;
        });
        //Read in Timer
        fs.readFile(path.join(__dirname, `${configFilesLocation}/timer.json`), 'utf8', (error, data) => {
          if(error){
              console.log('fileLoader() | Target File streamState.json does not exist.')
              return false;
          }
          const timer = JSON.parse(data);
          //Assign new data to main object

          this.config.timer = timer;
        });

        //Read in Admin Password
        fs.readFile(path.join(__dirname, `${configFilesLocation}/appConfig.json`), 'utf8', (error, data) => {
            if(error){
                console.log('fileLoader() | Target File streamState.json does not exist.')
                return false;
            }
            const password = JSON.parse(data);
            //Assign new data to main object
    
            this._adminPassword = password.admin_key;
          });
        setTimeout(() => {
          console.info('fileLoader() | All Files Where Loaded into RAM!');
        }, 1000);
    }
    checkPassword(userInput) {
        return this._adminPassword === userInput;
    }
    updateMapPick(targetIndex, map, action){
        this.config.mapPicks.picks[targetIndex] = [map, action]
    }
    setTimer(timeMiliseconds, description){
        this.config.timer.time = timeMiliseconds;
        this.config.timer.description = description;
        this.config.timer.isOn = true;
    }
    getTimer(){
        return {
            isOn: this.config.timer.isOn,
            time: this.config.timer.time,
            description: this.config.timer.description
        }
    }
}

const dataBus = new fileLoader();
dataBus.init('../config'); //Init dataBus by loading the config files into the instance of fileLoader()

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
        responseObject.team_1[`player_${i}`]["player_uuid"] =  dataBus.config.players[`player_${i}`]['player_uuid']
    }
    for(let i = 5; i < 10; i++){
        responseObject.team_2[`player_${i-5}`] = dataBus.config.players[`player_${i}`]['data'];
        responseObject.team_2[`player_${i-5}`]["player_uuid"] =  dataBus.config.players[`player_${i}`]['player_uuid']
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
    const { data } = req.body;
    console.log('Player Stats recieved: ', data);
    return res.status(200).send({ message: 'Stats Recieved' });
});
/*
Update Game state
Send json information to update the game state information, round number, round won/lost, spike planted/defused, etc...
*/
router.post('/register_external_user', upload.none(), (req, res) => {
    const { player_token } = req.body;
    if(!player_token){
        return res.status(400).send({ status: false, message: 'Failed To Authenticate User' });
    }
    //Check if token is valid and not yet taken.
    fs.readFile(path.join(__dirname, '../players.json'), 'utf8', (err, data) => {
        if(err){
            return res.status(500);
        }
        const playerJson = JSON.parse(data);
        const player_index = findPlayerByToken(playerJson, player_token);
        console.log(player_index);
    })
    console.log(new Date(), " | Registered player with token: ", player_token);
    return res.status(200).send({ status: true, message: 'User Registerd on offsite server!'});
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



module.exports = router;

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
        let errors = [];
        if(this.isInitialized){
            console.log('fileLoader() | Files are already loaded into memory');
            errors.push(0)
            return false;
        }
        //Read in players
        fs.readFile(path.join(__dirname, `${configFilesLocation}/players.json`), 'utf8', (error, data) => {
            if(error){
                console.log('fileLoader() | Target File players.json does not exist.')
                errors.push(0)
                return false;
            }
            const players = JSON.parse(data);
            for(const key in players){
                if(key.startsWith('player_')){
                    players[key].last_updated = Date.now();
                }
            }
            //Assign new data to main object

            this.config.players = players;
        });
        //Read in Game State
        fs.readFile(path.join(__dirname, `${configFilesLocation}/gameState.json`), 'utf8', (error, data) => {
          if(error){
              console.log('fileLoader() | Target File gameState.json does not exist.')
              errors.push(0)
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
              errors.push(0)
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
              errors.push(0)
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
                errors.push(0)
                return false;
            }
            const password = JSON.parse(data);
            //Assign new data to main object
    
            this._adminPassword = password.admin_key;
          });
        setTimeout(() => {
        
          if(errors.length == 0) console.info('fileLoader() | All Files Where Loaded into RAM!');
        }, 1000);

        setInterval(() => {
            this.checkForInactivePlayers();
        }, 15000)
    }
    checkPassword(userInput) {
        return this._adminPassword === userInput;
    }
    generateRandomUserToken(){
        return crypto.randomBytes(12).toString('base64').slice(0,15);
    }
    //Timer Logic
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
    //Player Logic
    checkGameTokenValidity(gameToken) { // Function to find player index by the given game token and check if no player is already registered there.
        for (const key in this.config.players) {
          if (key.startsWith("player_") && this.config.players[key].token == gameToken) {
            if (this.config.players[key].is_registered == false) {
              return { status: true, key: key };
            } else {
                return { status: false, message: 'Token is already registered!' }
            }
          }
        }

        return { status: false, message: 'Token does not exist!'};
    }
    findPlayerKeyByToken(gameToken){
        for(const key in this.config.players){
            if(key.startsWith('player_') && this.config.players[key].token == gameToken){
                return { status: true, key: key };
            }
        }
        return { status: false, message: 'Token does not exist!'};
    }
    updatePlayerData(playerDataObject){
        let playerKey = this.findPlayerKeyByToken(playerDataObject.token);
        if(playerKey.status){
            playerKey = playerKey.key;
            if(this.config.players[playerKey].is_registered == true){
                //Change every aspect of the targeted player ebject
                this.config.players[playerKey].data.username = playerDataObject.username ? playerDataObject.username : '';
                this.config.players[playerKey].data.agent = playerDataObject.agent ? playerDataObject.agent : '';
                this.config.players[playerKey].data.health = playerDataObject.health ? playerDataObject.health : 0;
                this.config.players[playerKey].data.shield = playerDataObject.shield ? playerDataObject.shield : 0;
                this.config.players[playerKey].data.ult_points_needed = playerDataObject.ult_points_needed ? playerDataObject.ult_points_needed : 0;
                this.config.players[playerKey].data.ult_points_gained = playerDataObject.ult_points_gained ? playerDataObject.ult_points_gained : 0;
                this.config.players[playerKey].data.weapon = playerDataObject.weapon ? playerDataObject.weapon : '';
                this.config.players[playerKey].data.c_util = playerDataObject.c_util
                this.config.players[playerKey].data.q_util = playerDataObject.q_util
                this.config.players[playerKey].data.e_util = playerDataObject.e_util
                this.config.players[playerKey].data.x_util = playerDataObject.x_util
                this.config.players[playerKey].data.credits = playerDataObject.credits ? playerDataObject.credits : 0;
                this.config.players[playerKey].data.has_spike = playerDataObject.has_spike;
                this.config.players[playerKey].data.is_dead = playerDataObject.is_dead;
                
                //Reset last update to right now
                this.config.players[playerKey].last_updated = Date.now();
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    
    }
    regeneratePlayerTokens(){
        for(const key in this.config.players){
            if(key.startsWith('player_')){
                this.config.players[key].token = this.generateRandomUserToken()
            }
        }
        console.log('\x1b[91m%s\x1b[0m', new Date().toLocaleString() + ' | Regenerated all game tokens')
    }
    //Game Logic
    getGameConfiguration(){
        return {
            team_1: this.config.gameState.team_1,
            team_2: this.config.gameState.team_2,
            game_flow: this.config.gameState.game_flow,
            team_1_score: this.config.gameState.team_1_score,
            team_2_score: this.config.gameState.team_2_score
        }
    }
    getGameState(){
        let roundOver = false;
        if(this.config.gameState.round_over == true){
            roundOver = true;
            this.config.gameState.round_over = false
        }
        return {
            round_number: this.config.gameState.round_number,
            spike_down: this.config.gameState.spike_down,
            round_over: roundOver,
            team_1_score: this.config.gameState.team_1_score,
            team_2_score: this.config.gameState.team_2_score
            
        }
    }
    //Map Pick Logic
    updateMapPick(targetIndex, map, action){
        this.config.mapPicks.picks[targetIndex] = [map, action]
    }
    reCalculateMapFlow(){
        
    }
    //Function to perpetually check for update status on player tokens to kick out inactive users
    //to prevent a potential softlock by players whose pc crashes which could result in a ghost user that is counted as registered
    checkForInactivePlayers(){
        let currentDate = Date.now();
        for(const key in this.config.players){
            if(
                key.startsWith('player_') &&
                this.config.players[key].is_registered == true &&
                Math.abs(currentDate - this.config.players[key].last_updated) >= 15000
            ){
                this.config.players[key].last_updated = currentDate;
                this.config.players[key].is_registered = false;
                console.log('\x1b[34m%s\x1b[0m', new Date().toLocaleString(), " | User with token: ", this.config.players[key].token, " was auto kicked due to inactivity");
            }
        }
    }

}

module.exports = fileLoader;
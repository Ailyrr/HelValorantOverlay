
class helValorantGameScore {
    constructor(){
        //Value Variables
        this.roundCounter = 0; //Set to -1 at start of round
        this.gamePhaseTimers = [[30000, 45000], 100000, 45000, 6000] //30s or 45s ; 100s ; 45 ; 6s
        this.currentGamePhase = -1; // -1 = idle : 0 = buy : 1 = fight : 2 = spike : 3 = post
        this.serverGamePhase = ''; //Used for data recovered by the server. Compared to currentGamePhase for logic
        this._switchSides = false; //Is set to true for round numbers between 13-24 and every other round after that
        this.spikeDown = false;
        this.interval; //Setting the timer variable

        //Element Variables
        this.roundCounterElement = document.getElementById('round-counter');
        this.leftTeamContainer = document.getElementById('left-team');
        this.rightTeamContainer = document.getElementById('right-team');
        this.leftAttackIndicator = document.getElementsByClassName('attack-indicator')[0];
        this.rightAttackIndicator = document.getElementsByClassName('attack-indicator')[1];
        this.leftTeamGamesWon = document.getElementsByClassName('maps-won-container-sub')[0];
        this.rightTeamGamesWon = document.getElementsByClassName('maps-won-container-sub')[1];
        this.countdownElement = document.getElementById('timer');
        this.spikeElement = document.getElementById('spike');

        //Set Default Values
        this.updateRoundNumer();
        this.leftTeamContainer.innerHTML = this.formatTeamDisplay('BLU', '', '../visual_assets/blueTeamPlaceholder.jpg');
        this.rightTeamContainer.innerHTML = this.formatTeamDisplay('RED', '', '../visual_assets/redTeamPlaceholder.jpg');

        //Animation Variables
        this.spikeInAnimation = [{transform: 'translateY(-65px) scale(1.2)', color: 'red'}];
        this.spikeOutAnimation = [{transform: 'translateY(0px) scale(1)', color: 'white'}];
        this.animationTiming = {duration: 350, fill: 'forwards'};
    }

    async init(){
        //Fetch information from the server;
        //Create Initial layout of overlay with elements that will not change for the entire match;
        const res = await fetch('../get_game_configuration', {method: 'GET', crossorigin: true});
        const json = await res.json();

        if(res.status === 200){
            //Parse Team Icon, Abbreviation and Information;
            let team_1_img = (json.team_1.icon_link == '') ? '../visual_assets/blueTeamPlaceholder.jpg' : json.team_1.icon_link;
            let team_2_img = (json.team_2.icon_link == '') ? '../visual_assets/redTeamPlaceholder.jpg' : json.team_2.icon_link;
    
            this.leftTeamContainer.innerHTML = this.formatTeamDisplay(json.team_1.abbreviation, json.team_1.team_info, team_1_img);
            this.rightTeamContainer.innerHTML = this.formatTeamDisplay(json.team_2.abbreviation, json.team_2.team_info, team_2_img);

            //Parse Previous won games of the series by teams
            let team1WonGames = 0;
            let team2WonGames = 0;
            let amountToWin = Math.ceil((Object.keys(json.game_flow).length) / 2) //Always 1 more that half the amount of maps to play

            for(const map in json.game_flow){
                if(json.game_flow[map].state == 'over' && json.game_flow[map].winner == 'team_1') team1WonGames += 1;
                if(json.game_flow[map].state == 'over' && json.game_flow[map].winner == 'team_2') team2WonGames += 1;
            }
            for(let i = 1; i<=amountToWin; i++){
                if(i <= team1WonGames){
                    this.leftTeamGamesWon.innerHTML += `<div class="map-won-point full-point"></div>`;
                } else {
                    this.leftTeamGamesWon.innerHTML += `<div class="map-won-point"></div>`;
                }
                if(i <= team2WonGames){
                    this.rightTeamGamesWon.innerHTML += `<div class="map-won-point full-point"></div>`;
                } else {
                    this.rightTeamGamesWon.innerHTML += `<div class="map-won-point"></div>`;
                }
            }

        }
        //Start game cycle
        setInterval(async () => {
            this.getGameState();
        }, 100)
    }
    async getGameState(){
        //Fetch Game Information
        //fetching is repeated every 200ms to get constant updates on game state
        const res = await fetch('../get_game_state', {method: 'GET', crossorigin: true});
        const json = await res.json();
        if(res.status === 200){
            if(json.round_number != this.roundCounter){
                this.updateRoundNumer(json.round_number);
            }
            if(json.game_stage != ''){
                switch(json.game_stage){
                    case 'buy':
                        if(this.currentGamePhase != 0){
                            //Check if spike is down
                            if(this.spikeDown) {
                                clearTimeout();
                                this.resetSpikeAnimation()
                            }
                            if(this.interval) clearInterval(this.interval); //Clear any still running timers
                            this.currentGamePhase = 0;
                            let buyTimerIndex = 0;
                            //Check if it is a crucial round. (1st pistol, 2nd pistol, overtime)
                            if(this.roundCounter == 1 || this.roundCounter == 13 || this.roundCounter > 24){
                                buyTimerIndex = 1
                            }
                            this.startCountdown(this.gamePhaseTimers[this.currentGamePhase][buyTimerIndex]);
                        }
                        break;
                    case 'fight':
                        if(this.currentGamePhase != 1){
                            //Check if spike is down
                            if(this.spikeDown) {
                                clearTimeout();
                                this.resetSpikeAnimation()
                            }
                            if(this.interval) clearInterval(this.interval); //Clear any still running timers
                            this.currentGamePhase = 1;
                            this.startCountdown(this.gamePhaseTimers[this.currentGamePhase])
                        }
                        break;
                    case 'spike':
                        if(this.currentGamePhase != 2 && json.spike_down == true && !this.spikeDown){
                            this.spikeDown = true;
                            this.currentGamePhase = 2;
                            this.startSpikeCountDown(this.gamePhaseTimers[this.currentGamePhase])
                        }
                        break;
                    case 'post':
                        if(this.currentGamePhase != 3){
                            //Check if spike is down
                            if(this.spikeDown) {
                                clearTimeout();
                                this.resetSpikeAnimation()
                            }
                            if(this.interval) clearInterval(this.interval);
                            this.currentGamePhase = 3;
                            this.startCountdown(this.gamePhaseTimers[this.currentGamePhase]);
                        }
                        break;
                    default:
                        console.warn('Unknown game phase entered, ignoring.');
                }
                //Update Game Stage
            }
        }
    }
    formatTeamDisplay(teamAbbr, teamInfo, teamImgLink){
        return `<div class="team-information-container">
                    <img class="team-icon" src="${teamImgLink}" alt="">
                    <span class="team-name-and-seed">
                        <span class="name">${teamAbbr}</span>
                        <span class="seed">${teamInfo}</span>
                    </span>
                </div>
                <div class="color-separator-bar"></div>
                <div class="score-holder">
                    <span class="score-span">0</span>
                </div>`;
    }
    updateTeamScores(leftScore, rightScore){
        document.getElementsByClassName('score-span')[0].textContent = leftScore.toString();
        document.getElementsByClassName('score-span')[1].textContent = rightScore.toString();
        return;
    }
    updateRoundNumer(newRoundNumber){
        if(newRoundNumber) this.roundCounter = newRoundNumber; //Check if a new round number was set.
        
        if(this.roundCounter > 12 && this.roundCounter < 25) {
            this._switchSides = true;
        }
        else if(this.roundCounter > 24 && this.roundCounter%2 == 0){
            this._switchSides = true;
        }
        else {
            this._switchSides = false;
        }
        this.roundCounterElement.textContent = `Round ${this.roundCounter}`;
        this.switchSides();
    }
    switchSides(){
        
        if(this._switchSides == true){
            this.leftTeamContainer.classList.remove('green-team');
            this.leftTeamContainer.classList.add('red-team');
            this.rightTeamContainer.classList.remove('red-team');
            this.rightTeamContainer.classList.add('green-team');
            this.leftAttackIndicator.classList.remove('hidden');
            this.rightAttackIndicator.classList.add('hidden');
        } else {
            this.leftTeamContainer.classList.remove('red-team');
            this.leftTeamContainer.classList.add('green-team');
            this.rightTeamContainer.classList.remove('green-team');
            this.rightTeamContainer.classList.add('red-team');
            this.leftAttackIndicator.classList.add('hidden');
            this.rightAttackIndicator.classList.remove('hidden');
        }
    }
    mainLopp(){

    }
    //Timer Logic
    startCountdown(duration) {
        let remainingTime = duration;
    
        this.interval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(this.interval);
                this.currentGamePhase = -1;
                this.countdownElement.innerText = '--:--';
                return;
            }
    
            remainingTime -= 1000;
            this.countdownElement.innerHTML = this.formatTime(remainingTime);
        }, 1000);
    }
    startSpikeCountDown(timeMiliseconds){
        this.leftAttackIndicator.classList.add('hidden');
        this.rightAttackIndicator.classList.add('hidden');
        this.countdownElement.classList.add('hidden');
        this.roundCounterElement.classList.add('hidden');
        this.spikeElement.animate(this.spikeInAnimation, this.animationTiming);
        //Show red spike
        setTimeout(() => {
            this.resetSpikeAnimation();
        }, timeMiliseconds)
    }
    resetSpikeAnimation(){
        //Hide Red spike
        this.roundCounterElement.classList.remove('hidden');
        this.countdownElement.classList.remove('hidden');
        this.spikeElement.animate(this.spikeOutAnimation, this.animationTiming);
        //Reset Local Variables
        this.spikeDown = false;
        this.currentGamePhase = -1;
        this.countdownElement.innerText = '--:--';
        this.updateRoundNumer();
    }
    //Helper Functions
    padZero(num) {
        return num < 10 ? '0' + num : num;
    }
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
    
        if(ms < 15000 && this.currentGamePhase == 1){
            return `<span style="color: red;">${this.padZero(minutes)}:${this.padZero(seconds)}</span>`;
        } else {
            return `<span style="color: white;">${this.padZero(minutes)}:${this.padZero(seconds)}</span>`;
        }
    }
}

//Initialize gameScore instance
const gameScoreInterface = new helValorantGameScore();

//Start Requesting Data from server (5 req/sec) for maximum game fidelity;
gameScoreInterface.init();
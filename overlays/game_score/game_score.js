
class helValorantGameScore {
    constructor(){
        //Value Variables
        this.roundCounter = 0; //Set to -1 at start of round
        this._switchSides = false; //Is set to true for round numbers between 13-24 and every other round after that
        this.spikeDown = false;
        this.roundOver = false; //Checks if a round is over to show the 
        this.leftTeamPoints = 0;
        this.rightTeamPoints = 0;
        this.interval; //Setting the timer variable
        this.leftTeamIcon = ''; //Default icon links are unavailable
        this.rightTeamIcon = '';//Default icon links are unavailable
        this.currentWinPanel = null;

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
        this.spikeInAnimation = [{transform: 'translateY(-80px) scale(1.2)', color: 'red'}];
        this.spikeOutAnimation = [{transform: 'translateY(0px) scale(1)', color: 'white'}];
        this.animationTiming = {duration: 350, fill: 'forwards'};
    }

    async init(){
        //Fetch information from the server;
        //Create Initial layout of overlay with elements that will not change for the entire match;
        const res = await fetch('../get_game_configuration', {method: 'GET', crossorigin: true});
        const json = await res.json();
        console.log(json)
        if(res.status === 200){
            //Parse Team Icon, Abbreviation and Information;
            this.leftTeamIcon = (json.team_1.icon_link == '') ? '../visual_assets/blueTeamPlaceholder.jpg' : json.team_1.icon_link;
            this.rightTeamIcon = (json.team_2.icon_link == '') ? '../visual_assets/redTeamPlaceholder.jpg' : json.team_2.icon_link;
    
            this.leftTeamContainer.innerHTML = this.formatTeamDisplay(json.team_1.abbreviation, json.team_1.team_info, this.leftTeamIcon);
            this.rightTeamContainer.innerHTML = this.formatTeamDisplay(json.team_2.abbreviation, json.team_2.team_info, this.rightTeamIcon);

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
            //Update local team scores
            this.leftTeamPoints = json.team_1_score;
            this.rightTeamPoints = json.team_2_score;
            this.updateTeamScores(json.team_1_score, json.team_2_score)

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
            if(json.spike_down == true && !this.spikeDown){
                this.startSpikeCountDown(45000);
            }
            if(json.round_over == true && json.round_over != this.roundOver){
                this.updateTeamScores(json.team_1_score, json.team_2_score)
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
        if(leftScore > this.leftTeamPoints) this.showRoundWinPanel('left');
        if(rightScore > this.rightTeamPoints) this.showRoundWinPanel('right');
        this.leftTeamPoints = leftScore;
        this.rightTeamPoints = rightScore;
        document.getElementsByClassName('score-span')[0].textContent = this.leftTeamPoints.toString();
        document.getElementsByClassName('score-span')[1].textContent = this.rightTeamPoints.toString();
        this.updateRoundNumer(this.leftTeamPoints + this.rightTeamPoints + 1);
        return;
    }
    showRoundWinPanel(teamName){
        if(!this.currentWinPanel){
            this.currentWinPanel = document.createElement('div');
            this.currentWinPanel.classList.add('round-win-panel-container');
            this.currentWinPanel.id = 'round-win-panel';
            this.currentWinPanel.innerHTML = `
                <div class="round-win-panel">
                    <div class="round-win-panel-inner-div">
                        <svg height="200" width="780">
                            <path d="M5 5 L50 5 M725 5 L775 5 L775 50 M775 150 L775 195 L725 195 M50 195 L5 195 L5 150 M5 50 L5 5" fill="none" stroke="white" stroke-width="1"></path> 
                        </svg>
                    </div>
                </div>`;
            document.body.appendChild(this.currentWinPanel);

            setTimeout(() => {
                document.body.removeChild(this.currentWinPanel);
                this.currentWinPanel = false;
            },  3000)
        }
        else {
            console.log('Panel Already Deployed')
        }
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
        this.roundCounterElement.textContent = `ROUND ${this.roundCounter}`;
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
    startSpikeCountDown(timeMiliseconds){
        this.leftAttackIndicator.classList.add('hidden');
        this.rightAttackIndicator.classList.add('hidden');
        this.roundCounterElement.classList.add('hidden');
        this.spikeElement.animate(this.spikeInAnimation, this.animationTiming);
        this.spikeElement.src = '../visual_assets/spike_red.png'
        //Show red spike
        setTimeout(() => {
            this.resetSpikeAnimation();
        }, timeMiliseconds)
    }
    resetSpikeAnimation(){
        //Hide Red spike
        this.roundCounterElement.classList.remove('hidden');
        this.spikeElement.animate(this.spikeOutAnimation, this.animationTiming);
        this.spikeElement.src = '../visual_assets/spike_white.png'
        //Reset Local Variables
        this.spikeDown = false;
        this.switchSides();
    }
    //
    //Helper Functions
}

//Initialize gameScore instance
const gameScoreInterface = new helValorantGameScore();

//Start Requesting Data from server (5 req/sec) for maximum game fidelity;
gameScoreInterface.init();
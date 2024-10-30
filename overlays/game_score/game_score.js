
class helValorantGameScore {
    constructor(){
        //Value Variables
        this.roundCounter = 0;
        this.gamePhases = ['buy', 'fight', 'spike', 'post'] //30s or 45s ; 100s ; 45 ; 6s
        this.currentRound = 0;
        this.currentGamePhase = 'idle';
        //Element Variables
        this.roundCounterElement = document.getElementById('round-counter');
        this.leftTeamContainer = document.getElementById('left-team');
        this.rightTeamContainer = document.getElementById('right-team');
        this.leftScoreLabel = document.getElementsByClassName('score')[0];
        this.rightScoreLabel = document.getElementsByClassName('score')[1];
        this.leftAttackIndicator = document.getElementsByClassName('attack-indicator')[0];
        this.rightAttackIndicator = document.getElementsByClassName('attack-indicator')[1];

        //Set Default Values
        this.updateRoundNumer();
        this.leftTeamContainer.innerHTML = this.formatTeamDisplay('RED', '', '../visual_assets/blueTeamPlaceholder.jpg');
        this.rightTeamContainer.innerHTML = this.formatTeamDisplay('BLU', '', '../visual_assets/redTeamPlaceholder.jpg');
    }

    init(){
        //Fetch information from the server;
    }
    nextGamePhase(){

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
                    <span class="score">0</span>
                </div>`;
    }
    updateTeamScores(leftScore, rightScore){
        this.leftScoreLabel.textContent = toString(leftScore);
        this.rightScoreLabel.textContent = toString(rightScore);
    }
    updateRoundNumer(){
        this.roundCounter += 1;
        this.roundCounterElement.textContent = `Round ${this.roundCounter}`;
    }
    switchSides(){
        if(this.leftTeamContainer.classList.contains('green-team')){
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
}

class helValorantGameScoreTimer extends helValorantGameScore{
    constructor(){
        super();
        this.timerIsRunning = false;
        this.countdownElement = document.getElementById('timer');
        this.spikeElement = document.getElementById('spike');

        setInterval(async ( ) => {
            this.tick();
        }, 250)
    }
    updateTimerSettings(){
        switch(this.currentGamePhase){
            case 'idle':
                this.countdownElement.textContent = '--:--';
                break;
            case 'buy':
                if(!this.timerIsRunning){
                    this.timerIsRunning = true;
                    this.startCountdown(30000);
                }
                break;
            case 'fight':
                if(!this.timerIsRunning){
                    this.timerIsRunning = true;
                    this.startCountdown(100000);
                }
                break;
            case 'spike':
                clearInterval();
                this.timerIsRunning = true;
                this.countdownElement.textContent = '';
                this.startSpikeCountDown();
            case 'post':
                if(!this.timerIsRunning){
                    this.timerIsRunning = true;
                    this.startCountdown(5000);
                }
        }
    }
    padZero(num) {
        return num < 10 ? '0' + num : num;
    }
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
    
        if(ms < 15000){
            return `<span style="color: red;">${this.padZero(minutes)}:${this.padZero(seconds)}</span>`;
        } else {
            return `<span style="color: white;">${this.padZero(minutes)}:${this.padZero(seconds)}</span>`;
        }
    }
    startCountdown(duration) {
        let remainingTime = duration;
    
        const interval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(interval);
                this.timerIsRunning = false
                return;
            }
    
            remainingTime -= 1000;
            this.countdownElement.innerHTML = this.formatTime(remainingTime);
        }, 1000);
    }
    startSpikeCountDown(){
        let spikeInAnimation = [
            {transform: 'translateY(-65px) scale(1.2)', backgroundColor: 'red'}
        ];
        let spikeOutAnimation = [
            {transform: 'translateY(0px) scale(1)', backgroundColor: 'white'}
        ];
        let animationTiming = {
            duration: 350,
            fill: 'forwards'
        }
        if(!this.timerIsRunning){
            this.timerIsRunning = true;
            this.countdownElement.textContent = '';
            this.roundCounterElement.textContent = '';
            this.spikeElement.animate(spikeInAnimation, animationTiming);
            //Time is always 45s
            //Show red spike
            setTimeout(() => {
                //Hide Red spike
                this.roundCounter -= 1; //Compensate for round added
                this.updateRoundNumer()
                this.spikeElement.animate(spikeOutAnimation, animationTiming);
                this.timerIsRunning = false;
            }, 4000)
        }
    }
    tick(){
        this.updateTimerSettings();
    }
}
//Counter For game State

const gameScoreInterface = new helValorantGameScore();
const gameTimer = new helValorantGameScoreTimer();

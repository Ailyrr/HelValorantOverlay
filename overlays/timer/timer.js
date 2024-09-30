class Timer{
    constructor(start_time, timer_target){
        this.milliseconds = start_time;
        this.timer_display = timer_target
    }
    format_timer(){

    }
    start_timer(){
        setTimeout(() => {
            this.milliseconds -= 10
            if(this.milliseconds <= 0){
                document.getElementById(this.timer_display).textContent = `00:00:000`;
                return 0
            }
            let milliseconds = this.milliseconds % 1000;
            let seconds = Math.floor((this.milliseconds / 1000) % 60);
            let minutes = Math.floor((this.milliseconds / (1000 * 60)) % 60);
    
            // Formatting to ensure two digits for minutes and seconds, three for milliseconds
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            milliseconds = milliseconds < 100 ? (milliseconds < 10 ? `00${milliseconds}` : `0${milliseconds}`) : milliseconds;
            document.getElementById(this.timer_display).textContent = `${minutes}:${seconds}:${milliseconds}`;
            this.start_timer()
        }, 10)
    }
}
/*
Get info about timer
{
    "timer": true,
    "miliseconds": 60000,
    "decription": "Timeout"
}
*/
const timer = new Timer(1000000, 'timer')
timer.start_timer()
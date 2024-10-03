class Timer{
    constructor(start_time, timer_target, timer_target_label, timer_container){
        this.milliseconds = start_time || 0;
        this.timer_display = timer_target;
        this.label = timer_target_label;
        this.container = timer_container;
    }
    format_timer(){

    }
    async get_data(){
        const res = await fetch('../get_timer_info', { method: 'GET'});
        const json = await res.json();
        if(json.isOn){
            //Update Core Values Of timer
            this.milliseconds = json.time;
            document.getElementById(this.label).innerText = json.description;
            //Start the animation of the timer
            this.animate_timer_in();
            //Start the countdown
            this.start_timer();
        } else {
            //If  there is no timer, wait for a bit until requerying a request.
            setTimeout(() => {
                this.get_data()
            }, 2000)
        }
    }
    async reset_timer(){
        //Call api to change value of server data from true to false
        const res = await fetch('../reset_timer', { method: 'GET'});
        const json = await res.json();
        if(res.status === 200){
            return 0
        } else {
            console.log('Error while querying api');
        }
    }
    animate_timer_in(){
        document.getElementById(this.container).animate(
            [
                {transform: 'translateX(-650px)'},
                {transform: 'translateX(0px)'}
            ], {
                duration: 400,
                fill: 'forwards',
                iterations: 1
            }
        )
    }
    animate_timer_out(){
        document.getElementById(this.container).animate(
            [
                {transform: 'translateX(0px)'},
                {transform: 'translateX(-650px)'}
            ], {
                duration: 400,
                fill: 'forwards',
                iterations: 1
            }
        )
    }
    start_timer(){
        //Update timer each 1/10 second
        setTimeout(() => {
            this.milliseconds -= 10
            if(this.milliseconds <= 0){
                //If time is zero change string to zero and animate timer out
                document.getElementById(this.timer_display).textContent = `00:00:000`;
                this.animate_timer_out();
                //call api to reset timer
                this.reset_timer();
                //Wait until refetching data as to not trigger a timer twice.
                setTimeout(() => {
                    this.get_data();
                }, 500)
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


const timer = new Timer(0, 'timer', 'timer-label', 'timer-container')
timer.get_data()
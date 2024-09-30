//Counter For game State
function startCountdown(duration) {
    const countdownElement = document.getElementById('timer');
    let remainingTime = duration;

    const interval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(interval);
            countdownElement.innerHTML = '00:00';
            return;
        }

        remainingTime -= 1000;
        countdownElement.innerHTML = formatTime(remainingTime);
    }, 1000);
}

// Function to format the remaining time in hh:mm:ss format
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if(ms < 15000){
        return `<span style="color: red;">${padZero(minutes)}:${padZero(seconds)}</span>`;
    } else {
        return `<span style="color: white;">${padZero(minutes)}:${padZero(seconds)}</span>`;
    }
}

// Function to add leading zero to numbers less than 10
function padZero(num) {
    return num < 10 ? '0' + num : num;
}

// Start the countdown with a given duration in milliseconds (e.g., 5 minutes)
startCountdown(17*1000); // 5 minutes in milliseconds

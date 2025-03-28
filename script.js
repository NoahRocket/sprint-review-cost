let timer;
let totalSeconds;
let costPerSecond;

function startTimer() {
    clearInterval(timer);
    
    const attendees = parseInt(document.getElementById('attendees').value);
    const hours = parseFloat(document.getElementById('hours').value);
    
    if (!attendees || !hours) {
        alert('Please enter both attendees and hours');
        return;
    }

    // Calculate total seconds from hours
    totalSeconds = hours * 3600;
    
    // Calculate cost per second
    // 100€ per hour per person, divided by 3600 seconds in an hour
    costPerSecond = (100 * attendees) / 3600;
    
    let currentCost = 0;
    const costElement = document.getElementById('cost');
    const timeElement = document.getElementById('time-remaining');

    timer = setInterval(() => {
        totalSeconds--;
        currentCost += costPerSecond;

        // Update cost display
        costElement.textContent = `€${currentCost.toFixed(2)}`;

        // Update time remaining
        const hoursLeft = Math.floor(totalSeconds / 3600);
        const minutesLeft = Math.floor((totalSeconds % 3600) / 60);
        const secondsLeft = totalSeconds % 60;
        timeElement.textContent = `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;

        if (totalSeconds <= 0) {
            clearInterval(timer);
            timeElement.textContent = 'Meeting Ended';
        }
    }, 1000);
}

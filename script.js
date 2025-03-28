let timer;
let totalSeconds;
let costPerSecond;
let animationFrame;

function startTimer() {
    clearInterval(timer);
    cancelAnimationFrame(animationFrame);
    
    const attendees = parseInt(document.getElementById('attendees').value);
    const hours = parseFloat(document.getElementById('hours').value);
    
    if (!attendees || !hours) {
        alert('Please enter both attendees and hours');
        return;
    }

    // Calculate total seconds from hours
    totalSeconds = hours * 3600;
    const initialSeconds = totalSeconds;
    
    // Calculate cost per second
    costPerSecond = (100 * attendees) / 3600;
    
    let currentCost = 0;
    const costElement = document.getElementById('cost');
    const timeElement = document.getElementById('time-remaining');
    
    // Canvas setup
    const canvas = document.getElementById('money-pit');
    const ctx = canvas.getContext('2d');
    
    function drawMoneyPit(burnProgress) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw money pit (green rectangle representing money)
        const moneyHeight = 150 * (1 - burnProgress);
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(50, 50 + (150 - moneyHeight), 200, moneyHeight);
        
        // Draw flames
        const flameHeight = 150 * burnProgress;
        for (let i = 0; i < 5; i++) {
            const x = 50 + i * 50;
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, ${165 - burnProgress * 100}, 0, ${burnProgress})`;
            ctx.moveTo(x, 200);
            ctx.quadraticCurveTo(x + 25, 200 - flameHeight, x + 50, 200);
            ctx.fill();
        }
    }

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

    // Animation loop for burning effect
    function animate() {
        const burnProgress = 1 - (totalSeconds / initialSeconds);
        drawMoneyPit(burnProgress);
        if (totalSeconds > 0) {
            animationFrame = requestAnimationFrame(animate);
        }
    }
    animate();
}

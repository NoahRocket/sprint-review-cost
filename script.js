let timer;
let totalSeconds;
let costPerSecond;
let animationFrame;
let particles = [];

function startTimer() {
    clearInterval(timer);
    cancelAnimationFrame(animationFrame);
    particles = [];
    
    const attendees = parseInt(document.getElementById('attendees').value);
    const hours = parseFloat(document.getElementById('hours').value);
    const hourlyRate = 100; // Fixed hourly rate
    
    if (!attendees || !hours) {
        alert('Please enter both attendees and hours');
        return;
    }

    // Calculate total seconds from hours
    totalSeconds = hours * 3600;
    const initialSeconds = totalSeconds;
    
    // Calculate cost per second
    costPerSecond = (hourlyRate * attendees) / 3600;
    
    let currentCost = 0;
    const costElement = document.getElementById('cost');
    const timeElement = document.getElementById('time-remaining');
    
    // Canvas setup
    const canvas = document.getElementById('money-pit');
    const ctx = canvas.getContext('2d');
    
    // Particle system for flames and smoke
    function createParticle(x, y, isSmoke = false) {
        return {
            x: x,
            y: y,
            size: isSmoke ? Math.random() * 5 + 2 : Math.random() * 10 + 5,
            speedX: (Math.random() - 0.5) * 2,
            speedY: isSmoke ? -(Math.random() * 1 + 0.5) : -(Math.random() * 3 + 1),
            life: isSmoke ? 50 : 30,
            color: isSmoke ? `rgba(150, 150, 150, ${Math.random() * 0.5 + 0.3})` : 
                   `rgba(255, ${Math.random() * 100 + 155}, 0, ${Math.random() * 0.5 + 0.5})`
        };
    }

    function drawMoneyPit(burnProgress) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw money pile (stacked bills effect with details)
        const moneyHeight = 150 * (1 - burnProgress);
        for (let i = 0; i < 5; i++) {
            const offset = i * 10;
            const billHeight = moneyHeight / 5;
            const yPos = 50 + (150 - moneyHeight);

            // Draw each bill layer
            ctx.fillStyle = burnProgress > 0.8 ? '#555' : `hsl(120, 50%, ${50 - i * 5}%)`;
            ctx.fillRect(50 + offset, yPos, 200 - offset * 2, moneyHeight);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(50 + offset, yPos, 200 - offset * 2, moneyHeight);

            // Add bill details (dollar signs and lines)
            if (burnProgress < 0.8) {
                ctx.fillStyle = '#000';
                ctx.font = '12px Arial';
                for (let j = 0; j < Math.floor(moneyHeight / 20); j++) {
                    const billY = yPos + j * 20 + 10;
                    ctx.fillText('$', 60 + offset, billY);
                    ctx.fillText('$', 230 - offset, billY);
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.beginPath();
                    ctx.moveTo(50 + offset, billY - 5);
                    ctx.lineTo(250 - offset, billY - 5);
                    ctx.stroke();
                }
            }
        }

        // Generate particles (flames and smoke)
        if (burnProgress > 0) {
            const particleCount = burnProgress * 10;
            for (let i = 0; i < particleCount; i++) {
                particles.push(createParticle(150 + (Math.random() - 0.5) * 100, 200 - moneyHeight));
                if (burnProgress > 0.5) {
                    particles.push(createParticle(150 + (Math.random() - 0.5) * 100, 200 - moneyHeight, true));
                }
            }
        }

        // Update and draw particles
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.life--;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
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

// Check for URL parameters and auto-start timer if present
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const attendees = urlParams.get('attendees');
    const hours = urlParams.get('hours');

    if (attendees && hours) {
        document.getElementById('attendees').value = attendees;
        document.getElementById('hours').value = hours;
        startTimer();
    }
};

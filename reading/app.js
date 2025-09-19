const allWords = ['at', 'am', 'it', 'in', 'is', 'as', 'an', 'sit', 'sat', 'mat', 'man', 'tan', 'ran', 'rat', 'tin', 
                  'sin', 'tar', 'mar', 'rim', 'ram', 'tim', 'sam', 'ant', 'arm', 'art'];

let words = [];
let currentWordIndex = 0;
let isCompleted = false;

function selectRandomWords() {
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    words = shuffled.slice(0, 8);
    currentWordIndex = 0;
    isCompleted = false;
}
let isDragging = false;
let startX = 0;
let currentX = 0;
let arrowOffset = 0;

const wordElement = document.getElementById('word');
const arrowElement = document.getElementById('arrow');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const arrowTrack = document.querySelector('.arrow-track');
const wordArea = document.querySelector('.word-area');
const progressFill = document.getElementById('progressFill');
const dotsContainer = document.getElementById('dotsContainer');
const presentContainer = document.getElementById('presentContainer');
const present = document.getElementById('present');
const prize = document.getElementById('prize');
const playAgainBtn = document.getElementById('playAgainBtn');
const confettiContainer = document.getElementById('confettiContainer');

function initializeDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < words.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dotsContainer.appendChild(dot);
    }
    updateDots();
}

function createStars(dot) {
    const dotRect = dot.getBoundingClientRect();
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random direction for each star
        const angle = (Math.PI * 2 / 5) * i + Math.random() * 0.5;
        const distance = 30 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        star.style.setProperty('--x', x + 'px');
        star.style.setProperty('--y', y + 'px');
        star.style.left = (dotRect.left - containerRect.left + dotRect.width / 2 - 10) + 'px';
        star.style.top = (dotRect.top - containerRect.top + dotRect.height / 2 - 10) + 'px';
        
        document.querySelector('.container').appendChild(star);
        
        // Remove star after animation
        setTimeout(() => star.remove(), 1000);
    }
}

function updateDots() {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        const wasCompleted = dot.classList.contains('completed');
        const wasCurrent = dot.classList.contains('current');
        
        dot.classList.remove('completed', 'current', 'upcoming');
        
        if (index < currentWordIndex) {
            dot.classList.add('completed');
            if (!wasCompleted && (wasCurrent || dot.classList.contains('upcoming'))) {
                createStars(dot);
            }
        } else if (index === currentWordIndex) {
            dot.classList.add('current');
            if (!wasCurrent) {
                createStars(dot);
            }
        } else {
            dot.classList.add('upcoming');
        }
    });
}

function displayWord() {
    const word = words[currentWordIndex];
    wordElement.innerHTML = '';
    
    for (let i = 0; i < word.length; i++) {
        const span = document.createElement('span');
        span.textContent = word[i];
        span.dataset.index = i;
        wordElement.appendChild(span);
    }
    
    resetArrow();
    updateDots();
}

function resetArrow() {
    arrowOffset = 0; // Start at the very beginning
    arrowElement.style.left = arrowOffset + 'px';
    progressFill.style.width = arrowOffset + 'px';
    
    const letters = wordElement.querySelectorAll('span');
    letters.forEach(letter => letter.classList.remove('highlighted'));
}

function updateHighlighting() {
    const letters = wordElement.querySelectorAll('span');
    const arrowRect = arrowElement.getBoundingClientRect();
    const arrowCenter = arrowRect.left + arrowRect.width / 2;
    
    // Update progress bar fill with pixel value for straight edge
    progressFill.style.width = arrowOffset + 'px';
    
    letters.forEach((letter) => {
        const letterRect = letter.getBoundingClientRect();
        const letterCenter = letterRect.left + letterRect.width / 2;
        
        if (arrowCenter >= letterRect.left) {
            letter.classList.add('highlighted');
        } else {
            letter.classList.remove('highlighted');
        }
    });
}

function startDrag(e) {
    isDragging = true;
    arrowElement.classList.add('dragging');
    
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    const touch = e.touches ? e.touches[0] : e;
    currentX = touch.clientX;
    
    const trackRect = arrowTrack.getBoundingClientRect();
    const minX = 0; // Start at the very left
    const maxX = trackRect.width;
    
    const newOffset = arrowOffset + (currentX - startX);
    arrowOffset = Math.min(Math.max(newOffset, minX), maxX);
    arrowElement.style.left = arrowOffset + 'px';
    
    startX = currentX;
    
    updateHighlighting();
    
    e.preventDefault();
}

function endDrag(e) {
    isDragging = false;
    arrowElement.classList.remove('dragging');
    e.preventDefault();
}

function showPresent() {
    wordArea.style.display = 'none';
    presentContainer.classList.add('show');
    dotsContainer.style.display = 'none';
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6ab04c', '#c7ecee'];
    const prizeEmojis = ['🎉', '⭐', '🏆', '🎊', '🌟', '💫', '✨', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🥇', '🏅'];
    
    // Create confetti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // Select random prize emoji
    const randomPrize = prizeEmojis[Math.floor(Math.random() * prizeEmojis.length)];
    document.querySelector('.prize-emoji').textContent = randomPrize;
    
    // Show prize after explosion
    setTimeout(() => {
        present.style.display = 'none';
        prize.classList.add('show');
    }, 500);
}

function nextWord() {
    if (currentWordIndex === words.length - 1) {
        // Last word completed, show present
        showPresent();
        isCompleted = true;
        return;
    }
    
    // Disable buttons during animation
    nextBtn.classList.add('disabled');
    prevBtn.classList.add('disabled');
    
    // Add slide-out animation to entire word area
    wordArea.classList.add('slide-out');
    
    // Immediately start preparing the new word (no delay)
    setTimeout(() => {
        // Update to next word
        currentWordIndex = currentWordIndex + 1;
        
        // Remove slide-out class
        wordArea.classList.remove('slide-out');
        
        // Update the word content
        displayWord();
        
        // Add slide-in animation
        wordArea.classList.add('slide-in');
        
        // Clean up after animation completes
        setTimeout(() => {
            wordArea.classList.remove('slide-in');
            nextBtn.classList.remove('disabled');
            prevBtn.classList.remove('disabled');
        }, 500);
    }, 50); // Minimal delay, just enough to start the slide-out
}

function prevWord() {
    // Disable buttons during animation
    nextBtn.classList.add('disabled');
    prevBtn.classList.add('disabled');
    
    // Add slide-out-down animation to entire word area
    wordArea.classList.add('slide-out-down');
    
    // Immediately start preparing the new word (no delay)
    setTimeout(() => {
        // Update to previous word
        currentWordIndex = currentWordIndex === 0 ? words.length - 1 : currentWordIndex - 1;
        
        // Remove slide-out class
        wordArea.classList.remove('slide-out-down');
        
        // Update the word content
        displayWord();
        
        // Add slide-in-down animation
        wordArea.classList.add('slide-in-down');
        
        // Clean up after animation completes
        setTimeout(() => {
            wordArea.classList.remove('slide-in-down');
            nextBtn.classList.remove('disabled');
            prevBtn.classList.remove('disabled');
        }, 500);
    }, 50); // Minimal delay, just enough to start the slide-out
}

arrowElement.addEventListener('mousedown', startDrag);
arrowElement.addEventListener('touchstart', startDrag, { passive: false });

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag, { passive: false });

document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag, { passive: false });

// Add both click and touch events for better mobile support
nextBtn.addEventListener('click', nextWord);
nextBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    nextWord();
});

prevBtn.addEventListener('click', prevWord);
prevBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    prevWord();
});

present.addEventListener('click', () => {
    if (!present.classList.contains('opened')) {
        present.classList.add('opened');
        createConfetti();
    }
});

present.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (!present.classList.contains('opened')) {
        present.classList.add('opened');
        createConfetti();
    }
});

playAgainBtn.addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    selectRandomWords();
    presentContainer.classList.remove('show');
    prize.classList.remove('show');
    present.classList.remove('opened');
    present.style.display = 'block';
    wordArea.style.display = 'flex';
    dotsContainer.style.display = 'flex';
    nextBtn.style.display = 'flex';
    prevBtn.style.display = 'flex';
    confettiContainer.innerHTML = '';
    initializeDots();
    displayWord();
}

selectRandomWords();
initializeDots();
displayWord();
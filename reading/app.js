// Game state variables
let currentChallenge = null;
let allWords = [];
let lessonSize = 8;
let words = [];
let currentWordIndex = 0;
let isCompleted = false;
let isDragging = false;
let startX = 0;
let currentX = 0;
let arrowOffset = 0;

// Wait for page to load
window.addEventListener('load', function() {
    // Get all elements
    const challengeGrid = document.getElementById('challengeGrid');
    const challengeSelection = document.getElementById('challengeSelection');
    const practiceView = document.getElementById('practiceView');
    const backBtn = document.getElementById('backBtn');
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

    // Display challenges
    function displayChallenges() {
        challengeGrid.innerHTML = '';
        challenges.forEach(function(challenge) {
            const card = document.createElement('div');
            card.className = 'challenge-card';
            card.innerHTML = '<h3>' + challenge.name + '</h3><p>' + challenge.words.join(', ') + '</p>';
            
            // Use closure to capture challenge
            (function(ch) {
                card.onclick = function() {
                    selectChallenge(ch);
                };
            })(challenge);
            
            challengeGrid.appendChild(card);
        });
    }

    // Select a challenge
    function selectChallenge(challenge) {
        currentChallenge = challenge;
        allWords = challenge.words;
        lessonSize = challenge.lessonSize;
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('challenge', challenge.id);
        window.history.pushState({}, '', url);
        
        // Show practice view
        challengeSelection.style.display = 'none';
        practiceView.style.display = 'block';
        
        // Start game
        resetGame();
    }

    // Game functions
    function selectRandomWords() {
        const shuffled = [...allWords].sort(() => 0.5 - Math.random());
        words = shuffled.slice(0, lessonSize);
        currentWordIndex = 0;
        isCompleted = false;
    }

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
            
            const angle = (Math.PI * 2 / 5) * i + Math.random() * 0.5;
            const distance = 30 + Math.random() * 20;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            star.style.setProperty('--x', x + 'px');
            star.style.setProperty('--y', y + 'px');
            star.style.left = (dotRect.left - containerRect.left + dotRect.width / 2 - 10) + 'px';
            star.style.top = (dotRect.top - containerRect.top + dotRect.height / 2 - 10) + 'px';
            
            document.querySelector('.container').appendChild(star);
            
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
        arrowOffset = 0;
        arrowElement.style.left = arrowOffset + 'px';
        progressFill.style.width = arrowOffset + 'px';
        
        const letters = wordElement.querySelectorAll('span');
        letters.forEach(letter => letter.classList.remove('highlighted'));
    }

    function updateHighlighting() {
        const letters = wordElement.querySelectorAll('span');
        const arrowRect = arrowElement.getBoundingClientRect();
        const arrowCenter = arrowRect.left + arrowRect.width / 2;
        
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
        const minX = 0;
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
        const prizeEmojis = ['🎺', '🐕', '🐈', '🐒', '🎩', '🎹', '⚽', '🍕', '🍔', '🍦', '🍪'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confettiContainer.appendChild(confetti);
        }
        
        const randomPrize = prizeEmojis[Math.floor(Math.random() * prizeEmojis.length)];
        document.querySelector('.prize-emoji').textContent = randomPrize;
        
        setTimeout(() => {
            present.style.display = 'none';
            prize.classList.add('show');
        }, 500);
    }

    function nextWord() {
        if (currentWordIndex === words.length - 1) {
            showPresent();
            isCompleted = true;
            return;
        }
        
        nextBtn.classList.add('disabled');
        prevBtn.classList.add('disabled');
        
        wordArea.classList.add('slide-out');
        
        setTimeout(() => {
            currentWordIndex = currentWordIndex + 1;
            
            wordArea.classList.remove('slide-out');
            displayWord();
            wordArea.classList.add('slide-in');
            
            setTimeout(() => {
                wordArea.classList.remove('slide-in');
                nextBtn.classList.remove('disabled');
                prevBtn.classList.remove('disabled');
            }, 500);
        }, 50);
    }

    function prevWord() {
        nextBtn.classList.add('disabled');
        prevBtn.classList.add('disabled');
        
        wordArea.classList.add('slide-out-down');
        
        setTimeout(() => {
            currentWordIndex = currentWordIndex === 0 ? words.length - 1 : currentWordIndex - 1;
            
            wordArea.classList.remove('slide-out-down');
            displayWord();
            wordArea.classList.add('slide-in-down');
            
            setTimeout(() => {
                wordArea.classList.remove('slide-in-down');
                nextBtn.classList.remove('disabled');
                prevBtn.classList.remove('disabled');
            }, 500);
        }, 50);
    }

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

    // Set up event listeners
    arrowElement.addEventListener('mousedown', startDrag);
    arrowElement.addEventListener('touchstart', startDrag, { passive: false });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag, { passive: false });
    
    nextBtn.onclick = nextWord;
    prevBtn.onclick = prevWord;
    
    present.onclick = function() {
        if (!present.classList.contains('opened')) {
            present.classList.add('opened');
            createConfetti();
        }
    };
    
    playAgainBtn.onclick = function() {
        resetGame();
    };
    
    backBtn.onclick = function() {
        console.log('Back button clicked');
        challengeSelection.style.display = 'block';
        practiceView.style.display = 'none';
        
        const url = new URL(window.location);
        url.searchParams.delete('challenge');
        window.history.pushState({}, '', url);
        
        displayChallenges();
    };

    // Handle browser navigation
    window.addEventListener('popstate', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const challengeId = urlParams.get('challenge');
        
        if (challengeId) {
            const challenge = challenges.find(c => c.id === challengeId);
            if (challenge) {
                selectChallenge(challenge);
            } else {
                challengeSelection.style.display = 'block';
                practiceView.style.display = 'none';
            }
        } else {
            challengeSelection.style.display = 'block';
            practiceView.style.display = 'none';
        }
    });

    // Initialize app
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('challenge');
    
    if (challengeId) {
        const challenge = challenges.find(c => c.id === challengeId);
        if (challenge) {
            selectChallenge(challenge);
        } else {
            displayChallenges();
            challengeSelection.style.display = 'block';
            practiceView.style.display = 'none';
        }
    } else {
        displayChallenges();
        challengeSelection.style.display = 'block';
        practiceView.style.display = 'none';
    }
});
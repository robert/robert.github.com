// Game state
let currentChallenge = null;
let allWords = [];
let lessonSize = 8;
let words = [];
let currentWordIndex = 0;
let isDragging = false;
let startX = 0;
let arrowOffset = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const challengeGrid = document.getElementById('challengeGrid');
    const challengeSelection = document.getElementById('challengeSelection');
    const practiceView = document.getElementById('practiceView');
    const backBtn = document.getElementById('backBtn');
    const wordElement = document.getElementById('word');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dotsContainer = document.getElementById('dotsContainer');
    const arrowElement = document.getElementById('arrow');
    const arrowTrack = document.querySelector('.arrow-track');
    const progressFill = document.getElementById('progressFill');
    const wordArea = document.querySelector('.word-area');
    const presentContainer = document.getElementById('presentContainer');
    const present = document.getElementById('present');
    const prize = document.getElementById('prize');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const confettiContainer = document.getElementById('confettiContainer');
    
    // Display challenges
    function showChallenges() {
        challengeGrid.innerHTML = '';
        
        challenges.forEach(function(challenge) {
            const card = document.createElement('div');
            card.className = 'challenge-card';
            card.innerHTML = '<h3>' + challenge.name + '</h3><p>' + challenge.words.join(', ') + '</p>';
            
            card.onclick = function() {
                startChallenge(challenge);
            };
            
            challengeGrid.appendChild(card);
        });
    }
    
    // Start challenge
    function startChallenge(challenge) {
        currentChallenge = challenge;
        allWords = challenge.words;
        lessonSize = challenge.lessonSize;
        
        // Update URL
        window.history.pushState({}, '', '?challenge=' + challenge.id);
        
        // Switch views
        challengeSelection.style.display = 'none';
        practiceView.style.display = 'block';
        
        // Initialize game
        resetGame();
    }
    
    function selectRandomWords() {
        const shuffled = [...allWords].sort(() => 0.5 - Math.random());
        words = shuffled.slice(0, lessonSize);
        currentWordIndex = 0;
    }
    
    function initializeDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        for (let i = 0; i < words.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dotsContainer.appendChild(dot);
        }
        updateDots();
    }
    
    function updateDots() {
        if (!dotsContainer) return;
        
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('completed', 'current', 'upcoming');
            
            if (index < currentWordIndex) {
                dot.classList.add('completed');
            } else if (index === currentWordIndex) {
                dot.classList.add('current');
            } else {
                dot.classList.add('upcoming');
            }
        });
    }
    
    function displayWord() {
        if (!wordElement || words.length === 0) return;
        
        const word = words[currentWordIndex];
        wordElement.innerHTML = '';
        
        for (let i = 0; i < word.length; i++) {
            const span = document.createElement('span');
            span.textContent = word[i];
            wordElement.appendChild(span);
        }
        
        updateDots();
        resetArrow();
    }
    
    function resetArrow() {
        if (!arrowElement) return;
        
        arrowOffset = 0;
        arrowElement.style.left = arrowOffset + 'px';
        if (progressFill) progressFill.style.width = arrowOffset + 'px';
        
        const letters = wordElement ? wordElement.querySelectorAll('span') : [];
        letters.forEach(letter => letter.classList.remove('highlighted'));
    }
    
    function updateHighlighting() {
        if (!wordElement || !arrowElement) return;
        
        const letters = wordElement.querySelectorAll('span');
        const arrowRect = arrowElement.getBoundingClientRect();
        const arrowCenter = arrowRect.left + arrowRect.width / 2;
        
        letters.forEach((letter) => {
            const letterRect = letter.getBoundingClientRect();
            if (arrowCenter >= letterRect.left) {
                letter.classList.add('highlighted');
            } else {
                letter.classList.remove('highlighted');
            }
        });
    }
    
    function showPresent() {
        if (!presentContainer || !wordArea) return;
        
        wordArea.style.display = 'none';
        presentContainer.classList.add('show');
        if (dotsContainer) dotsContainer.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
    }
    
    function createConfetti() {
        if (!confettiContainer) return;
        
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
        const prizeEmoji = document.querySelector('.prize-emoji');
        if (prizeEmoji) prizeEmoji.textContent = randomPrize;
        
        setTimeout(() => {
            if (present) present.style.display = 'none';
            if (prize) prize.classList.add('show');
        }, 500);
    }
    
    function resetGame() {
        selectRandomWords();
        if (presentContainer) presentContainer.classList.remove('show');
        if (prize) prize.classList.remove('show');
        if (present) {
            present.classList.remove('opened');
            present.style.display = 'block';
        }
        if (wordArea) wordArea.style.display = 'flex';
        if (dotsContainer) dotsContainer.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        if (prevBtn) prevBtn.style.display = 'flex';
        if (confettiContainer) confettiContainer.innerHTML = '';
        initializeDots();
        displayWord();
    }
    
    function nextWord() {
        if (currentWordIndex === words.length - 1) {
            showPresent();
            return;
        }
        
        currentWordIndex++;
        displayWord();
    }
    
    function prevWord() {
        if (currentWordIndex > 0) {
            currentWordIndex--;
        } else {
            currentWordIndex = words.length - 1;
        }
        displayWord();
    }
    
    // Drag functions
    function startDrag(e) {
        // Don't start drag if clicking on buttons
        if (e.target.closest('.nav-btn') || e.target.closest('.back-btn')) {
            return;
        }
        
        isDragging = true;
        arrowElement.classList.add('dragging');
        
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging || !arrowElement || !arrowTrack) return;
        
        const touch = e.touches ? e.touches[0] : e;
        const currentX = touch.clientX;
        
        const trackRect = arrowTrack.getBoundingClientRect();
        const maxX = trackRect.width;
        
        const newOffset = arrowOffset + (currentX - startX);
        arrowOffset = Math.min(Math.max(newOffset, 0), maxX);
        arrowElement.style.left = arrowOffset + 'px';
        
        if (progressFill) progressFill.style.width = arrowOffset + 'px';
        
        startX = currentX;
        updateHighlighting();
        
        e.preventDefault();
    }
    
    function endDrag(e) {
        if (!isDragging) return;
        
        isDragging = false;
        if (arrowElement) arrowElement.classList.remove('dragging');
        e.preventDefault();
    }
    
    // Set up event handlers
    if (backBtn) {
        backBtn.onclick = function() {
            challengeSelection.style.display = 'block';
            practiceView.style.display = 'none';
            window.history.pushState({}, '', window.location.pathname);
            showChallenges();
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = function() {
            nextWord();
        };
    }
    
    if (prevBtn) {
        prevBtn.onclick = function() {
            prevWord();
        };
    }
    
    if (present) {
        present.onclick = function() {
            if (!present.classList.contains('opened')) {
                present.classList.add('opened');
                createConfetti();
            }
        };
    }
    
    if (playAgainBtn) {
        playAgainBtn.onclick = function() {
            resetGame();
        };
    }
    
    // Set up arrow drag - only on the arrow element itself
    if (arrowElement) {
        arrowElement.addEventListener('mousedown', startDrag);
        arrowElement.addEventListener('touchstart', startDrag, { passive: false });
        
        // Add drag events to document
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag, { passive: false });
    }
    
    // Handle browser navigation
    window.addEventListener('popstate', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const challengeId = urlParams.get('challenge');
        
        if (challengeId) {
            const challenge = challenges.find(c => c.id === challengeId);
            if (challenge) {
                startChallenge(challenge);
            } else {
                challengeSelection.style.display = 'block';
                practiceView.style.display = 'none';
            }
        } else {
            challengeSelection.style.display = 'block';
            practiceView.style.display = 'none';
        }
    });
    
    // Initialize
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('challenge');
    
    if (challengeId) {
        const challenge = challenges.find(c => c.id === challengeId);
        if (challenge) {
            startChallenge(challenge);
        } else {
            showChallenges();
        }
    } else {
        showChallenges();
    }
});
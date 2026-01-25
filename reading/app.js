// Game state
let currentChallenge = null;
let allWords = [];
let lessonSize = 8;
let words = [];
let currentWordIndex = 0;
let isDragging = false;
let startX = 0;
let arrowOffset = 0;
let sizeMode = 'normal'; // 'normal', 'big', 'extra-big'

// Listening mode state
let listeningPairs = [];
let currentPairIndex = 0;
let targetWord = null;
let listeningAnswered = false;

// TTS voice selection
let selectedVoice = null;

function selectBestVoice() {
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Filter to English voices only
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    if (englishVoices.length === 0) return voices[0];

    // Prioritize voices (higher = better)
    // Premium/enhanced voices are usually marked or have specific names
    const scoredVoices = englishVoices.map(voice => {
        let score = 0;
        const name = voice.name.toLowerCase();

        // Prefer local/offline voices (usually higher quality on modern systems)
        if (voice.localService) score += 5;

        // Premium voice indicators
        if (name.includes('premium')) score += 20;
        if (name.includes('enhanced')) score += 15;
        if (name.includes('natural')) score += 15;
        if (name.includes('neural')) score += 15;

        // Specific high-quality voices by platform
        // macOS - prefer Samantha or other natural voices
        if (name.includes('samantha')) score += 25;
        if (name.includes('karen')) score += 20;
        if (name.includes('daniel')) score += 20;
        if (name.includes('moira')) score += 18;
        if (name.includes('tessa')) score += 18;

        // Google voices (Chrome)
        if (name.includes('google') && name.includes('us')) score += 15;
        if (name.includes('google') && name.includes('uk')) score += 14;

        // Microsoft voices (Edge)
        if (name.includes('aria')) score += 18;
        if (name.includes('jenny')) score += 18;
        if (name.includes('guy')) score += 16;

        // Prefer US or UK English
        if (voice.lang === 'en-US') score += 3;
        if (voice.lang === 'en-GB') score += 2;

        // Avoid compact/low-quality voices
        if (name.includes('compact')) score -= 10;

        return { voice, score };
    });

    // Sort by score and pick the best
    scoredVoices.sort((a, b) => b.score - a.score);

    console.log('Top 5 voices:', scoredVoices.slice(0, 5).map(v => `${v.voice.name} (score: ${v.score})`));
    console.log('Selected voice:', scoredVoices[0].voice.name, `(score: ${scoredVoices[0].score})`);

    return scoredVoices[0].voice;
}

// Initialize voice when voices are loaded
function initVoices() {
    selectedVoice = selectBestVoice();
    if (selectedVoice) {
        console.log('Selected TTS voice:', selectedVoice.name);
    }
}

// Voices may load asynchronously
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = initVoices;
    // Also try immediately (some browsers have voices ready)
    initVoices();
}

document.addEventListener('DOMContentLoaded', function () {
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
    const bigModeBtn = document.getElementById('bigModeBtn');

    // Listening mode elements
    const listeningView = document.getElementById('listeningView');
    const listeningBackBtn = document.getElementById('listeningBackBtn');
    const listeningDotsContainer = document.getElementById('listeningDotsContainer');
    const wordChoices = document.getElementById('wordChoices');
    const wordChoice1 = document.getElementById('wordChoice1');
    const wordChoice2 = document.getElementById('wordChoice2');
    const listeningNextBtn = document.getElementById('listeningNextBtn');
    const listeningPrevBtn = document.getElementById('listeningPrevBtn');
    const listeningPresentContainer = document.getElementById('listeningPresentContainer');
    const listeningPresent = document.getElementById('listeningPresent');
    const listeningPrize = document.getElementById('listeningPrize');
    const listeningPlayAgainBtn = document.getElementById('listeningPlayAgainBtn');
    const listeningConfettiContainer = document.getElementById('listeningConfettiContainer');

    // Display challenges
    function showChallenges() {
        challengeGrid.innerHTML = '';

        challenges.forEach(function (challenge) {
            const card = document.createElement('div');
            card.className = 'challenge-card';

            if (challenge.mode === 'listening') {
                const pairText = challenge.pairs.map(p => p.join('/')).join(', ');
                card.innerHTML = '<h3>' + challenge.name + '</h3><p>' + pairText + '</p>';
            } else {
                card.innerHTML = '<h3>' + challenge.name + '</h3><p>' + challenge.words.join(', ') + '</p>';
            }

            card.onclick = function () {
                if (challenge.mode === 'listening') {
                    startListeningChallenge(challenge);
                } else {
                    startChallenge(challenge);
                }
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
        const prizeEmojis = [
            '🚂', '🤩', '🦸', '🏎️', '🚒', '🎤', '🗡️', '🚜', '🏓', '🍪', '🍩', '🍎', '🦉', '👻'
        ];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confettiContainer.appendChild(confetti);
        }

        // Determine number of prizes: 70% for 1, 20% for 2, 10% for 3
        const rand = Math.random();
        let numPrizes;
        if (rand < 0.7) {
            numPrizes = 1;
        } else if (rand < 0.9) {
            numPrizes = 2;
        } else {
            numPrizes = 3;
        }

        const prizeEmoji = document.querySelector('.prize-emoji');
        const selectedPrizes = [];

        // Pick unique emojis
        while (selectedPrizes.length < numPrizes) {
            const prize = prizeEmojis[Math.floor(Math.random() * prizeEmojis.length)];
            if (!selectedPrizes.includes(prize)) {
                selectedPrizes.push(prize);
            }
        }

        if (prizeEmoji) prizeEmoji.textContent = selectedPrizes.join(' ');

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

    // ========== LISTENING MODE FUNCTIONS ==========

    function startListeningChallenge(challenge) {
        currentChallenge = challenge;
        lessonSize = challenge.lessonSize || 5;

        // Update URL
        window.history.pushState({}, '', '?challenge=' + challenge.id);

        // Switch views
        challengeSelection.style.display = 'none';
        practiceView.style.display = 'none';
        listeningView.style.display = 'block';

        // Initialize listening game
        resetListeningGame();
    }

    function selectRandomPairs() {
        const allPairs = currentChallenge.pairs;
        const shuffled = [...allPairs].sort(() => 0.5 - Math.random());
        listeningPairs = shuffled.slice(0, lessonSize);
        currentPairIndex = 0;
    }

    function initializeListeningDots() {
        if (!listeningDotsContainer) return;

        listeningDotsContainer.innerHTML = '';
        for (let i = 0; i < listeningPairs.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            listeningDotsContainer.appendChild(dot);
        }
        updateListeningDots();
    }

    function updateListeningDots() {
        if (!listeningDotsContainer) return;

        const dots = listeningDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('completed', 'current', 'upcoming');

            if (index < currentPairIndex) {
                dot.classList.add('completed');
            } else if (index === currentPairIndex) {
                dot.classList.add('current');
            } else {
                dot.classList.add('upcoming');
            }
        });
    }

    function speakWord(word, times = 1, delay = 800, onComplete = null) {
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported');
            if (onComplete) onComplete();
            return;
        }

        let count = 0;
        function speak() {
            if (count >= times) {
                if (onComplete) onComplete();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = 0.7;
            utterance.pitch = 1;

            // Use the pre-selected best voice
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            } else {
                utterance.lang = 'en-US';
            }

            utterance.onend = function () {
                count++;
                if (count < times) {
                    setTimeout(speak, delay);
                } else if (onComplete) {
                    onComplete();
                }
            };

            // Handle errors gracefully
            utterance.onerror = function (e) {
                console.warn('Speech error:', e.error);
                count++;
                if (count < times) {
                    setTimeout(speak, delay);
                } else if (onComplete) {
                    onComplete();
                }
            };

            speechSynthesis.speak(utterance);
        }

        // Cancel any ongoing speech
        speechSynthesis.cancel();
        speak();
    }

    function displayListeningRound() {
        if (listeningPairs.length === 0) return;

        const pair = listeningPairs[currentPairIndex];

        // Randomly order the buttons
        const shuffledPair = [...pair].sort(() => 0.5 - Math.random());

        wordChoice1.textContent = shuffledPair[0];
        wordChoice2.textContent = shuffledPair[1];

        updateListeningDots();
    }

    function nextListeningRound() {
        if (currentPairIndex === listeningPairs.length - 1) {
            showListeningPresent();
        } else {
            currentPairIndex++;
            displayListeningRound();
        }
    }

    function prevListeningRound() {
        if (currentPairIndex > 0) {
            currentPairIndex--;
        } else {
            currentPairIndex = listeningPairs.length - 1;
        }
        displayListeningRound();
    }

    function showListeningPresent() {
        if (!listeningPresentContainer || !wordChoices) return;

        wordChoices.style.display = 'none';
        if (listeningNextBtn) listeningNextBtn.style.display = 'none';
        if (listeningPrevBtn) listeningPrevBtn.style.display = 'none';
        listeningPresentContainer.classList.add('show');
        if (listeningDotsContainer) listeningDotsContainer.style.display = 'none';
    }

    function createListeningConfetti() {
        if (!listeningConfettiContainer) return;

        const colors = ['#4ecdc4', '#45b7d1', '#5dade2', '#3498db', '#2980b9', '#1abc9c', '#48c9b0', '#76d7c4'];
        const prizeEmojis = [
            '🚂', '🤩', '🦸', '🏎️', '🚒', '🎤', '🗡️', '🚜', '🏓', '🍪', '🍩', '🍎', '🦉', '👻'
        ];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            listeningConfettiContainer.appendChild(confetti);
        }

        // Determine number of prizes
        const rand = Math.random();
        let numPrizes;
        if (rand < 0.7) {
            numPrizes = 1;
        } else if (rand < 0.9) {
            numPrizes = 2;
        } else {
            numPrizes = 3;
        }

        const prizeEmoji = listeningPresentContainer.querySelector('.prize-emoji');
        const selectedPrizes = [];

        while (selectedPrizes.length < numPrizes) {
            const prize = prizeEmojis[Math.floor(Math.random() * prizeEmojis.length)];
            if (!selectedPrizes.includes(prize)) {
                selectedPrizes.push(prize);
            }
        }

        if (prizeEmoji) prizeEmoji.textContent = selectedPrizes.join(' ');

        setTimeout(() => {
            if (listeningPresent) listeningPresent.style.display = 'none';
            if (listeningPrize) listeningPrize.classList.add('show');
        }, 500);
    }

    function resetListeningGame() {
        selectRandomPairs();
        if (listeningPresentContainer) listeningPresentContainer.classList.remove('show');
        if (listeningPrize) listeningPrize.classList.remove('show');
        if (listeningPresent) {
            listeningPresent.classList.remove('opened');
            listeningPresent.style.display = 'block';
        }
        if (wordChoices) wordChoices.style.display = 'flex';
        if (listeningNextBtn) listeningNextBtn.style.display = 'flex';
        if (listeningPrevBtn) listeningPrevBtn.style.display = 'flex';
        if (listeningDotsContainer) listeningDotsContainer.style.display = 'flex';
        if (listeningConfettiContainer) listeningConfettiContainer.innerHTML = '';
        initializeListeningDots();
        displayListeningRound();
    }

    // ========== END LISTENING MODE FUNCTIONS ==========

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
        const trackLeft = trackRect.left;
        const maxX = trackRect.width;

        // Calculate position relative to the track
        const relativeX = currentX - trackLeft;
        arrowOffset = Math.min(Math.max(relativeX, 0), maxX);
        arrowElement.style.left = arrowOffset + 'px';

        if (progressFill) progressFill.style.width = arrowOffset + 'px';

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
        backBtn.onclick = function () {
            challengeSelection.style.display = 'block';
            practiceView.style.display = 'none';
            window.history.pushState({}, '', window.location.pathname);
            showChallenges();
        };
    }

    if (nextBtn) {
        nextBtn.onclick = function () {
            nextWord();
        };
    }

    if (prevBtn) {
        prevBtn.onclick = function () {
            prevWord();
        };
    }

    if (present) {
        present.onclick = function () {
            if (!present.classList.contains('opened')) {
                present.classList.add('opened');
                createConfetti();
            }
        };
    }

    if (playAgainBtn) {
        playAgainBtn.onclick = function () {
            resetGame();
        };
    }

    if (bigModeBtn) {
        bigModeBtn.onclick = function () {
            if (!wordArea) return;

            // Cycle through modes: normal -> big -> extra-big -> small -> normal
            if (sizeMode === 'normal') {
                sizeMode = 'big';
                wordArea.classList.remove('extra-big-mode', 'small-mode');
                wordArea.classList.add('big-mode');
                bigModeBtn.classList.remove('extra-active', 'small-active');
                bigModeBtn.classList.add('active');
            } else if (sizeMode === 'big') {
                sizeMode = 'extra-big';
                wordArea.classList.remove('big-mode', 'small-mode');
                wordArea.classList.add('extra-big-mode');
                bigModeBtn.classList.remove('active', 'small-active');
                bigModeBtn.classList.add('extra-active');
            } else if (sizeMode === 'extra-big') {
                sizeMode = 'small';
                wordArea.classList.remove('big-mode', 'extra-big-mode');
                wordArea.classList.add('small-mode');
                bigModeBtn.classList.remove('active', 'extra-active');
                bigModeBtn.classList.add('small-active');
            } else {
                sizeMode = 'normal';
                wordArea.classList.remove('big-mode', 'extra-big-mode', 'small-mode');
                bigModeBtn.classList.remove('active', 'extra-active', 'small-active');
            }
        };
    }

    // Listening mode event handlers
    if (listeningBackBtn) {
        listeningBackBtn.onclick = function () {
            speechSynthesis.cancel();
            challengeSelection.style.display = 'block';
            listeningView.style.display = 'none';
            window.history.pushState({}, '', window.location.pathname);
            showChallenges();
        };
    }

    if (listeningNextBtn) {
        listeningNextBtn.onclick = function () {
            nextListeningRound();
        };
    }

    if (listeningPrevBtn) {
        listeningPrevBtn.onclick = function () {
            prevListeningRound();
        };
    }

    if (listeningPresent) {
        listeningPresent.onclick = function () {
            if (!listeningPresent.classList.contains('opened')) {
                listeningPresent.classList.add('opened');
                createListeningConfetti();
            }
        };
    }

    if (listeningPlayAgainBtn) {
        listeningPlayAgainBtn.onclick = function () {
            resetListeningGame();
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
    window.addEventListener('popstate', function () {
        speechSynthesis.cancel();
        const urlParams = new URLSearchParams(window.location.search);
        const challengeId = urlParams.get('challenge');

        if (challengeId) {
            const challenge = challenges.find(c => c.id === challengeId);
            if (challenge) {
                if (challenge.mode === 'listening') {
                    startListeningChallenge(challenge);
                } else {
                    startChallenge(challenge);
                }
            } else {
                challengeSelection.style.display = 'block';
                practiceView.style.display = 'none';
                listeningView.style.display = 'none';
            }
        } else {
            challengeSelection.style.display = 'block';
            practiceView.style.display = 'none';
            listeningView.style.display = 'none';
        }
    });

    // Initialize
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('challenge');

    if (challengeId) {
        const challenge = challenges.find(c => c.id === challengeId);
        if (challenge) {
            if (challenge.mode === 'listening') {
                startListeningChallenge(challenge);
            } else {
                startChallenge(challenge);
            }
        } else {
            showChallenges();
        }
    } else {
        showChallenges();
    }
});
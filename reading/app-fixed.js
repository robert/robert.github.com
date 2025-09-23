// Game state
let currentChallenge = null;
let allWords = [];
let lessonSize = 8;
let words = [];
let currentWordIndex = 0;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    
    // Get elements
    const challengeGrid = document.getElementById('challengeGrid');
    const challengeSelection = document.getElementById('challengeSelection');
    const practiceView = document.getElementById('practiceView');
    const backBtn = document.getElementById('backBtn');
    
    // Display challenge cards
    function showChallenges() {
        console.log('Showing challenges...');
        challengeGrid.innerHTML = '';
        
        challenges.forEach(function(challenge) {
            const card = document.createElement('div');
            card.className = 'challenge-card';
            card.innerHTML = '<h3>' + challenge.name + '</h3><p>' + challenge.words.join(', ') + '</p>';
            card.style.cursor = 'pointer';
            
            card.onclick = function() {
                console.log('Challenge selected:', challenge.name);
                startChallenge(challenge);
            };
            
            challengeGrid.appendChild(card);
        });
    }
    
    // Start a challenge
    function startChallenge(challenge) {
        currentChallenge = challenge;
        allWords = challenge.words;
        lessonSize = challenge.lessonSize;
        
        // Update URL
        window.history.pushState({}, '', '?challenge=' + challenge.id);
        
        // Switch views
        challengeSelection.style.display = 'none';
        practiceView.style.display = 'block';
        
        console.log('Challenge started:', challenge.name);
        // TODO: Initialize game here
    }
    
    // Back button
    if (backBtn) {
        backBtn.onclick = function() {
            console.log('Back button clicked');
            challengeSelection.style.display = 'block';
            practiceView.style.display = 'none';
            window.history.pushState({}, '', window.location.pathname);
            showChallenges();
        };
    }
    
    // Check URL on load
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('challenge');
    
    if (challengeId) {
        // Find and start challenge
        const challenge = challenges.find(c => c.id === challengeId);
        if (challenge) {
            startChallenge(challenge);
        } else {
            showChallenges();
        }
    } else {
        // Show challenge selection
        showChallenges();
    }
    
    console.log('App initialized');
});
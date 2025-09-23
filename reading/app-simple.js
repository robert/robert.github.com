// Wait for page to load
window.addEventListener('load', function() {
    // Get elements
    var challengeGrid = document.getElementById('challengeGrid');
    var challengeSelection = document.getElementById('challengeSelection');
    var practiceView = document.getElementById('practiceView');
    
    // Display challenges
    challenges.forEach(function(challenge) {
        var card = document.createElement('div');
        card.className = 'challenge-card';
        card.innerHTML = '<h3>' + challenge.name + '</h3><p>' + challenge.words.join(', ') + '</p>';
        
        // Use closure to capture challenge
        (function(ch) {
            card.onclick = function() {
                alert('Loading: ' + ch.name);
                window.location.href = window.location.pathname + '?challenge=' + ch.id;
            };
        })(challenge);
        
        challengeGrid.appendChild(card);
    });
    
    // Check if we should load a challenge
    var urlParams = new URLSearchParams(window.location.search);
    var challengeId = urlParams.get('challenge');
    
    if (challengeId) {
        // Hide selection, show practice
        challengeSelection.style.display = 'none';
        practiceView.style.display = 'block';
        
        // Find and load the challenge
        var challenge = challenges.find(function(c) { return c.id === challengeId; });
        if (challenge) {
            alert('Challenge loaded: ' + challenge.name);
            // Initialize game with challenge...
        }
    }
});
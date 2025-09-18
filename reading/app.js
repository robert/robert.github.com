const words = ['at', 'am', 'it', 'in', 'on', 'up', 'go', 'no', 'so', 'we', 'me', 'be', 'to', 'do', 'is', 'as'];

let currentWordIndex = 0;
let isDragging = false;
let startX = 0;
let currentX = 0;
let arrowOffset = 0;

const wordElement = document.getElementById('word');
const arrowElement = document.getElementById('arrow');
const nextBtn = document.getElementById('nextBtn');
const arrowTrack = document.querySelector('.arrow-track');

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
}

function resetArrow() {
    arrowOffset = 0;
    arrowElement.style.left = '30px';
    
    const letters = wordElement.querySelectorAll('span');
    letters.forEach(letter => letter.classList.remove('highlighted'));
}

function updateHighlighting() {
    const letters = wordElement.querySelectorAll('span');
    const arrowRect = arrowElement.getBoundingClientRect();
    const arrowCenter = arrowRect.left + arrowRect.width / 2;
    
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
    const minX = 30;
    const maxX = trackRect.width - 60;
    
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

function nextWord() {
    // Disable button during animation
    nextBtn.classList.add('disabled');
    
    // Add slide-out animation to current elements
    wordElement.classList.add('slide-out');
    arrowTrack.classList.add('slide-out');
    
    // Wait for animation to complete
    setTimeout(() => {
        // Update to next word
        currentWordIndex = (currentWordIndex + 1) % words.length;
        
        // Remove slide-out classes
        wordElement.classList.remove('slide-out');
        arrowTrack.classList.remove('slide-out');
        
        // Update the word content
        displayWord();
        
        // Add slide-in animation
        wordElement.classList.add('slide-in');
        arrowTrack.classList.add('slide-in');
        
        // Clean up after animation completes
        setTimeout(() => {
            wordElement.classList.remove('slide-in');
            arrowTrack.classList.remove('slide-in');
            nextBtn.classList.remove('disabled');
        }, 400);
    }, 400);
}

arrowElement.addEventListener('mousedown', startDrag);
arrowElement.addEventListener('touchstart', startDrag, { passive: false });

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag, { passive: false });

document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag, { passive: false });

nextBtn.addEventListener('click', nextWord);

displayWord();
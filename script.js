// --- NAVIGATION SYSTEM ---

function loadGame(gameId) {
    // 1. Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    // 2. Show the specific game screen
    document.getElementById(`game-${gameId}`).classList.add('active');

    // 3. Initialize the specific game (We will fill this later)
    if (gameId === 'snake') startSnake();
    if (gameId === 'memory') startMemory();
    if (gameId === 'dino') startDino();
    if (gameId === 'typing') startTyping(); 
    // ... etc
}

function goBack() {
    // 1. Stop any running game loops (Important!)
    stopSnake(); 
    
    // 2. Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    // 3. Show Main Menu
    document.getElementById('main-menu').classList.add('active');
}

// --- GAME 1: SNAKE LOGIC PLACEHOLDERS ---
// ==========================================
// GAME 1: SNAKE LOGIC
// ==========================================

// ==========================================
// GAME 1: SNAKE LOGIC
// ==========================================

const cvs = document.getElementById("snakeCanvas");
const ctx = cvs.getContext("2d");
const box = 20;

// Game Variables
let snake = [];
let food = {};
let score = 0;
let d;
let gameInterval;

// NEW: Default Speed (100ms)
let currentSnakeSpeed = 100; 

// NEW: Function to change speed and restart immediately
function setSnakeSpeed(speed) {
    currentSnakeSpeed = speed;
    startSnake();
}

// 1. START FUNCTION (Updated to use variable speed)
function startSnake() {
    // Hide Restart Button
    const btn = document.getElementById('btn-snake');
    if(btn) btn.style.display = 'none'; 

    // Reset everything
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    
    score = 0;
    d = undefined;
    
    document.addEventListener("keydown", direction);
    
    clearInterval(gameInterval);
    
    // USE THE VARIABLE SPEED HERE!
    gameInterval = setInterval(drawSnake, currentSnakeSpeed); 
}

// 2. STOP FUNCTION
function stopSnake() {
    clearInterval(gameInterval);
    document.removeEventListener("keydown", direction);
}

// 3. CONTROLS
function direction(event) {
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT") d = "LEFT";
    else if(key == 38 && d != "DOWN") d = "UP";
    else if(key == 39 && d != "LEFT") d = "RIGHT";
    else if(key == 40 && d != "UP") d = "DOWN";
}

// 4. MAIN GAME ENGINE
function drawSnake() {
    // A. Draw Background
    ctx.fillStyle = "#000"; // Black
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // B. Draw Snake
    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = (i == 0) ? "#4CAF50" : "white"; // Head is Green, Tail is White
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // C. Draw Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // D. Logic: Move Snake Head
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    // E. Logic: Eat Food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        // Generate new food
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        }
        // We don't remove the tail, so snake grows
    } else {
        // Remove the tail
        snake.pop();
    }

    // F. Logic: Game Over Rules
    // 1. Hit Wall
    // F. Logic: Game Over Rules
if(snakeX < 0 || snakeX > 19 * box || snakeY < 0 || snakeY > 19 * box || collision(snakeX, snakeY, snake)){
    clearInterval(gameInterval);

    // OLD CODE: alert("Game Over");
    // NEW CODE: Show Restart Button
    document.getElementById('btn-snake').style.display = 'inline-block';

    // Optional: Draw "Game Over" text on the canvas
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", 140, 200);
    return; 
}
    // G. Create new Head and add to front
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    snake.unshift(newHead);
    
    // H. Draw Score
    ctx.fillStyle = "white";
    ctx.font = "20px Courier New";
    ctx.fillText("Score: " + score, 10, 20);
}

// Helper: Check if snake hits itself
function collision(headX, headY, array){
    for(let i = 0; i < array.length; i++){
        if(headX == array[i].x && headY == array[i].y){
            return true;
        }
    }
    return false;
}
// ==========================================
// GAME 2: MEMORY MATCH LOGIC
// ==========================================

// ==========================================
// GAME 2: MEMORY MATCH LOGIC (Updated)
// ==========================================

const memoryBoard = document.getElementById('memory-board');

const cardsArray = [
    '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍓', '🍓',
    '🍒', '🍒', '🍍', '🍍', '🥝', '🥝', '🍉', '🍉'
];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchesFound = 0; // NEW: Track progress

function startMemory() {
    // Hide Restart Button initially
    document.getElementById('btn-memory').style.display = 'none';
    
    // Reset Variables
    matchesFound = 0;
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];

    // Clear and Shuffle
    memoryBoard.innerHTML = '';
    let shuffledCards = cardsArray.sort(() => 0.5 - Math.random());

    // Create Cards
    shuffledCards.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.name = item; 
        card.innerText = '?'; 
        card.addEventListener('click', flipCard);
        memoryBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    this.innerText = this.dataset.name;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // NEW LOGIC: Increment Match Counter
    matchesFound++;

    // CHECK WIN CONDITION (8 pairs total)
    if (matchesFound === 8) {
        setTimeout(() => {
            // Show Restart Button
            document.getElementById('btn-memory').style.display = 'inline-block';
            alert("You Won! Good memory!");
        }, 500);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        firstCard.innerText = '?';
        secondCard.innerText = '?';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}
// ==========================================
// GAME 3: DINO RUNNER LOGIC
// ==========================================

const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
let checkDeadInterval;

function startDino() {
    document.getElementById('btn-dino').style.display = 'none'; // HIDE BUTTON
    console.log("Dino Started");
    
    // Start the cactus moving
    cactus.classList.add("animate-cactus");
    
    // Enable Jumping
    document.addEventListener("keydown", jumpControl);
    document.addEventListener("click", jump); // Also jump on click

    // Start checking for collision constantly
    clearInterval(checkDeadInterval);
    checkDeadInterval = setInterval(checkCollision, 10);
}

function stopDino() {
    // Stop checking collision
    clearInterval(checkDeadInterval);
    
    // Stop movement
    cactus.classList.remove("animate-cactus");
    
    // Remove listeners
    document.removeEventListener("keydown", jumpControl);
}

function jumpControl(e) {
    // Only jump on Spacebar (Code 32) or Up Arrow (Code 38)
    if (e.keyCode === 32 || e.keyCode === 38) {
        jump();
    }
}

function jump() {
    // Only add class if not already jumping
    if (!dino.classList.contains("animate-jump")) {
        dino.classList.add("animate-jump");
        
        // Remove class after animation ends (500ms)
        setTimeout(function() {
            dino.classList.remove("animate-jump");
        }, 500);
    }
}

function checkCollision() {
    // 1. Get current vertical position of Dino (as a number)
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top")); // Value like "150px" -> 150

    // 2. Get current horizontal position of Cactus
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

    // 3. COLLISION MATH
    // If cactus is between 0 and 50px (touching dino's X zone)
    // AND Dino is not high enough in the air (top > 150 means he is near ground)
    
    // Note: 'top' is distance from top of screen.
    // Box height is 200. Dino height 50. Ground top is 150.
    // If top is 150, he is on ground. If top is 100, he is in air.
    
    if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
    stopDino();
    // OLD CODE: alert(...)
    // NEW CODE: Show Restart Button
    document.getElementById('btn-dino').style.display = 'inline-block';
}
}
// ==========================================
// GAME 4: TYPING DEFENSE LOGIC
// ==========================================

const wordArea = document.getElementById('word-area');
const typeInput = document.getElementById('type-input');

// The Dictionary
const words = [
    "html", "css", "script", "java", "node", "react", "angular",
    "vue", "python", "ruby", "cloud", "server", "data", "pixel",
    "canvas", "loop", "array", "object", "string", "browser"
];

let typingScore = 0;
let spawnerInterval;
let moverInterval;
let activeWords = []; // Tracks the HTML elements currently on screen

function startTyping() {
    document.getElementById('btn-typing').style.display = 'none'; // HIDE BUTTON
    console.log("Typing Game Started");
    
    // Reset
    wordArea.innerHTML = '';
    typeInput.value = '';
    activeWords = [];
    typingScore = 0;

    // Focus on the input box so user can type immediately
    typeInput.focus();

    // Listen for typing
    typeInput.addEventListener('input', checkInput);

    // 1. Start Spawning words every 2 seconds
    clearInterval(spawnerInterval);
    spawnerInterval = setInterval(spawnWord, 2000);

    // 2. Start Moving words every 50ms
    clearInterval(moverInterval);
    moverInterval = setInterval(moveWords, 50);
}

function stopTyping() {
    clearInterval(spawnerInterval);
    clearInterval(moverInterval);
    typeInput.removeEventListener('input', checkInput);
}

function spawnWord() {
    // Pick random word
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    // Create Element
    const wordDiv = document.createElement('div');
    wordDiv.classList.add('falling-word');
    wordDiv.innerText = randomWord;
    
    // Random Horizontal Position (0% to 80% so it doesn't overflow right)
    wordDiv.style.left = Math.floor(Math.random() * 80) + "%";
    wordDiv.style.top = "0px";

    wordArea.appendChild(wordDiv);
    activeWords.push(wordDiv);
}

function moveWords() {
    // Loop backwards so we can remove items safely
    for (let i = activeWords.length - 1; i >= 0; i--) {
        let wordDiv = activeWords[i];
        
        // Get current top value
        let currentTop = parseInt(wordDiv.style.top);
        
        // Move down by 2 pixels
        wordDiv.style.top = (currentTop + 2) + "px";

        // CHECK GAME OVER (If it hits the bottom: 330px)
        // CHECK GAME OVER
if (currentTop > 330) {
    stopTyping();
    // OLD CODE: alert(...)
    // NEW CODE: Show Restart Button
    document.getElementById('btn-typing').style.display = 'inline-block';
    return;
}
    }
}

function checkInput() {
    const typedValue = typeInput.value.trim().toLowerCase();

    // Check against all active words
    for (let i = 0; i < activeWords.length; i++) {
        if (activeWords[i].innerText === typedValue) {
            // MATCH FOUND!
            
            // 1. Remove from DOM
            activeWords[i].remove();
            
            // 2. Remove from Array
            activeWords.splice(i, 1);
            
            // 3. Clear Input
            typeInput.value = '';
            
            // 4. Increase Score (Visual flash)
            typingScore++;
            typeInput.style.borderColor = "#00ff00"; // Green flash
            setTimeout(() => typeInput.style.borderColor = "#e94560", 100);
            
            break; // Stop checking
        }
    }
}
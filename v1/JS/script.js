// A class for the audios
class AudioController {
    constructor() {
        // Assign audios into variables
        this.bgMusic = new Audio('../MEDIA/AUDIO/mlbb-bg1.mp3');
        this.flipSound = new Audio('../MEDIA/AUDIO/click.mp3');
        this.matchSound = new Audio('../MEDIA/AUDIO/match.mp3');
        this.victorySound = new Audio('../MEDIA/AUDIO/victory.mp3');
        
        // Add some audio properties
        this.bgMusic.volume = 0.3;
        this.matchSound.volume = 0.4;
        this.bgMusic.loop = true;
    }

    // create functions for the audio
        startMusic() {
            this.bgMusic.play();
        }
        stopMusic() {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
        flip() {
            this.flipSound.play();
        }
        match() {
            this.matchSound.play();
        }
        victory() {
            this.stopMusic();
            this.victorySound.play();
        }
}

// Main class for the game
class MemoryGame {

    constructor(totalTime, cards) {
        // Assign into variables
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeCount = totalTime;
        this.timer = document.getElementById('time')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }

    // Function when game starts
    startGame() {
        this.audioController.startMusic(); // Start bg music
        this.totalClicks = 0; // Counter for the total flips
        this.timeCount = this.totalTime; // Counter for the total time
        this.cardToCheck = null;
        this.matchedCards = []; // Array for the matched cards
        this.busy = true;
        setTimeout(() => { // A function as a first parameter and ms as a second parameter
            this.shuffleCards(this.cardsArray); // Shuffle cards
            this.timecount = this.startTime();
            this.busy = false;
        }, 500) // Wait before doing the function
        // Hide cards, reset time and flip count when starting the game
        this.hideCards();
        this.timer.innerText = this.timeCount;
        this.ticker.innerText = this.totalClicks;
    }

    // Function that shuffle the cards
    shuffleCards(cardsArray) {
        // Fisher-Yates Shuffle Algorithm.
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }

    // Funtion for the time
    startTime() {
        return setInterval(() => {
            this.timeCount++; // Increment total time
            this.timer.innerText = this.timeCount; // Update time on the html
        }, 1000); // Calls the function every 1000 ms
    }

    // Function that checks if the user can flip a card 
    canFlipCard(card) {
        // when it is busy/it is already a matched card/the card is a card to check
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }

    // A function use when flipping the cards
    flipCard(card) {
      console.log(card + ' was clicked');
        if(this.canFlipCard(card)) { // If the card can be flipped
            this.audioController.flip(); // Play this audio
            this.totalClicks++; // Increment flips counter
            this.ticker.innerText = this.totalClicks; //Updating the flips on the html
            card.classList.add('visible'); // Make the front of the card visible

            if(this.cardToCheck) { // If card to check is not null
                this.checkForCardMatch(card); // then call this function
            } else {
                this.cardToCheck = card; // Else, card flipped is a card to check
            }
        }
    }

    // Get card source attribute then return it
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    // A function that checks if cards match
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)) // If cards have the same src attribute
            this.cardMatch(card, this.cardToCheck); // then call this function
        else 
            this.cardMismatch(card, this.cardToCheck); // Else, call this function

        this.cardToCheck = null; // Card to check become null
    }

    // A function if cards match
    cardMatch(card1, card2) {
        this.matchedCards.push(card1); // Add card1 to the array of matched cards
        this.matchedCards.push(card2); // Add card2 to the array of matched cards
        card1.classList.add('matched'); // Add 'matched' class to the cards
        card2.classList.add('matched'); // Add 'matched' class to the cards
        this.audioController.match(); // Play this sfx
        if(this.matchedCards.length === this.cardsArray.length) // If all cards are matched
            this.victory(); // then, call this function
    }

    // A function if cards mismatch
    cardMismatch(card1, card2) {
        this.busy = true; // Prevent users to flip a card
        setTimeout(() => {
            // Remove visibility of the mismatched cards
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false; // then, allow users to flip a card
        }, 1000); // Wait before doing the function
    }

    // Function when the user matches all the cards
    victory() {
        clearInterval(this.timecount); // Stop the timer
        this.audioController.victory(); // Play victory sfx
        document.getElementById('victory').classList.add('visible'); // Make the victory overlay visible
        // Add user's result
        document.getElementById('p1').innerHTML = 'Congratulations! You did it in '+ this.totalClicks+ ' flips'  + ' and ' + this.timeCount + ' seconds.';
    }

    // A function that hides all the cards
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
}

// Wait for the page to load before running the code
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// A function when the page is already loaded
function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay')); // Make an array for the overlay collection
    let cards = Array.from(document.getElementsByClassName('card')); // Make an array for the card collection
    let game = new MemoryGame(0, cards);
    console.log("cards: ", cards);

    // Add an action in which the overlay will be removed when the user click anywhere on the page
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame(); // then, call this function
        });
    });

    // When a card has been clicked
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card); // call this function
        });
    });
}
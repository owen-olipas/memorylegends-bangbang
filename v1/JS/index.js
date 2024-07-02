// A class for the audios
class AudioController {
    constructor() {
        // Assign audios into variables
        this.bgMusic = new Audio('MEDIA/AUDIO/mlbb-bg_index.mp3');
        this.click = new Audio('MEDIA/AUDIO/click.mp3');

        // Add some audio properties
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }

    // create functions for the audio
        startMusic() {
            this.bgMusic.play();
        }
        flip() {
            this.click.play();
        }
}

class MemoryGame{

    constructor() {
        // Assign into variables
        this.audioController = new AudioController();
    }

    // Function when game starts
    startGame() {
        this.audioController.startMusic(); // Start bg music
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
    let game = new MemoryGame();

    // Add an action in which the overlay will be removed when the user click anywhere on the page
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame(); // then, call this function
        });
    });
}
import { Component, OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AudioControllerService } from '../services/audio-controller.service';

@Component({
  selector: 'app-card-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
  rows: number = 2;
  columns: number = 2;
  cards: any[] = [];
  cardsValues: any[] = [];
  private totalClicks: number = 0;
  private totalTime: number = 0;
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private timerInterval: any;
  private cardToCheck: any = null;
  private matchedCards: any[] = [];
  private busy: boolean = false;
  private timer: any;
  private ticker: any;

  constructor(
    private route: ActivatedRoute,
    private audioController: AudioControllerService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.rows = +params['rows'] || 2;
      this.columns = +params['columns'] || 2;
      this.initializeCards();
      this.timer = this.el.nativeElement.querySelector('#time');
      this.ticker = this.el.nativeElement.querySelector('#flips');
      const container = this.el.nativeElement.querySelector('.container');
      if (container) {
        const gridTemplateColumns = `repeat(${this.columns}, auto)`;
        this.renderer.setStyle(container, 'grid-template-columns', gridTemplateColumns);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setCardListeners();
    this.setOverlayListeners();
  }

  setCardListeners(): void {
    const container = this.el.nativeElement.querySelector('.container');
    if (container) {
      const cards = container.getElementsByClassName('card');
      this.cards = Array.from(cards);
      console.log("cards: ", this.cards);

      // When a card has been clicked
      this.cards.forEach(card => {
        card.addEventListener('click', () => {
          this.flipCard(card); // call this function
        });
      });
    }
  }

  setOverlayListeners(): void {
    const overlays = Array.from(document.getElementsByClassName('overlay'));
    overlays.forEach(overlay => {
      overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
        this.startGame(); // Call Angular's startGame method
      });
    });
    console.log(overlays);
  }

  initializeCards(): void {
    const cardNames = [
      'alpha', 'alpha', 'alucard', 'alucard', 'bane', 'bane', 'claude', 'claude',
      'fanny', 'fanny', 'franco', 'franco', 'freya', 'freya', 'gatot', 'gatot',
      'granger', 'granger', 'guinevere', 'guinevere', 'gusion', 'gusion', 'hanzo', 'hanzo',
      'harith', 'harith', 'hayabusa', 'hayabusa', 'kagura', 'kagura', 'karina', 'karina',
      'karrie', 'karrie', 'lancelot', 'lancelot', 'layla', 'layla', 'leomord', 'leomord',
      'leslie', 'leslie', 'zilong', 'zilong', 'martis', 'martis', 'minotaur', 'minotaur',
      'miya', 'miya', 'natalia', 'natalia', 'roger', 'roger', 'saber', 'saber',
      'sun', 'sun', 'tigreal', 'tigreal', 'xborg', 'xborg', 'zhask', 'zhask'
    ];

    this.cardsValues = cardNames.map(card => ({
      name: card,
      image: `../../assets/images/${card}.png`,
      visible: false,
      matched: false
    })).slice(0, this.rows * this.columns);
  }

  startGame(): void {
    this.audioController.startMusic2();
    this.totalClicks = 0;
    this.startTime = Date.now();
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;

    setTimeout(() => {
      this.shuffleCards();
      this.busy = false;
      this.startTimer();
    }, 500);
    // Hide cards, reset time and flip count when starting the game
    this.hideCards();
    this.updateTimerAndTicker();
  }

  shuffleCards(): void {
    for (let i = this.cardsValues.length - 1; i > 0; i--) {
      const randIndex = Math.floor(Math.random() * (i + 1));
      [this.cardsValues[i], this.cardsValues[randIndex]] = [this.cardsValues[randIndex], this.cardsValues[i]];
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.updateTimerAndTicker();
    }, 100); // Update every 100 milliseconds for more precise timing
  }

  updateTimerAndTicker(): void {
    if (this.timer) {
      this.timer.innerText = (this.elapsedTime / 1000).toFixed(3); // Display time in seconds with milliseconds
    }
    if (this.ticker) {
      this.ticker.innerText = this.totalClicks.toString();
    }
  }

  canFlipCard(card: any): boolean {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }

  flipCard(card: any): void {
    console.log(card + ' was clicked');
    console.log(this.canFlipCard(card));

    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++; // Increment flips counter
      this.ticker.innerText = this.totalClicks.toString(); //Updating the flips on the html
      card.classList.add('visible'); // Make the front of the card visible

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  getCardType(card: any): string {
    return card.getElementsByClassName('card-value')[0].src;
  }

  checkForCardMatch(card: any): void {
    console.log("card1", this.getCardType(card));
    console.log("card2", this.getCardType(this.cardToCheck));
    console.log("match ba?", this.getCardType(card) === this.getCardType(this.cardToCheck));

    if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.cardMismatch(card, this.cardToCheck);
    }

    this.cardToCheck = null;
  }

  cardMatch(card1: any, card2: any): void {
    this.matchedCards.push(card1, card2);
    card1.matched = true;
    card2.matched = true;
    card1.classList.add('matched'); // Add 'matched' class to the cards
    card2.classList.add('matched'); // Add 'matched' class to the cards
    this.audioController.match();

    if (this.matchedCards.length === this.cards.length) {
      this.victory();
    }
  }

  cardMismatch(card1: any, card2: any): void {
    this.busy = true;

    setTimeout(() => {
      card1.visible = false;
      card2.visible = false;
      // Remove visibility of the mismatched cards
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    }, 1000);
  }

  victory(): void {
    clearInterval(this.timerInterval); // Stop the timer
    this.audioController.victory();
    document.getElementById('victory')?.classList.add('visible'); // Make the victory overlay visible
    // Add user's result
    const p1Element = document.getElementById('p1');
    if (p1Element) {
        p1Element.innerHTML = `Congratulations! You did it in ${this.totalClicks} flips and ${(this.elapsedTime / 1000).toFixed(3)} seconds.`;
    }
  }

  hideCards(): void {
    this.cards.forEach(card => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    });
  }

  rowsArray(): number[] {
    return Array(this.rows).fill(0);
  }

  columnsArray(): number[] {
    return Array(this.columns).fill(0);
  }

  onScreenClick(): void {
    this.audioController.flip();
  }

  stopMusic2(): void {
    this.audioController.stopMusic2();
    this.audioController.stopVictory();
  }
}

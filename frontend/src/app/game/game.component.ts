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
  private timeCount: any;
  private timecount: any;
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
    this.timeCount = this.totalTime; // Counter for the total time
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;

    setTimeout(() => {
      this.shuffleCards();
      this.busy = false;
      this.timecount = this.startTime();
    }, 500);
    // Hide cards, reset time and flip count when starting the game
    this.hideCards();
    this.timer.innerText = this.timeCount;
    this.ticker.innerText = this.totalClicks;
  }

  shuffleCards(): void {
    for (let i = this.cardsValues.length - 1; i > 0; i--) {
      const randIndex = Math.floor(Math.random() * (i + 1));
      [this.cardsValues[i], this.cardsValues[randIndex]] = [this.cardsValues[randIndex], this.cardsValues[i]];
    }
  }

  startTime() {
    return setInterval(() => {
        this.timeCount++; // Increment total time
        this.timer.innerText = this.timeCount; // Update time on the html
    }, 1000); // Calls the function every 1000 ms
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
      this.ticker.innerText = this.totalClicks; //Updating the flips on the html
      card.classList.add('visible'); // Make the front of the card visible

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  getCardType(card: any): void {
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
    clearInterval(this.timecount); // Stop the timer
    this.audioController.victory();
    document.getElementById('victory')?.classList.add('visible'); // Make the victory overlay visible
    // Add user's result
    const p1Element = document.getElementById('p1');
    if (p1Element) {
        p1Element.innerHTML = 'Congratulations! You did it in '+ this.totalClicks+ ' flips'  + ' and ' + this.timeCount + ' seconds.';
    }
  }

  hideCards() {
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
}

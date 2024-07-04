import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AudioControllerService } from '../services/audio-controller.service';

@Component({
  selector: 'app-card-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  rows: number = 2;
  columns: number = 2;
  cards: any[] = [];
  private totalClicks: number = 0;
  private totalTime: number = 0;
  private timerInterval: any;
  private cardToCheck: any = null;
  private matchedCards: any[] = [];
  private busy: boolean = false;

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
      const container = this.el.nativeElement.querySelector('.container');
      if (container) {
        const gridTemplateColumns = `repeat(${this.columns}, auto)`;
        this.renderer.setStyle(container, 'grid-template-columns', gridTemplateColumns);
      }
    });
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

    this.cards = cardNames.map(card => ({
      name: card,
      image: `../../assets/images/${card}.png`,
      visible: false,
      matched: false
    })).slice(0, this.rows * this.columns);
    console.log(this.cards);

    this.shuffleCards();
  }

  shuffleCards(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const randIndex = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[randIndex]] = [this.cards[randIndex], this.cards[i]];
    }
  }

  startGame(): void {
    this.audioController.startMusic();
    this.totalClicks = 0;
    this.totalTime = 0;
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;

    setTimeout(() => {
      this.shuffleCards();
      this.busy = false;
      this.startTimer();
    }, 500);
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.totalTime++;
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.timerInterval);
  }

  flipCard(card: any): void {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      card.visible = true;
      this.totalClicks++;

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  canFlipCard(card: any): boolean {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }

  checkForCardMatch(card: any): void {
    if (card.name === this.cardToCheck.name) {
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
      this.busy = false;
    }, 1000);
  }

  victory(): void {
    this.stopTimer();
    this.audioController.victory();
    // Show victory message in your Angular template
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

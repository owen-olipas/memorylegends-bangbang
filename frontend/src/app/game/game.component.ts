import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  rows: number = 2;
  columns: number = 2;
  cards: string[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.rows = +params['rows'] || 2; // Default to 2 if parameter not provided
      this.columns = +params['columns'] || 2; // Default to 2 if parameter not provided

      // Initialize cards with image paths
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

      this.cards = cardNames.map(card => `../../assets/images/${card}.png`);

      // Ensure the number of cards matches rows * columns
      this.cards = this.cards.slice(0, this.rows * this.columns);

      // You can add more initialization logic here, like shuffling cards
    });
  }

  rowsArray(): number[] {
    return Array(this.rows).fill(0);
  }

  columnsArray(): number[] {
    return Array(this.columns).fill(0);
  }

}

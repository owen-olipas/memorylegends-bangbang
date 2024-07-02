import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioControllerService } from '../services/audio-controller.service'; // Adjust path as necessary

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  gameConfigs = [
    { name: 'WARRIOR', rows: 2, columns: 2 },
    { name: 'MASTER', rows: 4, columns: 4 },
    { name: 'EPIC', rows: 6, columns: 6 },
    { name: 'MYTHIC', rows: 8, columns: 8 }
    // Add more configurations as needed
  ];

  constructor(
    private router: Router,
    private audioController: AudioControllerService
  ) { }

  ngOnInit(): void {
    // Wait for the page to load before running the code
    const overlays = Array.from(document.getElementsByClassName('overlay'));
    overlays.forEach(overlay => {
      overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
        this.startGame(); // Call Angular's startGame method
      });
    });
  }

  startGame(): void {
    this.audioController.startMusic(); // Start background music
  }

  onScreenClick() {
    this.audioController.flip(); // Call flip() when screen is clicked
  }

  navigateToGame(rows: number, columns: number): void {
    this.router.navigate(['/game'], { queryParams: { rows, columns } });
  }
}

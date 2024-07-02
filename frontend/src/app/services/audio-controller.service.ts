import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioControllerService {
  private bgMusic: HTMLAudioElement;
  private click: HTMLAudioElement;

  constructor() {
    this.bgMusic = new Audio('../../assets/audio/mlbb-bg_index.mp3');
    this.click = new Audio('../../assets/audio/click.mp3');

    this.bgMusic.volume = 0.3;
    this.bgMusic.loop = true;
  }

  startMusic() {
    this.bgMusic.play();
  }

  flip() {
    this.click.play();
  }
}

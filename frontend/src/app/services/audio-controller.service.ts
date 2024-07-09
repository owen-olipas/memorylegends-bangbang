import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioControllerService {
  private bgMusic: HTMLAudioElement;
  private bgMusic2: HTMLAudioElement;
  private click: HTMLAudioElement;
  private matchSound: HTMLAudioElement;
  private victorySound: HTMLAudioElement;

  constructor() {
    this.bgMusic = new Audio('../../assets/audio/mlbb-bg_index.mp3');
    this.bgMusic2 = new Audio('../../assets/audio/mlbb-bg1.mp3');
    this.click = new Audio('../../assets/audio/click.mp3');
    this.matchSound = new Audio('../../assets/audio/match.mp3');
    this.victorySound = new Audio('../../assets/audio/victory.mp3');

    this.bgMusic.volume = 0.3;
    this.bgMusic.loop = true;

    this.matchSound.volume = 0.4;
  }

  startMusic() {
    this.bgMusic.play();
  }

  startMusic2() {
    this.bgMusic2.play();
  }

  stopMusic() {
    this.bgMusic.pause();
  }

  stopMusic2() {
    this.bgMusic2.pause();
  }

  getMusic2() {
    return this.bgMusic2;
  }

  getMusic() {
    return this.bgMusic;
  }

  resetMusic(music: HTMLAudioElement): void {
    music.currentTime = 0;
  }

  stopVictory() {
    this.victorySound.pause();
    this.victorySound.currentTime = 0;
  }
  flip() {
      this.click.play();
  }
  match() {
      this.matchSound.play();
  }
  victory() {
      this.stopMusic2();
      this.victorySound.play();
  }
}

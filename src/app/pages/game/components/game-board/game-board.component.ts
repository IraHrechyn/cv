import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { GeneralModel } from '../../types/general-model';
import { FoodService } from '../../services/food.service';
import { SnakeService } from '../../services/snake.service';
import { InputService } from '../../services/input.service';
import { ObstaclesService } from '../../services/obstacles.service';
import { TimerService } from '../../services/timer.service';
import { AppConstants } from '../../types/constants';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})

export class GameBoardComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public readonly m: GeneralModel,
    private readonly food: FoodService,
    private readonly snake: SnakeService,
    private readonly input: InputService,
    private readonly obstacles: ObstaclesService,
    private readonly timer: TimerService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.m.widthScreen = event.target.innerWidth;
    this.m.setGridSize();
  }

  ngOnInit(): void {
    this.m.modalVisible = true;
    this.m.widthScreen = window.innerWidth;
    this.m.setGridSize();
  }

  ngOnDestroy(): void {
    this.m.timerSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.m.gameBoard = document.querySelector(
      AppConstants.containerSelector
    ) as HTMLDivElement;
    if (!this.m.gameBoard) {
      throw new Error(
        `Can't find container with selector "${AppConstants.containerSelector}"`
      );
    }

    document.addEventListener('keydown', (event: KeyboardEvent): void => {
      if (event.code === AppConstants.keyToDirection['Space']) this.togglePause();
      if (event.code === AppConstants.keyToDirection['KeyR']) this.m.restart();
    });

    this.start(performance.now());
  }

  private start(currentTime: number): void {
    if (this.m.isPaused) return;
    window.requestAnimationFrame(this.start.bind(this));
    const secondsSinceLastRender: number =
      (currentTime - this.m.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / this.m.snakeSpeed) return;
    this.m.lastRenderTime = currentTime;
    this.update();
    if (!this.m.gameOver) this.draw();
  }

  private update(): void {
    this.snake.update();
    this.food.update();
    this.obstacles.update();
    this.checkDeath();
  }

  private draw(): void {
    this.m.gameBoard.innerHTML = '';
    this.snake.draw(this.m.gameBoard);
    this.food.draw(this.m.gameBoard);
    this.obstacles.draw(this.m.gameBoard);
  }

  private togglePause(): void {
    if (this.m.isPaused) {
      this.timer.resumeTimer();
      this.start(performance.now());
    } else this.timer.pauseTimer();
  }

  checkDeath(): void {
    if (!this.m.gameOver) return;
    if (this.m.soundOn) this.m.deathSound.play().then();
    this.m.gameBoard.classList.add(AppConstants.classBlur);
  }
}

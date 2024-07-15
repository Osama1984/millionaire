import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { GameService } from '../../services/game.service';
import { Question } from '../../interfaces/game';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-timer',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './sidebar-timer.component.html',
  styleUrls: ['./sidebar-timer.component.scss']
})
export class SidebarTimerComponent implements OnDestroy {
  timerValue: number = 120;
  @Output() end: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  question: Question | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private service: GameService) { }

  ngOnInit() {
    this.service.getCurrentQuestion().subscribe((data: Question | null) => {
      if (this.question !== data) {
        this.question = data;
        this.resetTimer();
        this.startTimer();
      }
    });
  }

  resetTimer() {
    this.timerValue = 120; // Reset to initial value
    if (this.subscription) {
      this.subscription.unsubscribe(); // Clean up the previous subscription
    }
  }

  startTimer() {
    const timer$ = interval(1000).pipe(take(this.timerValue));
    this.subscription = timer$.subscribe({
      next: () => this.timerValue -= 1,
      complete: () => this.service.setGameEnd()
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  formatTime(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
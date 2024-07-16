import { Component, OnInit } from '@angular/core';
import { interval, Subscription, take } from 'rxjs';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit{
  timerValue: number = 120;
  private subscription: Subscription = new Subscription();
  level:number=0
  constructor(private service:GameService) {
   }

  ngOnInit() {
    this.startTimer();
    this.service.getLevel().subscribe((data:number)=>{
      if(data!==this.level){
        this.timerValue=120;
      }
    })
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
      complete: () => {}
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

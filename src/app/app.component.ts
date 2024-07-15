import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Question } from './interfaces/game';
import { GameService } from './services/game.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainComponent } from './components/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  questions: Question[] = [];
  title = 'millionaire';
  gameStarted = false;
  gameEnded = false;
  score!:number;
  private gameEndSubscription: Subscription | undefined;

  constructor(private service: GameService) {}

  ngOnInit(): void {
    this.service.checkGameEnd().subscribe((data: boolean) => {
      if (data === true) {
        this.gameEnded = true;
        this.gameStarted = false;
        setTimeout(() => {
          this.gameEnded = false;
          this.restartGame();
        }, 5000);
      }
    });
    this.service.getScore().subscribe((data:number)=>{
      this.score=data
    })
  }

  Start(): void {
    this.gameStarted = true;
    this.service.getQuestions().subscribe((data: Question[]) => {
      this.questions = data;
    });
  }

  restartGame(): void {
    if (this.gameEndSubscription) {
      this.gameEndSubscription.unsubscribe(); // Unsubscribe to prevent multiple subscriptions
    }
    this.service.restartGame();
    this.questions = [];
  }
}
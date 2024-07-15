import { Component, OnInit } from '@angular/core';
import { Question } from '../../interfaces/game';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from '../question/question.component';
import { AnswersComponent } from '../answers/answers.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, QuestionComponent, AnswersComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  question: Question | null = null;
  level!:number;
  private subscription: Subscription | undefined;

  constructor(private service: GameService) {}

  ngOnInit(): void {
    this.service.getCurrentLevel().subscribe((data:number)=>{
      this.level=data;
      console.log(this.level);
    })
    setInterval(()=>{this.service.setCurrentQuestion(this.level)},3000);
    this.service.getCurrentQuestion();
      this.service.getCurrentQuestion().subscribe((data:Question|null)=>{
        this.question=data;
      })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
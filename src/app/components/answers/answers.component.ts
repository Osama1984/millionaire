import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../../interfaces/game';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-answers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit {
  @Input() question!: Question | null;
  answers: string[] = [];
  level = 0;

  constructor(private service: GameService) {}

  ngOnInit(): void {
    this.service.getCurrentQuestion().pipe(
      distinctUntilChanged((prev, curr) => prev?.question === curr?.question)
    ).subscribe((data: Question | null) => {
      if (data) {
        const incorrectAnswers = data.incorrect_answers ?? [];
        const correctAnswer = data.correct_answer ?? '';
        this.setAnswers([...incorrectAnswers, correctAnswer]);
      }
    });
  }

  setAnswers(answers: string[]): void {
    this.answers = this.shuffleAnswers(answers);
  }

  shuffleAnswers(answers: string[]): string[] {
    return answers.sort(() => Math.random() - 0.5);
  }

  selectAnswer(answer: string): void {
    if (answer === this.question?.correct_answer) {
      let score = 0;
      switch (this.level) {
        case 0:
          score = 100;
          break;
        case 1:
          score = 200;
          break;
        case 2:
          score = 300;
          break;
        case 3:
          score = 500;
          break;
        case 4:
          score = 1000;
          break;
        case 5:
          score = 2000;
          break;
        case 6:
          score = 4000;
          break;
        case 7:
          score = 8000;
          break;
        case 8:
          score = 16000;
          break;
        case 9:
          score = 32000;
          break;
        case 10:
          score = 64000;
          break;
        case 11:
          score = 125000;
          break;
        case 12:
          score = 250000;
          break;
        case 13:
          score = 500000;
          break;
        case 14:
          score = 1000000;
          break;
        default:
          score = 0;
      }
      this.service.updateScore(score);
      this.service.setCurrentLevel(this.level + 1);
    } else {
      this.service.setGameEnd();
    }
  }
}
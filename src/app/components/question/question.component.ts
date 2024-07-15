import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {HelpComponent } from '../help/help.component';
import { SidebarTimerComponent } from '../sidebar-timer/sidebar-timer.component';
import { Question } from '../../interfaces/game';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [HelpComponent, SidebarTimerComponent, CommonModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent implements OnInit {
  @Input() question!: Question|null;
  level!:number;
  constructor(private service:GameService){
  }
  ngOnInit(): void {
    this.service.getCurrentQuestion().subscribe((data: Question | null) => {
      if (data) {
        const incorrectAnswers = data.incorrect_answers ?? [];
        const correctAnswer = data.correct_answer ?? '';
        this.question = data;
      }
    });
  }
}

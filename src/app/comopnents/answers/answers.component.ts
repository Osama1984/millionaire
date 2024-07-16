import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit {
  answers!: String[];
  correct!: String;
  level!:Number;
 

  constructor(private service: GameService, private toastr:ToastrService) {}

  ngOnInit(): void {
    this.service.getAnswers().subscribe((data: String[]) => {
      this.answers = data;
    });
    this.service.getCorrectAnswer().subscribe((data) => {
      this.correct = data;
    });
    this.service.getLevel().subscribe((data:Number)=>{this.level=data})
  }

  checkAnswer(answer: String, correct:String) {
    if (answer === this.correct) {
      this.service.setLevel(+this.level+1);
    } else {
      this.service.setEndGame(true);
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { interval, Subscription, take } from 'rxjs';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent implements OnInit {
  question!:String
  constructor(private service:GameService){
  }
  ngOnInit(): void {
      this.service.getQuestion().subscribe((data:String)=>{
        this.question=data;
      })
  }
}

import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent implements OnInit {
  score!:number;
  constructor(private service:GameService){}
  ngOnInit(): void {
      this.service.getScore().subscribe((data:number)=>{
        this.score=data
      })
  }
}

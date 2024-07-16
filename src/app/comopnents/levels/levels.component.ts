import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.scss'
})
export class LevelsComponent implements OnInit {
  currentLevel!:Number
  levels = [
    { level: 0, prize: '$100' },
    { level: 1, prize: '$200' },
    { level: 2, prize: '$300' },
    { level: 3, prize: '$500' },
    { level: 4, prize: '$1,000' },
    { level: 5, prize: '$2,000' },
    { level: 6, prize: '$4,000' },
    { level: 7, prize: '$8,000' },
    { level: 8, prize: '$16,000' },
    { level: 9, prize: '$32,000' },
    { level: 10, prize: '$64,000' },
    { level: 11, prize: '$125,000' },
    { level: 12, prize: '$250,000' },
    { level: 13, prize: '$500,000' },
    { level: 14, prize: '$1,000,000' }
  ].reverse();

  constructor(private service:GameService){
  }
  ngOnInit(): void {
    this.service.getLevel().subscribe((data:number)=>{
      if(data===0){this.currentLevel=0}
      else{this.currentLevel=data;}
    })
  }

}

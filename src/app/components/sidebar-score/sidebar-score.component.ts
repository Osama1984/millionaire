import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { Question } from '../../interfaces/game';

@Component({
  selector: 'app-sidebar-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-score.component.html',
  styleUrl: './sidebar-score.component.scss'
})
export class SidebarScoreComponent implements OnInit {
  score:number=0;
  question!:Question|null;
  constructor(private service:GameService){}
  ngOnInit(): void {
      this.service.getScore().subscribe((data:number)=>{
        this.score=data
      })
      this.service.getCurrentQuestion().subscribe((data:Question|null)=>{
        setTimeout(()=>{this.question=data},1000);
      })
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MillionaireModuleModule } from './millionaire-module/millionaire-module.module';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MillionaireModuleModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'millionaire';
  protected start$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  module: MillionaireModuleModule = new MillionaireModuleModule();
  loading$: Observable<boolean>;

  constructor(private service: GameService) {
    this.loading$ = this.service.getLoading();
  }

  ngOnInit(): void {
    this.getStartValue().subscribe((data: boolean) => {
      if (data === true) {
        this.service.loadQuestions();
      }
    });
    this.service.getEndGame().subscribe((data: boolean) => {
      if (data === true) {
        this.start$.next(false);
      }
    });
  }

  startGame() {
    this.start$.next(true);
  }

  getStartValue(): Observable<boolean> {
    return this.start$.asObservable();
  }
}
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import { GameService } from '../../services/game.service';
import { Game, Question } from '../../interfaces/game';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { Chart, registerables  } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
@Component({
  selector: 'app-sidebar-help',
  standalone:true,
  imports:[CommonModule, BaseChartDirective,],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  @ViewChild('chartRef') private chartRef!: ElementRef;

  chart!: Chart;
  faPeople = faPeopleArrows;
  deleteAnswers: boolean = true;
  askPeople: boolean = true;
  question!: Question | null;
  votes: { [key: string]: number } = {};
  changeQuestion:boolean=true;
  displayChart:boolean = true;
  level!:number;
  // Chart properties
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartLegend = true;
  public barChartData: any[] = [
    { data: [], label: 'Votes' }
  ];

  constructor(private service: GameService, private http:HttpClient) { }

  ngOnInit(): void {
    this.service.getCurrentQuestion().subscribe((data: Question | null) => {
      this.question = data;
    });
    this.service.getCurrentLevel().subscribe((data:number)=>{
      this.level=data;
    });
  }

  deleteTwoAnswers() {
    this.service.deleteAnswers();
    this.deleteAnswers = false;
  }

  askPeopleVote() {
    this.generateVotes();
    this.createChart();
    this.askPeople = false;
    setTimeout(() => {
      this.displayChart=false;
    },6000);
    
  }

  generateVotes() {
    if (this.question) {
      const options = this.getQuestionOptions(this.question);
      this.votes = this.service.generateVotes(options);
      this.barChartLabels = ['1','2','3','4'];
      this.barChartData = [
        { data: Object.values(this.votes), label: 'Votes' }
      ];
      console.log(this.barChartData, this.barChartLabels);
    }
  }

  getQuestionOptions(question: Question): string[] {
    return [...question.incorrect_answers, question.correct_answer].filter(option => option !== undefined);
  }

  createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    Chart.register(...registerables)
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [...this.barChartLabels],
        datasets: [...this.barChartData]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  Change() {
   this.service.setCurrentQuestionFromHelpOption().subscribe((data:any)=>{console.log(data)});
   this.changeQuestion=false;
  }
}
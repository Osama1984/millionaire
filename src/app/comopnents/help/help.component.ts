import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Game } from '../../interfaces/game';
import { GameService } from '../../services/game.service';
import { Chart, registerables  } from 'chart.js';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent implements OnInit {
  @ViewChild('chartRef') private chartRef!: ElementRef;
  deleteAnswers: boolean = true;
  askPeople: boolean = true;
  changeQuestion:boolean=true;
  answers!:String[];
  votes: { [key: string]: number } = {};
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels: string[] = [];
  public barChartLegend = false;
  public barChartData: any[] = [
    { data: [], label: 'Votes' }
  ];
  displayChart:boolean = true;
  chart!: Chart;

  constructor(private service:GameService){}

  ngOnInit(): void {
      this.service.getAnswers().subscribe((data:String[])=>{
        this.answers=data;
      })
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

  generateVotes() {
    if (this.answers) {
      const options = this.answers;
      this.votes = this.service.generateVotes(options as string[]);
      this.barChartLabels = ['1','2','3','4'];
      this.barChartData = [
        { data: Object.values(this.votes), label: 'Votes' }
      ];
      console.log(this.barChartData, this.barChartLabels);
    }
  }
  changeTheQuestion(){
    this.service.changeTheQuestion();
  }
}

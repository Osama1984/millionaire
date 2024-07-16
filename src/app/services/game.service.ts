import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Game, Question } from '../interfaces/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private questions$ : BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  private answers$ : BehaviorSubject<String[]> = new BehaviorSubject<String[]>([]);
  private question$ : BehaviorSubject<String> = new BehaviorSubject<String>('');
  private correctAnswer$ : BehaviorSubject<String> = new BehaviorSubject<String>('');
  private level$ : BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private endGame$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loading$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private Scores:number[] = [0,100,200,300,500,1000,2000,4000,8000,16000,32000,64000,125000,250000,500000,1000000]
  private Score: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    return this.questions$.asObservable();
  }

  getAnswers(): Observable<String[]> {
    return this.answers$.asObservable();
  }

  getQuestion(): Observable<String> {
    return this.question$.asObservable();
  }

  getCorrectAnswer(): Observable<String> {
    return this.correctAnswer$.asObservable();
  }

  getEndGame(): Observable<boolean> {
    return this.endGame$.asObservable();
  }

  getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getScore(): Observable<number> {
    return this.Score.asObservable();
  }

  setEndGame(value: boolean): void {
    if (value) {
      this.endGame$.next(true);
      this.answers$.next(['']);
      this.question$.next('');
      this.correctAnswer$.next('');
      this.Score.next(0);
      this.level$.next(0);
    } else {
      this.endGame$.next(false);
    }
  }

  setQuestion(): void {
    const questions = this.questions$.getValue();
    const level = this.level$.getValue();
    if (questions.length > 0 && level < questions.length) {
      this.question$.next(questions[level].question);
    }
  }

  setAnswers(): void {
    const questions = this.questions$.getValue();
    const level = this.level$.getValue();
    if (questions.length > 0 && level < questions.length) {
      const currentQuestion = questions[level];
      const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);
      this.answers$.next(answers);
    }
  }

  setCorrectAnswer(): void {
    const questions = this.questions$.getValue();
    const level = this.level$.getValue();
    if (questions.length > 0 && level < questions.length) {
      this.correctAnswer$.next(questions[level].correct_answer);
    }
  }

  setLevel(level: number): void {
    if(level >= 15){
      this.setEndGame(true);
    } else {
      this.level$.next(level);
      this.setQuestion();
      this.setAnswers();
      this.setCorrectAnswer();
      this.Score.next(this.Scores[this.level$.value]);
    }
  }

  getLevel(): Observable<number> {
    return this.level$.asObservable();
  }

  loadQuestions(): void {
    this.loading$.next(true);
    this.http.get<Game>(`https://opentdb.com/api.php?amount=16&type=multiple`).pipe(
      delay(2000), // Delay for 2 seconds
      map(data => {
        this.questions$.next(data.results);
        this.setQuestion();
        this.setAnswers();
        this.setCorrectAnswer();
      }),
      finalize(() => {
        this.loading$.next(false);
      })
    ).subscribe();
  }

  deleteAnswers(): void {
    let answers = this.answers$.value;
    const correct = this.correctAnswer$.value;
    answers = answers.filter(answer => answer === correct || answers.indexOf(answer) !== answers.indexOf(correct));
    while (answers.length > 2) {
      const indexToRemove = answers.findIndex(answer => answer !== correct);
      if (indexToRemove !== -1) {
        answers.splice(indexToRemove, 1);
      } else {
        break;
      }
    }
  
    this.answers$.next(answers);
  }

  generateVotes(options: string[]): { [key: string]: number } {
    const votes: { [key: string]: number } = {};
    const totalVotes = 100; // Total percentage votes

    // Initialize votes for each option
    options.forEach(option => {
      votes[option] = 0;
    });

    // Distribute votes randomly
    for (let i = 0; i < totalVotes; i++) {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      votes[randomOption]++;
    }

    return votes;
  }

  changeTheQuestion(): void {
    const questions = this.questions$.getValue();
    const currentLevel = this.level$.getValue();
  
    if (questions.length > 0 && currentLevel < questions.length) {
      const lastQuestionIndex = questions.length - 1;
      console.log(lastQuestionIndex);
      // Set the question, answers, and correct answer to the last question
      this.question$.next(questions[lastQuestionIndex].question);
      const lastQuestion = questions[lastQuestionIndex];
      const answers = [...lastQuestion.incorrect_answers, lastQuestion.correct_answer].sort(() => Math.random() - 0.5);
      this.answers$.next(answers);
      this.correctAnswer$.next(lastQuestion.correct_answer);
    }
  }
}
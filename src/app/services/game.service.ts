import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of, concat } from 'rxjs';
import { delay, tap, catchError, retryWhen, mergeMap, map, take } from 'rxjs/operators';
import { Game, Question } from '../interfaces/game';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private questions: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  private currentLevel: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private currentQuestion: BehaviorSubject<Question|null> = new BehaviorSubject<Question|null>(null);
  private gameEnded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private score: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  
  constructor(private http: HttpClient) { }

  restartGame(): void {
    this.questions.next([]);
    this.currentLevel.next(0);
    this.currentQuestion.next(null);
    this.gameEnded.next(false);
    this.score.next(0); // Reset score
  }

  private prepareQuestions(): void {
    const easyQuestions$ = this.fetchQuestions('easy', 0);
    const mediumQuestions$ = this.fetchQuestions('medium', 1000);
    const hardQuestions$ = this.fetchQuestions('hard', 1000);

    concat(easyQuestions$, mediumQuestions$, hardQuestions$).subscribe();
  }

  private fetchQuestions(difficulty: string, delayTime: number): Observable<Game> {
    return this.http.get<Game>(`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`).pipe(
      delay(delayTime), // Delay before fetching
      tap(data => this.addQuestions(data.results)),
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse) => {
            if (error.status === 429) {
              console.warn(`Rate limit exceeded. Retrying after delay.`);
              return of(error).pipe(delay(10000)); // Retry after 10 seconds
            }
            return throwError(() => error);
          })
        )
      ),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('HTTP Error:', error.message);
    return throwError(() => new Error(error.message));
  }

  private addQuestions(newQuestions: Question[]): void {
    const currentQuestions = this.questions.value;
    this.questions.next([...currentQuestions, ...newQuestions]);
  }

  getQuestions(): Observable<Question[]> {
    this.prepareQuestions();
    return this.questions.asObservable();
  }

  getCurrentLevel(): Observable<number> {
    return this.currentLevel.asObservable();
  }

  checkGameEnd(): Observable<boolean> {
    return this.gameEnded.asObservable();
  }

  getCurrentQuestion(): Observable<Question|null> {
    return this.currentQuestion.asObservable();
  }

  setCurrentLevel(level: number): void {
    if (level <= this.questions.value.length - 1 && this.questions.value.length === 15) {
      this.currentLevel.next(level);
      this.setCurrentQuestion(level);
    } else if (this.questions.value.length < 15) {
      setTimeout(() => {
        this.currentLevel.next(level);
        this.setCurrentQuestion(level);
      }, 2000);
    }
    if (level > 14) {
      this.gameEnded.next(true);
    }
  }

  setCurrentQuestion(level: number): void {
    const questions = this.questions.value;
    if (questions.length > 0 && level < questions.length) {
      this.currentQuestion.next(questions[level]);
    } else {
      this.currentQuestion.next(null);
    }
  }

  setGameEnd(): void {
    this.gameEnded.next(true);
  }

  updateScore(score:number): void {
    const currentScore =score;
    this.score.next(currentScore);
  }

  getScore(): Observable<number> {
    return this.score.asObservable();
  }

  deleteAnswers(): void {
    let question = this.currentQuestion.value;
    
    if (question && question.incorrect_answers.length >= 2) {
      const indicesToRemove = this.getTwoRandomIndices(question.incorrect_answers.length);
      question.incorrect_answers = question.incorrect_answers.filter((_, index) => {
        return !indicesToRemove.includes(index);
      });
      this.currentQuestion.next(question);
    }
  }
  
  // Utility function to get two unique random indices
  private getTwoRandomIndices(max: number): number[] {
    const indices = new Set<number>();
    
    while (indices.size < 2) {
      const randomIndex = Math.floor(Math.random() * max);
      indices.add(randomIndex);
    }
    
    return Array.from(indices);
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

  
  setCurrentQuestionFromHelpOption() {
    return this.http.get<Game>('https://opentdb.com/api.php?amount=1&type=multiple').pipe(
      take(1), // Take only the first emitted value (complete after one emission)
      map((data: Game) => {
        if (data.results && data.results.length > 0) {
          this.currentQuestion.next(data.results[0]);
          return data.results[0]; // Return the current question
        }
        return null; // Return null if no results or results are empty
      })
    );
  }
}
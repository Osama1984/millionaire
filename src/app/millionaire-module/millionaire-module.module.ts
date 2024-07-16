import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AnswersComponent } from '../comopnents/answers/answers.component';
import { HelpComponent } from '../comopnents/help/help.component';
import { LevelsComponent } from '../comopnents/levels/levels.component';
import { ScoreComponent } from '../comopnents/score/score.component';
import { TimerComponent } from '../comopnents/timer/timer.component';
import { MainComponent } from '../comopnents/main/main.component';
import { QuestionComponent } from '../comopnents/question/question.component';

@NgModule({
  declarations: [
    MainComponent,
    QuestionComponent,
    AnswersComponent,
    HelpComponent,
    LevelsComponent,
    ScoreComponent,
    TimerComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    QuestionComponent,
    MainComponent,
    AnswersComponent,
    HelpComponent,
    LevelsComponent,
    ScoreComponent,
    TimerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MillionaireModuleModule { }
import { Routes } from '@angular/router';
import { MainComponent } from './comopnents/main/main.component';

export const routes: Routes = [
    {path:'', redirectTo:'main', pathMatch:'prefix'},
    {path:'main', component:MainComponent}
];

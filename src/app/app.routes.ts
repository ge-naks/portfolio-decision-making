import { Routes } from '@angular/router';
import { SignUpComponent, AgreementDialog } from './components/sign-up/sign-up.component';
import { QuestionComponent } from './components/question/question.component';
import { ChartComponent } from './components/chart/chart.component';

export const routes: Routes = [
    {path: '', component: SignUpComponent},
    {path: 'question', component: QuestionComponent}
];



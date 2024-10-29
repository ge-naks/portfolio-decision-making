import { Routes } from '@angular/router';
import { SignUpComponent, AgreementDialog } from './components/sign-up/sign-up.component';
import { QuestionComponent } from './components/question/question.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { SubmissionPageComponent } from './components/submission-page/submission-page.component';


export const routes: Routes = [
    {path: '', component: SignUpComponent},
    {path: 'question', component: QuestionComponent},
    {path: 'sandbox', component: SandboxComponent},
    {path: 'submit', component: SubmissionPageComponent }
];









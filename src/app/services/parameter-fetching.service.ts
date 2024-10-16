import { Injectable } from '@angular/core';
import { QuestionParameters } from '../models/question-parameters.model';

@Injectable({
    providedIn: 'root'
})
export class ParameterFetchingService {
    private questionList: QuestionParameters[] = []

    // backend call, will populate all needed questions
    setQuestions(): void{
        
    }
}
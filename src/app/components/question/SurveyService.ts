import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private surveyResponse: SurveyResponse = {
    responses: {}
  };

  getSurveyResponse() {
    return this.surveyResponse;
  }

  updateSurveyResponse(questionId: number, B_choices: number[]) {
    this.surveyResponse.responses[questionId] = { B_choices };
  }
}

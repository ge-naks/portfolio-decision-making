interface SurveyResponse {
    fName?: string;
    lName?: string;
    netID?: string;
    DOB?: Date
    responses: {
      [questionId: number]: {
        B_choices: number[]
      };
    };
  }
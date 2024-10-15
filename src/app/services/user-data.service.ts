import { Injectable } from '@angular/core';
import { UserData } from '../models/user-data.model';
import { UserParameters } from '../models/user-parameters.model';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private userData: UserData = {
    fName: '',
    lName: '',
    netID: '',
    DOB: new Date(),
    parameter_responses: [],
  };

  // mass set
  setUserData(data: UserData): void {
    this.userData = data;
  }

  // return all data
  getUserData(): UserData {
    return this.userData;
  }

  // set specific field
  updateUserData(key: keyof UserData, value: any): void {
    this.userData[key] = value;
  }

  // Add a new UserParameters entry to parameter_responses
  addUserParameter(parameters: UserParameters): void {
    this.userData.parameter_responses.push(parameters);
  }
}

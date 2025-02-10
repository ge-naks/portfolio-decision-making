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

  setUserData(data: UserData): void {
    this.userData = data;
  }

  getUserData(): UserData {
    return this.userData;
  }

  updateUserData(key: keyof UserData, value: any): void {
    this.userData[key] = value;
  }

  addUserParameter(parameters: UserParameters): void {
    this.userData.parameter_responses.push(parameters);
  }
}

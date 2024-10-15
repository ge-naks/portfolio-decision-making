import { UserParameters } from "./user-parameters.model";

export interface UserData{
    fName: string;
    lName: string;
    netID: string;
    DOB: Date;
    
    parameter_responses: UserParameters[]

}
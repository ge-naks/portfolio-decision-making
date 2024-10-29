// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../environments/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { Injectable } from '@angular/core';
import { UserData } from '../models/user-data.model';


@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(this.app);
  db = getFirestore(this.app);

  async postUserData(
    userData: UserData
  ) {
    try {
      const docRef = await addDoc(collection(this.db, 'users'), {
        fName: userData.fName,
        lName: userData.lName,
        netID: userData.netID,
        DOB: userData.DOB,
        parameter_responses: userData.parameter_responses,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
}

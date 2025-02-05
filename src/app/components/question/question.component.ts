import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserDataService } from '../../services/user-data.service';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { UserParameters } from '../../models/user-parameters.model';
import { QuestionParameters } from '../../models/question-parameters.model';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service';


@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCheckboxModule,
    ChartComponent,
    CommonModule,
    HttpClientModule,
  ],
  providers: [],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class QuestionComponent implements OnInit {
  constructor(
    private userDataService: UserDataService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private firebase: FirebaseService
  ) {}

  questions: QuestionParameters[] = [];

  question_id: string = '';
  currB: number | null = null;
  entered_B: number[] = [];
  harvests_str: string[] = [];
  harvests_num: number[] = [];
  avg_harvest = 0;
  max_harvest = 0;
  times: number[] = [];
  wealth: number[] = [];
  harvest: number = 0;
  math = Math;
  run = 0;
  currentQuestionIndex: number = 0;

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
  }

  loadCurrentQuestion() {
    this.wealth = [];
    this.times = [];
  }

  async loadQuestions(): Promise<void> {
    const response = await fetch('assets/survey-parameters.json');
    const jsonData = await response.json();

    this.questions = jsonData.questions;
    this.questions = this.shuffleArray(this.questions);
  }

  generateTime(delta_T: number, iterations: number): number[] {
    let times = [];
    for (let i = 0; i < Number(iterations / delta_T); i++) {
      times[i] = i;
    }
    return times;
  }

  gaussianRandom(mean: number, stdev: number) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdev + mean;
  }

  simulateWealth(
    delta_T: number,
    iterations: number,
    initialWealth: number,
    a: number,
    b: number,
    entered_B: number
  ) {
    let harvest = 0;
    let wealth = Array<number>(iterations / delta_T).fill(0);
    wealth[0] = initialWealth;
    for (let i = 1; i < iterations / delta_T; i++) {
      let noise = this.gaussianRandom(0, Math.sqrt(delta_T));
      let delta_W = delta_T * a + b * noise;
      wealth[i] = wealth[i - 1] + delta_W;
      if (wealth[i] < 0) {
        wealth[i] = 0;
        break;
      }
      if (wealth[i] > entered_B) {
        harvest += wealth[i] - entered_B;
        wealth[i] = entered_B;
      }
    }

    this.harvest = harvest;

    this.harvests_str.push(this.harvest.toFixed(2));
    this.harvests_num.push(this.harvest);
    this.entered_B.push(this.currB!);
    this.max_harvest = this.math.max(...this.harvests_num);
    const sum = this.harvests_num.reduce((a, b) => a + b, 0);
    this.avg_harvest = sum / this.harvests_num.length || 0;
    this.run += 1;

    return wealth;
  }

  runSim(
    delta_T: number = 0.01,
    iterations: number = 100,
    initialWealth: number = 1,
    a: number = 1,
    b: number = 1
  ): void {
    let B_star = this.currB!;

    this.times = this.generateTime(delta_T, iterations);
    this.wealth = this.simulateWealth(
      delta_T,
      iterations,
      initialWealth,
      a,
      b,
      B_star
    );
  }

  async ngOnInit(): Promise<void> {
    await this.loadQuestions();
    console.log(this.questions);
  }

  filledB() {
    return this.currB && this.run < 5;
  }

  nextQuestionReady() {
    return this.run >= 5;
  }

  nextQuestion() {
    const params: UserParameters = {
      question_id: this.questions[this.currentQuestionIndex].question_id,
      entered_B: [...this.entered_B], // Save a copy of entered_B
      harvests: [...this.harvests_num], // Save a copy of harvests_num
      avg_harvest: this.avg_harvest,
      max_harvest: this.max_harvest,
    };

    this.userDataService.addUserParameter(params);
    console.log(this.userDataService.getUserData());
    this.currB = null;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.loadCurrentQuestion();
      this.run = 0;
      this.avg_harvest = 0;
      this.max_harvest = 0;
      this.harvest = 0;
      this.harvests_num = [];
      this.harvests_str = [];
      this.entered_B = [];
      this.currB = null;
    } else {
      console.log('No more questions.');
      this.navigateEnd();
    }
  }

  buttonTag() {
    if (this.currentQuestionIndex == this.questions.length - 1) {
      return 'Submit';
    }
    return 'Next Question';
  }

  navigateEnd() {
    console.log(this.userDataService.getUserData());
    this.firebase.postUserData(this.userDataService.getUserData())
    this.router.navigate(['/submit']);
  }
}

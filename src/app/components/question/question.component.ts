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
    HttpClientModule
  ],
  providers: [
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})

export class QuestionComponent implements OnInit {
  constructor(private userDataService: UserDataService, private cdRef: ChangeDetectorRef, private http: HttpClient) {}

  questions: QuestionParameters[] = []


  question_id: string = '';
  currB = null;
  entered_B: number[] = [];
  drawdowns_str: string[] = []
  drawdowns_num: number[] = []
  avg_drawdown = 0;
  max_drawdown = 0;
  times: number[] = [];
  wealth: number[] = [];
  drawdown: number = 0;
  flag: boolean = false;
  math = Math;
  run = 0
  currentQuestionIndex: number = 0;
  
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  loadCurrentQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    if (question) {
      this.question_id = question.question_id;
      this.runSim(question.delta_T, question.T_horizon, question.initial_wealth, question.A, question.b);
    }
  }



  async loadQuestions(): Promise<void> {
    const response = await fetch('assets/survey-parameters.json');
    const jsonData = await response.json();

    this.questions = jsonData.questions;
    this.questions = this.shuffleArray(this.questions)

    console.log(this.questions);
}


  generateTime(delta_T: number, iterations: number): number[] {
    let times = [];
    for (let i = 0; i < iterations / delta_T; i++) {
      times[i] = i * delta_T;
    }
    return times;
  }

  gaussianRandom(mean: number, stdev: number) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
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
    let drawdown = 0;
    let wealth = Array<number>(iterations/ delta_T).fill(0);
    wealth[0] = initialWealth;
    for (let i = 1; i < iterations / delta_T; i++) {
      let noise = this.gaussianRandom(0, Math.sqrt(delta_T));
      let delta_W = delta_T * a + b * noise;
      wealth[i] = wealth[i - 1] + delta_W;
      if(wealth[i] < 0){
        wealth[i] = 0;
        break;
      }
      if(wealth[i] > entered_B){
        drawdown += wealth[i] - entered_B;
        wealth[i] = entered_B;
      }
    }

    this.drawdown = drawdown

    if(this.flag){
      this.drawdowns_str.push(this.drawdown.toFixed(2));
      this.drawdowns_num.push(this.drawdown)
      this.entered_B.push(this.currB!)
      this.max_drawdown = this.math.max(...this.drawdowns_num)
      const sum = this.drawdowns_num.reduce((a, b) => a + b, 0);
      this.avg_drawdown = (sum / this.drawdowns_num.length) || 0;
      this.run += 1

      this.cdRef.detectChanges();
    }
    
    return wealth;
  }


  runSim(delta_T: number = 0.01, iterations: number = 100, initialWealth: number = 1, a: number = 1, b: number = 1): void {
    let B_star: number;
    if (!this.currB){
      B_star = 2;
    }else{
      B_star = this.currB;
    }

    this.times = this.generateTime(delta_T, iterations);
    this.wealth = this.simulateWealth(delta_T, iterations, initialWealth, a, b, B_star);
    console.log(this.currentQuestionIndex)
  }


  async ngOnInit(): Promise<void> {
      this.runSim()
      await this.loadQuestions();
      console.log(this.questions)
      this.flag = true;
  }

  filledB(){
    return this.currB && this.run < 5;
  }

  nextQuestionReady(){
    return this.run >= 5
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.loadCurrentQuestion();
      this.run = 0
      this.avg_drawdown = 0
      this.max_drawdown = 0
      this.drawdowns_num = []
      this.drawdowns_str = []
    } else {
      console.log("No more questions.");
    }

    // Collect and save data for the current question
    let params: UserParameters = {
      question_id: this.question_id,
      entered_B: this.entered_B,
      drawdowns: this.drawdowns_num,
      avg_drawdown: this.avg_drawdown,
      max_drawdown: this.max_drawdown,
    };

    this.userDataService.addUserParameter(params);
    console.log(this.userDataService.getUserData());
  }
}


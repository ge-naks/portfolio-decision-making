import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserDataService } from '../../services/user-data.service';
import { UserParameters } from '../../models/user-parameters.model';
import { ChartComponent } from '../chart/chart.component';
import { SimParameters } from '../../models/sim-parameters.model';

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
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})

export class QuestionComponent implements OnInit {
  question_id: string = '';
  currB = null;
  entered_B: number[] = [];
  avg_drawdown = null;
  max_drawdown = null;
  times: number[] = [];
  wealth: number[] = [];
  drawdown: number = 0;


  

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
    console.log(drawdown)
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
  }
  
  

  ngOnInit(): void {
      this.runSim()
  }

  filledB(){
    return this.currB
  }

  constructor(private userDataService: UserDataService) {}
}

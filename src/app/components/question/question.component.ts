import { Component } from '@angular/core';
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
export class QuestionComponent {
  question_id: string = '';
  currB = null;
  entered_B: number[] = [];
  avg_drawdown = null;
  max_drawdown = null;
  times: number[] = [];
  wealth: number[] = [];

  generateTime(delta_T: number, iterations: number): number[] {
    let times = [];
    for (let i = 0; i < iterations; i++) {
      times[i] = i * delta_T;
    }
    return times;
  }

  gaussianRandom(mean: number, stdev: number) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
    }

  simulateWealth(
    delta_T: number,
    iterations: number,
    initialWealth: number,
    a: number,
    b: number
  ) {
    let wealth = [];
    wealth[0] = initialWealth;
    for (let i = 1; i < iterations; i++) {
      let noise = this.gaussianRandom(0, 1);
      let delta_W = delta_T * a + b * noise;
      wealth[i] = wealth[i - 1] + delta_W;
    }
    return wealth;
  }

  runSim(){
    const delta_T = .01;
    const iterations = 10000;
    const initialWealth = 1;
    const a = 1;
    const b = 1;

    this.times = this.generateTime(delta_T, iterations);
    this.wealth = this.simulateWealth(delta_T, iterations, initialWealth, a, b);
  }

  constructor(private userDataService: UserDataService) {}
}

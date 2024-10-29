import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartComponent } from "../chart/chart.component";
import { run } from 'node:test';
import { MatButtonModule } from '@angular/material/button';
import { SandboxChartComponent } from './sandbox-chart.component';

@Component({
  selector: 'app-sandbox',
  standalone: true,
  imports: [ChartComponent,
    MatButtonModule,
    SandboxChartComponent
  ],
  templateUrl: './sandbox.component.html',
  styleUrl: './sandbox.component.css'
})
export class SandboxComponent implements OnInit {
  times: number[] = [];
  wealth: number[] = [];


  constructor(private router: Router) {}

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
    
    return wealth;
  }


  runSim(delta_T: number = 0.01, iterations: number = 100, initialWealth: number = 1, a: number = 1, b: number = 1): void {
    
    this.times = this.generateTime(delta_T, iterations);
    this.wealth = this.simulateWealth(delta_T, iterations, initialWealth, a, b, 6);
  }

  ngOnInit(): void {
      this.runSim()
  }

  toNext(){
    
    this.router.navigate(['/question'])
  }




}

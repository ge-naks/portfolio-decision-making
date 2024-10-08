import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartType} from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'], // Change to styleUrls
})
export class ChartComponent implements OnInit {
  public config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: []
  };

  chart!: Chart<'line'>; 

  ngOnInit(): void {
    Chart.register(...registerables);
    this.chart = new Chart('MyChart', this.config);
  }
}

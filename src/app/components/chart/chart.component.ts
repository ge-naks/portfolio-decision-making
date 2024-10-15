import { Component, OnInit, Input } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartType, LinearScale} from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'], // Change to styleUrls
})
export class ChartComponent implements OnInit {
  @Input() times: number[] = [];
  @Input() wealth: number[] = [];

  public config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: [], 
      datasets: [
        {
          label: 'Wealth over Time',
          data: [],
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
  }

  ngAfterViewInit(): void {
    this.chart = new Chart('MyChart', this.config);
    this.updateChartData();
  }

  ngOnChanges(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    if (this.chart) {
      this.chart.data.labels = this.times;
      this.chart.data.datasets[0].data = this.wealth;
      this.chart.update(); // Update the chart with new data
    }
  }
}


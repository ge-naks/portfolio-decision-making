import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartType, LinearScale, Tooltip} from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'], // Change to styleUrls
})
export class ChartComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {}
  @Input() times: number[] = [];
  @Input() wealth: number[] = [];

  public config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: [], 
      datasets: [
        {
          label: 'Stochastic Wealth Generation',
          data: [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    },
    options: {
      elements: {
        point: {
          radius: 0,
          hoverRadius: 0,
        }
      },
      responsive: true,
      scales: {
        x: {
          ticks: {

          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
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
    this.cdr.detectChanges();
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


import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartType, LinearScale, Tooltip} from 'chart.js';

@Component({
  selector: 'app-sandbox-chart',
  standalone: true,
  imports: [],
  templateUrl: './sandbox-chart.component.html',
  styleUrls: ['./sandbox-chart.component.css'],
})
export class SandboxChartComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {}
  @Input() times: number[] = [];
  @Input() wealth: number[] = [];

  
  public config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: this.generateXLabels(this.wealth),
      datasets: [
        {
          label: 'Stochastic Wealth Generation',
          data: [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ],
    },
    options: {
      elements: {
        point: {
          radius: 0,
          hoverRadius: 0,
        },
        line:{
          borderWidth: 1
        }
      },
      responsive: true,
      scales: {
        x: {
          ticks: {
            autoSkip: true, // Skips ticks if there are too many to fit in the view
            maxRotation: 0 // Prevents label rotation, making it clearer
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

    if (!this.chart) {
    this.chart = new Chart('sandboxChart', this.config);
    this.updateChartData();
    this.cdr.detectChanges();
    }
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

  generateXLabels(wealth: number[]): number[] {
    const labels: number[] = [];
    for(let i = 0; i < wealth.length; i ++){
      if (wealth[i] % 100 == 0) {
        labels.push(wealth[i])
      }
    }
    return labels;
  }



}


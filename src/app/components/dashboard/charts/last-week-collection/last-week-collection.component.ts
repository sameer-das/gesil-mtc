import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-last-week-collection',
  imports: [ChartModule],
  templateUrl: './last-week-collection.component.html',
  styleUrl: './last-week-collection.component.scss'
})
export class LastWeekCollectionComponent {
  data: any;
  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--content-border-color');

    this.data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          // label: 'Daily Collection ($)',
          data: [4500, 5200, 4800, 6100, 5900, 4200, 3800],
          fill: true, // Creates an area chart effect
          borderColor: documentStyle.getPropertyValue('--p-green-500'),
          backgroundColor: documentStyle.getPropertyValue('--p-green-100'), // Light blue fill
          tension: 0.4, // Smooth curves
          pointRadius: 5,
          pointHoverRadius: 8
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        },
        y: {
          beginAtZero: true,
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        }
      }
    };
  }
}

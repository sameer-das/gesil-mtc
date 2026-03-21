import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-month-wise-collection',
  imports: [ChartModule],
  templateUrl: './month-wise-collection.component.html',
  styleUrl: './month-wise-collection.component.scss'
})
export class MonthWiseCollectionComponent implements OnInit {
  ngOnInit(): void {
    this.initChart()
  }
  barData: any;
  barOptions: any;

  initChart() {
     const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.barData = {
      labels: ['Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26'],
      datasets: [

        {
          label: 'Collected',
          backgroundColor: documentStyle.getPropertyValue('--p-blue-400'),
          borderColor: documentStyle.getPropertyValue('--p-blue-400'),
          data: [60, 40, 40, 20, 30, 40, 90, 30, 48, 40, 19, 66, 30, 20]
        },
        {
          label: 'Pending',
          backgroundColor: documentStyle.getPropertyValue('--p-yellow-300'),
          borderColor: documentStyle.getPropertyValue('--p-yellow-300'),
          data: [40, 60, 60, 80, 70, 60, 10, 70, 52, 60, 81, 34, 70, 80]
        }
      ]
    };

    this.barOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

  }


}

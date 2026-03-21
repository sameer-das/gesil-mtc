import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-zone-wise-collection',
  imports: [ChartModule],
  templateUrl: './zone-wise-collection.component.html',
  styleUrl: './zone-wise-collection.component.scss'
})
export class ZoneWiseCollectionComponent {

  data: any;
  options: any;

  ngOnInit() {
    this.data = {
      labels: ['CITY ZONE', 'KAVI NAGAR', 'MOHAN NAGAR', 'VASUNDHARA', 'VIJAY NAGAR'],
      datasets: [
        {
          label: 'Total',
          backgroundColor: 'green',
          data: [130, 150, 180, 120, 150]
        },
        {
          label: 'Collected',
          backgroundColor: '#42A5F5',
          data: [65, 59, 80, 81, 50]
        },
        {
          label: 'Pending',
          backgroundColor: '#FFA726',
          data: [28, 48, 40, 19, 50]
        },
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: { color: '#495057' }
        }
      },
      scales: {
        x: {
          stacked: true, // Enables stacking on X axis
          ticks: { color: '#495057' },
          grid: { color: '#ebedef' }
        },
        y: {
          stacked: true, // Enables stacking on Y axis
          ticks: { color: '#495057' },
          grid: { color: '#ebedef' }
        }
      }
    };
  }

}

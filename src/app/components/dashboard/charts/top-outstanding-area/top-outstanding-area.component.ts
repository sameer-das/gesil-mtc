import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-top-outstanding-area',
  imports: [TableModule],
  templateUrl: './top-outstanding-area.component.html',
  styleUrl: './top-outstanding-area.component.scss'
})
export class TopOutstandingAreaComponent {
  topOutStandingData = [
    {
      id:1,
      zone:'City Zone',
      ward:'ward 1',
      outstanding: 1500000,
      total: 1700000,
    },
    {
      id:2,
      zone:'City Zone',
      ward:'ward 2',
      outstanding: 1400000,
      total: 1700000,
    },
    {
      id:3,
      zone:'Mohan Nagare',
      ward:'ward 3',
      outstanding: 1500000,
      total: 1800000,
    },
    {
      id:4,
      zone:'Vashundhara',
      ward:'ward 6',
      outstanding: 1500000,
      total: 1700000,
    },
    {
      id:5,
      zone:'City Zone',
      ward:'ward 1',
      outstanding: 1500000,
      total: 1700000,
    },
    {
      id:6,
      zone:'City Zone',
      ward:'ward 2',
      outstanding: 1400000,
      total: 1700000,
    },
    {
      id:7,
      zone:'Mohan Nagare',
      ward:'ward 3',
      outstanding: 1500000,
      total: 1800000,
    },
    {
      id:8,
      zone:'Vashundhara',
      ward:'ward 6',
      outstanding: 1500000,
      total: 1700000,
    },
     {
      id:9,
      zone:'Vashundhara',
      ward:'ward 6',
      outstanding: 1500000,
      total: 1700000,
    },
    {
      id:10,
      zone:'City Zone',
      ward:'ward 1',
      outstanding: 1500000,
      total: 1700000,
    },
  ]
}

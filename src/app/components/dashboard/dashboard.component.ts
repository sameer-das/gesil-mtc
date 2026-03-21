import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { PageHeaderComponent } from "../utils/page-header/page-header.component";
import { PermissionService } from '../../services/permission.service';
import { ZoneWiseCollectionComponent } from "./charts/zone-wise-collection/zone-wise-collection.component";
import { MonthWiseCollectionComponent } from "./charts/month-wise-collection/month-wise-collection.component";
import { LastWeekCollectionComponent } from "./charts/last-week-collection/last-week-collection.component";
import { TopOutstandingAreaComponent } from "./charts/top-outstanding-area/top-outstanding-area.component";

@Component({
  selector: 'app-dashboard',
  imports: [PageHeaderComponent, TranslateModule, FormsModule, ChartModule, ZoneWiseCollectionComponent, MonthWiseCollectionComponent, LastWeekCollectionComponent, TopOutstandingAreaComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {



  barData: any;
  barOptions: any;
  pieData: any;
  pieOptions: any;

  permissionService: PermissionService = inject(PermissionService);

  ngOnInit(): void {
    this.initChart()
  }


  initChart() {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    
   



    this.pieData = {
      labels: ['CITY ZONE', 'KAVI NAGAR', 'MOHAN NAGAR', 'VASUNDHARA', 'VIJAY NAGAR'],
      datasets: [
        {
          data: [25, 30, 15,20,10],
          backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-red-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
        }
      ]
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      },
      responsive: true
    };
  }



}

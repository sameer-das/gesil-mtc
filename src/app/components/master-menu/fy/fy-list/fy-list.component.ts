import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { Fy } from '../../../../models/master-data.model';

@Component({
  selector: 'app-fy-list',
  imports: [PageHeaderComponent, TableModule, ButtonModule, RouterModule],
  templateUrl: './fy-list.component.html',
  styleUrl: './fy-list.component.scss'
})
export class FyListComponent {
fys:Fy[] = [
  {fyId: 1, fyName: 'FY 22-23', active: 1}, 
  {fyId: 2, fyName: 'FY 23-24', active: 1}, 
  {fyId: 3, fyName: 'FY 24-25', active: 1}, 
  {fyId: 4, fyName: 'FY 25-26', active: 1}, 
]

tableLoading: boolean = false;
  TABLE_CONFIG =TABLE_CONFIG;




  loadFyData(e: TableLazyLoadEvent) {
    console.log(e)
  }
}

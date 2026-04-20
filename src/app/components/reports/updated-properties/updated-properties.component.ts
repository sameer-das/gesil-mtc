import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PropertySearchResultType } from '../../../models/property-owner.model';
import { TABLE_CONFIG } from '../../../models/tableConfig';

@Component({
  selector: 'app-updated-properties',
  imports: [PageHeaderComponent, DatePickerModule, FormsModule, ButtonModule, TableModule],
  templateUrl: './updated-properties.component.html',
  styleUrl: './updated-properties.component.scss'
})
export class UpdatedPropertiesComponent implements OnInit {


  rangeDates: Date[] | undefined = [];
  
    TABLE_CONFIG = TABLE_CONFIG;
  
    reportData: PropertySearchResultType[] = [];
    totalRecords: number = 0;
  
    ngOnInit(): void {
      const date7daysago = new Date(); // Today's date
      date7daysago.setDate(date7daysago.getDate() - 7);
  
      this.rangeDates = [date7daysago, new Date()]
    }
  
    onSearch() {
      console.log(this.rangeDates)
    }
  
  
  
    loadUserData(e: TableLazyLoadEvent) {
        // console.log(e);
        let pageNumber = 1;
        if (e.first) {
          pageNumber = (e.first / (e.rows || 5)) + 1
        }
  
        const pageSize = e.rows || 5;
  
        console.log(pageNumber, pageSize)
    
      }



}

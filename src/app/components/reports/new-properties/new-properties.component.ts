import { TABLE_CONFIG } from './../../../models/tableConfig';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PropertySearchResultType } from '../../../models/property-owner.model';
import { MasterDataService } from '../../../services/master-data.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-new-properties',
  imports: [PageHeaderComponent, DatePickerModule, FormsModule, ButtonModule, TableModule, RouterLink],
  templateUrl: './new-properties.component.html',
  styleUrl: './new-properties.component.scss'
})
export class NewPropertiesComponent implements OnInit, OnDestroy {

  $destroy: Subject<boolean> = new Subject()
  ngOnDestroy(): void {
    this.$destroy.next(true)
  }

  rangeDates: Date[] = [];

  TABLE_CONFIG = TABLE_CONFIG;

  reportData: PropertySearchResultType[] = [];
  totalRecords: number = 0;
  masterDataService: MasterDataService = inject(MasterDataService);

  pageNo: number = 1;
  pageSize: number = 5;

  @ViewChild('dt1') table!: Table;

  ngOnInit(): void {
    const date7daysago = new Date(); // Today's date
    date7daysago.setDate(date7daysago.getDate() - 7);

    this.rangeDates = [date7daysago, new Date()];

    // this.getData(1,10);
  }

  onSearch() {
    this.table.first = 0;
    // this.getData(this.pageNo, this.pageSize)
  }



  loadUserData(e: TableLazyLoadEvent) {
    console.log(e);
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }

    const pageSize = e.rows || 5;

    this.pageNo = pageNumber;
    this.pageSize = pageSize;
    // this.getData(pageNumber, pageSize)

  }

  // getData(pageNumber: number, pageSize: number) {
  //   this.masterDataService.getVisitingReport({
  //     "pageNumber": pageNumber,
  //     "pageSize": pageSize,
  //     "fromDate": this.rangeDates[0]?.toISOString(),
  //     "toDate": this.rangeDates[1]?.toISOString(),
  //     "searchType": "CREATE"
  //   })
  //     .pipe(takeUntil(this.$destroy),
  //       tap(resp => {
  //         // console.log(resp)
  //         this.reportData = resp.data.searchProperties;
  //         this.totalRecords = resp.data.totalCount;
  //       }))
  //     .subscribe()
  // }
}

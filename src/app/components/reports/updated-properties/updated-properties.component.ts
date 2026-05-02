import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PropertySearchResultType } from '../../../models/property-owner.model';
import { TABLE_CONFIG } from '../../../models/tableConfig';
import { MasterDataService } from '../../../services/master-data.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TRANSACTION_REMARKS } from '../../../models/constants';
import { IUserTransactionReport } from '../../../models/user.model';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-updated-properties',
  imports: [PageHeaderComponent, DatePickerModule, FormsModule, ButtonModule, 
    TableModule, DatePipe, ImageModule],
  templateUrl: './updated-properties.component.html',
  styleUrl: './updated-properties.component.scss'
})
export class UpdatedPropertiesComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject()
  ngOnDestroy(): void {
    this.$destroy.next(true)
  }

  rangeDates: Date[] = [];

  TABLE_CONFIG = TABLE_CONFIG;

  reportData: IUserTransactionReport[] = [];
  totalRecords: number = 0;
  masterDataService: MasterDataService = inject(MasterDataService);
  userId: number = +(localStorage.getItem('loginUserId') || 0);


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
    this.getData(this.pageNo, this.pageSize)
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
    this.getData(pageNumber, pageSize)

  }


  getData(pageNumber: number, pageSize: number) {
    this.masterDataService.getVisitingReport({
      "pageNumber": pageNumber,
      "pageSize": pageSize,
      "fromDate": this.rangeDates[0]?.toISOString(),
      "toDate": this.rangeDates[1]?.toISOString(),
      "userId": this.userId
    })
      .pipe(takeUntil(this.$destroy),
        tap(resp => {
          // console.log(resp)
          this.reportData = resp.data.searchProperties.map(c => ({ ...c, remarkLabel: this.getRemarksLabel(c.remarks) }));
          this.totalRecords = resp.data.totalCount;
        }))
      .subscribe()
  }

  getRemarksLabel(remarkValue: number | string) {
    return TRANSACTION_REMARKS.find(c => +c.value === +remarkValue)?.label;
  }

  getImage(imagename: string) {
    return `${environment.API_URL}/Master/ownerDocumentDownload?fileName=${imagename}`
  }



}

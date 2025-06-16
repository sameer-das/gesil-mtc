import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { Fy } from '../../../../models/master-data.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { Subject, takeUntil } from 'rxjs';
import { APIResponse } from '../../../../models/user.model';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-fy-list',
  imports: [PageHeaderComponent, TableModule, ButtonModule, RouterModule, TooltipModule],
  templateUrl: './fy-list.component.html',
  styleUrl: './fy-list.component.scss'
})
export class FyListComponent implements OnInit, OnDestroy {

  fys: Fy[] = [];

  tableLoading: boolean = false;
  TABLE_CONFIG = TABLE_CONFIG;
  totalRecords = 0;
  $destroy: Subject<null> = new Subject();
  
  
  private masterDataService: MasterDataService = inject(MasterDataService);



  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    this.loadFyList(1,5);
  }



  onPaginate(e: TableLazyLoadEvent) {
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }
    this.loadFyList(pageNumber, (e.rows || 5));
  }



  loadFyList(pageNumber: number, pageSize: number) {
    this.masterDataService.fyList(pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{ fys: Fy[], totalCount: number }>) => {
          console.log(resp)
          if (resp.code === 200) {
            this.totalRecords = resp.data.totalCount;
            this.fys = resp.data.fys;
          }
        }
      })
  }
}

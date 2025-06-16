import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Ward } from '../../../../models/master-data.model';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { RouterModule } from '@angular/router';
import { MasterDataService } from '../../../../services/master-data.service';
import { Subject, takeUntil } from 'rxjs';
import { APIResponse } from '../../../../models/user.model';


@Component({
  selector: 'app-ward-list',
  imports: [PageHeaderComponent, TableModule, ButtonModule, RouterModule],
  templateUrl: './ward-list.component.html',
  styleUrl: './ward-list.component.scss'
})
export class WardListComponent implements OnInit,OnDestroy{


  $destroy: Subject<null> = new Subject();
  TABLE_CONFIG = TABLE_CONFIG;
  totalRecords = 0;
  wards: Ward[] = [];

  private masterDataService: MasterDataService = inject(MasterDataService);


    
  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    this.loadWardList(1, 5);
  }


  onPaginate(e: TableLazyLoadEvent) {
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }
    this.loadWardList(pageNumber, (e.rows || 5));
  }

  loadWardList(pageNumber: number, pageSize:number) {
    this.masterDataService.wardList(0, pageNumber, pageSize)
    .pipe(takeUntil(this.$destroy))
    .subscribe({
      next: (resp:APIResponse<{wards: Ward[], totalCount: number}>) => {
        console.log(resp)
        if(resp.code === 200) {
          this.totalRecords = resp.data.totalCount;
          this.wards = resp.data.wards;
        }
      }
    })
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { Subject, takeUntil, tap } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsageType } from '../../../../models/master-data.model';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usage-type-list',
  imports: [PageHeaderComponent, TableModule, ButtonModule, FormsModule, RouterModule, TooltipModule, IconFieldModule, InputIconModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './usage-type-list.component.html',
  styleUrl: './usage-type-list.component.scss'
})
export class UsageTypeListComponent implements OnInit, OnDestroy {

  usageTypes: UsageType[] = [];
  TABLE_CONFIG = TABLE_CONFIG;
  totalRecords = 0;
  $destroy: Subject<boolean> = new Subject();
  private masterDataService: MasterDataService = inject(MasterDataService);
  search: FormControl = new FormControl('');
  pageNumber = 1;
  pageSize = 5;

  ngOnDestroy(): void {
    this.$destroy.next(true)
  }


  ngOnInit(): void {
    this.getAllUsageTypes()
  }


  getAllUsageTypes(pageNumber = 0, pageSize = 0) {
    this.masterDataService.getUsageType(0, pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy), tap(resp => {
        console.log(resp)
        if (resp.code === 200) {
          this.usageTypes = resp.data.usageTypes;
          this.totalRecords = resp.data.totalCount;
        }
      }))
      .subscribe()
  }



  onPaginate(e: TableLazyLoadEvent) {
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }
    this.pageNumber = pageNumber;
    this.pageSize = e.rows || 5;

    if (this.search.value.trim().length === 0) {
      this.getAllUsageTypes(pageNumber, (e.rows || 5));
    } else {
      // this.masterDataService.searchCategory(this.search.value.trim(), this.pageNumber, this.pageSize)
      //   .pipe(
      //     takeUntil(this.$destroy),
      //     tap(resp => {
      //       console.log(resp)
      //       if (resp.code === 200) {
      //         this.usageTypes = resp.data.categories;
      //         this.totalRecords = resp.data.totalCount;
      //       }
      //     })
      //   ).subscribe()
    }

  }



}

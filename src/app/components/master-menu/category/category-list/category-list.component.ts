import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../../../models/master-data.model';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { APIResponse } from '../../../../models/user.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';

@Component({
  selector: 'app-category-list',
  imports: [TableModule, ButtonModule, PageHeaderComponent, RouterModule, TooltipModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  TABLE_CONFIG = TABLE_CONFIG;
  totalRecords = 0;
  $destroy: Subject<null> = new Subject();

  private masterDataService: MasterDataService = inject(MasterDataService);

  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    this.loadCategories();
  }



  onPaginate(e: TableLazyLoadEvent) {
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }
    this.loadCategories(pageNumber, (e.rows || 5));
  }



  loadCategories(pageNumber: number = 1, pageSize = 5) {
    this.masterDataService.categoryList(pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{ categories: Category[], totalCount: number }>) => {
          console.log(resp)
          if (resp.code === 200) {
            this.totalRecords = resp.data.totalCount;
            this.categories = resp.data.categories;
          }
        }
      })
  }


}

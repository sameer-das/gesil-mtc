import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { Category, SubCategory } from '../../../../models/master-data.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { Subject, takeUntil } from 'rxjs';
import { APIResponse } from '../../../../models/user.model';
import { TooltipModule } from 'primeng/tooltip';
TABLE_CONFIG
@Component({
  selector: 'app-sub-category-list',
  imports: [PageHeaderComponent, TableModule, ButtonModule, RouterModule, TooltipModule],
  templateUrl: './sub-category-list.component.html',
  styleUrl: './sub-category-list.component.scss'
})
export class SubCategoryListComponent implements OnInit, OnDestroy {

  TABLE_CONFIG = TABLE_CONFIG;
  subCategories: SubCategory[] = [];
  totalRecords = 0;
  $destroy: Subject<null> = new Subject();

  categoryId = input<undefined | number>();
  categoryName = input<string>();

  masterDataService: MasterDataService = inject(MasterDataService);


  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete;
  }



  ngOnInit(): void {
    if (this.categoryId()) {
      this.loadSubCategoriesOfCategory(this.categoryId()!)
    } else {
      this.loadSubCategories();
    }

  }



  onPaginate(e: TableLazyLoadEvent) {
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }

    if (this.categoryId()) {
      this.loadSubCategoriesOfCategory(this.categoryId()!, pageNumber, (e.rows || 5))
    }
    else {
      this.loadSubCategories(pageNumber, (e.rows || 5));
    }

  }



  loadSubCategories(pageNumber = 1, pageSize = 5) {
    this.masterDataService.subCategoryList(pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{ subCategories: SubCategory[], totalCount: number }>) => {
          console.log(resp)
          if (resp.code === 200) {
            this.totalRecords = resp.data.totalCount;
            this.subCategories = resp.data.subCategories;
          }
        }
      })
  }



  loadSubCategoriesOfCategory(categoryId: number, pageNumber: number = 1, pageSize: number = 5) {
    this.masterDataService.subCategoriesOfCategory(categoryId, pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{ subCategories: SubCategory[], totalCount: number }>) => {
          console.log(resp)
          if (resp.code === 200 && resp.data) {
            this.totalRecords = resp.data.totalCount;
            this.subCategories = resp.data.subCategories;
          }
        }
      })
  }


}

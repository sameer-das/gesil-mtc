import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { SubCategory } from '../../../../models/master-data.model';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { APIResponse } from '../../../../models/user.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";

@Component({
  selector: 'app-sub-category-list',
  imports: [PageHeaderComponent, TableModule, ButtonModule, RouterModule,
    TooltipModule, IconFieldModule, InputIconModule, ReactiveFormsModule, InputTextModule],
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
  search: FormControl = new FormControl('');
  pageNumber = 1;
  pageSize = 5;

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


    this.search.valueChanges.pipe(
      takeUntil(this.$destroy),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((searchValue) => {
        if (searchValue.trim().length > 0)
          return this.masterDataService.searchSubCategory(searchValue, this.pageNumber, this.pageSize);
        else
          return this.masterDataService.subCategoryList(this.pageNumber, this.pageSize);
      }),
      tap(resp => {
        if (resp.code === 200) {
          this.subCategories = resp.data.subCategories;
          this.totalRecords = resp.data.totalCount;
        }
      })
    ).subscribe()

  }



  onPaginate(e: TableLazyLoadEvent) {
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }

    this.pageNumber = pageNumber;
    this.pageSize = e.rows || 5;

    if (this.categoryId()) {
      this.loadSubCategoriesOfCategory(this.categoryId()!, pageNumber, (e.rows || 5))
    }
    else {
      if(this.search.value.trim().length === 0) {
        this.loadSubCategories(pageNumber, (e.rows || 5));
      } else {
        this.masterDataService.searchSubCategory(this.search.value.trim(), this.pageNumber, this.pageSize)
        .pipe(
          takeUntil(this.$destroy),
          tap(resp => {
            console.log(resp)
            if (resp.code === 200) {
              this.subCategories = resp.data.subCategories;
              this.totalRecords = resp.data.totalCount;
            }
          })
        ).subscribe()
      }

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

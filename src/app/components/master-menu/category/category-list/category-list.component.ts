import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Category } from '../../../../models/master-data.model';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { APIResponse } from '../../../../models/user.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-category-list',
  imports: [TableModule, ButtonModule, PageHeaderComponent, RouterModule, TooltipModule, IconFieldModule, InputIconModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  TABLE_CONFIG = TABLE_CONFIG;
  totalRecords = 0;
  $destroy: Subject<null> = new Subject();

  private masterDataService: MasterDataService = inject(MasterDataService);
  search: FormControl = new FormControl('');
  pageNumber = 1;
  pageSize = 5;

  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    this.loadCategories();

    this.search.valueChanges.pipe(
      takeUntil(this.$destroy),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((searchValue) => {
        if (searchValue.trim().length > 0)
          return this.masterDataService.searchCategory(searchValue, this.pageNumber, this.pageSize);
        else
          return this.masterDataService.categoryList(this.pageNumber, this.pageSize);
      }),
      tap(resp => {
        if (resp.code === 200) {
          this.categories = resp.data.categories;
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

    if(this.search.value.trim().length === 0) {
      this.loadCategories(pageNumber, (e.rows || 5));
    } else {
      this.masterDataService.searchCategory(this.search.value.trim(), this.pageNumber, this.pageSize)
      .pipe(
          takeUntil(this.$destroy),
          tap(resp => {
            console.log(resp)
            if (resp.code === 200) {
              this.categories = resp.data.categories;
              this.totalRecords = resp.data.totalCount;
            }
          })
        ).subscribe()
    }

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

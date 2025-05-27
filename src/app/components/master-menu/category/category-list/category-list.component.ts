import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { RouterModule } from '@angular/router';
import { Category } from '../../../../models/master-data.model';

@Component({
  selector: 'app-category-list',
  imports: [TableModule, ButtonModule, PageHeaderComponent, RouterModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {


  categories: Category[] = [
    {categoryId: 1, categoryName: 'Below Poverty Line'},
    {categoryId: 2, categoryName: 'EWS'},
    {categoryId: 3, categoryName: 'MIG (200 squre meters)'},
    {categoryId: 4, categoryName: 'HIG (200 squre meters)'},
  ];
  tableLoading: boolean = false;
  TABLE_CONFIG =TABLE_CONFIG;




  loadCategoryData(e: TableLazyLoadEvent) {
    console.log(e)
  }
}

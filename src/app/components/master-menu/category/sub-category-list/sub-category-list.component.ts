import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { SubCategory } from '../../../../models/master-data.model';
TABLE_CONFIG
@Component({
  selector: 'app-sub-category-list',
  imports: [PageHeaderComponent, TableModule, ButtonModule, RouterModule],
  templateUrl: './sub-category-list.component.html',
  styleUrl: './sub-category-list.component.scss'
})
export class SubCategoryListComponent {
  TABLE_CONFIG = TABLE_CONFIG;
  tableLoading = false;
  subCategories: SubCategory[] = [
    { subCategoryId: 1, subCategoryName: 'Hut', categoryId: 1, categoryName: 'Below Poverty Line', taxAmountPerMonth: 5000 },
    { subCategoryId: 2, subCategoryName: 'Pucca House/Flat', categoryId: 1, categoryName: 'Below Poverty Line', taxAmountPerMonth: 2000 },
    { subCategoryId: 3, subCategoryName: 'EWS', categoryId: 2, categoryName: 'EWS', taxAmountPerMonth: 7000 },
    { subCategoryId: 4, subCategoryName: 'MIG (200 square meter)', categoryId: 3, categoryName: 'MIG (200 square meter)', taxAmountPerMonth: 5000 },
  ];


  loadSubCategoryData(e: TableLazyLoadEvent) {

  }
}

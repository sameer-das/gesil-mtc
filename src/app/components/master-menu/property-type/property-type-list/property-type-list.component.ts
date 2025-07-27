import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { MasterDataService } from '../../../../services/master-data.service';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PropertyType } from '../../../../models/master-data.model';
import { APIResponse } from '../../../../models/user.model';

@Component({
  selector: 'app-property-type-list',
  imports: [PageHeaderComponent, TableModule, RouterModule, ButtonModule],
  templateUrl: './property-type-list.component.html',
  styleUrl: './property-type-list.component.scss'
})
export class PropertyTypeListComponent {


  propertyTypes: PropertyType[] = [];
  TABLE_CONFIG = TABLE_CONFIG;
  totalRecords = 0;
  $destroy: Subject<null> = new Subject();


  private masterDataService: MasterDataService = inject(MasterDataService);



  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    this.loadPropertyTypeList(1, 5);
  }



  onPaginate(e: TableLazyLoadEvent) {
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }
    this.loadPropertyTypeList(pageNumber, (e.rows || 5));
  }



  loadPropertyTypeList(pageNumber: number, pageSize: number) {
    this.masterDataService.propertyTypeList(pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{ propertyTypes: PropertyType[], totalCount: number }>) => {
          console.log(resp)
          if (resp.code === 200) {
            this.totalRecords = resp.data.totalCount;
            this.propertyTypes = resp.data.propertyTypes;
          }
        }
      })
  }

}

import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ElectricityConnectionType } from '../../../../models/master-data.model';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { Subject, takeUntil } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { APIResponse } from '../../../../models/user.model';

@Component({
  selector: 'app-electricity-type-list',
  imports: [PageHeaderComponent, TableModule, RouterModule, ButtonModule],
  templateUrl: './electricity-type-list.component.html',
  styleUrl: './electricity-type-list.component.scss'
})
export class ElectricityTypeListComponent {

  electricityTypes: ElectricityConnectionType[] = [];
  TABLE_CONFIG = TABLE_CONFIG;
  totalRecords = 0;
  $destroy: Subject<null> = new Subject();


  private masterDataService: MasterDataService = inject(MasterDataService);



  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }

  ngOnInit(): void {
      this.loadElectricityConnectionTypeList(1, 5);
    }
  
  
  
    onPaginate(e: TableLazyLoadEvent) {
      let pageNumber = 1;
      if (e.first) {
        pageNumber = (e.first / (e.rows || 5)) + 1
      }
      this.loadElectricityConnectionTypeList(pageNumber, (e.rows || 5));
    }
  
  
  
    loadElectricityConnectionTypeList(pageNumber: number, pageSize: number) {
      this.masterDataService.electricityConnectionTypeList(pageNumber, pageSize)
            .pipe(takeUntil(this.$destroy))
            .subscribe({
              next: (resp: APIResponse<{ econnections: ElectricityConnectionType[], totalCount: number }>) => {
                console.log(resp)
                if (resp.code === 200) {
                  this.totalRecords = resp.data.totalCount;
                  this.electricityTypes = resp.data.econnections;
                }
              }
            })
    }
}

import { TABLE_CONFIG } from './../../../../models/tableConfig';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { forkJoin, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { APIResponse } from '../../../../models/user.model';
import { Ward, Zone } from '../../../../models/master-data.model';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';
import { TableModule, TablePageEvent } from 'primeng/table';

@Component({
  selector: 'app-zone-details',
  imports: [PageHeaderComponent, TableModule, RouterModule],
  templateUrl: './zone-details.component.html',
  styleUrl: './zone-details.component.scss'
})
export class ZoneDetailsComponent implements OnInit, OnDestroy {

  zoneId = input<number>();

  $destroy: Subject<null> = new Subject();
  TABLE_CONFIG = TABLE_CONFIG;
  totalRecords = 0;

  route: ActivatedRoute = inject(ActivatedRoute);
  masterDataService: MasterDataService = inject(MasterDataService);

  zoneDetails!: Zone;
  wards: Ward[] = [];



  ngOnDestroy(): void {
    this.$destroy.next(null);
  }



  ngOnInit(): void {
    forkJoin([this.masterDataService.zoneDetails(this.zoneId() || 0), this.masterDataService.wardList(this.zoneId() || 0, 1, 5)])
      .pipe(
        takeUntil(this.$destroy),
        tap(([zoneDetailsResp, wardListResp]) => {
          if (zoneDetailsResp.code === 200) {
            this.zoneDetails = zoneDetailsResp.data;
          }

          if (wardListResp.code === 200) {
            this.totalRecords = wardListResp.data.totalCount;
            this.wards = wardListResp.data.wards || [] ;
          }
        })
      ).subscribe();
  }



  onPaginate(e: TablePageEvent) {
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }

    this.masterDataService.wardList(this.zoneId() || 0, pageNumber, (e.rows || 5))
      .pipe(
        takeUntil(this.$destroy),
        tap((wardListResp) => {
          // console.log(wardListResp)
          if (wardListResp.code === 200) {
            this.totalRecords = wardListResp.data.totalCount;
            this.wards = wardListResp.data.wards;
          }
        })
      ).subscribe();
  }

}

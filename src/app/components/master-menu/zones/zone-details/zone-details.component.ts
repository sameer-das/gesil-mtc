import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { APIResponse } from '../../../../models/user.model';
import { Zone } from '../../../../models/master-data.model';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';

@Component({
  selector: 'app-zone-details',
  imports: [PageHeaderComponent],
  templateUrl: './zone-details.component.html',
  styleUrl: './zone-details.component.scss'
})
export class ZoneDetailsComponent implements OnInit, OnDestroy {

  $destroy: Subject<null> = new Subject();

  route:ActivatedRoute = inject(ActivatedRoute);
  masterDataService: MasterDataService = inject(MasterDataService);

  zoneDetails!:Zone;
  ngOnDestroy(): void {
    this.$destroy.next(null);
  }
  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.$destroy),
      switchMap((param:Params) => this.masterDataService.zoneDetails(+param['zoneId'])),
      tap((resp: APIResponse<Zone>) => {
        console.log(resp);
          if(resp.code === 200) {
            this.zoneDetails = resp.data;
          }
      })
    ).subscribe()
  }

}

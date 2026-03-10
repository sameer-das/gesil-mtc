
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { OwnerServiceService } from '../../../../services/owner-service.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, tap } from 'rxjs';
import { DemandList, DemandListResp } from '../../../../models/property-owner.model';
import { APIResponse } from '../../../../models/user.model';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from "@angular/router";
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-demand-list',
  imports: [PageHeaderComponent, ButtonModule, RouterLink],
  templateUrl: './demand-list.component.html',
  styleUrl: './demand-list.component.scss'
})
export class DemandListComponent implements OnInit, OnDestroy {

  propertyId = input<number>();

  $destroy: Subject<boolean> = new Subject();
  demands:DemandList[] = [];
  environment = environment;

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);



  ngOnDestroy(): void {
      this.$destroy.next(true);
  }



  ngOnInit(): void {
    console.log(this.propertyId())

    this.ownerService.getDemandsOfProperty(this.propertyId() || 0, 0, 0).pipe(
      takeUntil(this.$destroy),
      tap((resp: APIResponse<DemandListResp>) => {
        console.log(resp)
        if(resp.code === 200) {
          this.demands = resp.data.demands;
        }
      })
    ).subscribe()


  }


  getDemandFileUrl(filename: string) {
    return `${environment.API_URL}/Master/ownerDocumentDownload?fileName=${filename}`
  }

}

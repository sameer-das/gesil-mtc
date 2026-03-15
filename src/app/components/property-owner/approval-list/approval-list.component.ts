import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { APIResponse } from '../../../models/user.model';
import { PropertySearchResultType } from '../../../models/property-owner.model';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';

@Component({
  selector: 'app-approval-list',
  imports: [PageHeaderComponent],
  templateUrl: './approval-list.component.html',
  styleUrl: './approval-list.component.scss'
})
export class ApprovalListComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject();

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  private messageService: MessageService = inject(MessageService);

  userId: number = +(localStorage.getItem('loginUserId') || 0);

  properties: PropertySearchResultType[] = [];

  ngOnDestroy(): void {
    this.$destroy.next(true)
  }


  fetchAllApprovalPendingProperties() {
    this.ownerService.getPropertyMasterDetail('attribute1', this.userId)
      .pipe(takeUntil(this.$destroy), tap((resp: APIResponse<PropertySearchResultType[]>) => {
        if (resp.code === 200 && resp.status === 'Success') {
          this.properties = resp.data;
        } else {
          this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: `Property fetch failed.`, life: MessageDuaraion.STANDARD })
        }
      })).subscribe()
  }

  ngOnInit(): void {
    this.fetchAllApprovalPendingProperties()
  }



  propertyClick(propertyId: number) {
    this.router.navigate(['/property', 'detail', propertyId])
  }

}

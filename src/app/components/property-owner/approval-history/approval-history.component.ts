import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ApprovalLog, PropertySearchResultType } from '../../../models/property-owner.model';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { MessageService } from 'primeng/api';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-approval-history',
  imports: [PageHeaderComponent, DatePipe],
  templateUrl: './approval-history.component.html',
  styleUrl: './approval-history.component.scss'
})
export class ApprovalHistoryComponent implements OnInit,OnDestroy{
  
  ngOnDestroy(): void {
    this.$destroy.next(true);
  }

  propertyId = input<number>();
  $destroy: Subject<boolean> = new Subject();
  logs: ApprovalLog[] = []

  property: Partial<PropertySearchResultType> = {};


  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    forkJoin([this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0),
      this.ownerService.getApprovalLog(this.propertyId() || 0)
    ])
    .pipe(
      takeUntil(this.$destroy),
      tap(([propertyResp, approvalLogResp]) => {
        if(propertyResp.code === 200) {
          this.property = propertyResp.data[0]
        }

        if(approvalLogResp.code === 200) {
          console.log(approvalLogResp.data)
          this.logs = approvalLogResp.data;
        }
      })

    )
    .subscribe()
  }

}

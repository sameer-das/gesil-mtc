import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { finalize, map, Subject, takeUntil, tap } from 'rxjs';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { APIResponse } from '../../../models/user.model';
import { ApproveRejectPayload, PropertySearchResultType } from '../../../models/property-owner.model';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { LoaderService } from '../../../services/loader.service';

type PropertySelectType = PropertySearchResultType & { selected: boolean }

@Component({
  selector: 'app-approval-list',
  imports: [PageHeaderComponent, CheckboxModule, FormsModule, ButtonModule, RouterLink],
  templateUrl: './approval-list.component.html',
  styleUrl: './approval-list.component.scss'
})
export class ApprovalListComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject();

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  private messageService: MessageService = inject(MessageService);
  loaderService: LoaderService = inject(LoaderService);
  userId: number = +(localStorage.getItem('loginUserId') || 0);


  properties: PropertySelectType[] = [];
  selectAll = false;
  bulkActionButtonDisable = true;

  ngOnDestroy(): void {
    this.$destroy.next(true)
  }


  fetchAllApprovalPendingProperties() {
    this.ownerService.getPropertyMasterDetail('attribute1', this.userId)
      .pipe(takeUntil(this.$destroy), tap((resp: APIResponse<PropertySearchResultType[]>) => {
        if (resp.code === 200 && resp.status === 'Success') {
          this.properties = resp.data.map(p => ({ ...p, selected: false }));
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


  onSelectAll(e: CheckboxChangeEvent) {
    this.properties.forEach(p => p.selected = e.checked);
    this.bulkActionButtonDisable = !e.checked;
  }

  onSingleSelect(e: CheckboxChangeEvent, p: PropertySelectType) {
    this.selectAll = this.properties.every(p => p.selected);
    this.bulkActionButtonDisable = !this.properties.some(p => p.selected);
  }

  onApproveSelected() {
    const payload: ApproveRejectPayload[] = this.properties
      .filter(p => p.selected)
      .map((p: PropertySelectType) => {
        return {
          logId: Number(p.attribute2),
          comments: '',
          status: 'Approved',
          approverUserId: this.userId,
          propertyId: p.propertyId || 0
        }
      })

    console.log(payload)

    this.loaderService.show();
    this.ownerService.approveRejectProperty(payload)
      .pipe(takeUntil(this.$destroy), finalize(() => this.loaderService.hide()),
        map((resp) => {
          console.log(resp)
          if (resp.code === 200 && resp.status === 'Success') {
            this.messageService.add({
              severity: MessageSeverity.SUCCESS, summary: 'Approved',
              detail: `Properties approved successfully.`, life: MessageDuaraion.STANDARD
            });
            this.fetchAllApprovalPendingProperties();
            this.selectAll = false;
          }
        })).subscribe()
  }

}

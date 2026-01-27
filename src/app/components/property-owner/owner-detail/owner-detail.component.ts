import { ApproveRejectPayload, OwnerDetail, PropertySearchResultType } from './../../../models/property-owner.model';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PropertyListComponent } from "../property-list/property-list.component";
import { OwnerServiceService } from '../../../services/owner-service.service';
import { finalize, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { APIResponse } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';
import { AadharMaskPipe } from '../../../pipes/aadhar-mask.pipe';
import { CommonModule, Location } from '@angular/common';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { LoaderService } from '../../../services/loader.service';


@Component({
  selector: 'app-owner-detail',
  imports: [PageHeaderComponent,
    ButtonModule,
    RouterModule,
    DividerModule,
    AccordionModule,
    FileUploadModule,
    TooltipModule,
    AadharMaskPipe,
    CommonModule,
    ConfirmDialogModule,
    MenuModule, PropertyListComponent],
  templateUrl: './owner-detail.component.html',
  styleUrl: './owner-detail.component.scss'
})
export class OwnerDetailComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }

  env = environment;
  propertyId = input<number>();
  $destroy: Subject<boolean> = new Subject();

  ownerDetail: OwnerDetail | null = null;

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  loaderService: LoaderService = inject(LoaderService);

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  property: Partial<PropertySearchResultType> = {};
  userId: number = +(localStorage.getItem('loginUserId') || 0);
  private _location = inject(Location);

  ngOnInit(): void {
    if (this.propertyId()) {
      this.getPropertyDetail()
    } else {
      this.router.navigate(['owner', 'detail'])
    }
  }


  getPropertyDetail() {
    this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0)
      .pipe(takeUntil(this.$destroy),
        tap((resp: APIResponse<PropertySearchResultType[]>) => {
          console.log(resp)
          if (resp.code === 200 && resp.status === 'Success') {
            if (resp.data.length > 0) {

              this.property = resp.data[0];
              this.ownerDetail = {
                ownerId: this.property.ownerId || 0,
                salutation: this.property.salutation || '',
                ownerName: this.property.ownerName || '',
                careOf: this.property.careOf || '',
                guardianName: this.property.guardianName || '',
                gender: this.property.gender || '',
                dob: this.property.dob || '',
                mobile: this.property.mobile || '',
                email: this.property.email || '',
                pan: this.property.pan || '',
                aadhar: this.property.aadhar || '',
                isSpecialOwner: this.property.isSpecialOwner || false,
                identityProof: this.property.identityProof || '',
                photo: this.property.photo || '',
                specialCertificate: this.property.specialCertificate || '',
                active: true,
                createdOn: this.property.createdOn || '',
              }
            }
            else
              this.router.navigate(['owner', 'owner-search'])
          }
        }))
      .subscribe()
  }


  approveProperty() {
    const payload: ApproveRejectPayload = {
      logId: Number(this.property.attribute2),
      comments: '',
      status: 'Approved',
      approverUserId: this.userId,
      propertyId: this.propertyId() || 0

    }

    this.loaderService.show();
    this.ownerService.approveRejectProperty(payload)
      .pipe(takeUntil(this.$destroy), finalize(() => this.loaderService.hide()),
        map((resp) => {
          if (resp.code === 200 && resp.status === 'Success') {
            this.messageService.add({
              severity: MessageSeverity.SUCCESS, summary: 'Approved',
              detail: `Propety approved successfully.`, life: MessageDuaraion.STANDARD
            });
            this._location.back();

          }
        })).subscribe()
  }


  onEditClick(e: Event) {
    this.messageService.add({
      severity: MessageSeverity.CONTRAST,
      summary: 'Feature Unavailable',
      detail: `Edit feature is only available in mobile app.`, life: MessageDuaraion.LONG, closable: true
    })

  }

  onApproveClick(e: Event) {
    this.confirmationService.confirm({
      target: e.target as EventTarget,
      message: 'Please verify the property details. Your approval will be forwarded to your reporting manager for review. Are you sure you want to approve?',
      header: 'Did you verify',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Approve',
      },
      accept: () => {
        this.approveProperty();
      },
      reject: () => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Rejected',
        //   detail: 'You have rejected',
        //   life: 3000,
        // });
      },
    })

  }

  onApprovalHistory(e: Event) {

  }

}

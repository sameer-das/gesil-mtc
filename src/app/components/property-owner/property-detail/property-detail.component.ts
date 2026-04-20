import { PERMISSIONS } from './../../../models/constants';
import { CommonModule, Location } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, map, Subject, takeUntil, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { ApproveRejectPayload, OwnerDetail, PropertySearchResultType } from '../../../models/property-owner.model';
import { APIResponse } from '../../../models/user.model';
import { LoaderService } from '../../../services/loader.service';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { PermissionService } from '../../../services/permission.service';


@Component({
  selector: 'app-property-detail',
  imports: [PageHeaderComponent,
    ButtonModule,
    RouterModule,
    DividerModule,
    AccordionModule,
    FileUploadModule,
    TooltipModule,
    CommonModule,
    ConfirmDialogModule,
    FormsModule,
    TextareaModule,
    MenuModule, DialogModule],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }

  env = environment;
  propertyId = input<number>();
  $destroy: Subject<boolean> = new Subject();

  ownerDetail: OwnerDetail | null = null;
  rejectPopupVisible: boolean = false;

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  loaderService: LoaderService = inject(LoaderService);
  permissionService: PermissionService = inject(PermissionService);
  PERMISSIONS = PERMISSIONS;

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  property: Partial<PropertySearchResultType> = {};
  userId: number = +(localStorage.getItem('loginUserId') || 0);
  private _location = inject(Location);

  ngOnInit(): void {
    if (this.propertyId()) {
      this.getPropertyDetail()
    } else {
      this.router.navigate(['property', 'detail'])
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
              this.router.navigate(['property', 'property-search'])
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
            this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0)
            .pipe(takeUntil(this.$destroy), tap(resp => {
              if(resp.code === 200) {
                this.property = resp.data[0]
              }
            }))
            .subscribe()

          }
        })).subscribe()
  }


  onEditClick(e: Event) {
    // this.messageService.add({
    //   severity: MessageSeverity.CONTRAST,
    //   summary: 'Feature Unavailable',
    //   detail: `Edit feature is only available in mobile app.`, life: MessageDuaraion.LONG, closable: true
    // })

    this.router.navigate(['/property', 'property-entry', this.property?.propertyId])
  }

  onApproveClick(e: Event) {
    this.confirmationService.confirm({
      target: e.target as EventTarget,
      message: 'Please verify the property details. Your approval will be forwarded to your reporting manager for review. Are you sure you want to approve?',
      header: 'Did you verify',
      closable: true,
      closeOnEscape: true,
      key: 'global',
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

      },
    })

  }


  rejectComment: string = ''
  onRejectClick(e: Event) {
    this.rejectPopupVisible = true;
  }

  onRejectConfirm() {
    console.log(this.rejectComment);
    const payload: ApproveRejectPayload = {
      logId: Number(this.property.attribute2),
      comments: this.rejectComment,
      status: 'Rejected',
      approverUserId: this.userId,
      propertyId: this.propertyId() || 0
    }

    this.loaderService.show();
    this.ownerService.approveRejectProperty(payload)
      .pipe(takeUntil(this.$destroy), finalize(() => this.loaderService.hide()),
        map((resp) => {
          if (resp.code === 200 && resp.status === 'Success') {
            this.messageService.add({
              severity: MessageSeverity.SUCCESS, summary: 'Rejected',
              detail: `Propety rejected successfully.`, life: MessageDuaraion.STANDARD
            });
            this.rejectPopupVisible = false;
            this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0)
            .pipe(takeUntil(this.$destroy), tap(resp => {
              if(resp.code === 200) {
                this.property = resp.data[0]
              }
            }))
            .subscribe()
          }
        })).subscribe()
  }


}

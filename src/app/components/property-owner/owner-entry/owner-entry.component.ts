import { APIResponse } from './../../../models/user.model';
import { OwnerServiceService } from './../../../services/owner-service.service';
import { Component, computed, inject, input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUpload, FileUploadErrorEvent, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MasterDataService } from '../../../services/master-data.service';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { MessageModule, Message } from 'primeng/message';
import { CreateOwnerDetail, OwnerDetail, OwnerDocumentUpload, PropertyMaster, PropertySearchResultType, UpdateOwnerDetail } from '../../../models/property-owner.model';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { uniqueAadharValidator } from './uniqueAadharValidator';
import { CAREOF_OPTIONS, GENDER_OPTIONS, SALUTATION_OPTIONS } from '../../../models/constants';
@Component({
  selector: 'app-owner-entry',
  imports: [PageHeaderComponent,
    FluidModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DividerModule,
    InputNumberModule,
    TooltipModule,
    DatePickerModule,
    CheckboxModule,
    FileUploadModule,
    RouterModule, Message],
  templateUrl: './owner-entry.component.html',
  styleUrl: './owner-entry.component.scss'
})

export class OwnerEntryComponent implements OnInit, OnDestroy {
  env = environment;
  $destroy: Subject<null> = new Subject();

  propertyId = input<number>();
  editMode = computed(() => !!this.propertyId());

  @ViewChild('userCertificateUploader') userCertificateUploader!: FileUpload;
  @ViewChild('userIdentityUploader') userIdentityUploader!: FileUpload;
  @ViewChild('userPhotoUploader') userPhotoUploader!: FileUpload;

  userCertificateFile: File | null = null;
  userPhotoFile: File | null = null;
  userIdentityFile: File | null = null;

  ownerDetail!: OwnerDetail | undefined;
  ownerAadhar = signal<string | undefined>(undefined);



  messageService: MessageService = inject(MessageService);
  masterDataService: MasterDataService = inject(MasterDataService);
  router: Router = inject(Router);
  ownerService: OwnerServiceService = inject(OwnerServiceService);
  confirmationService: ConfirmationService = inject(ConfirmationService);


  property: Partial<PropertySearchResultType> = {};
  currentLoggedUsername: string = localStorage.getItem('username') ?? '';

  addNewOwnerForm: FormGroup = new FormGroup({
    salutation: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    careOf: new FormControl('', []),
    guardianName: new FormControl('', []),
    gender: new FormControl('', []),
    mobile: new FormControl('', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    email: new FormControl('', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]),
    pan: new FormControl('', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)]),
    aadhar: new FormControl('', [Validators.pattern('^[0-9]{12}$')]),
    dob: new FormControl('', []),
    isSpecialOwner: new FormControl(null),
  });


  genders = GENDER_OPTIONS;
  salutations = SALUTATION_OPTIONS;
  careOfs = CAREOF_OPTIONS;

  certificateUploadMessage = 'By selecting the checkbox, you confirm that you possess the relevant certificate and are prepared to upload it when required.';




  constructor() { }

  ngOnDestroy(): void {
    this.$destroy.next(null)
  }


  ngOnInit(): void {
    console.log(this.editMode())
    if (this.editMode()) {
      this.getPropertyDetail();
    }
  }


  isInvalid(controlName: string): boolean {
    const control = this.addNewOwnerForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  askConfirmationOnSave(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed with these details of the owner?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Proceed',
      },
      accept: () => {
        this.saveOwnerDetail();
      },
      reject: () => { },
    });

  }



  saveOwnerDetail() {

    const updateOwnerPayload: PropertyMaster = {
      propertyId: this.property.propertyId || 0,
      salutation: this.addNewOwnerForm.value.salutation.value,
      ownerName: this.addNewOwnerForm.value.ownerName,
      careOf: this.addNewOwnerForm.value.careOf.value,
      guardianName: this.addNewOwnerForm.value.guardianName,
      mobile: this.addNewOwnerForm.value.mobile,
      email: this.addNewOwnerForm.value.email,
      pan: this.addNewOwnerForm.value.pan,
      aadhar: this.addNewOwnerForm.value.aadhar,
      dob: this.getDate(this.addNewOwnerForm.value.dob),
      gender: this.addNewOwnerForm.value.gender.value,
      isSpecialOwner: this.addNewOwnerForm.value.isSpecialOwner.length > 0,
      updatedBy: this.currentLoggedUsername
    }

    this.ownerService.updatePropertyMaster(updateOwnerPayload)
      .pipe(
        takeUntil(this.$destroy),
        tap((resp: APIResponse<string>) => {
          if (resp.code === 200 && resp.status === 'Success') {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Owner details updated successfully.', life: MessageDuaraion.STANDARD })
            this.getPropertyDetail();
          } else {
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Error', detail: 'Error while updating owner details.', life: MessageDuaraion.STANDARD })
          }
        })
      ).subscribe()

  }


  getPropertyDetail() {
    this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0)
      .pipe(takeUntil(this.$destroy),
        tap((resp: APIResponse<PropertySearchResultType[]>) => {
          console.log(resp)
          if (resp.code === 200 && resp.status === 'Success') {
            if (resp.data.length > 0) {

              this.property = resp.data[0];

              this.ownerAadhar.set(this.property?.aadhar);

              this.addNewOwnerForm.patchValue({
                salutation: this.salutations.find(curr => String(curr.value).toLowerCase() === String(this.property.salutation).toLowerCase()),
                ownerName: this.property.ownerName,
                careOf: this.careOfs.find(curr => String(curr.value).toLowerCase() === String(this.property.careOf).toLowerCase()),
                guardianName: this.property.guardianName,
                gender: this.genders.find(curr => String(curr.value).toLowerCase() === String(this.property.gender).toLowerCase()),
                mobile: this.property.mobile,
                email: this.property.email,
                pan: this.property.pan,
                aadhar: this.property.aadhar,
                dob: this.property.dob ? new Date(this.property.dob) : new Date(),
                isSpecialOwner: this.property.isSpecialOwner ? ['false'] : [],
              }, { emitEvent: false })
            }
            else
              this.router.navigate(['owner', 'owner-search'])
          }
        }))
      .subscribe()
  }



  show() {
    console.log(this.addNewOwnerForm)
  }



  validateFile(file: File, type: string) {
    const validFormats = ['image/png', 'application/pdf', 'image/jpeg'];
    if (validFormats.indexOf(file.type) >= 0) {
      if (file.size < (2 * 1024 * 1024)) {
        return true
      } else {
        this.clearFile(type);
        this.messageService.add({ severity: MessageSeverity.WARN, summary: 'Large File Size', detail: `Only files up to 2 MB are allowed. Please choose a smaller file.`, life: MessageDuaraion.STANDARD });
        return false;
      }
    } else {
      this.clearFile(type);
      this.messageService.add({ severity: MessageSeverity.WARN, summary: 'Invalid File Format', detail: `Please upload files with png/jpeg/pdf format only.`, life: MessageDuaraion.STANDARD });
      return false;
    }
  }


  onFileSelect(event: FileSelectEvent, type: string) {
    console.log(event)
    const isValid = this.validateFile(event.currentFiles[0], type);
    if (!isValid)
      return;
    if (event.files && event.files.length > 0) {
      if (type === 'specialCertificate') {
        this.userCertificateFile = event.files[0];
      } else if (type === 'identityProof') {
        this.userIdentityFile = event.files[0];
      } else if (type === 'photo') {
        this.userPhotoFile = event.files[0];
      }
    }
  }



  onClear(type: string) {
    console.log('Files cleared! ', type);
    if (type === 'specialCertificate') {
      this.userCertificateFile = null; // Clear our stored file
    } else if (type === 'identityProof') {
      this.userIdentityFile = null;
    } else if (type === 'photo') {
      this.userPhotoFile = null;
    }

  }



  clearFile(type: string) {
    if (type === 'specialCertificate') {
      this.userCertificateFile = null;
      if (this.userCertificateUploader) {
        this.userCertificateUploader.clear(); // This clears the internal file list of the component
      }
    } else if (type === 'identityProof') {
      this.userIdentityFile = null;
      if (this.userIdentityUploader) {
        this.userIdentityUploader.clear(); // This clears the internal file list of the component
      }
    } else if (type === 'photo') {
      this.userPhotoFile = null;
      if (this.userPhotoUploader) {
        this.userPhotoUploader.clear(); // This clears the internal file list of the component
      }
    }

  }



  onUpload(e: FileUploadErrorEvent, type: string) {
    console.log(e)
    console.log('on upload ' + type)
    const file = e.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      const fileNameParts = e.files[0].name.split('.');
      const newFileNameWithoutExtention = fileNameParts.slice(0, fileNameParts.length - 1).join('_');

      // const payload: OwnerDocumentUpload = {
      //   "ownerId": Number(this.ownerId() || 0),
      //   "documentType": type,
      //   "documentName": newFileNameWithoutExtention,
      //   "documentBase64data": reader.result
      // }

      // this.ownerService.uploadDocument(payload).pipe(takeUntil(this.$destroy))
      //   .subscribe({
      //     next: (resp: APIResponse<string>) => {
      //       if (resp.code === 200) {
      //         this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: `Uploaded successfully.`, life: MessageDuaraion.STANDARD });
      //         this.clearFile(type);
      //       }
      //     }
      //   })
    };


  }



  getDate(date: Date | string) {
    const d = new Date(date).getTime() + 19800000;
    return new Date(d).toISOString();
  }



}

import { Location } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { forkJoin, map, Subject, takeUntil, tap } from 'rxjs';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { TRANSACTION_REMARKS } from '../../../../models/constants';
import { AddDemandTxnType, DemandList, PropertySearchResultType } from '../../../../models/property-owner.model';
import { OwnerServiceService } from '../../../../services/owner-service.service';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";

@Component({
  selector: 'app-demand-payment',
  imports: [PageHeaderComponent, SelectModule,
    ReactiveFormsModule, InputTextModule,
    DatePickerModule, ButtonModule, FileUploadModule
  ],
  templateUrl: './demand-payment.component.html',
  styleUrl: './demand-payment.component.scss'
})
export class DemandPaymentComponent implements OnInit, OnDestroy {

  propertyId = input<number>();
  demandId = input<number>();

  $destroy: Subject<boolean> = new Subject();
  remarkOptions = TRANSACTION_REMARKS;
  currentLoggedUserId: string = localStorage.getItem('loginUserId') || '0';

  minDate = new Date()

  property: Partial<PropertySearchResultType> = {};
  demand: Partial<DemandList> = {};

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);
  private _location = inject(Location);

  disableAmount = false;
  disableTransactionNo = false;
  showNextVisitDate = false;
  showCustomReason = false;
  hideAmountTxn = false;

  file!: File;
  fileName: string | null = '';
  fileContent: string = '';
  latLong: string = '';
  gettingLocation = false;

  paymentForm: FormGroup = new FormGroup({
    remarks: new FormControl(''),
    amountPaid: new FormControl(''),
    paymentTxnNumber: new FormControl(''),
    nextVisitDate: new FormControl(),
    customReason: new FormControl(),

  })

  ngOnDestroy(): void {
    this.$destroy.next(true)
  }



  ngOnInit(): void {
    this.paymentForm.get('remarks')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      map((remark) => {
        console.log(remark);
        if (remark.value === 1) {
          this.disableAmount = true;
          this.disableTransactionNo = false;
          this.showCustomReason = false;
          this.showNextVisitDate = false;
          this.hideAmountTxn = false;
          this.paymentForm.patchValue({
            amountPaid: this.demand.amountPending,
            nextVisitDate: null,
            customReason: '',
            paymentTxnNumber: ''
          });
        } else if (remark.value === 2) {
          this.disableAmount = false;
          this.disableTransactionNo = false;
          this.showCustomReason = false;
          this.showNextVisitDate = false;
          this.hideAmountTxn = false;
          this.paymentForm.patchValue({
            amountPaid: 0,
            nextVisitDate: null,
            customReason: '',
            paymentTxnNumber: ''
          });
        } else if (remark.value === 4) {
          // asked to come later
          this.disableAmount = true;
          this.disableTransactionNo = true;
          this.showCustomReason = false;
          this.showNextVisitDate = true;
          this.hideAmountTxn = true;
          this.paymentForm.patchValue({
            amountPaid: 0,
            nextVisitDate: new Date(),
            customReason: '',
            paymentTxnNumber: ''
          });
        } else if (remark.value === 8) {
          // others
          this.disableAmount = true;
          this.disableTransactionNo = true;
          this.showCustomReason = true;
          this.showNextVisitDate = false;
          this.hideAmountTxn = true;
          this.paymentForm.patchValue({
            amountPaid: 0,
            nextVisitDate: null,
            customReason: '',
            paymentTxnNumber: ''
          });
        } else if (remark.value === 3 || remark?.value === 5 || remark?.value === 6) {
          // others
          this.disableAmount = true;
          this.disableTransactionNo = true;
          this.showCustomReason = false;
          this.showNextVisitDate = false;
          this.hideAmountTxn = true;
          this.paymentForm.patchValue({
            amountPaid: 0,
            nextVisitDate: null,
            customReason: '',
            paymentTxnNumber: ''
          });
        }
      })
    ).subscribe();



    forkJoin([this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0)
      , this.ownerService.getDemandsOfProperty(this.propertyId() || 0, 0, 0)
    ])
      .pipe(takeUntil(this.$destroy),
        tap(([propertyResp, demandsResp]) => {
          if (propertyResp.code === 200) {
            this.property = propertyResp.data[0]
          }

          if (demandsResp.code === 200) {
            const index = demandsResp.data.demands.findIndex(c => c.demandId === +(this.demandId() || 0))
            this.demand = index >= 0 ? demandsResp.data.demands[index] : {};
            this.paymentForm.patchValue({
              remarks: TRANSACTION_REMARKS[0]
            })
            console.log(this.demand)
          }
        })
      )
      .subscribe()
  }


  onFileSelectWeb(e: FileSelectEvent) {
    this.processFile(e.files[0])
  }

  processFile(f: File) {
    console.log(f);
    this.file = f;
    this.fileName = f.name;

    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => {
      this.fileContent = reader.result as string;
    }
  }


  getCurrentLocation() {
    console.log('getCurrentLocation ');
    this.gettingLocation = true;
    this.ownerService.getCurrentLocation().subscribe({
      next: (position) => {
        this.latLong = position.coords.latitude + '; ' + position.coords.longitude;
        console.log('User Location:', position.coords);
        this.gettingLocation = false;
      },
      error: (err) => {
        this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Error getting location.', detail: err, life: MessageDuaraion.STANDARD })

        console.error('Error getting location:', err);
        this.latLong = '';
        this.gettingLocation = false;
      }
    });
  }


  onSubmit() {
    console.log(this.paymentForm.value);
    const regex = /^\d+(\.\d{2})?$/;
    if (this.paymentForm.value.remarks.value === 1 || this.paymentForm.value.remarks.value === 2) {
      if (this.paymentForm.value.amountPaid > +(this.demand?.amountPending || 0)) {
        this.messageService.add({ severity: MessageSeverity.INFO, summary: 'Invalid  Amount', detail: `Entered amount cannot exceed pending amount.`, life: MessageDuaraion.STANDARD })
        return;
      } else if (this.paymentForm.value.paymentTxnNumber.trim() === '') {
        this.messageService.add({ severity: MessageSeverity.INFO, summary: 'Invalid Transaction Id', detail: `Please enter transaction id.`, life: MessageDuaraion.STANDARD })
        return;
      } else if (!regex.test(this.paymentForm.value.amountPaid)) {
        this.messageService.add({ severity: MessageSeverity.INFO, summary: 'Invalid Amount.', detail: `Please enter a valid amount.`, life: MessageDuaraion.STANDARD })
        return;
      } else if (+this.paymentForm.value.amountPaid === 0) {
        this.messageService.add({ severity: MessageSeverity.INFO, summary: 'Invalid Amount.', detail: `Amount cannot be zero.`, life: MessageDuaraion.STANDARD })
        return;
      }
    } else if (this.paymentForm.value.remarks.value === 8 && this.paymentForm.value.customReason.trim() === '') {
      this.messageService.add({ severity: MessageSeverity.INFO, summary: 'Error Custom Reason.', detail: `Please enter custom reason.`, life: MessageDuaraion.STANDARD })
      return;
    }

    const paylaod: AddDemandTxnType = {
      billDate: this.getDate(new Date().toISOString()),
      txnDate: this.getDate(new Date().toISOString()),
      billNo: 0,
      propertyId: this.property.propertyId || 0,
      demandId: this.demand.demandId || 0,
      amountPaid: [1, 2].includes(Number(this.paymentForm.value.remarks.value || 0)) ? this.paymentForm.value.amountPaid : 0,
      remarks: String(this.paymentForm.value.remarks.value) || '',
      customReason: this.paymentForm.value.customReason,
      paymentTxnNumber: this.paymentForm.value.paymentTxnNumber,
      nextVisitDate: this.paymentForm.value.remarks.value === 4 ? this.getDate(this.paymentForm.value.nextVisitDate.toISOString()) : null,
      attribute0: this.currentLoggedUserId,
      attribute1: '',
      attribute2: this.latLong,
      attribute3: '',
      attribute4: '',
      imageFilename: this.file.name.split('.').slice(0, -1).join(), // remove the extension
      imageContent: this.fileContent,
      imageType: this.file.type
    }


    this.ownerService.addDemandTransaction(paylaod)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp) => {
          console.log(resp);
          if (resp.code === 200 && resp.status === 'Success') {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Transaction Success', detail: `Transaction added succcesfully.`, life: MessageDuaraion.STANDARD });
            this._location.back();
          } else {
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Transaction Failed', detail: `Failed while adding transaction.`, life: MessageDuaraion.STANDARD })
          }
        }
      })

  }


  getDate(date: Date | string) {
    const d = new Date(date).getTime() + 19800000;
    return new Date(d).toISOString();
  }

  onFileSelectMob(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      this.processFile(fileList[0])
    }
  }
}

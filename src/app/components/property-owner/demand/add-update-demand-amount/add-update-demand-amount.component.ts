import { Component, inject, input, OnDestroy, OnInit, Pipe } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { catchError, map, Observable, of, Subject, take, takeUntil, tap } from 'rxjs';
import { Fy } from '../../../../models/master-data.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { APIResponse } from '../../../../models/user.model';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OwnerServiceService } from '../../../../services/owner-service.service';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-update-demand-amount',
  imports: [PageHeaderComponent, ReactiveFormsModule, SelectModule, ButtonModule, InputTextModule],
  templateUrl: './add-update-demand-amount.component.html',
  styleUrl: './add-update-demand-amount.component.scss'
})
export class AddUpdateDemandAmountComponent implements OnInit, OnDestroy {
  propertyId = input<number>();
  $destroy: Subject<boolean> = new Subject();
  fys: Fy[] = [];
  existngFyIds = JSON.parse(sessionStorage.getItem('demandids') || '[]')
  private masterDataService: MasterDataService = inject(MasterDataService);
  private ownerService: OwnerServiceService = inject(OwnerServiceService);
  messageService: MessageService = inject(MessageService);
  demandForm: FormGroup = new FormGroup({
    fy: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.validateFyId.bind(this)]
    }),
    dueFromPrevYear: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]),
    currentFyAmount: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]),
  })

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }



  ngOnInit(): void {
    console.log(this.existngFyIds)
    this.masterDataService.fyList(0, 0)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{ fys: Fy[], totalCount: number }>) => {
          console.log(resp)
          if (resp.code === 200) {
            this.fys = resp.data.fys;
          }
        }
      })
  }


  validateFyId(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(this.existngFyIds.includes(control.value.fyId))
      .pipe(
        map(taken => {
          if (taken) {
            return { 'fyid': true }
          } else {
            return null
          }
        }),
        catchError(() => of(null)))
  }


  isInvalid(control: string) {
    return this.demandForm.controls[control].errors
  }


  onDemandAdd() {
    console.log(this.demandForm.value)

    const payload = [
      {
        "fyId": this.demandForm.value.fy.fyId,
        "dueFromPrevYear": Number(this.demandForm.value.dueFromPrevYear),
        "currentMonthlyCharge": (+this.demandForm.value.currentFyAmount / 12),
        "noOfMonths": 12,
        "currentFyAmount": Number(this.demandForm.value.currentFyAmount),
        "totalAmount": Number(this.demandForm.value.dueFromPrevYear) + Number(this.demandForm.value.currentFyAmount),
        "demandNo": "",
        "amountPaid": 0,
        "amountPending": Number(this.demandForm.value.dueFromPrevYear) + Number(this.demandForm.value.currentFyAmount),
        "propertyId": +(this.propertyId() || 0),
        "demandGeneratedDate": null,
        "demandGeneratedBy": 0,
        "demandFile": ""
      }
    ]

    console.log(payload)
    this.ownerService.addDemand(payload)
      .pipe(takeUntil(this.$destroy),
        tap(resp => {
          console.log(resp)
          if (resp.code === 200) {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Demand Added Successfully.', life: MessageDuaraion.STANDARD })
            inject(Location).back();
          } else {
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Demand Addition Failed.', life: MessageDuaraion.STANDARD })
          }
        }))
      .subscribe()

  }



}

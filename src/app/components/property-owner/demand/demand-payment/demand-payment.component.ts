import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { DemandList, PropertySearchResultType } from '../../../../models/property-owner.model';
import { OwnerServiceService } from '../../../../services/owner-service.service';
import { MessageService } from 'primeng/api';
import { TRANSACTION_REMARKS } from '../../../../models/constants';
import { SelectModule } from 'primeng/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-demand-payment',
  imports: [PageHeaderComponent, SelectModule,
    ReactiveFormsModule, InputTextModule,
    DatePickerModule,
  ],
  templateUrl: './demand-payment.component.html',
  styleUrl: './demand-payment.component.scss'
})
export class DemandPaymentComponent implements OnInit, OnDestroy {

  propertyId = input<number>();
  demandId = input<number>();

  $destroy: Subject<boolean> = new Subject();
  remarkOptions = TRANSACTION_REMARKS;

  minDate= new Date()

  property: Partial<PropertySearchResultType> = {};
  demand: Partial<DemandList> = {};

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);


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
    forkJoin([this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0)
      , this.ownerService.getDemandsOfProperty(this.propertyId() || 0, 0, 0)
    ])
      .pipe(takeUntil(this.$destroy),
        tap(([propertyResp, demandsResp]) => {
          if (propertyResp.code === 200) {
            this.property = propertyResp.data[0]
          }

          if (demandsResp.code === 200) {
            console.log(this.demandId())
            const index = demandsResp.data.demands.findIndex(c => c.demandId === +(this.demandId() || 0))

            this.demand = index >= 0 ? demandsResp.data.demands[index] : {}
            console.log(this.demand)
          }
        })
      )
      .subscribe()
  }

}

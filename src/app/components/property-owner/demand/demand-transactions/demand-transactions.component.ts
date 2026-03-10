import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { OwnerServiceService } from '../../../../services/owner-service.service';
import { MessageService } from 'primeng/api';
import { DemandTransactionRecord, PropertySearchResultType } from '../../../../models/property-owner.model';
import { DatePipe } from '@angular/common';
import { TRANSACTION_REMARKS } from '../../../../models/constants';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demand-transactions',
  imports: [PageHeaderComponent, DatePipe, InputSwitchModule, FormsModule],
  templateUrl: './demand-transactions.component.html',
  styleUrl: './demand-transactions.component.scss'
})
export class DemandTransactionsComponent implements OnInit, OnDestroy {
  propertyId = input<number>();
  demandId = input<number>();
  $destroy: Subject<boolean> = new Subject();

  property: Partial<PropertySearchResultType> = {};
  allTransactions: DemandTransactionRecord[] = [];
  filteredTransactions: DemandTransactionRecord[] = [];
  showAll = true;

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);

  

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }



  ngOnInit(): void {
    // console.log(this.propertyId());

    forkJoin([this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0),
    this.ownerService.getDemandsTxnOfProperty(this.propertyId() || 0, this.demandId() || 0)]).pipe(
      takeUntil(this.$destroy),
      tap(([propertyResp, txnResp]) => {
        console.log(propertyResp)
        if (txnResp.code === 200) {
          this.allTransactions = txnResp.data.map(c => ({ ...c, remarkLabel: this.getRemarksLabel(c.remarks) }));
          this.filteredTransactions = ([] as DemandTransactionRecord[]).concat(this.allTransactions);
        }

        if (propertyResp.code === 200) {
          this.property = propertyResp.data[0];
        }
      })
    ).subscribe()
  }



  getRemarksLabel(remarkValue: number | string) {
    return TRANSACTION_REMARKS.find(c => +c.value === +remarkValue)?.label;
  }



  onChangeSwitch(e: InputSwitchChangeEvent) {
    // console.log(e)
    this.showAll = e.checked;
    if(e.checked) {
      this.filteredTransactions = ([] as DemandTransactionRecord[]).concat(this.allTransactions);
    } else {
      this.filteredTransactions = this.allTransactions.filter(c => +c.amountPaid > 0);
    }
  }
}

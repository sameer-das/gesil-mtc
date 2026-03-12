import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { Subject, takeUntil } from 'rxjs';
import { Fy } from '../../../../models/master-data.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { APIResponse } from '../../../../models/user.model';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-add-update-demand-amount',
  imports: [PageHeaderComponent, ReactiveFormsModule, SelectModule, ButtonModule, InputTextModule],
  templateUrl: './add-update-demand-amount.component.html',
  styleUrl: './add-update-demand-amount.component.scss'
})
export class AddUpdateDemandAmountComponent implements OnInit, OnDestroy {

  $destroy: Subject<boolean> = new Subject();
  fys: Fy[] = [];
  private masterDataService: MasterDataService = inject(MasterDataService);

  demandForm: FormGroup = new FormGroup({
    fy: new FormControl('', [Validators.required]),
    dueFromPrevYear: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]),
    currentFyAmount: new FormControl(0, [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]),
  })

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }



  ngOnInit(): void {
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


  onDemandAdd() {
    console.log(this.demandForm.value)
  }



}

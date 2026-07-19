import { Component, computed, DestroyRef, inject, input, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CreateUsageType } from '../../../../models/master-data.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';


@Component({
  selector: 'app-usage-type-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, ButtonModule,
    InputTextModule, InputNumberModule
  ],
  templateUrl: './usage-type-create.component.html',
  styleUrl: './usage-type-create.component.scss'
})
export class UsageTypeCreateComponent implements OnInit {
  usageTypeId = input<number | undefined>();
  editMode = computed(() => !!this.usageTypeId());
  destroyRef = inject(DestroyRef);

  private masterDataService: MasterDataService = inject(MasterDataService);
  private messageService: MessageService = inject(MessageService);

  createUsageTypeForm = new FormGroup({
    usageTypeName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    chargesPerMonth: new FormControl<number>(0.00, { nonNullable: true, validators: [Validators.required] }),
    chargesPerYear: new FormControl<number>(0.00, { nonNullable: true, validators: [Validators.required] }),
    attribute0: new FormControl<string>('', { nonNullable: true }),
    attribute1: new FormControl<string>('', { nonNullable: true }),
    attribute2: new FormControl<string>('', { nonNullable: true }),
    attribute3: new FormControl<string>('', { nonNullable: true }),
  })



  ngOnInit(): void {
    const monthlyCtrl = this.createUsageTypeForm.get('chargesPerMonth');
    const yearlyCtrl = this.createUsageTypeForm.get('chargesPerYear');

    monthlyCtrl?.valueChanges.subscribe(value => {
      if (!value) {
        yearlyCtrl?.setValue(0.00, { emitEvent: false });
        return;
      }
      yearlyCtrl?.setValue(+(Number(value) * 12).toFixed(2), { emitEvent: false });
    });

    yearlyCtrl?.valueChanges.subscribe(value => {
      if (!value) {
        monthlyCtrl?.setValue(0.00, { emitEvent: false });
        return;
      }
      monthlyCtrl?.setValue(+(Number(value) / 12).toFixed(2), { emitEvent: false });
    });


    if (this.editMode()) {
      this.getUsageType()
    }
  }



  getUsageType() {
    this.masterDataService.getUsageType(this.usageTypeId(), 0, 0).pipe(
      tap(resp => {
        if (resp.code === 200) {
          this.createUsageTypeForm.patchValue({
            usageTypeName: resp.data.usageTypes[0].usageTypeName,
            chargesPerMonth: resp.data.usageTypes[0].chargesPerMonth,
            chargesPerYear: resp.data.usageTypes[0].chargesPerYear,
            attribute0: resp.data.usageTypes[0].attribute0,
            attribute1: resp.data.usageTypes[0].attribute1,
            attribute2: resp.data.usageTypes[0].attribute2,
            attribute3: resp.data.usageTypes[0].attribute3,
          })
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }



  onSaveUsageType() {
    console.log(this.createUsageTypeForm.value)
    const payload: CreateUsageType = {
      usageTypeId: this.editMode() ? (this.usageTypeId() || 0) : 0,
      usageTypeName: this.createUsageTypeForm.value.usageTypeName || '',
      chargesPerMonth: this.createUsageTypeForm.value.chargesPerMonth || 0.00,
      chargesPerYear: this.createUsageTypeForm.value.chargesPerYear || 0.00,
      active: true,
      attribute0: this.createUsageTypeForm.value.attribute0 ?? '',
      attribute1: this.createUsageTypeForm.value.attribute1 ?? '',
      attribute2: this.createUsageTypeForm.value.attribute2 ?? '',
      attribute3: this.createUsageTypeForm.value.attribute3 ?? '',
    }

    this.masterDataService.updateCreateUsageType(payload)
      .pipe(tap(resp => {
        console.log(resp)
        if (resp.code === 200 && resp.data === 'S') {
          this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: `Usage Type ${this.editMode() ? 'updated' : 'created'} successfully.`, life: MessageDuaraion.STANDARD });
          if(!this.editMode()) {
            this.createUsageTypeForm.reset();
          }
        } else {
          this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: `Usage Type ${this.editMode() ? 'update' : 'create'} failed.`, life: MessageDuaraion.STANDARD })
        }
      }), takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

}

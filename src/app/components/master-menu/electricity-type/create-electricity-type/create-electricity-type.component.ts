import { Component, computed, inject, input } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ElectricityConnectionType } from '../../../../models/master-data.model';
import { map, Subject, takeUntil } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { MessageService } from 'primeng/api';
import { APIResponse } from '../../../../models/user.model';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';

@Component({
  selector: 'app-create-electricity-type',
  imports: [PageHeaderComponent, ReactiveFormsModule, InputTextModule, ButtonModule, RouterModule],
  templateUrl: './create-electricity-type.component.html',
  styleUrl: './create-electricity-type.component.scss'
})
export class CreateElectricityTypeComponent {
  electricityConnectionId = input<number | undefined>();
  editMode = computed(() => !!this.electricityConnectionId());
  $destroy: Subject<null> = new Subject();

  electricityConnectionForm: FormGroup = new FormGroup({
    electricityConnectionName: new FormControl('', [Validators.required])
  });

  private masterDataService: MasterDataService = inject(MasterDataService);
  private messageService: MessageService = inject(MessageService);

  private electricityConnectionDetail!: ElectricityConnectionType;

  constructor() {
  }



  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    if (this.editMode()) {
      this.masterDataService.getElectricityConnectionTypeDetail(this.electricityConnectionId() || 0)
        .pipe(takeUntil(this.$destroy),
          map((resp: APIResponse<ElectricityConnectionType>) => {
            if (resp.code === 200 && resp.status === 'Success') {
              this.electricityConnectionDetail = resp.data;
              this.electricityConnectionForm.patchValue({
                electricityConnectionName: resp.data.electricityConnectionName
              })
            }
          }))
        .subscribe()
    }
  }



  onSaveElectricityType() {
    console.log(this.electricityConnectionForm.value)
    if (this.editMode()) {
      // Update Mode

      const payload : ElectricityConnectionType= {
        electricityConnectionId: this.electricityConnectionDetail.electricityConnectionId,
        electricityConnectionName: this.electricityConnectionForm.value.electricityConnectionName
      }

      this.masterDataService.updateElectricityConnectionType(payload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Electricity Type updated successfully.', life: MessageDuaraion.STANDARD });
              this.electricityConnectionForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Electricity Type updated failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
    else {
      // Create Mode

      const createElectricityPayload = { electricityConnectionName: this.electricityConnectionForm.value.electricityConnectionName.trim() }
      this.masterDataService.createElectricityConnectionType(createElectricityPayload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Electricity Type created successfully.', life: MessageDuaraion.STANDARD });
              this.electricityConnectionForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Electricity Type creation failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
  }
}

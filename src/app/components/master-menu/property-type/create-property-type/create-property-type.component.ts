import { Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { map, Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MasterDataService } from '../../../../services/master-data.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { APIResponse } from '../../../../models/user.model';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { PropertyType } from '../../../../models/master-data.model';

@Component({
  selector: 'app-create-property-type',
  imports: [PageHeaderComponent, ButtonModule, RouterModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './create-property-type.component.html',
  styleUrl: './create-property-type.component.scss'
})
export class CreatePropertyTypeComponent implements OnInit, OnDestroy {

  propertyTypeId = input<number | undefined>();
  editMode = computed(() => !!this.propertyTypeId());
  $destroy: Subject<null> = new Subject();

  propertyTypeForm: FormGroup = new FormGroup({
    propertyTypeName: new FormControl('', [Validators.required])
  });

  private masterDataService: MasterDataService = inject(MasterDataService);
  private messageService: MessageService = inject(MessageService);

  private propertyTypeDetail!: PropertyType;

  constructor() {
  }



  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    if (this.editMode()) {
      this.masterDataService.getPropertyTypeDetail(this.propertyTypeId() || 0)
        .pipe(takeUntil(this.$destroy),
          map((resp: APIResponse<PropertyType>) => {
            if (resp.code === 200 && resp.status === 'Success') {
              this.propertyTypeDetail = resp.data;
              this.propertyTypeForm.patchValue({
                propertyTypeName: resp.data.propertyTypeName
              })
            }
          }))
        .subscribe()
    }
  }



  onSavePropertyType() {
    console.log(this.propertyTypeForm.value)
    if (this.editMode()) {
      // Update Mode

      const payload : PropertyType= {
        propertyTypeId: this.propertyTypeDetail.propertyTypeId,
        propertyTypeName: this.propertyTypeForm.value.propertyTypeName
      }

      this.masterDataService.updatePropertyType(payload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Property Type updated successfully.', life: MessageDuaraion.STANDARD });
              this.propertyTypeForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Property Type updated failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
    else {
      // Create Mode

      const createPropertyTypePayload = { propertyTypeName: this.propertyTypeForm.value.propertyTypeName.trim() }
      this.masterDataService.createPropertyType(createPropertyTypePayload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Property Type created successfully.', life: MessageDuaraion.STANDARD });
              this.propertyTypeForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Property Type creation failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
  }
}

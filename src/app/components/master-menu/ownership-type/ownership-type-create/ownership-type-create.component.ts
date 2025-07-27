import { Component, computed, inject, input } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { OwnershipType } from '../../../../models/master-data.model';
import { map, Subject, takeUntil } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { MessageService } from 'primeng/api';
import { APIResponse } from '../../../../models/user.model';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-ownership-type-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './ownership-type-create.component.html',
  styleUrl: './ownership-type-create.component.scss'
})
export class OwnershipTypeCreateComponent {
  ownershipTypeId = input<number | undefined>();
  editMode = computed(() => !!this.ownershipTypeId());
  $destroy: Subject<null> = new Subject();

  ownershipTypeForm: FormGroup = new FormGroup({
    ownershipTypeName: new FormControl('', [Validators.required])
  });

  private masterDataService: MasterDataService = inject(MasterDataService);
  private messageService: MessageService = inject(MessageService);

  private ownershipTypeDetail!: OwnershipType;

  constructor() {
  }



  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    if (this.editMode()) {
      this.masterDataService.getOwnershipTypeDetail(this.ownershipTypeId() || 0)
        .pipe(takeUntil(this.$destroy),
          map((resp: APIResponse<OwnershipType>) => {
            if (resp.code === 200 && resp.status === 'Success') {
              this.ownershipTypeDetail = resp.data;
              this.ownershipTypeForm.patchValue({
                ownershipTypeName: resp.data.ownershipTypeName
              })
            }
          }))
        .subscribe()
    }
  }



  onSaveOwnershipType() {
    console.log(this.ownershipTypeForm.value)
    if (this.editMode()) {
      // Update Mode

      const payload : OwnershipType= {
        ownershipTypeId: this.ownershipTypeDetail.ownershipTypeId,
        ownershipTypeName: this.ownershipTypeForm.value.ownershipTypeName
      }

      this.masterDataService.updateOwnershipType(payload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Ownership Type updated successfully.', life: MessageDuaraion.STANDARD });
              this.ownershipTypeForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Ownership Type updated failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
    else {
      // Create Mode

      const createOwnershipTypePayload = { ownershipTypeName: this.ownershipTypeForm.value.ownershipTypeName.trim() }
      this.masterDataService.createOwnershipType(createOwnershipTypePayload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Ownership Type created successfully.', life: MessageDuaraion.STANDARD });
              this.ownershipTypeForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Ownership Type creation failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
  }
}

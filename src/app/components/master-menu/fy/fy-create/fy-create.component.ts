import { Component, computed, inject, input, OnDestroy } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { APIResponse } from '../../../../models/user.model';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { Fy } from '../../../../models/master-data.model';

@Component({
  selector: 'app-fy-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, InputTextModule, ButtonModule,],
  templateUrl: './fy-create.component.html',
  styleUrl: './fy-create.component.scss'
})
export class FyCreateComponent implements OnDestroy {

  fyId = input<number | undefined>();
  editMode = computed(() => !!this.fyId());
  $destroy: Subject<null> = new Subject();

  fyForm: FormGroup = new FormGroup({
    fyName: new FormControl('', [Validators.required])
  });

  private masterDataService: MasterDataService = inject(MasterDataService);
  private messageService: MessageService = inject(MessageService);

  constructor() {
  }



  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }



  ngOnInit(): void {
    if (this.editMode()) {
      // Fetch the FY detail
      if (this.fyId()) {
        this.masterDataService.fyDetail(this.fyId()!)
          .pipe(takeUntil(this.$destroy))
          .subscribe({
            next: (resp: APIResponse<Fy>) => {
              if (resp.code === 200 && resp.data) {
                this.fyForm.patchValue({ fyName: resp.data.fyName }, { emitEvent: false });
              } else {
                this.fyForm.patchValue({ fyName: '' }, { emitEvent: false });
                // this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Financial Year Details Fetch rror.', life: MessageDuaraion.STANDARD })
              }
            }
          });
      }
    }
  }


  onSaveFy() {
    if (!this.editMode()) {
      this.masterDataService.createFy(this.fyForm.value.fyName.trim())
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Financial Year created successfully.', life: MessageDuaraion.STANDARD });
              this.fyForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Financial Year creation failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    } else {
      // Edit mode
      const fyUpdatePayload: Fy = {
        fyId: this.fyId() ?? 0,
        fyName: this.fyForm.value.fyName.trim()
      }
      this.masterDataService.updateFy(fyUpdatePayload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Financial Year updated successfully.', life: MessageDuaraion.STANDARD });
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Financial Year update failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
  }

}

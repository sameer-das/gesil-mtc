import { Component, computed, inject, input } from '@angular/core';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil, tap } from 'rxjs';
import { CreateUpdateMohalla, Mohalla } from '../../../../models/master-data.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { APIResponse } from '../../../../models/user.model';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';

@Component({
  selector: 'app-mohalla-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './mohalla-create.component.html',
  styleUrl: './mohalla-create.component.scss'
})
export class MohallaCreateComponent {
  mohallaId = input<number | undefined>();
  editMode = computed(() => !!this.mohallaId());

  $destroy: Subject<null> = new Subject();

  mohallaForm: FormGroup = new FormGroup({
    mohallaName: new FormControl('', [Validators.required])
  });

  mohallaDetails!: Mohalla;


  masterDataService: MasterDataService = inject(MasterDataService);
  messageService: MessageService = inject(MessageService);
  route: ActivatedRoute = inject(ActivatedRoute);



  ngOnDestroy(): void {
    this.$destroy.next(null);
  }



  ngOnInit(): void {
    if (this.editMode() && this.mohallaId()) {
      this.masterDataService.mohallaDetails(this.mohallaId() || 0).pipe(
        takeUntil(this.$destroy),
        tap((resp: APIResponse<Mohalla>) => {
          console.log(resp);
          if (resp.code === 200) {
            this.mohallaDetails = resp.data;
            this.mohallaForm.patchValue({
              mohallaName: this.mohallaDetails.mohallaName
            });
          }
        })
      ).subscribe()
    }
  }





  onSaveMohalla() {
    console.log(this.mohallaForm.value)
    if (!this.editMode()) {
      // Create Mode
      const createMohalla: CreateUpdateMohalla = { mohallaName: this.mohallaForm.value.mohallaName.trim() };
      this.masterDataService.createMohalla(createMohalla)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200) {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Mohalla created successfully.', life: MessageDuaraion.STANDARD });
              this.mohallaForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Mohalla creation failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    } else {
      // Edit/Update Mode
      const updateMohalla: CreateUpdateMohalla = {
        mohallaId: this.mohallaId() || 0,
        mohallaName: this.mohallaForm.value.mohallaName
      }
      this.masterDataService.updateMohalla(updateMohalla).pipe(
        takeUntil(this.$destroy)
      ).subscribe({
        next: (resp: APIResponse<string>) => {
          if (resp.code === 200) {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Mohalla updated successfully.', life: MessageDuaraion.STANDARD });
          } else {
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Mohalla update failed.', life: MessageDuaraion.STANDARD })
          }
        }
      })
    }
  }
}

import { CreateUpdateZone } from './../../../../models/master-data.model';
import { Component, computed, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Zone } from '../../../../models/master-data.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { APIResponse } from '../../../../models/user.model';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-zone-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './zone-create.component.html',
  styleUrl: './zone-create.component.scss'
})
export class ZoneCreateComponent implements OnInit, OnDestroy {

  zoneId = input<number | undefined>();
  editMode = computed(() => !!this.zoneId());

  $destroy: Subject<null> = new Subject();

  zoneForm: FormGroup = new FormGroup({
    zoneName: new FormControl('', [Validators.required])
  });

  zoneDetails!: Zone;


  masterDataService: MasterDataService = inject(MasterDataService);
  messageService: MessageService = inject(MessageService);
  route: ActivatedRoute = inject(ActivatedRoute);



  ngOnDestroy(): void {
    this.$destroy.next(null);
  }



  ngOnInit(): void {
    if (this.editMode() && this.zoneId()) {
      this.masterDataService.zoneDetails(this.zoneId() || 0).pipe(
        takeUntil(this.$destroy),
        tap((resp: APIResponse<Zone>) => {
          console.log(resp);
          if (resp.code === 200) {
            this.zoneDetails = resp.data;
            this.zoneForm.patchValue({
              zoneName: this.zoneDetails.zoneName
            });
          }
        })
      ).subscribe()
    }
  }





  onSaveZone() {
    console.log(this.zoneForm.value)
    if (!this.editMode()) {
      // Create Mode
      const createZone: CreateUpdateZone = { zoneName: this.zoneForm.value.zoneName.trim() };
      this.masterDataService.createZone(createZone)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200) {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Zone created successfully.', life: MessageDuaraion.STANDARD });
              this.zoneForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Zone creation failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    } else {
      // Edit/Update Mode
      const updateZone: CreateUpdateZone = {
        zoneId: this.zoneId() || 0,
        zoneName: this.zoneForm.value.zoneName
      }
      this.masterDataService.updateZone(updateZone).pipe(
        takeUntil(this.$destroy)
      ).subscribe({
        next: (resp: APIResponse<string>) => {
          if (resp.code === 200) {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Zone updated successfully.', life: MessageDuaraion.STANDARD });
          } else {
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Zone update failed.', life: MessageDuaraion.STANDARD })
          }
        }
      })
    }
  }
}

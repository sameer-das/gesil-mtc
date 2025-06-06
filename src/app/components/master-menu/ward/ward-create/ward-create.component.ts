import { Zone } from './../../../../models/master-data.model';
import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { CreateUpdateWard, Ward } from '../../../../models/master-data.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { APIResponse } from './../../../../models/user.model';

@Component({
  selector: 'app-ward-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './ward-create.component.html',
  styleUrl: './ward-create.component.scss'
})
export class WardCreateComponent implements OnInit, OnDestroy {


  wardId = input<number | undefined>();
  editMode = computed(() => !!this.wardId());
  $destroy: Subject<null> = new Subject();

  wardDetails = signal<Ward | null>(null);
  zones = signal<Zone[]>([]);


  masterDataService: MasterDataService = inject(MasterDataService);
  messageService: MessageService = inject(MessageService);
  route: ActivatedRoute = inject(ActivatedRoute);

  wardForm = new FormGroup({
    wardNumber: new FormControl<string>('', [Validators.required]),
    wardName: new FormControl<string>('', [Validators.required]),
    zone: new FormControl<Zone | null>(null, [Validators.required])
  });




  ngOnDestroy(): void {
    this.$destroy.next(null);
  }



  ngOnInit(): void {

    if (this.editMode()) {
      forkJoin([
        this.masterDataService.wardDetails(this.wardId() || 0),
        this.masterDataService.zoneList(0, 0),
      ])
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: ([wardDetailsResp, zoneListResp]) => {
            if (wardDetailsResp.code === 200 && zoneListResp.code === 200) {
              this.zones.set(zoneListResp.data.zones);
              this.wardDetails.set(wardDetailsResp.data);
              const selectedZone = zoneListResp.data.zones.find((z: Zone) => z.zoneId === wardDetailsResp.data.zoneId);

              this.wardForm.patchValue({
                wardName: wardDetailsResp.data.wardName,
                wardNumber: wardDetailsResp.data.wardNumber,
                zone: selectedZone
              })
            }
          }
        })
    } else {
      this.populateZones();
    }
  }



  onSaveWard() {
    // console.log(this.wardForm.value)
    if (!this.editMode()) {
      // Create Mode
      const createWard: CreateUpdateWard = {
        wardName: this.wardForm.value.wardName || '',
        wardNumber: this.wardForm.value.wardNumber || '',
        zoneId: this.wardForm.value.zone?.zoneId || 0
      }
      this.masterDataService.createWard(createWard)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            console.log(resp)
            if (resp.code === 200 && resp.data === 'S') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Zone created successfully.', life: MessageDuaraion.STANDARD });
              this.wardForm.reset();
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Zone creation failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    } else {
      // edit/modify mode
      const updateWard: CreateUpdateWard = {
        wardId: this.wardId(),
        wardName: this.wardForm.value.wardName || '',
        wardNumber: this.wardForm.value.wardNumber || '',
        zoneId: this.wardForm.value.zone?.zoneId || 0
      }
      this.masterDataService.updateWard(updateWard)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200) {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Ward updated successfully.', life: MessageDuaraion.STANDARD });
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Ward update failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })
    }
  }



  populateZones() {
    this.masterDataService.zoneList()
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{ zones: Zone[], totalCount: number }>) => {
          // console.log(resp)
          if (resp.code === 200 && resp.status === 'Success') {
            this.zones.set(resp.data.zones)

            const preSelectZoneId = this.route.snapshot.queryParams?.['zoneId'];
            // console.log(this.route.snapshot.queryParams)
            if (preSelectZoneId) {
              const foundZone = resp.data.zones.find(z => z.zoneId === +preSelectZoneId);
              this.wardForm.patchValue({ zone: foundZone }, { emitEvent: false });
            }
          } else {
            this.zones.set([]);
          }

        }
      })
  }
}

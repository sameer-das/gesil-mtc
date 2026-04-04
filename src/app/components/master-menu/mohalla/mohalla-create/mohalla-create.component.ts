import { Component, computed, inject, input } from '@angular/core';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { filter, forkJoin, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CreateUpdateMohalla, Mohalla, Ward, Zone } from '../../../../models/master-data.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { APIResponse } from '../../../../models/user.model';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-mohalla-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './mohalla-create.component.html',
  styleUrl: './mohalla-create.component.scss'
})
export class MohallaCreateComponent {
  mohallaId = input<number | undefined>();
  editMode = computed(() => !!this.mohallaId());

  $destroy: Subject<null> = new Subject();

  zones: Zone[] = [];
  wards: Ward[] = [];

  mohallaForm: FormGroup = new FormGroup({
    zone: new FormControl('', [Validators.required]),
    ward: new FormControl('', [Validators.required]),
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
    // Fetch the whole zone list
    this.masterDataService.zoneList(0, 0).pipe(
      takeUntil(this.$destroy),
      tap((resp) => {
        if (resp.code === 200) {
          this.zones = resp.data.zones;
        }
      })
    ).subscribe();

    // Fetch the ward based on zone selected
    this.mohallaForm.get('zone')?.valueChanges
    .pipe(
      takeUntil(this.$destroy),
      filter(x => Boolean(x)),
      tap(x => console.log(x)),
      switchMap((zone) => this.masterDataService.wardList(zone?.zoneId, 0, 0)),
      tap((wardResp) => {
        if (wardResp.code === 200) {
          this.wards = wardResp.data.wards;
        }

        if (this.editMode() && this.mohallaId()) {
          this.mohallaForm.patchValue({
            ward: this.wards.find(w => w.wardId === this.mohallaDetails.wardId)
          })
        }
      })
    ).subscribe();


    if (this.editMode() && this.mohallaId()) {
      forkJoin({
        mohallaDetails: this.masterDataService.mohallaDetails(this.mohallaId() || 0),
        zones: this.masterDataService.zoneList(0, 0)
      }).pipe(
        takeUntil(this.$destroy),
        tap(({ mohallaDetails, zones }) => {
          if (mohallaDetails.code === 200) {
            this.mohallaDetails = mohallaDetails.data;
            this.mohallaForm.patchValue({
              mohallaName: this.mohallaDetails.mohallaName
            });
          }

          if (zones.code === 200) {
            this.zones = zones.data.zones;
            this.mohallaForm.patchValue({
              zone: this.zones.find(m => m.zoneId === this.mohallaDetails.zoneId)
            })
          }
        })
      ).subscribe()
    }


  }





  onSaveMohalla() {
    console.log(this.mohallaForm.value)
    if (!this.editMode()) {
      // Create Mode
      const createMohalla: CreateUpdateMohalla = {
        mohallaName: this.mohallaForm.value.mohallaName.trim(),
        zoneId: this.mohallaForm.value.zone.zoneId,
        wardId: this.mohallaForm.value.ward.wardId
      };
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
        mohallaName: this.mohallaForm.value.mohallaName,
        zoneId: this.mohallaForm.value.zone.zoneId,
        wardId: this.mohallaForm.value.ward.wardId
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

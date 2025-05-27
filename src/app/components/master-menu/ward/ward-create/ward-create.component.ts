import { Component, computed, input, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Zone } from '../../../../models/master-data.model';
import { Subject } from 'rxjs';

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


  wardForm = new FormGroup({
    wardNumber: new FormControl('', [Validators.required]),
    wardName: new FormControl(''),
    zone: new FormControl('', [Validators.required])
  });

  zones: Zone[] = [
    { zoneName: 'Zone 1', zoneId: 1 },
    { zoneName: 'Zone 2', zoneId: 2 },
    { zoneName: 'Zone 3', zoneId: 3 },
    { zoneName: 'Zone 4', zoneId: 4 },
  ]



  ngOnDestroy(): void {
    this.$destroy.next(null);
  }



  ngOnInit(): void {
    console.log(this.editMode())
  }


  onSaveWard() {
    console.log(this.wardForm.value)
  }
}

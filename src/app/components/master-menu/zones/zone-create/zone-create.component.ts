import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Zone } from '../../../../models/master-data.model';

@Component({
  selector: 'app-zone-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './zone-create.component.html',
  styleUrl: './zone-create.component.scss'
})
export class ZoneCreateComponent implements OnInit {

  zoneId = input<number | undefined>();
  editMode = computed(() => !!this.zoneId());

  zoneForm: FormGroup = new FormGroup({
    zoneName: new FormControl('', [Validators.required])
  });

  constructor() {
  }




  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }


  onSaveZone() {
    console.log(this.zoneForm.value)
  }
}

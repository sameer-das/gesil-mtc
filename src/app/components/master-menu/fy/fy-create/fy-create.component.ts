import { Component, computed, input } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-fy-create',
  imports: [PageHeaderComponent,ReactiveFormsModule,InputTextModule, ButtonModule,],
  templateUrl: './fy-create.component.html',
  styleUrl: './fy-create.component.scss'
})
export class FyCreateComponent {

  fyId = input<number | undefined>();
  editMode = computed(() => !!this.fyId());

  fyForm: FormGroup = new FormGroup({
    fyName: new FormControl('', [Validators.required])
  });

  constructor() {
  }




  ngOnInit(): void {
    console.log(this.editMode())
  }


  onSaveFy() {
    console.log(this.fyForm.value)
  }

}

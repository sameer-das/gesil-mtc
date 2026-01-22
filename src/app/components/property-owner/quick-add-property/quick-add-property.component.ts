import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { Fluid } from "primeng/fluid";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-quick-add-property',
  imports: [PageHeaderComponent, Fluid, ReactiveFormsModule, SelectModule, InputTextModule],
  templateUrl: './quick-add-property.component.html',
  styleUrl: './quick-add-property.component.scss'
})
export class QuickAddPropertyComponent implements OnInit{
  
  salutations = ['Mr.', 'Mrs.', 'Miss'];



  quickAddPropertyForm: FormGroup = new FormGroup({
    salutation: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    
    propertyType: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    subCategroy: new FormControl('', [Validators.required]),
    
    zone: new FormControl('', [Validators.required]),
    ward: new FormControl('', [Validators.required]),
    mohallaName: new FormControl('', [Validators.required]),
  })


  isInvalid(controlName: string): boolean {
    const control = this.quickAddPropertyForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  ngOnInit() {
    
  }
}

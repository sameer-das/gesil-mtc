import { Component, computed, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-category-create',
  imports: [PageHeaderComponent, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.scss'
})
export class CategoryCreateComponent  implements OnInit{

  categoryId = input<number | undefined>();
  editMode = computed(() => !!this.categoryId());

  categoryForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', [Validators.required])
  });

  constructor() {
  }




  ngOnInit(): void {
    console.log(this.editMode())
  }


  onSaveCategory() {
    console.log(this.categoryForm.value)
  }
}

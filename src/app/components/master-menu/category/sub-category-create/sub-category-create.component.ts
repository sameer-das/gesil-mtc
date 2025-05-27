import { Component, computed, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { SelectModule } from 'primeng/select';
import { Category } from '../../../../models/master-data.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sub-category-create',
  imports: [PageHeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule],
  templateUrl: './sub-category-create.component.html',
  styleUrl: './sub-category-create.component.scss'
})
export class SubCategoryCreateComponent implements OnInit, OnDestroy{
  

  subCategoryId = input<number | undefined>();
  editMode = computed(() => !!this.subCategoryId());
  $destroy: Subject<null> = new Subject();

   categories: Category[] = [
    {categoryId: 1, categoryName: 'Below Poverty Line'},
    {categoryId: 2, categoryName: 'EWS'},
    {categoryId: 3, categoryName: 'MIG (200 squre meters)'},
    {categoryId: 4, categoryName: 'HIG (200 squre meters)'},
  ];

  subCategoryForm: FormGroup = new FormGroup({
    subCategoryName: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    taxAmountPerMonth: new FormControl('', [Validators.required, Validators.pattern(/^\d{1,6}(\.\d{1,2})?$/)]),
  })



  ngOnDestroy(): void {
    this.$destroy.next(null);
  }



  ngOnInit(): void {
    console.log(this.editMode())
  }


  
  onSaveSubCategory() {
    console.log(this.subCategoryForm.value);
  }

}

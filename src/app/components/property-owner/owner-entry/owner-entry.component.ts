import { Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { Category, DueFormatOption, Fy, RoadType, SubCategory, Ward, Zone } from '../../../models/master-data.model';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { forkJoin, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { MasterDataService } from '../../../services/master-data.service';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { Owner } from '../../../models/property-owner.model';
@Component({
  selector: 'app-owner-entry',
  imports: [PageHeaderComponent,
    FluidModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DividerModule,
    InputNumberModule,
    TooltipModule,
    DatePickerModule,
    CheckboxModule,
    FileUploadModule],
  templateUrl: './owner-entry.component.html',
  styleUrl: './owner-entry.component.scss'
})

export class OwnerEntryComponent implements OnInit, OnDestroy {

  $destroy: Subject<null> = new Subject();

  ownerId = input<number>();
  editMode = computed(() => !!this.ownerId());


  masterDataService: MasterDataService = inject(MasterDataService);


  addNewOwnerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    guardianName: new FormControl('', []),
    gender: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    email: new FormControl('', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]),
    pan: new FormControl('', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)]),
    aadhar: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{12}$')]),
    dob: new FormControl('', [Validators.required]),
    isSpecialOwner: new FormControl(null),
  });


  genders = [
    { name: 'Male', code: 'M' },
    { name: 'Female', code: 'F' },
    { name: 'Others', code: 'O' },
  ];









  constructor() { }

  ngOnDestroy(): void {
    this.$destroy.next(null)
  }


  ngOnInit(): void {
      console.log(this.editMode())
  }


  onUpload(e: FileUploadHandlerEvent, type: string, element?: FileUpload) {

  }





show(){
  console.log(this.addNewOwnerForm.value)
}


}

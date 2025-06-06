import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-citizen-entry',
  imports: [PageHeaderComponent,
    FluidModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DividerModule,
    InputNumberModule,
    TooltipModule],
  templateUrl: './citizen-entry.component.html',
  styleUrl: './citizen-entry.component.scss'
})

export class CitizenEntryComponent implements OnInit, OnDestroy {

  $destroy: Subject<null> = new Subject();

  pendingDueFormatOptions: DueFormatOption[] = [
    { label: 'Lumpsum Amount (Nigam has given only due amount)', value: 0 },
    { label: 'Financial Year Wise (Nigam has given financial year wise dues)', value: 1 },
  ];

  masterDataService: MasterDataService = inject(MasterDataService);

  citizenForm: FormGroup = new FormGroup({
    zone: new FormControl('', [Validators.required]),
    ward: new FormControl('', [Validators.required]),
    wardName: new FormControl({ value: '', disabled: true }),

    houseNo: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    guardianName: new FormControl('', [Validators.required]),

    address: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required]),

    buildingNo: new FormControl('', [Validators.required]),
    noOfFloor: new FormControl('', [Validators.required]),
    ownership: new FormControl('', [Validators.required]),
    floorSize: new FormControl('', [Validators.required]),

    propertyType: new FormControl('', [Validators.required]),
    roadType: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    subCategory: new FormControl('', [Validators.required]),

    pendingDueFormat: new FormControl<DueFormatOption>(this.pendingDueFormatOptions[0], [Validators.required]),
    pendingDue: new FormControl('', [Validators.required, Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/)])

  });



  zones: Zone[] = [];
  wards: Ward[] = [];

  categories: Category[] = [
    { categoryId: 1, categoryName: 'Below Poverty Line' },
    { categoryId: 2, categoryName: 'EWS' },
    { categoryId: 3, categoryName: 'MIG (200 squre meters)' },
    { categoryId: 4, categoryName: 'HIG (200 squre meters)' },
  ];

  subCategories: SubCategory[] = [
    { subCategoryId: 1, subCategoryName: 'Hut', categoryId: 1, categoryName: 'Below Poverty Line', taxAmountPerMonth: 5000 },
    { subCategoryId: 2, subCategoryName: 'Pucca House/Flat', categoryId: 1, categoryName: 'Below Poverty Line', taxAmountPerMonth: 2000 },
    { subCategoryId: 3, subCategoryName: 'EWS', categoryId: 2, categoryName: 'EWS', taxAmountPerMonth: 7000 },
    { subCategoryId: 4, subCategoryName: 'MIG (200 square meter)', categoryId: 3, categoryName: 'MIG (200 square meter)', taxAmountPerMonth: 5000 },
  ];

  propertyTypes: any[] = [
    { propertyTypeName: 'Residential', value: 'res' },
    { propertyTypeName: 'Commertial', value: 'com' },
  ]

  fyList: Fy[] = [
    { fyId: 1, fyName: 'FY 22-23', active: 1 },
    { fyId: 2, fyName: 'FY 23-24', active: 1 },
    { fyId: 3, fyName: 'FY 24-25', active: 1 },
    { fyId: 4, fyName: 'FY 25-26', active: 1 },
  ]


  roadType: RoadType[] = [
    { roadTypeId: 1, roadTypeName: '200 Feet Road' },
    { roadTypeId: 2, roadTypeName: '100 Feet Road' },
    { roadTypeId: 3, roadTypeName: 'Service Road' },
    { roadTypeId: 4, roadTypeName: 'Village Kaccha Road' },
  ]


  constructor() { }

  ngOnDestroy(): void {
    this.$destroy.next(null)
  }


  ngOnInit(): void {
    // Handle Zone Change  
    this.citizenForm.get('zone')?.valueChanges
      .pipe(takeUntil(this.$destroy),
        switchMap((zone: Zone) => this.masterDataService.wardList(zone.zoneId)),
        tap((wardResp) => {
          if (wardResp.code === 200) {
            this.wards = wardResp.data.wards;
          } else {
            this.wards = []
          }
        })).subscribe();

    // Handle Ward Change
    this.citizenForm.get('ward')?.valueChanges
      .pipe(takeUntil(this.$destroy), tap((ward: Ward) => {
        this.citizenForm.get('wardName')?.setValue(ward.wardName, { emitEvent: false })
      })).subscribe();


    // Fetch Initial Data
    forkJoin([this.masterDataService.zoneList()])
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: ([zoneListResp]) => {
          if (zoneListResp.code === 200) {
            this.zones = zoneListResp.data.zones;
          }
        }
      })
  }




  // FormArray Related methods ------------------------------------ 
  createPendingDueFormGroup() {
    return new FormGroup({
      fy: new FormControl('', [Validators.required]),
      dueAmount: new FormControl('', [Validators.required, Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/)]),
    })
  }

  get pendingDues(): FormArray {
    return this.citizenForm.get('pendingDues') as FormArray;
  }

  addPendingDueControls(): void {
    this.pendingDues.push(this.createPendingDueFormGroup());
  }

  removePendingDueControl(index: number): void {
    this.pendingDues.removeAt(index);
  }
  // FormArray Related methods ------------------------------------ 



  onDueFormatChange(e: SelectChangeEvent) {
    console.log(e);
    const value = <DueFormatOption>e.value; // Type casted
    if (value.value === 1) {
      this.citizenForm.addControl('pendingDues', new FormArray([this.createPendingDueFormGroup()]))
      this.citizenForm.removeControl('pendingDue')
    } else if (value.value === 0) {
      this.citizenForm.addControl('pendingDue', new FormControl('', [Validators.required, Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/)]))
      this.citizenForm.removeControl('pendingDues')
    }
  }
}

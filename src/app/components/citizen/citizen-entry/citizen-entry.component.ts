import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { FluidModule } from 'primeng/fluid';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { Category, SubCategory, Ward, Zone } from '../../../models/master-data.model';

@Component({
  selector: 'app-citizen-entry',
  imports: [PageHeaderComponent, FluidModule,
    ReactiveFormsModule, SelectModule, InputTextModule, TextareaModule, ButtonModule],
  templateUrl: './citizen-entry.component.html',
  styleUrl: './citizen-entry.component.scss'
})

export class CitizenEntryComponent {

  citizenForm: FormGroup = new FormGroup({
    zone: new FormControl('', [Validators.required]),
    ward: new FormControl('', [Validators.required]),
    wardName: new FormControl({value: '', disabled: true}),

    houseNo: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    guardianName: new FormControl('', [Validators.required]),

    address: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required]),

    buildingNo: new FormControl('', [Validators.required]),
    noOfFloor: new FormControl('', [Validators.required]),
    floor: new FormControl('', [Validators.required]),
    floorSize: new FormControl('', [Validators.required]),

    propertyType: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    subCategory: new FormControl('', [Validators.required]),
  });

  zones: Zone[] = [
    { zoneName: 'Zone 1', zoneId: 1 },
    { zoneName: 'Zone 2', zoneId: 2 },
    { zoneName: 'Zone 3', zoneId: 3 },
    { zoneName: 'Zone 4', zoneId: 4 },
  ];

  wards: Ward[] = [
    { wardId: 1, wardName: 'Mukta Nagar', wardNumber: 'W1', zoneId: 1, zoneName: 'Zone 1' },
    { wardId: 2, wardName: 'Amarpali Nagar', wardNumber: 'W2', zoneId: 1, zoneName: 'Zone 1' },
    { wardId: 3, wardName: 'Soubhagya Nagar', wardNumber: 'W3', zoneId: 1, zoneName: 'Zone 1' },
    { wardId: 4, wardName: 'Smurti Nagar', wardNumber: 'W4', zoneId: 1, zoneName: 'Zone 1' },
    { wardId: 5, wardName: 'Gopal Nagar', wardNumber: 'W5', zoneId: 1, zoneName: 'Zone 1' },
  ]

    categories: Category[] = [
      {categoryId: 1, categoryName: 'Below Poverty Line'},
      {categoryId: 2, categoryName: 'EWS'},
      {categoryId: 3, categoryName: 'MIG (200 squre meters)'},
      {categoryId: 4, categoryName: 'HIG (200 squre meters)'},
    ];

    subCategories: SubCategory[] = [
        { subCategoryId: 1, subCategoryName: 'Hut', categoryId: 1, categoryName: 'Below Poverty Line', taxAmountPerMonth: 5000 },
        { subCategoryId: 2, subCategoryName: 'Pucca House/Flat', categoryId: 1, categoryName: 'Below Poverty Line', taxAmountPerMonth: 2000 },
        { subCategoryId: 3, subCategoryName: 'EWS', categoryId: 2, categoryName: 'EWS', taxAmountPerMonth: 7000 },
        { subCategoryId: 4, subCategoryName: 'MIG (200 square meter)', categoryId: 3, categoryName: 'MIG (200 square meter)', taxAmountPerMonth: 5000 },
      ];

      propertyTypes: any[] = [
        {propertyTypeName: 'Residential', value: 'res'},
        {propertyTypeName: 'Commertial', value: 'com'},
      ]
}

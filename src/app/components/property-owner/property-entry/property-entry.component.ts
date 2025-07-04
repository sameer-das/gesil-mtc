import { District } from './../../../models/user.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { FluidModule } from 'primeng/fluid';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { Ward, Zone } from '../../../models/master-data.model';
import { Subject, takeUntil, tap } from 'rxjs';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-property-entry',
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
    FileUploadModule,
    
  ],
  templateUrl: './property-entry.component.html',
  styleUrl: './property-entry.component.scss'
})
export class PropertyEntryComponent implements OnInit, OnDestroy {
  propertyForm: FormGroup = new FormGroup({
    householdNo: new FormControl(''),
    zone: new FormControl(''),
    ward: new FormControl(''),
    wardName: new FormControl(),
    propertyType: new FormControl(),
    typeOfOwnership: new FormControl(),
    otherTypeOfOwnerShip: new FormControl(),

    widthOfRoad: new FormControl(),
    areaOfPlot: new FormControl(),

    // For Independent Building
    noOfFloors: new FormControl(0),
    floorWiseData: new FormArray([]),

    // For Flats/Units in multi storied builing
    buildingNo: new FormControl(),
    flatNo: new FormControl(),
    flatSize: new FormControl(),

    // Electricity 

    elctricityCustomerId: new FormControl(),
    electricityAccountNo: new FormControl(),
    electricityBookNo: new FormControl(),
    electricityCategory: new FormControl(),

    // Building Plan and Water Bill Details

    buildingPlanApprovalNo: new FormControl(),
    buildingPlanApprovalDate: new FormControl(),
    waterConsumerNo: new FormControl(),
    waterConnectionDate: new FormControl(),

    // As per Patta

    district: new FormControl(),
    tahasil: new FormControl(),
    villageName: new FormControl(),
    khataNo: new FormControl(),
    plotNo: new FormControl(),


    // Property Address

    propertyAddress: new FormControl(),
    propertyAddressDistrict: new FormControl(),
    propertyAddressCity: new FormControl(),
    propertyAddressPin: new FormControl(),

    // Owner Address
    isOwnerAddressSame: new FormControl(null),
    ownerAddress: new FormControl(),
    ownerAddressDistrict: new FormControl(),
    ownerAddressCity: new FormControl(),
    ownerAddressPin: new FormControl(),

    // Valcant Land
    plotArea: new FormControl(),
    dateOfAcquisition: new FormControl(),
    useAsPerMasterPlan: new FormControl(),
    

    // Mobile Tower
    mobileTowerArea: new FormControl(),
    mobileTowerDateOfInstallation: new FormControl(),


    // Hoarding
    hoardingArea: new FormControl(),
    hoardingDateOfInstallation: new FormControl(),


    // Petrol Pump
    petrolpumpUndergroundArea: new FormControl(),
    petrolpumpDateOfCompletion: new FormControl(),

    // Water Harvesting provision
    hasWaterHarvestingProvision: new FormControl()

  })


  zones: Zone[] = [];
  wards: Ward[] = [];

  propertyTypes: { propertyTypeId: number; propertyTypeName: string; }[] = [
    { propertyTypeId: 1, propertyTypeName: 'Vacant Land' },
    { propertyTypeId: 2, propertyTypeName: 'Independent Building' },
    { propertyTypeId: 3, propertyTypeName: 'Flats/Units in Multistoried Building' },
    { propertyTypeId: 4, propertyTypeName: 'Super Structure' },
  ]

  typeOfOwnerships: { typeOfOwnershipId: number; typeOfOwnershipName: string }[] = [
    { typeOfOwnershipId: 1, typeOfOwnershipName: 'Individual' },
    { typeOfOwnershipId: 2, typeOfOwnershipName: 'Institute' },
    { typeOfOwnershipId: 3, typeOfOwnershipName: 'Co-operative Society' },
    { typeOfOwnershipId: 4, typeOfOwnershipName: 'Religious Trust' },
    { typeOfOwnershipId: 5, typeOfOwnershipName: 'Trust' },
    { typeOfOwnershipId: 6, typeOfOwnershipName: 'State Govt' },
    { typeOfOwnershipId: 7, typeOfOwnershipName: 'Central Govt' },
    { typeOfOwnershipId: 8, typeOfOwnershipName: 'State PSU' },
    { typeOfOwnershipId: 9, typeOfOwnershipName: 'Central PSU' },
    { typeOfOwnershipId: 10, typeOfOwnershipName: 'BOARD' },
    { typeOfOwnershipId: 11, typeOfOwnershipName: 'Company Public Ltd' },
    { typeOfOwnershipId: 12, typeOfOwnershipName: 'Company Pvt Ltd' },
    { typeOfOwnershipId: 13, typeOfOwnershipName: 'Other' },
  ]

  electricityCagtegory: { electricityCagtegoryId: number; electricityCagtegoryName: string }[] = [
    { electricityCagtegoryId: 1, electricityCagtegoryName: 'DSI/II/III' },
    { electricityCagtegoryId: 2, electricityCagtegoryName: 'NDS/II/III' },
    { electricityCagtegoryId: 3, electricityCagtegoryName: 'ISI/II' },
    { electricityCagtegoryId: 4, electricityCagtegoryName: 'LTS' },
    { electricityCagtegoryId: 5, electricityCagtegoryName: 'HTS' },
  ]



  $destroy: Subject<null> = new Subject();
  enableIndividualBuildingType = false;
  enableFlatType = false;
  minFloorValue = 0;


  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }


  ngOnInit(): void {
    this.propertyForm.get('propertyType')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      tap((propertyType: { propertyTypeId: number; propertyTypeName: string; }) => {
        if (propertyType.propertyTypeId === 2) {
          this.enableIndividualBuildingType = true;
          this.propertyForm.patchValue({ 'noOfFloors': 1 }, { emitEvent: true });
          this.enableFlatType = false;
          this.minFloorValue = 1;
        } else if (propertyType.propertyTypeId === 3) {
          this.enableFlatType = true;
          this.enableIndividualBuildingType = false;
          this.minFloorValue = 0;
          this.propertyForm.patchValue({ 'noOfFloors': 0 }, { emitEvent: true });
          this.floorWiseDataFormArray.clear();
        } else {
          this.enableFlatType = false;
          this.enableIndividualBuildingType = false;
          this.minFloorValue = 0;
          this.propertyForm.patchValue({ 'noOfFloors': 0 }, { emitEvent: true });
          this.floorWiseDataFormArray.clear();
        }
      })
    ).subscribe();


    this.propertyForm.get('noOfFloors')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      tap((val: number) => {
        this.floorWiseDataFormArray.clear();
        for (let i = 1; i <= val; i++) {
          this.floorWiseDataFormArray.push(this.createFloorWiseDataGroup())
        }
      })).subscribe();


  }


  get floorWiseDataFormArray(): FormArray {
    return this.propertyForm.get('floorWiseData') as FormArray;
  }

  private createFloorWiseDataGroup(): FormGroup {
    return new FormGroup({
      floorNo: new FormControl(),
      builtUpArea: new FormControl(),
      constructionType: new FormControl(),
      circleRate: new FormControl(),
    })
  }

  addFlooWiseDataRow() {
    this.floorWiseDataFormArray.push(this.createFloorWiseDataGroup())
  }

  onUpload(e: FileUploadHandlerEvent, type: string, element?: FileUpload) {
  
    }
}

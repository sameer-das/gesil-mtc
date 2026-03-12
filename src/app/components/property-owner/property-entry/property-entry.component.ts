import { District, APIResponse } from './../../../models/user.model';
import { Component, computed, effect, inject, input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { FluidModule } from 'primeng/fluid';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { Category, ElectricityConnectionType, Mohalla, OwnershipType, PropertyType, SelectType, SubCategory, Ward, Zone } from '../../../models/master-data.model';
import { forkJoin, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FileSelectEvent, FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { MasterDataService } from '../../../services/master-data.service';
import { OwnerDocumentUpload, PropertyMaster, PropertySearchResultType } from '../../../models/property-owner.model';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { Router } from '@angular/router';
import { CAREOF_OPTIONS, GENDER_OPTIONS, OWNERSHIP_TYPE, SALUTATION_OPTIONS } from '../../../models/constants';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';

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
    ToggleSwitchModule,
    ToggleButtonModule
  ],
  templateUrl: './property-entry.component.html',
  styleUrl: './property-entry.component.scss'
})
export class PropertyEntryComponent implements OnInit, OnDestroy {

  constructor() { }

  ebFile: File | null = null;
  ppFile: File | null = null;
  @ViewChild('ebUploader') ebUploader!: FileUpload;
  @ViewChild('propertyPhotoUploader') propertyPhotoUploader!: FileUpload;
  propertyId = input<number>();

  isCorrespondenceSame: boolean = false;
  currentLoggedUserName: string = localStorage.getItem('username') || 'GESIL';


  property: Partial<PropertySearchResultType> = {};
  readMode = true;

  genders = GENDER_OPTIONS;
  salutations = SALUTATION_OPTIONS;
  careOfs = CAREOF_OPTIONS;
  typeOfOwnerships = OWNERSHIP_TYPE;

  propertyForm: FormGroup = new FormGroup({
    salutation: new FormControl(''),
    ownerName: new FormControl(''),
    careOf: new FormControl(''),
    guardianName: new FormControl(''),

    gender: new FormControl(''),
    dob: new FormControl(''),
    mobile: new FormControl(''),

    zone: new FormControl('', [Validators.required]),
    ward: new FormControl('', [Validators.required]),
    mohallaName: new FormControl('', [Validators.required]),

    propertyType: new FormControl('', [Validators.required]),
    category: new FormControl(),
    subCategory: new FormControl(),

    typeOfOwnership: new FormControl('', [Validators.required]),
    widthOfRoad: new FormControl(),
    areaOfPlot: new FormControl(),

    // For Independent Building
    noOfFloors: new FormControl(0),
    floorWiseData: new FormArray([]),

    // For Flats/Units in multi storied builing
    buildingNo: new FormControl(),
    flatNo: new FormControl(),

    // flatSize: new FormControl(),

    // // Electricity 

    // elctricityCustomerId: new FormControl(),
    // electricityAccountNo: new FormControl(),
    // electricityBookNo: new FormControl(),
    // electricityCategory: new FormControl(),

    // // Building Plan and Water Bill Details

    // buildingPlanApprovalNo: new FormControl(),
    // buildingPlanApprovalDate: new FormControl(),
    // waterConsumerNo: new FormControl(),
    // waterConnectionDate: new FormControl(),

    // // As per Patta

    // district: new FormControl(),
    // tahasil: new FormControl(),
    // villageName: new FormControl(),
    // khataNo: new FormControl(),
    // plotNo: new FormControl(),


    // Property Address
    propertyAddress: new FormControl(),
    propertyAddressDistrict: new FormControl(),
    propertyAddressCity: new FormControl(),
    propertyAddressPin: new FormControl(),
    propertyAddressHouseNo: new FormControl(),
    propertyAddressLandmark: new FormControl(),

    // latitude: new FormControl(),
    // longitude: new FormControl(),

    // Owner Address
    isOwnerAddressSame: new FormControl(null),

    ownerAddress: new FormControl(),
    ownerAddressDistrict: new FormControl(),
    ownerAddressCity: new FormControl(),
    ownerAddressPin: new FormControl(),
    ownerAddressHouseNo: new FormControl(),
    ownerAddressLandmark: new FormControl(),

    // // Valcant Land
    // plotArea: new FormControl(),
    // dateOfAcquisition: new FormControl(),
    // useAsPerMasterPlan: new FormControl(),


    // // Mobile Tower
    // mobileTowerArea: new FormControl(),
    // mobileTowerDateOfInstallation: new FormControl(),


    // // Hoarding
    // hoardingArea: new FormControl(),
    // hoardingDateOfInstallation: new FormControl(),


    // // Petrol Pump
    // petrolpumpUndergroundArea: new FormControl(),
    // petrolpumpDateOfCompletion: new FormControl(),

    // // Water Harvesting provision
    // hasWaterHarvestingProvision: new FormControl()

  })


  zones: Zone[] = [];
  wards: Ward[] = [];
  mohallas: Mohalla[] = [];

  propertyTypes: PropertyType[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];


  // electricityCagtegory: ElectricityConnectionType[] = [];

  masterDataFetched = signal<boolean>(false);
  propertyDetailFetched = signal<boolean>(false);
  populateMasterFormsForEdit = computed(() => this.masterDataFetched() && this.propertyDetailFetched());

  $destroy: Subject<null> = new Subject();
  enableIndividualBuildingType = false;
  enableFlatType = false;
  minFloorValue = 0;


  messageService: MessageService = inject(MessageService);
  masterDataService: MasterDataService = inject(MasterDataService);
  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private router = inject(Router);



  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }


  ngOnInit(): void {
    this.fetchAllMasterData();

    console.log(this.propertyId());

    this.propertyForm.get('typeOfOwnership')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      tap((propertyType: SelectType) => {
        console.log(propertyType);
        if (+propertyType?.value === 1) {
          this.enableIndividualBuildingType = true;
          this.propertyForm.patchValue({ 'noOfFloors': 1 }, { emitEvent: true });
          this.enableFlatType = false;
          this.minFloorValue = 1;
        } else if (+propertyType?.value === 2) {
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
        if (this.propertyForm.value.propertyType?.propertyTypeId === 2 && !val) {
          console.log('mark the form invalid')
        }
        this.floorWiseDataFormArray.clear();
        for (let i = 1; i <= val; i++) {
          this.floorWiseDataFormArray.push(this.createFloorWiseDataGroup())
        }
      })).subscribe();

    this.propertyForm.get('zone')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      switchMap((zone) => this.masterDataService.wardList(zone.zoneId, 0, 0)),
      tap((wardResp) => {
        if (wardResp.code === 200) {
          this.wards = wardResp.data.wards;
          if (this.propertyId()) {
            this.propertyForm.patchValue({
              ward: this.wards.find(ward => ward.wardId === +(this.property.ward || 0))
            })
          }
        }
      })).subscribe();

    this.propertyForm.get('category')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      tap(c => console.log(c)),
      switchMap((category: Category) => this.masterDataService.subCategoriesOfCategory(category.categoryId, 0, 0)),
      tap((subCategoryResp) => {
        if (subCategoryResp.code === 200) {
          this.subCategories = subCategoryResp.data.subCategories;
          if (this.propertyId()) {
            this.propertyForm.patchValue({
              subCategory: this.subCategories.find(s => s.subCategoryId === +(this.property.subcategory || 0))
            })
          }
        }
      }
      )
    ).subscribe();

    this.propertyForm.get('isOwnerAddressSame')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      tap((val: boolean) => {
        console.log(val)
        if (val) {
          // Make the forms readonly
          this.propertyForm.patchValue({
            ownerAddress: this.propertyForm.value.propertyAddress,
            ownerAddressDistrict: this.propertyForm.value.propertyAddressDistrict,
            ownerAddressCity: this.propertyForm.value.propertyAddressCity,
            ownerAddressPin: this.propertyForm.value.propertyAddressPin,
            ownerAddressHouseNo: this.propertyForm.value.propertyAddressHouseNo,
            ownerAddressLandmark: this.propertyForm.value.propertyAddressLandmark,
          });
          this.isCorrespondenceSame = true
        } else {
          this.propertyForm.patchValue({
            ownerAddress: '',
            ownerAddressDistrict: '',
            ownerAddressCity: '',
            ownerAddressPin: '',
            ownerAddressHouseNo: '',
            ownerAddressLandmark: ''
          })
          this.isCorrespondenceSame = false
        }
      })).subscribe();

  }



  isInvalid(controlName: string): boolean {
    const control = this.propertyForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }




  fetchAllMasterData() {
    const fakeAPIResp: APIResponse<PropertySearchResultType[]> = {
      code: 200,
      status: 'Success',
      data: []
    }
    const propertyDetail = this.propertyId() ?
      this.ownerService.getPropertyMasterDetail('propertyId', String(this.propertyId())) :
      of(fakeAPIResp)

    forkJoin([propertyDetail, this.masterDataService.zoneList(),
      this.masterDataService.propertyTypeList(),
      this.masterDataService.mohallaList(),
      this.masterDataService.categoryList()])
      .pipe(takeUntil(this.$destroy),
        tap(([propertyDetailResp, zoneResp, propertyTypeResp, mohallaResp, categoryResp]) => {
          if (zoneResp.code === 200 && propertyTypeResp.code === 200 &&
            mohallaResp.code === 200 && categoryResp.code === 200) {
            this.masterDataFetched.set(true);
            this.zones = zoneResp.data.zones;
            this.propertyTypes = propertyTypeResp.data.propertyTypes;
            this.mohallas = mohallaResp.data.mohallas;
            this.categories = categoryResp.data.categories;


            if (propertyDetailResp.code === 200 && propertyDetailResp.status === 'Success') {
              if (propertyDetailResp.data.length > 0) {
                this.property = propertyDetailResp.data[0];
                console.log(this.property);
                this.patchFormData();
              }
              else {
                // new mode
                this.property = {};
                // this.messageService.add({ severity: MessageSeverity.INFO, summary: 'Not Found', detail: `Property not found`, life: MessageDuaraion.STANDARD });
              }
            }

          }
        }))
      .subscribe();
  }



  patchFormData() {

    this.propertyForm.patchValue({
      salutation: SALUTATION_OPTIONS.find(opt => opt.value === this.property.salutation) || SALUTATION_OPTIONS[0],
      careOf: CAREOF_OPTIONS.find(opt => opt.value === this.property.careOf) || CAREOF_OPTIONS[0],
      gender: GENDER_OPTIONS.find(opt => opt.value === this.property.gender) || GENDER_OPTIONS[0],
      ownerName: this.property.ownerName || '',
      guardianName: this.property.guardianName || '',
      mobile: this.property.mobile || '',
      dob: this.property.dob ? new Date(this.property.dob) : new Date(),

      zone: this.zones.find(zone => zone.zoneId === +(this.property.zone || 0)),
      mohallaName: this.mohallas.find(m => m.mohallaId === +(this.property.mohallaName || 0)),
      propertyType: this.propertyTypes.find(p => p.propertyTypeName === this.property.propertyType),
      category: this.categories.find(c => c.categoryId === +(this.property.category || 0)),


      widthOfRoad: this.property.widthOfRoad,
      areaOfPlot: this.property.areaOfPlot,
      typeOfOwnership: OWNERSHIP_TYPE.find(opt => opt.value === this.property.typeOfOwnership),

      propertyAddress: this.property.propertyAddress,
      propertyAddressDistrict: this.property.propertyAddressDistrict,
      propertyAddressCity: this.property.propertyAddressCity,
      propertyAddressPin: this.property.propertyAddressPin,
      propertyAddressHouseNo: this.property.propertyAddressHouseNo,
      propertyAddressLandmark: this.property.propertyAddressLandmark,

      isOwnerAddressSame: this.property.isOwnerAddressSame,

      ownerAddress: this.property.ownerAddress,
      ownerAddressDistrict: this.property.ownerAddressDistrict,
      ownerAddressCity: this.property.ownerAddressCity,
      ownerAddressPin: this.property.ownerAddressPin,
      ownerAddressHouseNo: this.property.ownerAddressHouseNo,
      ownerAddressLandmark: this.property.ownerAddressLandmark,

      noOfFloors: this.property.noOfFloors,
      buildingNo: this.property.buildingNo,
      flatNo: this.property.flatNo,
    });

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



  getThisLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          // Success callback
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log('Got Latitude:', latitude);
          console.log('Got Longitude:', longitude);
          this.propertyForm.patchValue({
            latitude: latitude,
            longitude: longitude
          })
        },
        (error: GeolocationPositionError) => {
          // Error callback
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Error', detail: 'User denied the request for Geolocation.', life: MessageDuaraion.STANDARD })
              console.error('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Error', detail: 'Location information is unavailable.', life: MessageDuaraion.STANDARD })
              console.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Error', detail: 'The request to get user location timed out.', life: MessageDuaraion.STANDARD })
              console.error('The request to get user location timed out.');
              break;
            default:
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Error', detail: 'An unknown error occurred.', life: MessageDuaraion.STANDARD })
              console.error('An unknown error occurred.');
              break;
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Optional options
      );
    } else {
      this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Error', detail: 'Geolocation is not supported by this browser.', life: MessageDuaraion.STANDARD })
    }
  }



  onUpload(e: FileUploadHandlerEvent, type: string, element?: FileUpload) {
    console.log(e)
    console.log('on upload ' + type)
    const file = e.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      const fileNameParts = e.files[0].name.split('.');
      const newFileNameWithoutExtention = fileNameParts.slice(0, fileNameParts.length - 1).join('_');

      const payload: OwnerDocumentUpload = {
        "ownerId": Number(0),
        "documentType": type,
        "documentName": newFileNameWithoutExtention,
        "documentBase64data": reader.result
      }

      console.log(payload)
      //   this.ownerService.uploadDocument(payload).pipe(takeUntil(this.$destroy))
      //     .subscribe({
      //       next: (resp: APIResponse<string>) => {
      //         if (resp.code === 200) {
      //           this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: `Uploaded successfully.`, life: MessageDuaraion.STANDARD });
      //           this.clearFile(type);
      //         }
      //       }
      //     })
      // };
    }
  }



  onFileSelect(event: FileSelectEvent, type: string) {
    console.log(event)
    const isValid = this.validateFile(event.currentFiles[0], type);
    if (!isValid)
      return;

    if (event.files && event.files.length > 0) {
      if (type === 'EB') {
        this.ebFile = event.files[0];
      }
      if (type === 'PP') {
        this.ppFile = event.files[0];
      }
    }
  }



  validateFile(file: File, type: string) {
    const validFormats = ['image/png', 'application/pdf', 'image/jpeg'];
    if (validFormats.indexOf(file.type) >= 0) {
      if (file.size < (2 * 1024 * 1024)) {
        return true
      } else {
        this.clearFile(type);
        this.messageService.add({ severity: MessageSeverity.WARN, summary: 'Large File Size', detail: `Only files up to 2 MB are allowed. Please choose a smaller file.`, life: MessageDuaraion.STANDARD });
        return false;
      }
    } else {
      this.clearFile(type);
      this.messageService.add({ severity: MessageSeverity.WARN, summary: 'Invalid File Format', detail: `Please upload files with png/jpeg/pdf format only.`, life: MessageDuaraion.STANDARD });
      return false;
    }
  }



  onClear(type: string) {
    console.log('Files cleared! ', type);
    if (type === 'EB') {
      this.ebFile = null; // Clear our stored file
    }
    if (type === 'PP') {
      this.ppFile = null; // Clear our stored file
    }
  }



  clearFile(type: string) {
    console.log(type)
    if (type === 'EB') {
      this.ebFile = null;
      if (this.ebUploader) {
        this.ebUploader.clear(); // This clears the internal file list of the component
      }
    }
    if (type === 'PP') {
      this.ppFile = null;
      if (this.propertyPhotoUploader) {
        this.propertyPhotoUploader.clear(); // This clears the internal file list of the component
      }
    }

  }


  onSubmit() {
    console.log(this.propertyForm.value)
    const updateDetailsPayload: PropertyMaster = {
            propertyId: this.property?.propertyId || 0,
            householdNo: this.property?.householdNo,

            salutation: this.propertyForm.value.salutation.value,
            ownerName: this.propertyForm.value.ownerName,
            careOf: this.propertyForm.value.careOf.value,
            guardianName: this.propertyForm.value.guardianName,
            gender: this.propertyForm.value.gender.value,
            dob: this.getDate(this.propertyForm.value.dob),
            mobile: this.propertyForm.value.mobile,

            zone: this.propertyForm.value.zone?.zoneId,
            ward: this.propertyForm.value.ward?.wardId,
            category: String(this.propertyForm.value.category.categoryId),
            subcategory: String(this.propertyForm.value.subCategory.subCategoryId),
            mohallaName: String(this.propertyForm.value.mohallaName.mohallaId),

            propertyType: this.propertyForm.value.propertyType.propertyTypeName,
            widthOfRoad: String(this.propertyForm.value.widthOfRoad),
            areaOfPlot: String(this.propertyForm.value.areaOfPlot),
            
            typeOfOwnership: this.propertyForm.value.typeOfOwnership?.value,
            buildingNo: this.propertyForm.value.buildingNo,
            flatNo: this.propertyForm.value.flatNo,
            noOfFloors: this.propertyForm.value.noOfFloors,

            propertyAddress: this.propertyForm.value.propertyAddress,
            propertyAddressCity: this.propertyForm.value.propertyAddressCity,
            propertyAddressDistrict: this.propertyForm.value.propertyAddressDistrict  ,
            propertyAddressPin: this.propertyForm.value.propertyAddressPin,
            propertyAddressHouseNo: this.propertyForm.value.propertyAddressHouseNo  ,
            propertyAddressLandmark: this.propertyForm.value.propertyAddressLandmark,

            isOwnerAddressSame: this.propertyForm.value.isOwnerAddressSame,

            ownerAddress: this.propertyForm.value.ownerAddress,
            ownerAddressCity: this.propertyForm.value.ownerAddressCity,
            ownerAddressDistrict: this.propertyForm.value.ownerAddressDistrict,
            ownerAddressPin: this.propertyForm.value.ownerAddressPin,
            ownerAddressHouseNo: this.propertyForm.value.ownerAddressHouseNo,
            ownerAddressLandmark: this.propertyForm.value.ownerAddressLandmark, 

            updatedBy: this.currentLoggedUserName,
        };

        console.log(updateDetailsPayload);

        this.ownerService.updatePropertyMaster(updateDetailsPayload)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (resp: APIResponse<string>) => {
            if (resp.code === 200 && resp.status === 'Success') {
              this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: resp.data, life: MessageDuaraion.STANDARD });
            } else {
              this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Property update failed.', life: MessageDuaraion.STANDARD })
            }
          }
        })

  }

  getDate(date: Date | string) {
    const d = new Date(date).getTime() + 19800000;
    return new Date(d).toISOString();
  }




}

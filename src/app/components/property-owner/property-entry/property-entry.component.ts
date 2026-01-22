import { District, APIResponse } from './../../../models/user.model';
import { Component, inject, input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
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
import { ElectricityConnectionType, OwnershipType, PropertyType, Ward, Zone } from '../../../models/master-data.model';
import { forkJoin, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FileSelectEvent, FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { MasterDataService } from '../../../services/master-data.service';
import { OwnerDocumentUpload } from '../../../models/property-owner.model';

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
  ebFile: File | null = null;
  ppFile: File | null = null;
  @ViewChild('ebUploader') ebUploader!: FileUpload;
  @ViewChild('propertyPhotoUploader') propertyPhotoUploader!: FileUpload;
  ownerId = input<number>();

  isCorrespondenceSame: boolean = false;

  propertyForm: FormGroup = new FormGroup({
    householdNo: new FormControl(''),
    zone: new FormControl('', [Validators.required]),
    ward: new FormControl('', [Validators.required]),
    wardName: new FormControl(),
    propertyType: new FormControl('', [Validators.required] ),
    typeOfOwnership: new FormControl('', [Validators.required]),
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
    latitude: new FormControl(),
    longitude: new FormControl(),

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
  propertyTypes: PropertyType[] = [];
  typeOfOwnerships: OwnershipType[] = [];
  electricityCagtegory: ElectricityConnectionType[] = [];

  masterDataFetched = signal<boolean>(false);
  propertyTypeFetched = signal<boolean>(false);


  $destroy: Subject<null> = new Subject();
  enableIndividualBuildingType = false;
  enableFlatType = false;
  minFloorValue = 0;


  messageService: MessageService = inject(MessageService);
  masterDataService: MasterDataService = inject(MasterDataService);




  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }


  ngOnInit(): void {
    this.propertyForm.get('propertyType')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      tap((propertyType: { propertyTypeId: number; propertyTypeName: string; }) => {
        console.log(propertyType);
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
        if(this.propertyForm.value.propertyType.propertyTypeId === 2 && !val) {
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
        }
      })).subscribe();

    this.propertyForm.get('isOwnerAddressSame')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      tap((val:string[]) => {
        if(val.length > 0) {
          // Make the forms readonly
          this.propertyForm.patchValue({
            ownerAddress: this.propertyForm.value.propertyAddress,
            ownerAddressDistrict: this.propertyForm.value.propertyAddressDistrict,
            ownerAddressCity: this.propertyForm.value.propertyAddressCity,
            ownerAddressPin: this.propertyForm.value.propertyAddressPin            
          });
          this.isCorrespondenceSame = true
        } else {
          this.propertyForm.patchValue({
            ownerAddress:'',
            ownerAddressDistrict:'',
            ownerAddressCity:'',
            ownerAddressPin:''
          })
          this.isCorrespondenceSame = false
        }
      })).subscribe();

    this.fetchAllMasterData()
  }



  isInvalid(controlName: string): boolean {
    const control = this.propertyForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }




  fetchAllMasterData() {
    forkJoin([this.masterDataService.zoneList(),
    this.masterDataService.propertyTypeList(),
    this.masterDataService.ownershipTypeList(),
    this.masterDataService.electricityConnectionTypeList()])
      .pipe(takeUntil(this.$destroy),
        map(([zoneResp, propertyResp, ownershipResp, electricityResp]) => {
          if (zoneResp.code === 200 && propertyResp.code === 200 &&
            ownershipResp.code === 200 && electricityResp.code === 200) {
            this.masterDataFetched.set(true);
            this.zones = zoneResp.data.zones;
            this.propertyTypes = propertyResp.data.propertyTypes;
            this.typeOfOwnerships = ownershipResp.data.oTypes;
            this.electricityCagtegory = electricityResp.data.econnections;
          }
        }))
      .subscribe();
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
        "ownerId": Number(this.ownerId() || 0),
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
  }




}

import { District, APIResponse } from './../../../models/user.model';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { ElectricityConnectionType, OwnershipType, PropertyType, Ward, Zone } from '../../../models/master-data.model';
import { forkJoin, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { MasterDataService } from '../../../services/master-data.service';

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
        this.floorWiseDataFormArray.clear();
        for (let i = 1; i <= val; i++) {
          this.floorWiseDataFormArray.push(this.createFloorWiseDataGroup())
        }
      })).subscribe();

    this.propertyForm.get('zone')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      switchMap((zone) => this.masterDataService.wardList(zone.zoneId,0,0)),
      tap((wardResp) => {
        if(wardResp.code === 200) {
          this.wards = wardResp.data.wards;
        }
      })).subscribe();

      this.fetchAllMasterData()
  }



  fetchAllMasterData() {
    forkJoin([this.masterDataService.zoneList(), 
      this.masterDataService.propertyTypeList(), 
      this.masterDataService.ownershipTypeList(),
      this.masterDataService.electricityConnectionTypeList()])
      .pipe(takeUntil(this.$destroy),
      map(([zoneResp, propertyResp, ownershipResp, electricityResp]) => {
          if(zoneResp.code === 200 && propertyResp.code === 200 && 
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

  }



}

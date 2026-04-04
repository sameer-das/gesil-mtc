import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { Fluid } from "primeng/fluid";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { Category, Mohalla, PropertyType, SubCategory, Ward, Zone } from '../../../models/master-data.model';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { forkJoin, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { MasterDataService } from '../../../services/master-data.service';
import { SALUTATION_OPTIONS } from '../../../models/constants';
import { ButtonModule } from 'primeng/button';
import { QuickCreatePropertyType } from '../../../models/property-owner.model';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { DialogModule } from 'primeng/dialog';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-quick-add-property',
  imports: [PageHeaderComponent, Fluid, ReactiveFormsModule,
    SelectModule, InputTextModule, ButtonModule, DialogModule, RouterLink],
  templateUrl: './quick-add-property.component.html',
  styleUrl: './quick-add-property.component.scss'
})
export class QuickAddPropertyComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.$destroy.next(true);
  }

  salutations = SALUTATION_OPTIONS;

  zones: Zone[] = [];
  wards: Ward[] = [];
  mohallas: Mohalla[] = [];

  propertyTypes: PropertyType[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  $destroy: Subject<boolean> = new Subject();

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  messageService: MessageService = inject(MessageService);
  masterDataService: MasterDataService = inject(MasterDataService);

  currentLoggedUserName: string = localStorage.getItem('username') || 'GESIL';
  
  dialogVisible = false;
  surveyNo: string | null = null;


  quickAddPropertyForm: FormGroup = new FormGroup({
    salutation: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),

    propertyType: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    subCategory: new FormControl('', [Validators.required]),

    zone: new FormControl('', [Validators.required]),
    ward: new FormControl('', [Validators.required]),
    mohallaName: new FormControl('', [Validators.required]),
  })


  isInvalid(controlName: string): boolean {
    const control = this.quickAddPropertyForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  ngOnInit() {
    this.fetchAllMasterData();

    this.quickAddPropertyForm.get('zone')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      switchMap((zone) => this.masterDataService.wardList(zone.zoneId, 0, 0)),
      tap((wardResp) => {
        if (wardResp.code === 200) {
          this.wards = wardResp.data.wards;
        }
      })).subscribe();

    this.quickAddPropertyForm.get('category')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      switchMap((category: Category) => this.masterDataService.subCategoriesOfCategory(category.categoryId, 0, 0)),
      tap((subCategoryResp) => {
        if (subCategoryResp.code === 200) {
          this.subCategories = subCategoryResp.data.subCategories;
        }
      })).subscribe();  

    this.quickAddPropertyForm.get('ward')?.valueChanges.pipe(
      takeUntil(this.$destroy),
      tap(w => console.log(w)),
      switchMap((ward: Ward) => this.masterDataService.mohallaList(this.quickAddPropertyForm.value.zone.zoneId, ward.wardId, 0, 0)),
      tap((mohallaResp) => {
        if (mohallaResp.code === 200) {
          this.mohallas = mohallaResp.data.mohallas;
        }
      }
      )
    ).subscribe();
  }



  fetchAllMasterData() {

    forkJoin([this.masterDataService.zoneList(),
    this.masterDataService.propertyTypeList(),
    this.masterDataService.categoryList()])
      .pipe(takeUntil(this.$destroy),
        tap(([zoneResp, propertyTypeResp, categoryResp]) => {
          if (zoneResp.code === 200 && propertyTypeResp.code === 200) {

            this.zones = zoneResp.data.zones;
            this.propertyTypes = propertyTypeResp.data.propertyTypes;
            this.categories = categoryResp.data.categories;

          }
        }))
      .subscribe();
  }

  onAddProperty() {
    console.log(this.quickAddPropertyForm.value);

    const paylod: QuickCreatePropertyType = {
      salutation: this.quickAddPropertyForm.value.salutation.value,
      ownerName: this.quickAddPropertyForm.value.ownerName,
      careOf: '',
      guardianName: '',
      mobile: this.quickAddPropertyForm.value.mobile,
      householdNo: '',
      propertyType: String(this.quickAddPropertyForm.value.propertyType.propertyTypeName),
      zone: this.quickAddPropertyForm.value.zone.zoneId,
      ward: this.quickAddPropertyForm.value.ward.wardId,
      mohallaName: String(this.quickAddPropertyForm.value.mohallaName.mohallaId),
      category: this.quickAddPropertyForm.value.category.categoryId,
      subCategory: this.quickAddPropertyForm.value.subCategory.subCategoryId,
      updatedBy: this.currentLoggedUserName,
    }
    console.log(paylod);
    this.ownerService.quickCreateProperty(paylod)
      .pipe(takeUntil(this.$destroy),
        tap((resp) => {
          if (resp.code === 200 && resp.status === 'Success') {
            // this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Property added successfully.', life: MessageDuaraion.STANDARD });
            this.dialogVisible = true;
            this.surveyNo = resp.data;
            this.quickAddPropertyForm.reset();
          } else {
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Property add failed.', life: MessageDuaraion.STANDARD });
          }
        }))
      .subscribe()
  }
}

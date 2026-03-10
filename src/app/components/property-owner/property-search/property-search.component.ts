import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutoFocusModule } from 'primeng/autofocus';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { APIResponse } from '../../../models/user.model';
import { OwnerDetail, PropertySearchResultType } from '../../../models/property-owner.model';
import { environment } from '../../../../environments/environment';
import { AadharMaskPipe } from '../../../pipes/aadhar-mask.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule } from '@angular/common';

type PropertySearchType = {
  searchBy: string,
  searchValue: string
}

@Component({
  selector: 'app-property-search',
  imports: [PageHeaderComponent, AutoCompleteModule,
    FormsModule, FluidModule, RadioButtonModule, AutoFocusModule,
    InputGroupModule, InputIconModule,
    IconFieldModule, InputTextModule, ButtonModule, InputGroupAddonModule, CommonModule],
  templateUrl: './property-search.component.html',
  styleUrl: './property-search.component.scss'
})
export class PropertySearchComponent {

  env = environment;


  items: OwnerDetail[] = [];


  $destroy: Subject<null> = new Subject();
  private router = inject(Router);
  private searchTerms = new Subject<string>();

  private ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);

  searchForm: PropertySearchType = {
    searchBy: 'householdNo',
    searchValue: ''
  }

  properties: PropertySearchResultType[] = [];



  constructor() {
    // this.searchTerms.pipe(
    //   takeUntil(this.$destroy),
    //   debounceTime(300), // Wait for 300ms after each keystroke before considering the term
    //   distinctUntilChanged(), // Ignore if next search term is same as previous
    //   switchMap((term: string) => this.ownerService.searchOwner(this.searchBy, term)) // Switch to new observable each time
    // ).subscribe((resp: APIResponse<OwnerDetail[]>) => {
    //   if (resp.code === 200 && resp.status === 'Success') {
    //     this.items = resp.data
    //   } else {
    //     this.items = []
    //   }
    // });
  }



  // search(event: AutoCompleteCompleteEvent) {
  //   const query = event.query;
  //   if (query && query.length > 0) {
  //     this.searchTerms.next(query);
  //   } else {
  //     this.items = []; // Clear suggestions if query is empty
  //   }

  // }

  clearResults() {
    this.properties = [];
  }

  onOwnerSelect(propertyId: number) {
    // console.log(event);
    if (!propertyId) {
      return
    }
    this.router.navigate(['/property', 'detail', propertyId])
  }

  searchProperty(formValue: PropertySearchType) {
    console.log(formValue)
    this.ownerService.getPropertyMasterDetail(formValue.searchBy, formValue.searchValue.trim().toLowerCase())
      .pipe(takeUntil(this.$destroy),
        tap((resp: APIResponse<PropertySearchResultType[]>) => {
          console.log(resp)
          if (resp.code === 200 && resp.status === 'Success') {
            this.properties = resp.data;
          } else {
            this.messageService.add({ severity: MessageSeverity.INFO, summary: 'Not Found', detail: `Property not found with provided details.`, life: MessageDuaraion.STANDARD })
          }
        }))
      .subscribe()
  }
}

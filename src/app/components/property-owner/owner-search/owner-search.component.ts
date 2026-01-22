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


@Component({
  selector: 'app-owner-search',
  imports: [PageHeaderComponent, AutoCompleteModule,
    FormsModule, FluidModule, RadioButtonModule, AutoFocusModule, AadharMaskPipe, InputTextModule, ButtonModule],
  templateUrl: './owner-search.component.html',
  styleUrl: './owner-search.component.scss'
})
export class OwnerSearchComponent {

  env = environment;
  searchValue = ''

  items: OwnerDetail[] = [];
  searchBy: string = 'pin';
  searchPin: string = ''

  $destroy: Subject<null> = new Subject();
  private router = inject(Router);
  private searchTerms = new Subject<string>();

  private ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);



  constructor() {
    this.searchTerms.pipe(
      takeUntil(this.$destroy),
      debounceTime(300), // Wait for 300ms after each keystroke before considering the term
      distinctUntilChanged(), // Ignore if next search term is same as previous
      switchMap((term: string) => this.ownerService.searchOwner(this.searchBy, term)) // Switch to new observable each time
    ).subscribe((resp: APIResponse<OwnerDetail[]>) => {
      if (resp.code === 200 && resp.status === 'Success') {
        this.items = resp.data
      } else {
        this.items = []
      }
    });
  }



  search(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    if (query && query.length > 0) {
      this.searchTerms.next(query);
    } else {
      this.items = []; // Clear suggestions if query is empty
    }

  }


  onOwnerSelect(event: AutoCompleteSelectEvent) {
    // console.log(event);
    this.router.navigate(['/owner', 'detail', event.value.ownerId])
  }

  searchProperty() {
    console.log(this.searchPin)
    this.ownerService.getPropertyMasterDetail(this.searchPin.trim().toUpperCase())
      .pipe(takeUntil(this.$destroy),
        tap((resp: APIResponse<PropertySearchResultType>) => {
          if (resp.code === 200 && (resp.data.attribute6 || resp.data.householdNo)) {
            // this.router.navigate(['/owner', 'detail', res
            // p.data.propertyId])
          
            this.router.navigate(['/owner', 'detail'], {queryParams: {
              pin: resp.data.householdNo,
              sur: resp.data.attribute6
            }})
          } else {
            this.messageService.add({ severity: MessageSeverity.INFO, summary: 'Not Found', detail: `Property not found with provided details.`, life: MessageDuaraion.STANDARD })
          }
        }))
      .subscribe()
  }
}

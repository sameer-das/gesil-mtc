import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutoFocusModule } from 'primeng/autofocus';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { APIResponse } from '../../../models/user.model';
import { OwnerDetail } from '../../../models/property-owner.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-owner-search',
  imports: [PageHeaderComponent, AutoCompleteModule, FormsModule, FluidModule, RadioButtonModule, AutoFocusModule],
  templateUrl: './owner-search.component.html',
  styleUrl: './owner-search.component.scss'
})
export class OwnerSearchComponent {

  env = environment;
  searchValue = ''

  items: OwnerDetail[] = [];
  searchBy: string = 'ownerName';


  private router = inject(Router);
  private searchTerms = new Subject<string>();

  private ownerService: OwnerServiceService = inject(OwnerServiceService);


  constructor(){
    this.searchTerms.pipe(
      debounceTime(300), // Wait for 300ms after each keystroke before considering the term
      distinctUntilChanged(), // Ignore if next search term is same as previous
      switchMap((term: string) => this.ownerService.searchOwner(this.searchBy, term)) // Switch to new observable each time
    ).subscribe((resp: APIResponse<OwnerDetail[]>) => {
      if(resp.code === 200 && resp.status === 'Success') {
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
}

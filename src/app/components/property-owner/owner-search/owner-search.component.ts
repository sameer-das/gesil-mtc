import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutoFocusModule } from 'primeng/autofocus';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-search',
  imports: [PageHeaderComponent, AutoCompleteModule, FormsModule, FluidModule, RadioButtonModule, AutoFocusModule],
  templateUrl: './owner-search.component.html',
  styleUrl: './owner-search.component.scss'
})
export class OwnerSearchComponent {
  searchValue = ''

  items: any[] = [];
  searchBy: string = 'name';


  private router = inject(Router);


  search(event: AutoCompleteCompleteEvent) {
    this.items = [...Array(10).keys()].map(item => event.query + '-' + item);
  }


  onOwnerSelect(event: AutoCompleteSelectEvent) {
    console.log(event);
    this.router.navigate(['/owner', 'detail', '1'])
  }
}

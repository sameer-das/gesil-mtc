import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../utils/page-header/page-header.component';
import { RequestCardComponent } from '../request-card/request-card.component';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';



@Component({
  selector: 'app-my-requests',
  imports: [PageHeaderComponent, RequestCardComponent, SelectModule, 
    InputTextModule, ReactiveFormsModule, DatePickerModule ],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss'
})
export class MyRequestsComponent implements OnInit {

  // statusFilter

  searchValue = new FormControl('');
  rangeDates = new FormControl();
  statusType = new FormControl({label: 'All', value: 'all'});
  statusTypes = [
    {label: 'All', value: 'all'},
    {label: 'Pending', value: 'pending'},
    {label: 'Approved', value: 'approved'},
    {label: 'Rejected', value: 'rejected'},
    {label: 'Sentback', value: 'sentback'},
  ]

  ngOnInit(){
    this.searchValue.valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(c => console.log(c)))
      .subscribe()

    this.rangeDates.valueChanges
    .pipe(
      tap(c => console.log(c)))
      .subscribe()
  }
}








import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { APIResponse, District, State, UserDetail } from '../../../models/user.model';
import { UsersService } from '../../../services/users.service';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";

@Component({
  selector: 'app-user-details',
  imports: [PageHeaderComponent,
    DividerModule,
    DatePipe,
    ButtonModule,
    RouterModule,
    ProgressBarModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {

  private $destroy: Subject<null> = new Subject();
  userDetail!: UserDetail;

  stateName: string = '';
  districtName: string = '';

  private route: ActivatedRoute = inject(ActivatedRoute);
  private usersService: UsersService = inject(UsersService);



  ngOnInit(): void {
    this.fetchUserDetails();
  }



  fetchUserDetails() {
    this.route.params
      .pipe(takeUntil(this.$destroy),
        tap((param: Params) => console.log(param)),
        switchMap((param: Params) => this.usersService.getUserDetails(+param['userId'])),
        tap((resp: APIResponse) => {
          console.log(resp);

          if (resp.code === 200) {
            this.userDetail = resp.data as UserDetail;
            this.populateStateName();

          }
        }))
      .subscribe()
  }



  populateStateName() {
    this.usersService.getStates().pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp);
          // this.states = resp.data;
          if (resp.code === 200) {
            const foundState = (resp.data as State[]).find((curr: State) => {
              return curr.id === this.userDetail.state;
            });
            if (foundState) {
              this.stateName = foundState.name;
              this.populateDistrictName(foundState.id);
            }
          }
        }
      })
  }



  populateDistrictName(stateId: number) {
    this.usersService.getDistrict(stateId).pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse) => {
          console.log(resp);
          // this.states = resp.data;
          if (resp.code === 200) {
            const foundDistrict = (resp.data as District[]).find((curr: District) => {
              return curr.id === this.userDetail.district;
            });
            if (foundDistrict) {
              this.districtName = foundDistrict.name;
            }
          }
        }
      })
  }

}

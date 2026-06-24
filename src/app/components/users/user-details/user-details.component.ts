import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { APIResponse, District, State, UserDetail } from '../../../models/user.model';
import { UsersService } from '../../../services/users.service';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { OrgChartComponent } from "../org-chart/org-chart.component";
import { PermissionService } from '../../../services/permission.service';
import { PERMISSIONS } from '../../../models/constants';


@Component({
  selector: 'app-user-details',
  imports: [PageHeaderComponent,
    DividerModule,
    DatePipe,
    ButtonModule,
    RouterModule,
    ProgressBarModule, TooltipModule, OrgChartComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  env = environment;

  private $destroy: Subject<null> = new Subject();
  userDetail: UserDetail | null = null;

  stateName: string = '';
  districtName: string = '';

  private route: ActivatedRoute = inject(ActivatedRoute);
  private usersService: UsersService = inject(UsersService);

  permissionService: PermissionService = inject(PermissionService);
  PERMISSIONS = PERMISSIONS;

  currentLoggedUserType: number = +(localStorage.getItem('loginUserType') || 0);

  userId!: number;

  ngOnInit(): void {
    this.fetchUserDetails();
  }



  fetchUserDetails() {
    this.route.params
      .pipe(takeUntil(this.$destroy),
        tap((param: Params) => {
          this.userId = +param['userId'];
          console.log(param)
        }),
        switchMap((param: Params) => this.usersService.getUserDetails(+param['userId'])),
        tap((resp: APIResponse<UserDetail>) => {
          console.log(resp);

          if (resp.code === 200) {
            this.userDetail = resp.data as UserDetail;
            this.populateStateName();
            this.fetchHeirarchy(this.userDetail.userId)
          }
        }))
      .subscribe()
  }



  populateStateName() {
    this.usersService.getStates().pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<State[]>) => {
          console.log(resp);
          // this.states = resp.data;
          if (resp.code === 200) {
            const foundState = (resp.data).find((curr: State) => {
              return curr.id === this.userDetail?.state;
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
        next: (resp: APIResponse<District[]>) => {
          console.log(resp);
          // this.states = resp.data;
          if (resp.code === 200) {
            const foundDistrict = (resp.data).find((curr: District) => {
              return curr.id === this.userDetail?.district;
            });
            if (foundDistrict) {
              this.districtName = foundDistrict.name;
            }
          }
        }
      })
  }


  fetchHeirarchy(userId: number) {
    this.usersService.getUserHierarchy(userId)
      .pipe(
        takeUntil
          (this.$destroy),
        tap(x => {
          console.log(x)
        })
      ).subscribe()
  }

}

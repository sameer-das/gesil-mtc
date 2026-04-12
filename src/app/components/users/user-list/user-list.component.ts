import { MasterDataService } from './../../../services/master-data.service';
import { PERMISSIONS } from './../../../models/constants';
import { APIResponse } from './../../../models/user.model';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TABLE_CONFIG } from '../../../models/tableConfig';
import { UserList } from '../../../models/user.model';
import { UsersService } from '../../../services/users.service';
import { PageHeaderComponent } from '../../utils/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionService } from '../../../services/permission.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-list',
  imports: [TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PageHeaderComponent,
    ButtonModule,
    TooltipModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  userList: UserList[] = [];
  TABLE_CONFIG = TABLE_CONFIG;
  totalRecords!: number;
  private $destroy: Subject<null> = new Subject();
  private currentLoggedUserType: number = +(localStorage.getItem('loginUserType') || 0);

  router: Router = inject(Router);
  private usersService: UsersService = inject(UsersService);
  permissionService: PermissionService = inject(PermissionService);
  PERMISSIONS = PERMISSIONS;

  search: FormControl = new FormControl('');
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {

    this.search.valueChanges.pipe(
      takeUntil(this.$destroy),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((searchValue) => {
        if (searchValue.trim().length > 0)
          return this.usersService.searchUser(searchValue, this.currentLoggedUserType, this.pageNumber, this.pageSize);
        else
          return this.usersService.getUserList(this.currentLoggedUserType, this.pageNumber, this.pageSize)
      }),
      tap(resp => {
        if (resp.code === 200) {
          console.log(resp);
          this.totalRecords = resp.data.totalCount;
          this.userList = resp.data?.userLists?.map((curr: UserList) => {
            return {
              ...curr,
              firstName: curr.firstName + ' ' + curr.middleName + ' ' + curr.lastName,
              showPassword: false
            }
          });
        }
      })
    ).subscribe()

  }



  onGlobalFilter(table: Table, e: Event) {
    console.log(table)
    console.log(e)
  }



  loadUserData(e: TableLazyLoadEvent) {
    // console.log(e);
    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }
    this.pageNumber = pageNumber;
    this.pageSize = e.rows || 5;

    if (this.search.value.trim().length === 0) {
      this.getUserListUnderCurrentUserType(pageNumber, (e.rows || 5));
    } else {
      this.usersService.searchUser(this.search.value.trim(), this.currentLoggedUserType, this.pageNumber, this.pageSize)
        .pipe(takeUntil(this.$destroy),
          tap((resp) => {
            if (resp.code === 200) {
              this.totalRecords = resp.data.totalCount;
              this.userList = resp.data?.userLists?.map((curr: UserList) => {
                return {
                  ...curr,
                  firstName: curr.firstName + ' ' + curr.middleName + ' ' + curr.lastName,
                  showPassword: false
                }
              });
            }
          }))
        .subscribe()
    }

  }



  getUserListUnderCurrentUserType(pageNumber: number, pageSize: number) {
    this.usersService.getUserList(this.currentLoggedUserType, pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{ userLists: UserList[], totalCount: number }>) => {

          if (resp.code === 200) {
            this.totalRecords = resp.data.totalCount;
            this.userList = resp.data?.userLists.map((curr: UserList) => {
              return {
                ...curr,
                firstName: curr.firstName + ' ' + curr.middleName + ' ' + curr.lastName,
                showPassword: false
              }
            });
          } else {
            this.userList = [];
          }

        }
      })
  }



}

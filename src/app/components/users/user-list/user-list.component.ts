import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TABLE_CONFIG } from '../../../models/tableConfig';
import { APIResponseForUserList, UserList } from '../../../models/user.model';
import { UsersService } from '../../../services/users.service';
import { PageHeaderComponent } from '../../utils/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
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
    TranslateModule],
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

  ngOnInit(): void {

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
    this.getUserListUnderCurrentUserType(pageNumber, (e.rows || 5));
  }



  getUserListUnderCurrentUserType(pageNumber: number, pageSize: number) {
    this.usersService.getUserList(this.currentLoggedUserType, pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponseForUserList) => {

          if (resp.code === 200) {
            this.totalRecords = resp.data.totalCount;
            this.userList = (resp.data?.userLists).map((curr: UserList) => {
              return {
                ...curr, firstName: curr.firstName + ' ' + curr.middleName + ' ' + curr.lastName
              }
            });
          } else {
            this.userList = [];
          }

        }
      })
  }



}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { UsersService } from '../../../services/users.service';
import { Subject, takeUntil } from 'rxjs';
import { APIResponse, ChildUserType, UserType } from '../../../models/user.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { TABLE_CONFIG } from '../../../models/tableConfig';

@Component({
  selector: 'app-user-type-list',
  imports: [PageHeaderComponent,
    TableModule,
    ButtonModule,
    TooltipModule,
    RouterModule
  ],
  templateUrl: './user-type-list.component.html',
  styleUrl: './user-type-list.component.scss'
})
export class UserTypeListComponent implements OnInit, OnDestroy {
    
    
    currentLoggedUserType: number = +(localStorage.getItem('loginUserType') || 0);

    private usersService = inject(UsersService);
    private $destroy: Subject<null> = new Subject();
    tableLoading: boolean = false;
    TABLE_CONFIG = TABLE_CONFIG;

    childUserType: ChildUserType[] = [];

    ngOnDestroy(): void {
      this.$destroy.next(null);
    }

    ngOnInit(): void {
      this.usersService.getChildrenUserType(this.currentLoggedUserType).pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<ChildUserType[]>) => {
          console.log(resp)
          if(resp.code === 200) {
            this.childUserType = resp.data;
          }
        }, 
        error: (err) => {
          console.log(err);
        }
      })
    }

    loadUserData(e: any) {
      console.log(e)
    }

    editUserType(userType: UserType) {

    }

    deleteUserType(userType: UserType){

    }

}

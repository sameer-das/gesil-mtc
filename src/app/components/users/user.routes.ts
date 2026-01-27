import { Routes } from '@angular/router';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserTypeListComponent } from './user-type-list/user-type-list.component';
import { UserTypeCreateComponent } from './user-type-create/user-type-create.component';
import { inject } from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { PERMISSIONS } from '../../models/constants';


export default [
    { path: '', component: UserListComponent },
    {
        path: 'list', component: UserListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.VIEW_USER)
        }]
    },
    {
        path: 'create', component: UserCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.CREATE_USER)
        }]
    },
    {
        path: 'details/:userId', component: UserDetailsComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.VIEW_USER)
        }]
    },
    {
        path: 'edit/:userId', component: UserEditComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_USER_DETAILS)
        }]
    },
    {
        path: 'usertypes', component: UserTypeListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.VIEW_USER_TYPE)
        }]
    },
    {
        path: 'usertypes/create', component: UserTypeCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.CREATE_USER_TYPE)
        }]
    },
    {
        path: 'usertypes/edit/:userId', component: UserTypeCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_USER_TYPE)
        }]
    },
] as Routes;
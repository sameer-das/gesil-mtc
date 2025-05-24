import { Routes } from '@angular/router';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserTypeListComponent } from './user-type-list/user-type-list.component';
import { UserTypeCreateComponent } from './user-type-create/user-type-create.component';


export default [
    { path: '', component: UserListComponent },
    { path: 'list', component: UserListComponent },
    { path: 'create', component: UserCreateComponent },
    { path: 'details/:userId', component: UserDetailsComponent },
    { path: 'edit/:userId', component: UserEditComponent },

    { path: 'usertypes', component: UserTypeListComponent },
    { path: 'usertypes/create', component: UserTypeCreateComponent },
    { path: 'usertypes/edit/:userId', component: UserTypeCreateComponent },
] as Routes;
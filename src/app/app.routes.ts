import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './services/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'user', loadChildren: () => import('./components/users/user.routes') },
            // { path: 'documentation', component: Documentation },
            // { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    {path: 'login', component: LoginComponent}
];

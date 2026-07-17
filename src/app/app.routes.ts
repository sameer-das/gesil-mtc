import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './services/guards/auth.guard';
import { citizenGuard } from './services/guards/citizen.guard';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'user', loadChildren: () => import('./components/users/user.routes') },
            { path: 'master', loadChildren: () => import('./components/master-menu/master-menu.routes') },
            { path: 'property', loadChildren: () => import('./components/property-owner/property-owner.routes') },
            { path: 'reports', loadChildren: () => import('./components/reports/reports.route') },
            { path: 'requests', loadChildren: () => import('./components/requests/requests.route') },
            { path: 'citizen', loadChildren: () => import('./components/citizen/citizen.routes')},
        ]
    },
    {path: 'login', component: LoginComponent}
];

import { Routes } from "@angular/router";
import { CitizenDashboardComponent } from "./citizen-dashboard/citizen-dashboard.component";


const route: Routes = [
    { path: 'citizen-dashboard', component: CitizenDashboardComponent },
    { path: '', redirectTo: 'citizen-dashboard', pathMatch: 'full' }
]

export default route;
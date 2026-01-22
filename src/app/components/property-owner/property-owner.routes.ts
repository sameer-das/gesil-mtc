import { Routes } from '@angular/router';
import { OwnerDetailComponent } from './owner-detail/owner-detail.component';
import { OwnerEntryComponent } from './owner-entry/owner-entry.component';
import { OwnerSearchComponent } from './owner-search/owner-search.component';
import { PropertyEntryComponent } from './property-entry/property-entry.component';
import { QuickAddPropertyComponent } from './quick-add-property/quick-add-property.component';



export default [
    { path: '', component: OwnerEntryComponent },
    { path: 'owner-entry', redirectTo: '', pathMatch: 'full' },
    { path: 'quick-add-property', component: QuickAddPropertyComponent },
    { path: 'owner-edit/:ownerId', component: OwnerEntryComponent },
    { path: 'owner-search', component: OwnerSearchComponent },
    { path: 'detail', component: OwnerDetailComponent },
    { path: 'property-entry/:ownerId', component: PropertyEntryComponent },

] as Routes;
import { Routes } from '@angular/router';
import { ZoneListComponent } from './zones/zone-list/zone-list.component';
import { ZoneCreateComponent } from './zones/zone-create/zone-create.component';
import { WardListComponent } from './ward/ward-list/ward-list.component';
import { WardCreateComponent } from './ward/ward-create/ward-create.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { SubCategoryListComponent } from './category/sub-category-list/sub-category-list.component';
import { SubCategoryCreateComponent } from './category/sub-category-create/sub-category-create.component';
import { FyListComponent } from './fy/fy-list/fy-list.component';
import { FyCreateComponent } from './fy/fy-create/fy-create.component';
import { ZoneDetailsComponent } from './zones/zone-details/zone-details.component';



export default [
    { path: '', component: ZoneListComponent },
    { path: 'zones-list', component: ZoneListComponent },
    { path: 'zone-create', component: ZoneCreateComponent },
    { path: 'zone-edit/:zoneId', component: ZoneCreateComponent },
    { path: 'zone-details/:zoneId', component: ZoneDetailsComponent },
    { path: 'ward-list', component: WardListComponent },
    { path: 'ward-create', component: WardCreateComponent },
    { path: 'ward-edit/:wardId', component: WardCreateComponent },
    { path: 'category-list', component: CategoryListComponent },
    { path: 'category-create', component: CategoryCreateComponent },
    { path: 'category-edit/:categoryId', component: CategoryCreateComponent },
    { path: 'sub-category-list', component: SubCategoryListComponent },
    { path: 'sub-category-create', component: SubCategoryCreateComponent },
    { path: 'sub-category-edit/:subCategoryId', component: SubCategoryCreateComponent },
    { path: 'fy-list', component: FyListComponent },
    { path: 'fy-create', component: FyCreateComponent },
    { path: 'fy-edit/:fyId', component: FyCreateComponent },

] as Routes;
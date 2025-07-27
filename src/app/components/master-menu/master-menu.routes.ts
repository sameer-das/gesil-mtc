import { ElectricityTypeListComponent } from './electricity-type/electricity-type-list/electricity-type-list.component';
import { CreatePropertyTypeComponent } from './property-type/create-property-type/create-property-type.component';
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
import { OwnershipTypeListComponent } from './ownership-type/ownership-type-list/ownership-type-list.component';
import { OwnershipTypeCreateComponent } from './ownership-type/ownership-type-create/ownership-type-create.component';
import { RoadTypeListComponent } from './road-type/road-type-list/road-type-list.component';
import { RoadTypeCreateComponent } from './road-type/road-type-create/road-type-create.component';
import { PropertyTypeListComponent } from './property-type/property-type-list/property-type-list.component';
import { CreateElectricityTypeComponent } from './electricity-type/create-electricity-type/create-electricity-type.component';



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

    { path: 'ownership-list', component: OwnershipTypeListComponent },
    { path: 'ownership-create', component: OwnershipTypeCreateComponent },
    { path: 'ownership-edit/:ownershipTypeId', component: OwnershipTypeCreateComponent },

    { path: 'roadtype-list', component: RoadTypeListComponent },
    { path: 'roadtype-create', component: RoadTypeCreateComponent },
    { path: 'roadtype-edit/:roadtypeId', component: RoadTypeCreateComponent },

    { path: 'property-list', component: PropertyTypeListComponent },
    { path: 'property-create', component: CreatePropertyTypeComponent },
    { path: 'property-edit/:propertyTypeId', component: CreatePropertyTypeComponent },

    { path: 'electricity-list', component: ElectricityTypeListComponent },
    { path: 'electricity-create', component: CreateElectricityTypeComponent },
    { path: 'electricity-edit/:electricityConnectionId', component: CreateElectricityTypeComponent },


] as Routes;
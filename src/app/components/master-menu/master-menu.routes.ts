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
import { MohallaListComponent } from './mohalla/mohalla-list/mohalla-list.component';
import { MohallaCreateComponent } from './mohalla/mohalla-create/mohalla-create.component';
import { inject } from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { PERMISSIONS } from '../../models/constants';



export default [
    // { path: '', component: ZoneListComponent },
    // ==================== ZONE ======================
    {
        path: 'zones-list', component: ZoneListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'zone-create', component: ZoneCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'zone-edit/:zoneId', component: ZoneCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'zone-details/:zoneId', component: ZoneDetailsComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    // ==================== WARD ======================
    {
        path: 'ward-list', component: WardListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'ward-create', component: WardCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'ward-edit/:wardId', component: WardCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    // ==================== CATEGORY ======================
    {
        path: 'category-list', component: CategoryListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'category-create', component: CategoryCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'category-edit/:categoryId', component: CategoryCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    // ==================== SUB CATEGORY ======================
    {
        path: 'sub-category-list', component: SubCategoryListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'sub-category-create', component: SubCategoryCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'sub-category-edit/:subCategoryId', component: SubCategoryCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    // ==================== FY ======================
    {
        path: 'fy-list', component: FyListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'fy-create', component: FyCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'fy-edit/:fyId', component: FyCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    // ==================== OWNERSHIP TYPE ======================
    {
        path: 'ownership-list', component: OwnershipTypeListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'ownership-create', component: OwnershipTypeCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'ownership-edit/:ownershipTypeId', component: OwnershipTypeCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    // ==================== ROAD TYPE ======================
    {
        path: 'roadtype-list', component: RoadTypeListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'roadtype-create', component: RoadTypeCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'roadtype-edit/:roadtypeId', component: RoadTypeCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },

    // ==================== PROPERTY TYPE ======================
    {
        path: 'property-list', component: PropertyTypeListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'property-create', component: CreatePropertyTypeComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'property-edit/:propertyTypeId', component: CreatePropertyTypeComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    // ==================== ELECTIRCITY TYPE ======================
    {
        path: 'electricity-list', component: ElectricityTypeListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'electricity-create', component: CreateElectricityTypeComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    { path: 'electricity-edit/:electricityConnectionId', component: CreateElectricityTypeComponent },
    // ==================== MOHALLA ======================
    {
        path: 'mohalla-list', component: MohallaListComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.READ_MASTER_DATA)
        }]
    },
    {
        path: 'mohalla-create', component: MohallaCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },
    {
        path: 'mohalla-edit/:mohallaId', component: MohallaCreateComponent, canActivate: [() => {
            return inject(PermissionService).hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
        }]
    },


] as Routes;
import { Routes } from "@angular/router";
import { NewPropertiesComponent } from "./new-properties/new-properties.component";
import { UpdatedPropertiesComponent } from "./updated-properties/updated-properties.component";

export default [
    {
        path: 'new-properties', component: NewPropertiesComponent, canActivate: [() => {
            return true
        }]
    },
    {
        path: 'updated-properties', component: UpdatedPropertiesComponent, canActivate: [() => {
            return true
        }]
    }
] as Routes;
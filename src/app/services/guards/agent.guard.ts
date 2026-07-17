import { CanMatchFn, Router } from "@angular/router";
import { PermissionService } from "../permission.service";
import { inject } from "@angular/core";

export const agentGuard: CanMatchFn = () => {

    const token = localStorage.getItem('accessToken');
    const permissionService = inject(PermissionService);

    const router = inject(Router);

    if (token && !permissionService.isEmployeeLogin()) {
        return true;
    } else {
        router.navigate(['/login'])
        return false;
    }



}
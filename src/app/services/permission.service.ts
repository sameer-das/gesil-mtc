import { computed, inject, Injectable, signal } from '@angular/core';
import { UsersService } from './users.service';
import { firstValueFrom, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor() { }

  private userService: UsersService = inject(UsersService);

  private _permissions = signal<number[]>([]);

  isEmployeeLogin = computed(() => {
    return this._permissions().length === 0
  });



  // refreshPermissions(userId: number = +(localStorage.getItem('loginUserId') || 0)) {
  //   console.log('Fetching Permissions for :: ' + userId);
  //   if (!userId || userId === 0) {
  //     this._permissions.set([]);
  //   } else {
  //     // this._permissions.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  //     this.userService.getFeatureMapping(userId, 0).pipe(tap((resp) => {
  //       console.log(resp);
  //       if (resp.code === 200 && resp.status === 'Success') {
  //         const allowedPermissions = resp.data.filter(curr => curr.mappingActive).map(curr => curr.featureId);
  //         console.log(allowedPermissions)
  //         this._permissions.set(allowedPermissions);
  //       }
  //     })).subscribe()
  //   }
  // }


async refreshPermissions(
  userId: number = +(localStorage.getItem('loginUserId') || 0)
): Promise<number[]> {
  console.log('Fetching Permissions for :: ' + userId);

  if (!userId || userId === 0) {
    this._permissions.set([]);
    return [];
  }

  try {
    const resp = await firstValueFrom(
      this.userService.getFeatureMapping(userId, 0).pipe(
        tap((resp) => console.log(resp))
      )
    );

    if (resp.code === 200 && resp.status === 'Success') {
      const allowedPermissions = resp.data
        .filter(curr => curr.mappingActive)
        .map(curr => curr.featureId);

      console.log(allowedPermissions);

      this._permissions.set(allowedPermissions);
      return allowedPermissions;
    }

    this._permissions.set([]);
    return [];
  } catch (error) {
    console.error('Failed to fetch permissions', error);
    this._permissions.set([]);
    return [];
  }
}

  permission() {
    return this._permissions.asReadonly();
  }

  hasPermission(featureId: number) {
    return this._permissions().includes(featureId);
  }
}

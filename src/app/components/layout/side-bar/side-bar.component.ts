import { Component, computed, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu'
import { PermissionService } from '../../../services/permission.service';
import { PERMISSIONS } from '../../../models/constants';

@Component({
  selector: 'app-side-bar',
  imports: [PanelMenuModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

  showUserTopMenu = computed(() => {
    return this.permissionService.hasPermission(PERMISSIONS.VIEW_USER_TYPE) ||
      this.permissionService.hasPermission(PERMISSIONS.CREATE_USER) ||
      this.permissionService.hasPermission(PERMISSIONS.VIEW_USER)
  });
  showMasterTopMenu = computed(() => {
    return this.permissionService.hasPermission(PERMISSIONS.READ_MASTER_DATA) ||
      this.permissionService.hasPermission(PERMISSIONS.MODIFY_MASTER_DATA)
  })
  showPropertyTopMenu = computed(() => {
    return true;
  })
  showReportsTopMenu = computed(() => {
    return this.permissionService.hasPermission(PERMISSIONS.VIEW_REPORTS);
  })


  constructor() {
    effect(() => {
      // console.log(this.showUserTopMenu())
      // console.log(this.showMasterTopMenu())
      // console.log(this.showPropertyTopMenu())
      this.getMenu()
    })
  }

  @ViewChild('sideBar') sideBar!: ElementRef;
  router = inject(Router);
  permissionService: PermissionService = inject(PermissionService);
  items: MenuItem[] = [];


  getMenu() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-table',
        routerLink: ['/'],
        routerLinkActiveOptions: { exact: true },
        command: (e: MenuItemCommandEvent) => {
          // console.log(e)
        }
      },
      {
        label: 'Users',
        icon: 'pi pi-user',
        visible: this.showUserTopMenu(),
        items: [
          {
            label: 'User Types',
            icon: 'pi pi-list',
            routerLink: '/user/usertypes',
            routerLinkActiveOptions: { exact: true },
            visible: this.permissionService.hasPermission(PERMISSIONS.VIEW_USER_TYPE),
            command: (e: MenuItemCommandEvent) => {
              // console.log(e);
              // this.router.navigate(['/user/create'])
            }
          },
          {
            label: 'User Creation',
            icon: 'pi pi-user-plus',
            routerLink: '/user/create',
            routerLinkActiveOptions: { exact: true },
            visible: this.permissionService.hasPermission(PERMISSIONS.CREATE_USER),
            command: (e: MenuItemCommandEvent) => {
              // console.log(e);
              // this.router.navigate(['/user/create'])
            }
          },
          {
            label: 'User Lists',
            icon: 'pi pi-users',
            routerLink: '/user/list',
            routerLinkActiveOptions: { exact: true },
            visible: this.permissionService.hasPermission(PERMISSIONS.VIEW_USER),
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate(['/user/list'])
            }
          }
        ]
      },
      {
        label: 'Master Data',
        icon: 'fa fa-city',
        visible: this.showMasterTopMenu(),
        items: [
          {
            label: 'Zone',
            icon: 'pi pi-list',
            routerLink: '/master/zones-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e);
              // this.router.navigate(['/user/create'])
            }
          },
          {
            label: 'Ward',
            icon: 'pi pi-list',
            routerLink: '/master/ward-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e);
              // this.router.navigate(['/user/create'])
            }
          },
          {
            label: 'Mohalla',
            icon: 'pi pi-list',
            routerLink: '/master/mohalla-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e);
              // this.router.navigate(['/user/create'])
            }
          },
          {
            label: 'Property Type',
            icon: 'pi pi-list',
            routerLink: '/master/property-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e);
              // this.router.navigate(['/user/create'])
            }
          },
          {
            label: 'Ownership Type',
            icon: 'pi pi-list',
            routerLink: '/master/ownership-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e);
              // this.router.navigate(['/user/create'])
            }
          },
          // {
          //   label: 'Electricity Connection',
          //   icon: 'pi pi-list',
          //   routerLink: '/master/electricity-list',
          //   routerLinkActiveOptions: { exact: true },
          //   command: (e: MenuItemCommandEvent) => {
          //     // console.log(e);
          //     // this.router.navigate(['/user/create'])
          //   }
          // },
          {
            label: 'Category List',
            icon: 'pi pi-list',
            routerLink: '/master/category-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate([''])
            }
          },
          {
            label: 'Sub-category List',
            icon: 'pi pi-list',
            routerLink: '/master/sub-category-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate([''])
            }
          },
          {
            label: 'Financial Years',
            icon: 'pi pi-list',
            routerLink: '/master/fy-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate([''])
            }
          },
          // {
          //   label: 'Ownership Type List',
          //   icon: 'pi pi-list',
          //   routerLink: '/master/ownership-list',
          //   routerLinkActiveOptions: { exact: true },
          //   command: (e: MenuItemCommandEvent) => {
          //     // console.log(e)
          //     // this.router.navigate([''])
          //   }
          // },
          // {
          //   label: 'Road Type List',
          //   icon: 'pi pi-list',
          //   routerLink: '/master/roadtype-list',
          //   routerLinkActiveOptions: { exact: true },
          //   command: (e: MenuItemCommandEvent) => {
          //     // console.log(e)
          //     // this.router.navigate([''])
          //   }
          // },

        ],

      }, 
      {
        label: 'Property and Owner',
        icon: 'pi pi-users',
        visible: this.showPropertyTopMenu(),
        items: [
          {
            label: 'Search Property',
            icon: 'pi pi-search',
            routerLink: '/property/property-search',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate([''])
            }
          },
          {
            label: 'Quick Add Property',
            icon: 'pi pi-building-columns',
            routerLink: '/property/quick-add-property',
            routerLinkActiveOptions: { exact: true },
            visible: this.permissionService.hasPermission(PERMISSIONS.ADD_PROPERTY),
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate([''])
            }
          },
          {
            label: 'Survery List',
            icon: 'pi pi-list',
            routerLink: '/property/survey-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate([''])
            }
          },
          {
            label: 'Approve Property',
            icon: 'pi pi-check',
            routerLink: '/property/approval-list',
            routerLinkActiveOptions: { exact: true },
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate([''])
            }
          },

        ]
      }, 
      {
        label: 'Reports',
        icon: 'pi pi-file-pdf',
        visible: this.showReportsTopMenu(),

        items: [
          {
            label: 'New Properties',
            icon: 'pi pi-file',
            routerLink: '/reports/new-properties',
            routerLinkActiveOptions: { exact: true },
            // visible: this.permissionService.hasPermission(PERMISSIONS.VIEW_USER),
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate(['/user/list'])
            }
          },
          {
            label: 'Updated Properties',
            icon: 'pi pi-file',
            routerLink: '/reports/updated-properties',
            routerLinkActiveOptions: { exact: true },
            // visible: this.permissionService.hasPermission(PERMISSIONS.VIEW_USER),
            command: (e: MenuItemCommandEvent) => {
              // console.log(e)
              // this.router.navigate(['/user/list'])
            }
          }
        ]
      }
    ];
  }

  
}

import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu'

@Component({
  selector: 'app-side-bar',
  imports: [PanelMenuModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

  @ViewChild('sideBar') sideBar!: ElementRef;
  router = inject(Router);
  items: MenuItem[] = [
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
      items: [
        {
          label: 'User Types',
          icon: 'pi pi-list',
          routerLink: '/user/usertypes',
          routerLinkActiveOptions: { exact: true },
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
        {
          label: 'Electricity Connection',
          icon: 'pi pi-list',
          routerLink: '/master/electricity-list',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e);
            // this.router.navigate(['/user/create'])
          }
        },
        // {
        //   label: 'Category List',
        //   icon: 'pi pi-list',
        //   routerLink: '/master/category-list',
        //   routerLinkActiveOptions: { exact: true },
        //   command: (e: MenuItemCommandEvent) => {
        //     // console.log(e)
        //     // this.router.navigate([''])
        //   }
        // },
        // {
        //   label: 'Sub-category List',
        //   icon: 'pi pi-list',
        //   routerLink: '/master/sub-category-list',
        //   routerLinkActiveOptions: { exact: true },
        //   command: (e: MenuItemCommandEvent) => {
        //     // console.log(e)
        //     // this.router.navigate([''])
        //   }
        // },
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

    }, {
      label: 'Property Owner',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Search Property Owner',
          icon: 'pi pi-search',
          routerLink: '/owner/owner-search',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e)
            // this.router.navigate([''])
          }
        },
        {
          label: 'New Property Owner',
          icon: 'pi pi-list',
          routerLink: '/owner',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e)
            // this.router.navigate([''])
          }
        },
        
      ]
    }
  ];
}

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
      label: 'Property Master',
      icon: 'fa fa-city',
      items: [
        {
          label: 'Ward List',
          icon: 'pi pi-list',
          routerLink: '',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e);
            // this.router.navigate(['/user/create'])
          }
        },
        {
          label: 'Floor List',
          icon: 'pi pi-list',
          routerLink: '',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e);
            // this.router.navigate(['/user/create'])
          }
        },
        {
          label: 'Road Type List',
          icon: 'pi pi-list',
          routerLink: '',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e)
            // this.router.navigate([''])
          }
        },
        {
          label: 'Construction Type List',
          icon: 'pi pi-list',
          routerLink: '',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e)
            // this.router.navigate([''])
          }
        },
        {
          label: 'Property Type List',
          icon: 'pi pi-list',
          routerLink: '',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e)
            // this.router.navigate([''])
          }
        },
        {
          label: 'Occupancy Type List',
          icon: 'pi pi-list',
          routerLink: '',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e)
            // this.router.navigate([''])
          }
        },
        {
          label: 'Usage Type Detail List',
          icon: 'pi pi-list',
          routerLink: '',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e)
            // this.router.navigate([''])
          }
        },
      ]
    },
  ];
}

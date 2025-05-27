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
          label: 'Zone List',
          icon: 'pi pi-list',
          routerLink: '/master/zones-list',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e);
            // this.router.navigate(['/user/create'])
          }
        },
        {
          label: 'Ward List',
          icon: 'pi pi-list',
          routerLink: '/master/ward-list',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e);
            // this.router.navigate(['/user/create'])
          }
        },
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
          label: 'Financial Year List',
          icon: 'pi pi-list',
          routerLink: '/master/fy-list',
          routerLinkActiveOptions: { exact: true },
          command: (e: MenuItemCommandEvent) => {
            // console.log(e)
            // this.router.navigate([''])
          }
        },
        
      ],

    }, {
      label: 'Citizens',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Citizen Entry',
          icon: 'pi pi-list',
          routerLink: '/citizen',
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

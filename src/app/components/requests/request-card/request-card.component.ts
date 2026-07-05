import { NgClass } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'request-card',
  imports: [NgClass, RouterLink, MenuModule, ButtonModule],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.scss'
})
export class RequestCardComponent {
  status = input<string>();
  borderClass = {}
  iconClass = {}
  badgeClass = {}

  items: MenuItem[] | undefined;

  constructor() {
    effect(() => {
      if (this.status()?.toLowerCase() === 'pending') {
        this.borderClass = { 'border-blue-400': true }
        this.iconClass = { 'text-blue-500 pi pi-clock': true }
        this.badgeClass = { 'text-blue-400 rounded-full': true }
      }
      else if (this.status()?.toLowerCase() === 'approved') {

        this.borderClass = { 'border-green-400': true }
        this.iconClass = { 'text-green-500 pi pi-thumbs-up': true }
        this.badgeClass = { 'text-green-400 rounded-full': true }
      }
      else if (this.status()?.toLowerCase() === 'rejected') {
        this.borderClass = { 'border-red-400': true }
        this.iconClass = { 'text-red-500 pi pi-times-circle': true }
        this.badgeClass = { 'text-red-400 rounded-full': true }
      }
      else if (this.status()?.toLowerCase() === 'sentback') {
        this.borderClass = { 'border-purple-400': true }
        this.iconClass = { 'text-purple-500 pi pi-arrow-down-left': true }
        this.badgeClass = { 'text-purple-400 rounded-full': true }
      }
      else {
        this.borderClass = { 'border-grey-400': true }
        this.iconClass = { 'text-grey-500 pi pi-stop': true }
        this.badgeClass = { 'text-grey-400 rounded-full': true }
      }
    })



    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'View Details',
            icon: 'pi pi-info-circle',
            routerLink: '/requests/request-details/123456'
          },
          // {
          //   label: 'Export',
          //   icon: 'pi pi-upload'
          // }
        ]
      }
    ];
  }



}

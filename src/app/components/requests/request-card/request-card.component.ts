import { NgClass } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PopoverModule } from 'primeng/popover';
import { PropertyRequest } from '../../../models/request.model';

@Component({
  selector: 'request-card',
  imports: [NgClass, MenuModule, ButtonModule, PopoverModule],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.scss'
})
export class RequestCardComponent {
  // status = input<string>();
  request = input<PropertyRequest | undefined>();
  borderClass = {}
  iconClass = {}
  badgeClass = {}

  items: MenuItem[] | undefined;


  menuItems;

  owenerInfo = computed(() => {
    const updateJson = JSON.parse(this.request()?.updateJson || '{}');
    return {
      ownerName: updateJson.ownerName,
      ownerMobile: updateJson.mobile,
      ownerAddress: updateJson.ownerAddress,
      ownerAddressDistrict: updateJson.ownerAddressDistrict,
      ownerAddressCity: updateJson.ownerAddressCity,
      ownerAddressPin: updateJson.ownerAddressPin,
      ownerAddressHouseNo: updateJson.ownerAddressHouseNo,
      ownerAddressLandmark: updateJson.ownerAddressLandmark,

      propertyAddress: updateJson.propertyAddress,
      propertyAddressDistrict: updateJson.propertyAddressDistrict,
      propertyAddressCity: updateJson.propertyAddressCity,
      propertyAddressPin: updateJson.propertyAddressPin,
      propertyAddressHouseNo: updateJson.propertyAddressHouseNo,
      propertyAddressLandmark: updateJson.propertyAddressLandmark,
    }
  })

  constructor() {
    effect(() => {
      if (this.request()?.status?.toLowerCase() === 'pending') {
        this.borderClass = { 'border-blue-400': true }
        this.iconClass = { 'text-blue-500 pi pi-clock': true }
        this.badgeClass = { 'text-blue-400 rounded-full': true }
      }
      else if (this.request()?.status?.toLowerCase() === 'approved') {

        this.borderClass = { 'border-green-400': true }
        this.iconClass = { 'text-green-500 pi pi-thumbs-up': true }
        this.badgeClass = { 'text-green-400 rounded-full': true }
      }
      else if (this.request()?.status?.toLowerCase() === 'rejected') {
        this.borderClass = { 'border-red-400': true }
        this.iconClass = { 'text-red-500 pi pi-times-circle': true }
        this.badgeClass = { 'text-red-400 rounded-full': true }
      }
      else if (this.request()?.status?.toLowerCase() === 'sentback') {
        this.borderClass = { 'border-purple-400': true }
        this.iconClass = { 'text-purple-500 pi pi-arrow-down-left': true }
        this.badgeClass = { 'text-purple-400 rounded-full': true }
      }
      else if (this.request()?.status?.toLowerCase() === 'draft') {
        this.borderClass = { 'border-amber-400': true }
        this.iconClass = { 'text-amber-500 pi pi-file-o': true }
        this.badgeClass = { 'text-amber-400 rounded-full': true }
      }
      else {
        this.borderClass = { 'border-grey-400': true }
        this.iconClass = { 'text-grey-500 pi pi-stop': true }
        this.badgeClass = { 'text-grey-400 rounded-full': true }
      }
    })



    this.menuItems = computed(() => {
      return [
        {
          label: 'Options',
          items: [
            {
              label: 'View Details',
              icon: 'pi pi-info-circle',
              routerLink: `/requests/request-details/${this.request()?.requestId}`
            },
            // {
            //   label: 'Export',
            //   icon: 'pi pi-upload'
            // }
          ]
        }
      ];
    })
  }


}

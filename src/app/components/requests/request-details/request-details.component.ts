import { Component, effect, signal } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { NgClass } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-request-details',
  imports: [PageHeaderComponent, NgClass, AccordionModule, TimelineModule, ButtonModule],
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.scss'
})
export class RequestDetailsComponent {
  status = signal<string>('Pending');
  borderClass = {}
  iconClass = {}
  badgeClass = {}

  tabs = [
    { version: '3', updatedBy: 'Sam Altmann', updatedOn: '2026-06-06 15:26:55', value: '2', content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos modi suscipit temporibus, impedit ad commodi possimus recusandae illum? Id facere rem inventore ex vitae dolor ea nobis ipsum numquam reiciendis.' },
    { version: '2', updatedBy: 'Rani Chatargee', updatedOn: '2026-06-06 12:26:55', value: '1', content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos modi suscipit temporibus, impedit ad commodi possimus recusandae illum? Id facere rem inventore ex vitae dolor ea nobis ipsum numquam reiciendis.' },
    { version: '1', updatedBy: 'Raghu Prasand', updatedOn: '2026-05-06 20:26:55', value: '0', content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos modi suscipit temporibus, impedit ad commodi possimus recusandae illum? Id facere rem inventore ex vitae dolor ea nobis ipsum numquam reiciendis.' },
  ];

  events = [
    { status: 'Pending', date: '15/10/2020 14:00', icon: 'pi pi-clock', color: 'bg-blue-400', updatedBy: 'A R Rahaman',updatedOn:'' },
    { status: 'Approved', date: '15/10/2020 16:15', icon: 'pi pi-thumbs-up', color: 'bg-green-400', updatedBy: 'Arijit Singh',updatedOn:'2026-06-06 23:05:49' },
    { status: 'Approved', date: '15/10/2020 16:15', icon: 'pi pi-thumbs-up', color: 'bg-green-400', updatedBy: 'Shankar M',updatedOn:'2026-06-03 20:05:49' },
    { status: 'Approved', date: '16/10/2020 10:00', icon: 'pi pi-thumbs-up', color: 'bg-green-400', updatedBy: 'Sachin Jiggar',updatedOn:'2026-06-01 08:05:49' },
    { status: 'Approved', date: '16/10/2020 10:00', icon: 'pi pi-thumbs-up', color: 'bg-green-400', updatedBy: 'Sachin Jiggar',updatedOn:'2026-06-01 08:05:49' },
    { status: 'Approved', date: '16/10/2020 10:00', icon: 'pi pi-thumbs-up', color: 'bg-green-400', updatedBy: 'Sachin Jiggar',updatedOn:'2026-06-01 08:05:49' }
  ];



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
  }
}

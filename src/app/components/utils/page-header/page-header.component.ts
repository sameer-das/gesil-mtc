import { Location } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
 import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-page-header',
  imports: [ButtonModule, TooltipModule],
  providers: [],
  template: `
    <div class="page-header-container flex items-center">
      @if(backButton) {
        <p-button rounded icon="pi pi-arrow-left" pTooltip="Go Back" class="mr-4" (click)="goBack()" ></p-button>
      }
      <h2 class="page-header">{{ title }}</h2>
    <div>
  `,
  styles: `
  .page-header-container {
    // display: flex;

    // background-color: var(--surface-card);
    // padding: 1rem 2rem;
    // border-radius: var(--content-border-radius);
  }
  
  .page-header {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
  }`
})
export class PageHeaderComponent {

  @Input('title') title!: string;
  @Input('backButton') backButton: boolean = false;
  private _location = inject(Location);
  goBack() {
    this._location.back()
  }
}

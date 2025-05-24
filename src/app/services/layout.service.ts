import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

interface LayoutState {
  sidebarActive?: boolean;
  sidebarMenuMobileActive?: boolean;
  isDarkmode?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor() { }
  document: Document = inject(DOCUMENT)

  initialLayoutState: LayoutState = {
    sidebarActive: false,
    sidebarMenuMobileActive: false,
    isDarkmode: false
  };

  layoutState = signal<LayoutState>(this.initialLayoutState);

  onMenuToggle() {
    if (this.isDesktop()) {
      this.layoutState.update((prevState) => ({ ...prevState, sidebarActive: !this.layoutState().sidebarActive }))
    }  else {
      this.layoutState.update((prevState) => ({ ...prevState, sidebarMenuMobileActive: true }))
    }
  }

  onDarkModeToggle() {
    this.document.documentElement.classList.contains('app-dark') ? 
    this.document.documentElement.classList.remove('app-dark') :
    this.document.documentElement.classList.add('app-dark')
  }

  isDesktop() {
    return window.innerWidth > 991;
  }
}

import { Component, Inject, inject, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { TopBarComponent } from './top-bar/top-bar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-layout',
  imports: [CommonModule, TopBarComponent, SideBarComponent, RouterOutlet, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnDestroy {

  layoutService = inject(LayoutService);

  @ViewChild('topBar') topBar!: TopBarComponent;
  @ViewChild('sideBar') sideBar!: SideBarComponent;

  menuOutsideClickListener: any;
  renderer: Renderer2 = inject(Renderer2);
  document: Document = inject(DOCUMENT)

  get containerClass() {
    return {
      'sidebar-open': this.layoutService.layoutState().sidebarActive,
      'mobile-active': this.layoutService.layoutState().sidebarMenuMobileActive,
    };
  }

  constructor() {
    if(!this.menuOutsideClickListener) {

      this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {  
        if (this.isOutsideClicked(event)) {
          this.hideMenuInMobileView();
        }

        if(this.layoutService.layoutState().sidebarMenuMobileActive) {
          this.blockBodyScroll()
        }
      });
    }
  }

  ngOnDestroy(): void {
    if(this.menuOutsideClickListener){
        this.menuOutsideClickListener();
    }
  }

  isOutsideClicked(event: MouseEvent) {
    const topbarEl = this.topBar.toggleBtn.nativeElement as Node;
    const sidebarEl = this.sideBar.sideBar.nativeElement as Node;
    const eventTarget = event.target as Node;
    return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
  }


  hideMenuInMobileView() {
    this.layoutService.layoutState.update((prev) => ({...prev, sidebarMenuMobileActive: false}));
    this.unblockBodyScroll();
  }

  blockBodyScroll() {
    this.renderer.addClass(this.document.body, 'blocked-scroll')
  }

  unblockBodyScroll() {
    this.renderer.removeClass(this.document.body, 'blocked-scroll');
  }

}

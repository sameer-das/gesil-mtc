import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-top-bar',
  imports: [MenuModule, ButtonModule, StyleClassModule, ToggleSwitchModule, FormsModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {
 
  isDarkMode!: boolean;
  layoutService = inject(LayoutService);
  router = inject(Router);
  document:Document = inject(DOCUMENT);

  @ViewChild('toggleBtn') toggleBtn!: ElementRef;

   ngOnInit(): void {
    this.isDarkMode = this.document.documentElement.classList.contains('app-dark')
  }

  onToggleTheme(e: ToggleSwitchChangeEvent) {
    this.layoutService.onDarkModeToggle();
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}

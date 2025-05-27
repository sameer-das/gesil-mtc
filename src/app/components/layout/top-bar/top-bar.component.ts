import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';
import { LayoutService } from '../../../services/layout.service';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top-bar',
  imports: [MenuModule, ButtonModule, 
    StyleClassModule, 
    ToggleSwitchModule, 
    FormsModule, 
    SelectButtonModule, 
    TranslateModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {

  private translateService: TranslateService = inject(TranslateService);


  isDarkMode!: boolean;
  layoutService = inject(LayoutService);
  router = inject(Router);
  document: Document = inject(DOCUMENT);

  stateOptions: any[] = [
    { label: 'English', value: 'en' },
    { label: 'हिन्दी', value: 'hi' }];

  selectedLanguage: string = 'en';

  @ViewChild('toggleBtn') toggleBtn!: ElementRef;

  constructor() {
    this.translateService.addLangs(['hi', 'en']);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    const browserLang = this.translateService.getBrowserLang();
    // console.log(browserLang)
    this.translateService.use(browserLang?.match(/en|hi/) ? browserLang : 'en');
  }

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

  onLangChange(e: SelectButtonChangeEvent) {
    this.translateService.use(e.value);
  }
}

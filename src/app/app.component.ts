import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LoaderComponent } from './components/utils/loader/loader.component';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, Toast, ConfirmDialog],
  template: `
  <p-toast />
  <p-confirmdialog />
  <loader />
  <router-outlet></router-outlet>`,
  providers: []
})
export class AppComponent  {
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LoaderComponent } from './components/utils/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, Toast ],
  template: `
  <p-toast />
  <loader />
  <router-outlet></router-outlet>`,
  providers: []
})
export class AppComponent  {
}

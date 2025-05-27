import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from "../utils/page-header/page-header.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [PageHeaderComponent, TranslateModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


}

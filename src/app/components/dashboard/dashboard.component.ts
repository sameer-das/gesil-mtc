import { Component } from '@angular/core';
import { PageHeaderComponent } from "../utils/page-header/page-header.component";

@Component({
  selector: 'app-dashboard',
  imports: [PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}

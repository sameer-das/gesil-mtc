import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../utils/page-header/page-header.component';
import { RequestCardComponent } from '../request-card/request-card.component';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-my-requests',
  imports: [PageHeaderComponent, RequestCardComponent, SelectModule],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss'
})
export class MyRequestsComponent {

  // statusFilter

}








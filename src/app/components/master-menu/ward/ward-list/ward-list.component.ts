import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Ward } from '../../../../models/master-data.model';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-ward-list',
  imports: [PageHeaderComponent, TableModule, ButtonModule, RouterModule],
  templateUrl: './ward-list.component.html',
  styleUrl: './ward-list.component.scss'
})
export class WardListComponent {

  tableLoading: boolean = false;
  TABLE_CONFIG = TABLE_CONFIG;
  wards: Ward[] = [
    { wardId: 1, wardName: 'Mukta Nagar', wardNumber: 'W1', zoneId: 1, zoneName: 'Zone 1' },
    { wardId: 2, wardName: 'Amarpali Nagar', wardNumber: 'W2', zoneId: 1, zoneName: 'Zone 1' },
    { wardId: 3, wardName: 'Soubhagya Nagar', wardNumber: 'W3', zoneId: 1, zoneName: 'Zone 1' },
    { wardId: 4, wardName: 'Smurti Nagar', wardNumber: 'W4', zoneId: 1, zoneName: 'Zone 1' },
    { wardId: 5, wardName: 'Gopal Nagar', wardNumber: 'W5', zoneId: 1, zoneName: 'Zone 1' },
  ]


  loadWardsData(e: TableLazyLoadEvent) {
    console.log(e)
  }
}

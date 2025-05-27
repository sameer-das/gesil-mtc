import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { RouterModule } from '@angular/router';
import { Zone } from '../../../../models/master-data.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-zone-list',
  imports: [PageHeaderComponent, TableModule, RouterModule, ButtonModule],
  templateUrl: './zone-list.component.html',
  styleUrl: './zone-list.component.scss'
})
export class ZoneListComponent implements OnInit,OnDestroy {
  
  
  tableLoading: boolean = false;
  TABLE_CONFIG = TABLE_CONFIG;
  $destroy: Subject<null> = new Subject();

  zones: Zone[] = [
    {zoneName: 'Zone 1', zoneId: 1},
    {zoneName: 'Zone 2', zoneId: 2},
    {zoneName: 'Zone 3', zoneId: 3},
    {zoneName: 'Zone 4', zoneId: 4},
  ];


  ngOnDestroy(): void {
    this.$destroy.next(null);
  }


  ngOnInit(): void {
    
  }





  loadZoneData(e: TableLazyLoadEvent) {
    console.log(e)
  }
}


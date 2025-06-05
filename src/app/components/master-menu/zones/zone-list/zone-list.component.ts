import { MessageService } from 'primeng/api';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { RouterModule } from '@angular/router';
import { Zone } from '../../../../models/master-data.model';
import { Subject, takeUntil } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { APIResponse } from '../../../../models/user.model';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';

@Component({
  selector: 'app-zone-list',
  imports: [PageHeaderComponent, TableModule, RouterModule, ButtonModule],
  templateUrl: './zone-list.component.html',
  styleUrl: './zone-list.component.scss'
})
export class ZoneListComponent implements OnInit, OnDestroy {


  TABLE_CONFIG = TABLE_CONFIG;
  $destroy: Subject<null> = new Subject();
  totalRecords = 0;

  masterDataService: MasterDataService = inject(MasterDataService);
  messageService: MessageService = inject(MessageService)

  zones: Zone[] = [];


  ngOnDestroy(): void {
    this.$destroy.next(null);
  }


  ngOnInit(): void {
    this.loadZoneList();
  }





  onPaginate(e: TableLazyLoadEvent) {
    // console.log(e)

    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }
    this.loadZoneList(pageNumber, (e.rows || 5))
  }


  loadZoneList(pageNumber: number = 1, pageSize: number = 5) {
    this.masterDataService.zoneList(pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{zones: Zone[], totalCount: number}>) => {
          console.log(resp)
          if (resp.code === 200 && resp.status === 'Success') {
            this.zones = resp.data.zones;
            this.totalRecords = resp.data.totalCount;
          } else {
            this.zones = [];
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Zone creation failed.', life: MessageDuaraion.STANDARD })

          }

        }
      })
  }
}


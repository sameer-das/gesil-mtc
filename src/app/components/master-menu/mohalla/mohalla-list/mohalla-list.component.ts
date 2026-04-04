import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { Subject, takeUntil } from 'rxjs';
import { MasterDataService } from '../../../../services/master-data.service';
import { MessageService } from 'primeng/api';
import { Mohalla } from '../../../../models/master-data.model';
import { APIResponse } from '../../../../models/user.model';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';

@Component({
  selector: 'app-mohalla-list',
  imports: [PageHeaderComponent, TableModule, RouterModule, ButtonModule],
  templateUrl: './mohalla-list.component.html',
  styleUrl: './mohalla-list.component.scss'
})
export class MohallaListComponent {
TABLE_CONFIG = TABLE_CONFIG;
  $destroy: Subject<null> = new Subject();
  totalRecords = 0;

  masterDataService: MasterDataService = inject(MasterDataService);
  messageService: MessageService = inject(MessageService)

  mohallas: Mohalla[] = [];


  ngOnDestroy(): void {
    this.$destroy.next(null);
  }


  ngOnInit(): void {
    this.loadMohalaList();
  }





  onPaginate(e: TableLazyLoadEvent) {
    // console.log(e)

    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1
    }
    this.loadMohalaList(pageNumber, (e.rows || 5))
  }


  loadMohalaList(pageNumber: number = 1, pageSize: number = 5) {
    this.masterDataService.mohallaList(0,0,pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{mohallas: Mohalla[], totalCount: number}>) => {
          console.log(resp)
          if (resp.code === 200 && resp.status === 'Success') {
            this.mohallas = resp.data.mohallas;
            this.totalRecords = resp.data.totalCount;
          } else {
            this.mohallas = [];
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Failed', detail: 'Mohalla list fetch failed.', life: MessageDuaraion.STANDARD })

          }

        }
      })
  }
}

import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { Mohalla } from '../../../../models/master-data.model';
import { TABLE_CONFIG } from '../../../../models/tableConfig';
import { APIResponse } from '../../../../models/user.model';
import { MasterDataService } from '../../../../services/master-data.service';
import { PageHeaderComponent } from '../../../utils/page-header/page-header.component';

@Component({
  selector: 'app-mohalla-list',
  imports: [PageHeaderComponent, TableModule,
    RouterModule, ButtonModule,
    InputTextModule, IconFieldModule,
    InputIconModule, ReactiveFormsModule],
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

  search: FormControl = new FormControl('');

  pageNumber = 1;
  pageSize = 5;


  ngOnDestroy(): void {
    this.$destroy.next(null);
  }


  ngOnInit(): void {
    this.loadMohalaList();

    this.search.valueChanges
      .pipe(
        takeUntil(this.$destroy),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          if (searchValue.trim().length > 0)
            return this.masterDataService.searchMohalla(searchValue, this.pageNumber, this.pageSize);
          else
            return this.masterDataService.mohallaList(0, 0, this.pageNumber, this.pageSize)
        }),
        tap(resp => {
          console.log(resp);
          if (resp.code === 200) {
            this.mohallas = resp.data.mohallas;
            this.totalRecords = resp.data.totalCount;
          }
        }))
      .subscribe()
  }





  onPaginate(e: TableLazyLoadEvent) {
    // console.log(e)

    let pageNumber = 1;
    if (e.first) {
      pageNumber = (e.first / (e.rows || 5)) + 1;
    }

    this.pageNumber = pageNumber;
    this.pageSize = e.rows || 5;

    if (this.search.value.trim().length === 0) {
      this.loadMohalaList(pageNumber, (e.rows || 5))
    } else {
      this.masterDataService.searchMohalla(this.search.value.trim(), this.pageNumber, this.pageSize)
        .pipe(
          takeUntil(this.$destroy),
          tap(resp => {
            console.log(resp)
            if (resp.code === 200) {
              this.mohallas = resp.data.mohallas;
              this.totalRecords = resp.data.totalCount;
            }
          })
        ).subscribe()
    }

  }


  loadMohalaList(pageNumber: number = 1, pageSize: number = 5) {
    this.masterDataService.mohallaList(0, 0, pageNumber, pageSize)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (resp: APIResponse<{ mohallas: Mohalla[], totalCount: number }>) => {
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

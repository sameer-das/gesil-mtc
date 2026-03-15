import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { Subject, takeUntil, tap } from 'rxjs';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { MessageService } from 'primeng/api';
import { MasterDataService } from '../../../services/master-data.service';
import { PropertySearchResultType } from '../../../models/property-owner.model';
import { RouterLink } from "@angular/router";
import { ButtonDirective, Button } from "primeng/button";

@Component({
  selector: 'app-survey-list',
  imports: [PageHeaderComponent, RouterLink, ButtonDirective, Button],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss'
})
export class SurveyListComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    this.$destroy.next(true)
  }

  $destroy: Subject<boolean> = new Subject();

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  messageService: MessageService = inject(MessageService);
  masterDataService: MasterDataService = inject(MasterDataService);

  currentUserUserName = localStorage.getItem('username') || '';
  properties: PropertySearchResultType[] = [];

  ngOnInit(): void {
    this.ownerService.getPropertyMasterDetail('createdBy', this.currentUserUserName)
    .pipe(takeUntil(this.$destroy),
    tap((resp) => {
      if(resp.code === 200) {
        this.properties = resp.data;
        console.log(this.properties)
      }
    }))
    .subscribe()
  }


}

import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MessageService } from 'primeng/api';
import { Button } from "primeng/button";
import { map, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { PropertySearchResultType } from '../../../models/property-owner.model';
import { MasterDataService } from '../../../services/master-data.service';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { APIResponse } from '../../../models/user.model';

@Component({
  selector: 'app-survey-list',
  imports: [PageHeaderComponent, RouterLink, Button],
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

  route: ActivatedRoute = inject(ActivatedRoute);
  type: string = 'c';

  ngOnInit(): void {

    const segments = this.route.snapshot.url;
    if (segments[0].path === 'survey-property-list') {
      this.type = 'c';
    } else if (segments[0].path === 'updated-property-list') {
      this.type = 'u';
    } else {
      this.type = 'c';
    }

    this.ownerService
      .getPropertyMasterDetail(this.type === 'c' ? 'createdBy' : 'updatedBy', this.currentUserUserName)
      .pipe(
        takeUntil(this.$destroy),
        tap((resp: APIResponse<PropertySearchResultType[]>) => {
          if (resp.code === 200) {
            this.properties = resp.data;
            console.log(this.properties)
          }
        })
      )
      .subscribe()
    // this.route.params.pipe(
    //   takeUntil(this.$destroy),
    //   switchMap((x) => {
    //     if (x['type'] === 'c') {
    //       this.type = 'c';
    //       return this.ownerService.getPropertyMasterDetail('createdBy', this.currentUserUserName)

    //     }
    //     else if (x['type'] === 'u') {
    //       this.type = 'u';
    //       return this.ownerService.getPropertyMasterDetail('updatedBy', this.currentUserUserName)
    //     }
    //     this.type = 'c';
    //     return this.ownerService.getPropertyMasterDetail('createdBy', this.currentUserUserName)
    //   }),
    //   tap((resp) => {
    //     if (resp.code === 200) {
    //       this.properties = resp.data;
    //       console.log(this.properties)
    //     }
    //   })
    // ).subscribe()

    // this.ownerService.getPropertyMasterDetail('createdBy', this.currentUserUserName)
    //   .pipe(takeUntil(this.$destroy),
    //     tap((resp) => {
    //       if (resp.code === 200) {
    //         this.properties = resp.data;
    //         console.log(this.properties)
    //       }
    //     }))
    //   .subscribe()
  }


}

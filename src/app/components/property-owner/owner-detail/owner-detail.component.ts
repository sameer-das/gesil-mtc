import { OwnerDetail, PropertySearchResultType } from './../../../models/property-owner.model';
import { Component, inject, input, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { OwnerCardComponent } from "../owner-card/owner-card.component";
import { PropertyListComponent } from "../property-list/property-list.component";
import { OwnerServiceService } from '../../../services/owner-service.service';
import { map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { APIResponse } from '../../../models/user.model';



@Component({
  selector: 'app-owner-detail',
  imports: [PageHeaderComponent,
    ButtonModule,
    RouterModule,
    DividerModule,
    AccordionModule,
    FileUploadModule,
    TooltipModule,
    MenuModule, OwnerCardComponent, PropertyListComponent],
  templateUrl: './owner-detail.component.html',
  styleUrl: './owner-detail.component.scss'
})
export class OwnerDetailComponent implements OnInit {


  ownerId = input<number>();
  $destroy: Subject<null> = new Subject();

  ownerDetail: OwnerDetail | null = null;

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);



  ngOnInit(): void {
    // this.getOwnerDetails();
    
    this.route.queryParams
      .pipe(
        takeUntil(this.$destroy),
        tap(x => console.log(x)),
        switchMap((params: any) => this.ownerService.getPropertyMasterDetail(params?.pin || params?.sur)),
        tap((resp: APIResponse<PropertySearchResultType>) => console.log(resp)),
        switchMap((resp) => this.ownerService.getOwnerDetails(resp.data.ownerId || 0)),
        tap((resp: APIResponse<OwnerDetail>) => {
          console.log(resp);
          if (resp.code === 200) {
            this.ownerDetail = resp.data;
          }
        })
      )
      .subscribe()
  }


  getOwnerDetails() {
    this.ownerService.getOwnerDetails(this.ownerId() || 0).pipe(
      takeUntil(this.$destroy),
      tap((resp: APIResponse<OwnerDetail>) => {
        console.log(resp);
        if (resp.code === 200) {
          this.ownerDetail = resp.data;
        }
      })
    ).subscribe();
  }

}

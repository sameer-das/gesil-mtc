import { Component, inject, input, OnInit } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { OwnerCardComponent } from "../owner-card/owner-card.component";
import { PropertyListComponent } from "../property-list/property-list.component";
import { OwnerServiceService } from '../../../services/owner-service.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { APIResponse } from '../../../models/user.model';
import { OwnerDetail } from '../../../models/property-owner.model';


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


  ngOnInit(): void {
    this.getOwnerDetails()
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

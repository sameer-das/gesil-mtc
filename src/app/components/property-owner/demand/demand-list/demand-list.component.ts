
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MessageDuaraion, MessageSeverity } from '../../../../models/config.enum';
import { DemandList, PropertySearchResultType } from '../../../../models/property-owner.model';
import { OwnerServiceService } from '../../../../services/owner-service.service';
import { PageHeaderComponent } from "../../../utils/page-header/page-header.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-demand-list',
  imports: [PageHeaderComponent, ButtonModule, RouterLink, DialogModule],
  templateUrl: './demand-list.component.html',
  styleUrl: './demand-list.component.scss'
})
export class DemandListComponent implements OnInit, OnDestroy {

  propertyId = input<number>();

  $destroy: Subject<boolean> = new Subject();
  demands: DemandList[] = [];
  property: Partial<PropertySearchResultType> = {};
  environment = environment;

  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  currentLoggedUserId: string = localStorage.getItem('loginUserId') || '0';

  displayPdfModal = false;
  pdfUrl: SafeResourceUrl = ''
  ngOnDestroy(): void {
    this.$destroy.next(true);
  }



  ngOnInit(): void {
    console.log(this.propertyId())

    forkJoin([
      this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0),
      this.ownerService.getDemandsOfProperty(this.propertyId() || 0, 0, 0)
    ])
      .pipe(
        takeUntil(this.$destroy),
        tap(([propertyResp, demandsResp]) => {
          if (demandsResp.code === 200) {
            this.demands = demandsResp.data.demands;
          }
          if (propertyResp.code === 200) {
            this.property = propertyResp.data[0];
          }
        })
      ).subscribe()


  }


  getDemandFileUrl(filename: string) {
    return `${environment.API_URL}/Master/ownerDocumentDownload?fileName=${filename}`
  }


  onDemandGenerationClick(demandId: number) {
    this.ownerService.generateDemand(this.propertyId() || 0, demandId, +this.currentLoggedUserId)
      .pipe(takeUntil(this.$destroy),
        tap((resp) => {
          console.log(resp)
          if (resp.code === 200 && resp.status === 'Success') {
            this.messageService.add({ severity: MessageSeverity.SUCCESS, summary: 'Success', detail: 'Demand Generated Successfully.', life: MessageDuaraion.STANDARD });

            forkJoin([
              this.ownerService.getPropertyMasterDetail('propertyId', this.propertyId() || 0),
              this.ownerService.getDemandsOfProperty(this.propertyId() || 0, 0, 0)
            ])
              .pipe(
                takeUntil(this.$destroy),
                tap(([propertyResp, demandsResp]) => {
                  if (demandsResp.code === 200) {
                    this.demands = demandsResp.data.demands;
                  }
                  if (propertyResp.code === 200) {
                    this.property = propertyResp.data[0];
                  }
                })
              ).subscribe()

          } else {
            this.messageService.add({ severity: MessageSeverity.ERROR, summary: 'Fail', detail: 'Demand Generation failed.', life: MessageDuaraion.STANDARD });
          }
        }))
      .subscribe()
  }


  showModal(fileName: string) {
    this.displayPdfModal = true;
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getDemandFileUrl(fileName)); 
  }
}

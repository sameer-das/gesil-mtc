import { ButtonModule } from 'primeng/button';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { PropertySearchResultType } from '../../../models/property-owner.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-citizen-dashboard',
  imports: [PageHeaderComponent, ButtonModule, RouterLink],
  templateUrl: './citizen-dashboard.component.html',
  styleUrl: './citizen-dashboard.component.scss'
})
export class CitizenDashboardComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject();
  propertyService:OwnerServiceService = inject(OwnerServiceService);
  properties: PropertySearchResultType[] = [];

  router = inject(Router);

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }



  ngOnInit() {
    this.fetchPropertiesWithMobileNo()
  }



  fetchPropertiesWithMobileNo() {
    this.propertyService.getPropertyMasterDetail('mobile', '9658646979')
    .pipe(takeUntil(this.destroy$), tap(x => {
      if(x.code === 200) {
        this.properties = x.data;
      }
    }))
    .subscribe()
  }



  goToPropertyDetail(id: number) {
    this.router.navigate(['property', 'detail', id])
  }
}

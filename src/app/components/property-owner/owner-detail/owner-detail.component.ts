import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Owner } from '../../../models/property-owner.model';
import { OwnerCardComponent } from "../owner-card/owner-card.component";
import { PropertyListComponent } from "../property-list/property-list.component";


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
export class OwnerDetailComponent {


  ownerDetail: Owner = {
    ownerId: 1,
    aadhar: '12358965866',
    pan: 'AYQPD3866P',
    email: 'jonathan.parida1995@gmail.com',
    name: 'Sindhuja Dasari',
    guardianName: 'Pabitra Thakur',
    dob: '05-12-1985',
    gender: 'F',
    isSpecialOwner: false,
    mobile: '8956789456'
  }

  items: MenuItem[] = [
    {
      label: 'Options',
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh',
          
        },
        {
          label: 'Export',
          icon: 'pi pi-upload'
        }
      ]
    }
  ];

  onUpload(e: FileUploadHandlerEvent, type: string, element?: FileUpload) {
    const file = e.files[0];
    console.log(file)
  }

}

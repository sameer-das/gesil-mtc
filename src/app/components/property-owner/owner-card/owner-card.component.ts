import { Component, input } from '@angular/core';
import { OwnerDetail } from '../../../models/property-owner.model';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { AadharMaskPipe } from '../../../pipes/aadhar-mask.pipe';

@Component({
  selector: 'app-owner-card',
  imports: [DatePipe, ButtonModule, RouterModule, AadharMaskPipe],
  templateUrl: './owner-card.component.html',
  styleUrl: './owner-card.component.scss'
})
export class OwnerCardComponent {
  env = environment;
  ownerDetail = input<OwnerDetail | null>();
}

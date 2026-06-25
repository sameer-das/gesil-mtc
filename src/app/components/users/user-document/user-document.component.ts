import { Component, input } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-document',
  imports: [ImageModule],
  templateUrl: './user-document.component.html',
  styleUrl: './user-document.component.scss'
})
export class UserDocumentComponent {
env = environment;

filename = input();
filelabel = input();
}

import { Component, inject, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageHeaderComponent } from "../../utils/page-header/page-header.component";
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { PropertyDocumentUploadPayload } from '../../../models/property-owner.model';
import { OwnerServiceService } from '../../../services/owner-service.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, tap } from 'rxjs';
import { MessageDuaraion, MessageSeverity } from '../../../models/config.enum';
import { APIResponse } from '../../../models/user.model';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ImageModule } from 'primeng/image';
@Component({
  selector: 'app-property-document',
  imports: [PageHeaderComponent, FileUploadModule, ButtonModule, RouterModule, ImageModule],
  templateUrl: './property-document.component.html',
  styleUrl: './property-document.component.scss'
})
export class PropertyDocumentComponent implements OnInit, OnDestroy {


  propertyId = input<number>();

  file: { [key: string]: File | null } = {
    'Property_Image1': null,
    'Property_Image2': null,
    'Property_Image3': null,
    'Property_Image4': null,
    'Owner_Photo': null,
  }

  fileContent: { [key: string]: string | null } = {
    'Property_Image1': null,
    'Property_Image2': null,
    'Property_Image3': null,
    'Property_Image4': null,
    'Owner_Photo': null,
  }

  alreadyAvailableFiles: { [key: string]: string | null } = {
    'Property_Image1': null,
    'Property_Image2': null,
    'Property_Image3': null,
    'Property_Image4': null,
    'Owner_Photo': null,
  }

  @ViewChild('fileUploadRef_Property_Image1') fileUploadRef_Property_Image1!: FileUpload;
  @ViewChild('fileUploadRef_Property_Image2') fileUploadRef_Property_Image2!: FileUpload;
  @ViewChild('fileUploadRef_Property_Image3') fileUploadRef_Property_Image3!: FileUpload;
  @ViewChild('fileUploadRef_Property_Image4') fileUploadRef_Property_Image4!: FileUpload;
  @ViewChild('fileUploadRef_Owner_Photo') fileUploadRef_Owner_Photo!: FileUpload;

  $destroy: Subject<boolean> = new Subject();

  currentUserUserId = localStorage.getItem('loginUserId') || '';


  ownerService: OwnerServiceService = inject(OwnerServiceService);
  private messageService: MessageService = inject(MessageService);



  ngOnDestroy(): void {
    this.$destroy.next(true);
  }


  ngOnInit(): void {
    this.ownerService.propertyDocumentList(this.propertyId() || 0)
      .pipe(takeUntil(this.$destroy),
      tap((resp: APIResponse<PropertyDocumentUploadPayload[]>) => {
          console.log(resp)

          if (resp.code === 200 && resp.status === 'Success') {
            for (let d of resp.data) {
              this.alreadyAvailableFiles[d.documentType] = d.documentName;
            }

            console.log(this.alreadyAvailableFiles)
          }

        })
      ).subscribe()
  }



  getDownloadLink(identifier: string) {
    return `${environment.API_URL}/Master/propertyDocumentDownload?fileName=${this.alreadyAvailableFiles[identifier]}`
  }

  onFileSelect(event: FileSelectEvent, identifier: string): void {
    this.processFile(event.files[0], identifier)
  }


  processFile(f: File, identifier: string) {
    console.log(f);
    this.file[identifier] = f;

    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => {
      this.fileContent[identifier] = reader.result as string;
    }
  }



  onUpload(identifier: string) {
    const payload: PropertyDocumentUploadPayload = {
      documentId: 0,
      documentName: this.getFileName(this.file[identifier]?.name || ''),
      documentType: identifier,
      documentUploadedBy: +this.currentUserUserId,
      documentUploadedOn: new Date().toISOString(),
      propertyId: this.propertyId() || 0,
      documentContent: this.fileContent[identifier] || ''
    }
    console.log(payload)

    this.ownerService.propertyDocumentUpload(payload)
      .pipe(
        takeUntil(this.$destroy),
        tap(resp => {
          console.log(resp)
          if (resp.code === 200 && resp.status === 'Success') {
            this.messageService.add({
              severity: MessageSeverity.SUCCESS, summary: 'Uploaded',
              detail: `Document uploaded successfully.`, life: MessageDuaraion.STANDARD
            });
          } else {
            this.messageService.add({
              severity: MessageSeverity.ERROR, summary: 'Failed',
              detail: `Document upload failed.`, life: MessageDuaraion.STANDARD
            });
          }
        })
      ).subscribe()

  }



  onRemove(identifier: string) {
    this.file = { ...this.file, [identifier]: null };
    this.fileContent[identifier] = null;
    if (identifier === 'Property_Image1') {
      this.fileUploadRef_Property_Image1.clear();
    } else if (identifier === 'Property_Image2') {
      this.fileUploadRef_Property_Image2.clear();
    } else if (identifier === 'Property_Image3') {
      this.fileUploadRef_Property_Image3.clear();
    } else if (identifier === 'Property_Image4') {
      this.fileUploadRef_Property_Image4.clear();
    }
  }

  getFileName(filename: string) {
    const splited = filename.split('.');
    splited.splice(-1, 1) // delete the last extension one 
    return splited.join('_');
  }
}

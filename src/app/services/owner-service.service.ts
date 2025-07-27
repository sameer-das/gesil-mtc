import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/user.model';
import { CreateOwnerDetail, OwnerDetail, OwnerDocumentUpload, UpdateOwnerDetail } from '../models/property-owner.model';
import { SHOW_LOADER } from './httpContexts';

@Injectable({
  providedIn: 'root'
})
export class OwnerServiceService {

  constructor() { }

  private http = inject(HttpClient);
  private API_URL = environment.API_URL;
  


  createOwner(createOwnerDetailPayload: CreateOwnerDetail): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.createOwner}`, createOwnerDetailPayload);
  }

  getOwnerDetails(ownerId: number): Observable<APIResponse<OwnerDetail>> {
    return this.http.get<APIResponse<OwnerDetail>>(`${this.API_URL}${environment.ownerDetails}?ownerId=${ownerId}`);
  }

  uploadDocument(ownerDocumentUpload: OwnerDocumentUpload): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.ownerDocumentUpload}`, ownerDocumentUpload);
  }

  searchOwner(key: string, value: string): Observable<APIResponse<OwnerDetail[]>> {     
    return this.http.get<APIResponse<OwnerDetail[]>>(`${this.API_URL}${environment.searchOwner}?searchKey=${key}&searchValue=${value}`, 
      {context: new HttpContext().set(SHOW_LOADER, false)})
  }

  updateOwner(updateOwnerPayload: UpdateOwnerDetail): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateOwner}`, updateOwnerPayload);
  }
}

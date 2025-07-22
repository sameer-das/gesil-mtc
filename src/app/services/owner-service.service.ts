import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/user.model';
import { CreateOwnerDetail, OwnerDetail, OwnerDocumentUpload, UpdateOwnerDetail } from '../models/property-owner.model';

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
    return this.http.get<APIResponse<OwnerDetail[]>>(`${this.API_URL}${environment.searchOwner}?searchKey=${key}&searchValue=${value}`)
  }

  updateOwner(updateOwnerPayload: UpdateOwnerDetail): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateOwner}`, updateOwnerPayload);
  }
}

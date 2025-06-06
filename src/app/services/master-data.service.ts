import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APIResponse } from '../models/user.model';
import { CreateUpdateWard, CreateUpdateZone, Ward, Zone } from '../models/master-data.model';


@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor() { }

  private http = inject(HttpClient);
  private API_URL = environment.API_URL;

  createZone(createZonePayload: CreateUpdateZone): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.createZone}`, createZonePayload);
  }

  zoneList(pageNumber: number = 0, pageSize: number = 0): Observable<APIResponse<{ zones: Zone[], totalCount: number }>> {
    return this.http.get<APIResponse<{ zones: Zone[], totalCount: number }>>(`${this.API_URL}${environment.zoneList}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  zoneDetails(zoneId: number): Observable<APIResponse<Zone>> {
    return this.http.get<APIResponse<Zone>>(`${this.API_URL}${environment.zoneDetails}?zoneId=${zoneId}`);
  }

  updateZone(zoneUpdatePayload: CreateUpdateZone): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateZone}`, zoneUpdatePayload);
  }




  createWard(createWardPayload: CreateUpdateWard): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.createWard}`, createWardPayload);
  }

  wardList(zoneId: number, pageNumber: number = 0, pageSize: number = 0): Observable<APIResponse<{ wards: Ward[], totalCount: number }>> {
    return this.http.get<APIResponse<{ wards: Ward[], totalCount: number }>>(`${this.API_URL}${environment.wardList}?zoneId=${zoneId}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  wardDetails(wardId: number): Observable<APIResponse<Ward>> {
    return this.http.get<APIResponse<Ward>>(`${this.API_URL}${environment.wardDetails}?wardId=${wardId}`);
  }

  updateWard(wardUpdatePayload: CreateUpdateWard): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateWard}`, wardUpdatePayload);
  }

}

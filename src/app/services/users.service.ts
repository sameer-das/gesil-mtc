import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { APIResponse, APIResponseForUserList, CreateUserTypePayload, UpdateUserAadharPan, UpdateUserBasicDetails, UpdateUserParentTypePayload, UpdateUserTypePayload, UserBasicDetails } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  private http = inject(HttpClient);
  private API_URL = environment.API_URL;

  saveNewUserBasicDetails(userPayload: UserBasicDetails): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.API_URL}${environment.saveUserNewBasicDetails}`, userPayload);
  }

  updateUserBasicDetails(userPayload: UpdateUserBasicDetails): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.API_URL}${environment.updateUserBasicDetails}`, userPayload);
  }

  updateUserParentDetails(userParentMappingPayload: UpdateUserParentTypePayload): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.API_URL}${environment.updateUserParentDetails}`, userParentMappingPayload);
  }

  getStates(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.API_URL}${environment.stateMaster}`);
  }

  getDistrict(stateId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.API_URL}${environment.districtMaster}${stateId}`);
  }

  getUserList(userType: number, pageNumber: number, pageSize: number): Observable<APIResponseForUserList> {
    return this.http.get<APIResponseForUserList>(`${this.API_URL}${environment.getUserList}?userType=${userType}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getUserDetails(userId: number): Observable<APIResponseForUserList> {
    return this.http.get<APIResponseForUserList>(`${this.API_URL}${environment.getUserDetails}${userId}`);
  }

  // ============================================ USER TYPE RELATED ==============================================
  getChildrenUserType(currentUserType: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.API_URL}${environment.userChildMapping}${currentUserType}`)
  }

  getParentUserType(currentUserType: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.API_URL}${environment.userParentMapping}${currentUserType}`)
  }

  createUserType(payload: CreateUserTypePayload): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.API_URL}${environment.createUserType}`, payload);
  }

  getUserType(userType: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.API_URL}${environment.getUserType}${userType}`)
  }

  updateUserType(payload: UpdateUserTypePayload): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.API_URL}${environment.updateUserType}`, payload);
  }
  // ==========================================================================================

  uploadUserDocument(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.API_URL}${environment.userDocumentUpload}`, payload);
  }

  updateUserAadharPan(payload: UpdateUserAadharPan): Observable<APIResponse> {
        return this.http.post<APIResponse>(`${this.API_URL}${environment.updateUserAadharPan}`, payload);
  }
}

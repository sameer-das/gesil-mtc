import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { APIResponse, ChildUserType, CreateUserTypePayload, District, ParentUserTypeForMapping, State, UpdateUserAadharPan, UpdateUserBasicDetails, UpdateUserParentTypePayload, UpdateUserTypePayload, UserBasicDetails, UserDetail, UserList, UserType } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  private http = inject(HttpClient);
  private API_URL = environment.API_URL;

  saveNewUserBasicDetails(userPayload: UserBasicDetails): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.saveUserNewBasicDetails}`, userPayload);
  }

  updateUserBasicDetails(userPayload: UpdateUserBasicDetails): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateUserBasicDetails}`, userPayload);
  }

  updateUserParentDetails(userParentMappingPayload: UpdateUserParentTypePayload): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateUserParentDetails}`, userParentMappingPayload);
  }

  getStates(): Observable<APIResponse<State[]>> {
    return this.http.get<APIResponse<State[]>>(`${this.API_URL}${environment.stateMaster}`);
  }

  getDistrict(stateId: number): Observable<APIResponse<District[]>> {
    return this.http.get<APIResponse<District[]>>(`${this.API_URL}${environment.districtMaster}${stateId}`);
  }

  getUserList(userType: number, pageNumber: number, pageSize: number): Observable<APIResponse<{ userLists: UserList[], totalCount: number}>> {
    return this.http.get<APIResponse<{userLists: UserList[], totalCount: number}>>(`${this.API_URL}${environment.getUserList}?userType=${userType}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getUserDetails(userId: number): Observable<APIResponse<UserDetail>> {
    return this.http.get<APIResponse<UserDetail>>(`${this.API_URL}${environment.getUserDetails}${userId}`);
  }

  // ============================================ USER TYPE RELATED ==============================================
  getChildrenUserType(currentUserType: number): Observable<APIResponse<ChildUserType[]>> {
    return this.http.get<APIResponse<ChildUserType[]>>(`${this.API_URL}${environment.userChildMapping}${currentUserType}`)
  }

  getParentUserType(currentUserType: number): Observable<APIResponse<ParentUserTypeForMapping[]>> {
    return this.http.get<APIResponse<ParentUserTypeForMapping[]>>(`${this.API_URL}${environment.userParentMapping}${currentUserType}`)
  }

  createUserType(payload: CreateUserTypePayload): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.createUserType}`, payload);
  }

  getUserType(userType: number): Observable<APIResponse<UserType[]>> {
    return this.http.get<APIResponse<UserType[]>>(`${this.API_URL}${environment.getUserType}${userType}`)
  }

  updateUserType(payload: UpdateUserTypePayload): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateUserType}`, payload);
  }
  // ==========================================================================================

  uploadUserDocument(payload: any): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.userDocumentUpload}`, payload);
  }

  updateUserAadharPan(payload: UpdateUserAadharPan): Observable<APIResponse<string>> {
        return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateUserAadharPan}`, payload);
  }
}

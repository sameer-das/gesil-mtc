import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/user.model';
import { AddDemandTxnType, AddDemandType, ApprovalLog, ApproveRejectPayload, CreateOwnerDetail, DemandList, DemandListResp, DemandTransactionRecord, FloorData, OwnerDetail, OwnerDocumentUpload, PropertyDocumentUploadPayload, PropertyMaster, PropertySearchResultType, QuickCreatePropertyType, UpdateOwnerDetail } from '../models/property-owner.model';
import { SHOW_LOADER } from './httpContexts';
import { CreateRequest, CreateRequestResponse, PropertyRequest, RequestMasterHistory } from '../models/request.model';

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor() { }

    private http = inject(HttpClient);
    private API_URL = environment.API_URL;

    createRequestForPropUpdate(payload: CreateRequest): Observable<APIResponse<CreateRequestResponse>> {
        return this.http.post<APIResponse<CreateRequestResponse>>(`${this.API_URL}${environment.CreateRequestForPropUpdate}`, payload);
    }

    GetRequestsAll(CreatedBy: number | string = '', FromDate: string = '', ToDate: string = '', Status: string = '', RequestId: number | string = ''): Observable<APIResponse<PropertyRequest[]>> {
        return this.http.get<APIResponse<PropertyRequest[]>>(`${this.API_URL}${environment.GetRequestsAll}`, { params: { CreatedBy, FromDate, ToDate, Status, RequestId } });
    }

    GetRequestMasterHistory(RequestId: number): Observable<APIResponse<RequestMasterHistory[]>> {
        return this.http.get<APIResponse<RequestMasterHistory[]>>(`${this.API_URL}${environment.GetRequestMasterHistory}`, { params: { RequestId } });
    }

    GetRequestApprovalHistory(RequestId: number): Observable<APIResponse<any>> {
        return this.http.get<APIResponse<any>>(`${this.API_URL}${environment.GetRequestApprovalHistory}`, { params: { RequestId } });
    }
}
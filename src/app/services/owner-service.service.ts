import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/user.model';
import { AddDemandTxnType, AddDemandType, ApprovalLog, ApproveRejectPayload, CreateOwnerDetail, DemandList, DemandListResp, DemandTransactionRecord, FloorData, OwnerDetail, OwnerDocumentUpload, PropertyDocumentUploadPayload, PropertyMaster, PropertySearchResultType, QuickCreatePropertyType, UpdateOwnerDetail } from '../models/property-owner.model';
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
      { context: new HttpContext().set(SHOW_LOADER, false) })
  }

  updateOwner(updateOwnerPayload: UpdateOwnerDetail): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateOwner}`, updateOwnerPayload);
  }

  getPropertyMasterDetail(searchKey: string, searchValue: string | number): Observable<APIResponse<PropertySearchResultType[]>> {
    return this.http.get<APIResponse<PropertySearchResultType[]>>(`${this.API_URL}${environment.getPropertyMasterDetails}`, { params: { searchKey, searchValue } })
  }

  approveRejectProperty(payload: ApproveRejectPayload) {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.approveRejectProperty}`, payload);
  }

  getApprovalLog(propertyId: number) {
    return this.http.get<APIResponse<ApprovalLog[]>>(`${this.API_URL}${environment.getApprovalLog}`, { params: { propertyId } })
  }


  updatePropertyMaster(payload: PropertyMaster) {
    const payloadToApi = {
      "propertyId": payload.propertyId || null,
      "ownerId": payload.ownerId || null,
      "householdNo": payload.householdNo,
      "zone": payload.zone || null,
      "ward": payload.ward || null,
      "wardName": payload.wardName || null,
      "propertyType": payload.propertyType || null,
      "typeOfOwnership": payload.typeOfOwnership || null,
      "otherTypeOfOwnerShip": payload.otherTypeOfOwnerShip || null,
      "widthOfRoad": payload.widthOfRoad || null,
      "areaOfPlot": payload.areaOfPlot || null,
      "noOfFloors": payload.noOfFloors || null,
      "floorWiseDataId": payload.floorWiseDataId || null,
      "buildingNo": payload.buildingNo || null,
      "flatNo": payload.flatNo || null,
      "flatSize": payload.flatSize || null,
      "elctricityCustomerId": payload.elctricityCustomerId || null,
      "electricityAccountNo": payload.electricityAccountNo || null,
      "electricityBookNo": payload.electricityBookNo || null,
      "electricityCategory": payload.electricityCategory || null,
      "buildingPlanApprovalNo": payload.buildingPlanApprovalNo || null,
      "buildingPlanApprovalDate": payload.buildingPlanApprovalDate || null,
      "waterConsumerNo": payload.waterConsumerNo || null,
      "waterConnectionDate": payload.waterConnectionDate || null,
      "district": payload.district || null,
      "tahasil": payload.tahasil || null,
      "villageName": payload.villageName || null,
      "khataNo": payload.khataNo || null,
      "plotNo": payload.plotNo || null,
      "propertyAddress": payload.propertyAddress || null,
      "propertyAddressDistrict": payload.propertyAddressDistrict || null,
      "propertyAddressCity": payload.propertyAddressCity || null,
      "propertyAddressPin": payload.propertyAddressPin || null,
      "latitude": payload.latitude || null,
      "longitude": payload.longitude || null,
      "isOwnerAddressSame": payload.isOwnerAddressSame,
      "ownerAddress": payload.ownerAddress || null,
      "ownerAddressDistrict": payload.ownerAddressDistrict || null,
      "ownerAddressCity": payload.ownerAddressCity || null,
      "ownerAddressPin": payload.ownerAddressPin || null,
      "plotArea": payload.plotArea || null,
      "dateOfAcquisition": payload.dateOfAcquisition || null,
      "useAsPerMasterPlan": payload.useAsPerMasterPlan || null,
      "mobileTowerArea": payload.mobileTowerArea || null,
      "mobileTowerDateOfInstallation": payload.mobileTowerDateOfInstallation || null,
      "hoardingArea": payload.hoardingArea || null,
      "hoardingDateOfInstallation": payload.hoardingDateOfInstallation || null,
      "petrolpumpUndergroundArea": payload.petrolpumpUndergroundArea || null,
      "petrolpumpDateOfCompletion": payload.petrolpumpDateOfCompletion || null,
      "hasWaterHarvestingProvision": payload.hasWaterHarvestingProvision || null,
      "attribute0": payload.attribute0 || null,
      "attribute1": payload.attribute1 || null,
      "attribute2": payload.attribute2 || null,
      "attribute3": payload.attribute3 || null,
      "attribute4": payload.attribute4 || null,
      "attribute5": payload.attribute5 || null,
      "attribute6": payload.attribute6 || null,
      "attribute7": payload.attribute7 || null,
      "attribute8": payload.attribute8 || null,
      "attribute9": payload.attribute9 || null,
      "mohallaName": payload.mohallaName || null,
      "ownerName": payload.ownerName || null,
      "amount": payload.amount || null,
      "category": payload.category || null,
      "subcategory": payload.subcategory || null,
      "rate": payload.rate || null,
      "createdBy": null,
      "createdOn": null,
      "updatedBy": payload.updatedBy || null,
      "updatedOn": null,
      "status": payload.status || null,
      "salutation": payload.salutation || null,
      "careOf": payload.careOf || null,
      "guardianName": payload.guardianName || null,
      "gender": payload.gender || null,
      "dob": payload.dob || null,
      "mobile": payload.mobile || null,
      "email": payload.email || null,
      "pan": payload.pan || null,
      "aadhar": payload.aadhar || null,
      "isSpecialOwner": payload.isSpecialOwner || null,
      "identityProof": payload.identityProof || null,
      "photo": payload.photo || null,
      "specialCertificate": payload.specialCertificate || null,
      "ownerAddressHouseNo": payload.ownerAddressHouseNo || null,
      "ownerAddressLandmark": payload.ownerAddressLandmark || null,
      "propertyAddressHouseNo": payload.propertyAddressHouseNo || null,
      "propertyAddressLandmark": payload.propertyAddressLandmark || null,
      "surveyNo": payload.surveyNo || null,
    }
    console.log(payloadToApi)
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateProperty}`, payloadToApi);
  }


  getDemandsOfProperty(propertyId: number, pageNumber: number, pageSize: number) {
    return this.http.get<APIResponse<DemandListResp>>(`${this.API_URL}${environment.getDemandsOfProperty}`, { params: { propertyId, pageNumber, pageSize } })
  }

  getDemandsTxnOfProperty(propertyId: number, demandId: number) {
    return this.http.get<APIResponse<DemandTransactionRecord[]>>(`${this.API_URL}${environment.getAllDemandTxn}`, { params: { propertyId, demandId } })
  }

  addDemandTransaction(payload: AddDemandTxnType) {
    return this.http.post<APIResponse<any>>(`${this.API_URL}${environment.addDemandTxn}`, payload)
  }

  quickCreateProperty(payload: QuickCreatePropertyType) {
    return this.http.post<APIResponse<any>>(`${this.API_URL}${environment.quickCreateProperty}`, payload)
  }

  generateDemand(propertyId: number, demandId: number, userId: number, lang: string = 'en',) {
    return this.http.get<APIResponse<any>>(`${this.API_URL}${environment.demandGenerate}`, { params: { lang, propertyId, demandId, userId } });
  }

  getFloorDetails(propertyId: number) {
    return this.http.get<APIResponse<FloorData[]>>(`${this.API_URL}${environment.getFloorDetails}`, { params: { propertyId } })
  }

  saveFloorData(payload: FloorData[]) {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateFloorData}`, payload)
  }

  propertyDocumentUpload(payload: PropertyDocumentUploadPayload) {
    return this.http.post<APIResponse<any>>(`${this.API_URL}${environment.propertyDocumentUpload}`, payload)
  }

  propertyDocumentList(propertyId: number) {
    return this.http.get<APIResponse<PropertyDocumentUploadPayload[]>>(`${this.API_URL}${environment.propertyDocumentList}`, { params: { propertyId } })
  }


  getCurrentLocation(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by your browser');
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position);
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }



  addDemand(paylaod: AddDemandType[]) {
    return this.http.post<APIResponse<any>>(`${this.API_URL}${environment.addDemand}`, paylaod)
  }

}



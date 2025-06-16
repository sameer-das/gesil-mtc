import { Fy, SubCategory } from './../models/master-data.model';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APIResponse } from '../models/user.model';
import {
  Category, CreateUpdateCategory,
  CreateUpdateSubCategory,
  CreateUpdateWard,
  CreateUpdateZone,
  Ward,
  Zone
} from '../models/master-data.model';


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


  createCategory(createCategoryPayload: CreateUpdateCategory): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.createCategory}`, createCategoryPayload);
  }
  categoryList(pageNumber: number = 0, pageSize: number = 0): Observable<APIResponse<{ categories: Category[], totalCount: number }>> {
    return this.http.get<APIResponse<{ categories: Category[], totalCount: number }>>(`${this.API_URL}${environment.categoryList}?&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  categoryDetail(categoryId: number): Observable<APIResponse<Category>> {
    return this.http.get<APIResponse<Category>>(`${this.API_URL}${environment.categoryDetail}?categoryId=${categoryId}`);
  }
  updateCategory(updateCategoryPayload: CreateUpdateCategory): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateCategory}`, updateCategoryPayload);
  }


  createSubCategory(createSubCategoryPayload: CreateUpdateSubCategory): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.createSubCategory}`, createSubCategoryPayload);
  }
  subCategoryList(pageNumber: number = 0, pageSize: number = 0): Observable<APIResponse<{ subCategories: SubCategory[], totalCount: number }>> {
    return this.http.get<APIResponse<{ subCategories: SubCategory[], totalCount: number }>>(`${this.API_URL}${environment.subCategoryList}?&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  subCategoryDetail(subCategoryId: number): Observable<APIResponse<SubCategory>> {
    return this.http.get<APIResponse<SubCategory>>(`${this.API_URL}${environment.subCategoryDetail}?subCategoryId=${subCategoryId}`);
  }
  updateSubCategory(updateSubCategoryPayload: CreateUpdateSubCategory): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateSubCategory}`, updateSubCategoryPayload);
  }
  subCategoriesOfCategory(categoryId = 1, pageNumber: number = 1, pageSize: number = 5): Observable<APIResponse<{ subCategories: SubCategory[], totalCount: number }>> {
    return this.http.get<APIResponse<{ subCategories: SubCategory[], totalCount: number }>>(`${this.API_URL}${environment.subCategoriesOfCategory}?categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }


  createFy(fyName: string): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.createFy}`, { fyName });
  }
  fyList(pageNumber: number = 0, pageSize: number = 0): Observable<APIResponse<{ fys: Fy[], totalCount: number }>> {
    return this.http.get<APIResponse<{ fys: Fy[], totalCount: number }>>(`${this.API_URL}${environment.fyList}?&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  fyDetail(fyId: number): Observable<APIResponse<Fy>> {
    return this.http.get<APIResponse<Fy>>(`${this.API_URL}${environment.fyDetail}?fyId=${fyId}`);
  }
  updateFy(fyUpdatePayLoad: Fy): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.API_URL}${environment.updateFyMaster}`, fyUpdatePayLoad);
  }
}

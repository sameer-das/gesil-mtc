export interface CreateRequest {
    propertyId: number,
    requestId: number,
    requestType: string,
    updateJson: string,
    createdBy: number,
    reason: string
}


export interface CreateRequestResponse {
    responseRequestId: number,
    requestNo: string | null,
    responseCode: number,
    responseMessage: string
}


export interface PropertyRequest {
  requestId: number;
  requestNo: string;
  propertyId: number;
  householdNo: string | null;
  surveyNo: string;
  requestType: string;
  updateJson: string; // JSON string from API
  status: string;
  reason: string;
  versionNo: number;
  assignedToUserId: number;
  assignedToUserName: string | null;
  assignedToUserRoleId: number;
  assignedToUserRoleName: string | null;
  createdBy: number;
  createdByName: string;
  createdDate: string;
  lastModifiedBy: number;
  lastModifiedByName: string;
  lastModifiedDate: string | null;
}

export interface RequestMasterHistory {
  updateHistoryId: number;
  requestId: number;
  propertyId: number;
  versionNo: number;
  editedByUserId: number;
  editedByUserName: string;
  editedByUserRoleId: number;
  editedByUserRoleName: string;
  editedDate: string;
  status: string;
  updateJson: string; // JSON string
  reason: string;
}
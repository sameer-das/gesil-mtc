export interface CreateOwnerDetail {
  salutation: string;
  ownerName: string;
  careOf: string;
  guardianName: string;
  mobile: string;
  email: string;
  pan: string;
  aadhar: string;
  dob: string;
  gender: string;
  isSpecialOwner: number;
}

export interface OwnerDetail {
  ownerId: number
  salutation: string
  ownerName: string
  careOf: string
  guardianName: string
  gender: string
  dob: string
  mobile: string
  email: string
  pan: string
  aadhar: string
  isSpecialOwner: boolean
  identityProof: string
  photo: string
  specialCertificate: string
  active: boolean
  createdOn: string
}

export interface OwnerDocumentUpload {
  ownerId: number;
  documentType: string;
  documentName: string;
  documentBase64data: string | ArrayBuffer | null;
}

export interface ApproveRejectPayload {
  logId: number;
  approverUserId: number;
  status: string;
  comments: string;
  propertyId: number;
}


export interface UpdateOwnerDetail {
  ownerId: number
  salutation: string
  ownerName: string
  careOf: string
  guardianName: string
  gender: string
  dob: string
  mobile: string
  email: string
  pan: string
  aadhar: string
  isSpecialOwner: boolean
}


export interface PropertySearchResultType {
  propertyId: number | null;
  ownerId: number | null;
  householdNo: string | null;
  zone: number | null;
  ward: number | null;
  wardName: string | null;
  propertyType: string | null;
  typeOfOwnership: string | null;
  otherTypeOfOwnerShip: string | null;
  widthOfRoad: string | null;
  areaOfPlot: string | null;
  noOfFloors: string | null;
  floorWiseDataId: number | number | null;
  buildingNo: string | null;
  flatNo: string | null;
  flatSize: string | null;
  elctricityCustomerId: string | null;
  electricityAccountNo: string | null;
  electricityBookNo: string | null;
  electricityCategory: string | null;
  buildingPlanApprovalNo: string | null;
  buildingPlanApprovalDate: string | null; // or Date
  waterConsumerNo: string | null;
  waterConnectionDate: string | null; // or Date
  district: string | null;
  tahasil: string | null;
  villageName: string | null;
  khataNo: string | null;
  plotNo: string | null;
  propertyAddress: string | null;
  propertyAddressDistrict: string | null;
  propertyAddressCity: string | null;
  propertyAddressPin: string | number | null;
  latitude: string | null;
  longitude: string | null;
  isOwnerAddressSame: boolean | null;
  ownerAddress: string | null;
  ownerAddressDistrict: string | null;
  ownerAddressCity: string | null;
  ownerAddressPin: string | number | null;
  plotArea: number | null;
  dateOfAcquisition: string | null;
  useAsPerMasterPlan: string | null;
  mobileTowerArea: number | null;
  mobileTowerDateOfInstallation: string | null;
  hoardingArea: number | null;
  hoardingDateOfInstallation: string | null;
  petrolpumpUndergroundArea: number | null;
  petrolpumpDateOfCompletion: string | null;
  hasWaterHarvestingProvision: boolean | null;
  attribute0: string | null;
  attribute1: string | null;
  attribute2: string | null;
  attribute3: string | null;
  attribute4: string | null;
  attribute5: string | null;
  attribute6: string | null;
  attribute7: string | null;
  attribute8: string | null;
  attribute9: string | null;
  mohallaName: string | null;
  ownerName: string | null;
  amount: number | null;
  category: string | null;
  subcategory: string | null;
  rate: number | null;
  createdBy: string | null;
  createdOn: string | null;
  updatedBy: string | null;
  updatedOn: string | null;
  status: string | null;
  salutation: string;
  careOf: string;
  guardianName: string;
  gender: string;
  dob: string | null;
  mobile: string;
  email: string;
  pan: string;
  aadhar: string;
  isSpecialOwner: boolean | null;
  identityProof: string;
  photo: string;
  specialCertificate: string;
  ownerAddressHouseNo: string | null;
  ownerAddressLandmark: string | null;
  propertyAddressHouseNo: string | null;
  propertyAddressLandmark: string | null;
  surveyNo: string | null;
  zoneName: string | null;
  mohallaNameDetail: string | null;
  categoryName: string | null;
  subCategoryName: string | null;
  approverName?: string | null;
  approverMobile?: string | null;
  approverEmail?: string | null;
  approverUserTypeName?: string | null;
}

export interface PropertyMaster {
  propertyId?: number;
  ownerId?: number;
  householdNo?: string | null;
  zone?: string | number | null;
  ward?: string | number | null;
  wardName?: string | null;
  propertyType?: string | null;
  typeOfOwnership?: string | number | null;
  otherTypeOfOwnerShip?: string | null;
  widthOfRoad?: string | null;
  areaOfPlot?: string | null;
  noOfFloors?: number;
  floorWiseDataId?: number;
  buildingNo?: string | null;
  flatNo?: string | null;
  flatSize?: string | null;
  elctricityCustomerId?: string | null;
  electricityAccountNo?: string | null;
  electricityBookNo?: string | null;
  electricityCategory?: string | null;
  buildingPlanApprovalNo?: string | null;
  buildingPlanApprovalDate?: string | null;
  waterConsumerNo?: string | null;
  waterConnectionDate?: string | null;
  district?: string | null;
  tahasil?: string | null;
  villageName?: string | null;
  khataNo?: string | null;
  plotNo?: string | null;
  propertyAddress?: string | null;
  propertyAddressDistrict?: string | null;
  propertyAddressCity?: string | null;
  propertyAddressPin?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  isOwnerAddressSame?: boolean;
  ownerAddress?: string | null;
  ownerAddressDistrict?: string | null;
  ownerAddressCity?: string | null;
  ownerAddressPin?: string | null;
  plotArea?: string | null;
  dateOfAcquisition?: string | null;
  useAsPerMasterPlan?: string | null;
  mobileTowerArea?: string | null;
  mobileTowerDateOfInstallation?: string | null;
  hoardingArea?: string | null;
  hoardingDateOfInstallation?: string | null;
  petrolpumpUndergroundArea?: string | null;
  petrolpumpDateOfCompletion?: string | null;
  hasWaterHarvestingProvision?: boolean;
  attribute0?: string | null;
  attribute1?: string | null;
  attribute2?: string | null;
  attribute3?: string | null;
  attribute4?: string | null;
  attribute5?: string | null;
  attribute6?: string | null;
  attribute7?: string | null;
  attribute8?: string | null;
  attribute9?: string | null;
  mohallaName?: string | null | null;
  ownerName?: string | null;
  amount?: number;
  category?: string | number | null;
  subcategory?: string | number | null;
  rate?: number;
  createdBy?: string | null;
  createdOn?: string | null;
  updatedBy?: string | null;
  updatedOn?: string | null;
  status?: boolean;
  salutation?: string | null;
  careOf?: string | null;
  guardianName?: string | null;
  gender?: string | null;
  dob?: string | null;
  mobile?: string | null;
  email?: string | null;
  pan?: string | null;
  aadhar?: string | null;
  isSpecialOwner?: boolean;
  identityProof?: string | null;
  photo?: string | null;
  specialCertificate?: string | null;
  ownerAddressHouseNo?: string | null;
  ownerAddressLandmark?: string | null;
  propertyAddressHouseNo?: string | null;
  propertyAddressLandmark?: string | null;
  surveyNo?: string | null;
  zoneName?: string | null;
  mohallaNameDetail?: string | null;
  categoryName?: string | null;
  subCategoryName?: string | null;
  approverName?: string | null;
  approverMobile?: string | null;
  approverEmail?: string | null;
  approverUserTypeName?: string | null;
}


export interface DemandList {
  demandId: number;
  fyId: number;
  dueFromPrevYear: number;
  currentMonthlyCharge: number;
  noOfMonths: number;
  currentFyAmount: number;
  totalAmount: number;
  demandNo: string;
  amountPaid: number;
  amountPending: number;
  propertyId: number;
  demandGeneratedBy: string; // Kept as string since it's quoted in JSON
  demandGeneratedDate: string; // ISO 8601 date string
  demandFile: string;
  fyName: string;
}


export interface DemandListResp {
  totalCount: number;
  demands: DemandList[];
}


export interface DemandTransactionRecord {
  txnId: number;
  billDate: string;
  txnDate: string;
  billNo: string;
  propertyId: number;
  demandId: number;
  amountPaid: number;
  remarks: string;
  customReason: string | null;
  paymentTxnNumber: string;
  nextVisitDate: string | null;
  attribute0: string;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  attribute4: string;
  remarkLabel?: string;
}


export interface AddDemandTxnType {
  billDate: string;
  txnDate: string;
  billNo: number;
  propertyId: number;
  demandId: number;
  amountPaid: string | number;
  remarks: string;
  customReason: string;
  paymentTxnNumber: string;
  nextVisitDate: string | null;
  attribute0: string;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  attribute4: string;
  imageFilename: string;
  imageContent: string;
  imageType: string;
}


export interface ApprovalLog {
  logId: number;
  propertyId: number;
  approverUserId: number;
  approverName: string | null;
  approverMobile: string | null;
  approverEmail: string | null;
  approverUserTypeName: string | null;
  status: string;
  comments: string | null;
  stepOrder: number;
  actionDate: string | Date | null;
}


export interface QuickCreatePropertyType {
  salutation: string | number;
  ownerName: string;
  careOf: string;
  guardianName: string;
  mobile: string;
  householdNo: string;
  propertyType: string;
  zone: number | string;
  ward: number | string;
  mohallaName: string;
  category: number | string;
  subCategory: number | string;
  updatedBy: string;
}

export interface FloorData {
  floorWiseDataId: number,
  propertyId: number,
  floorNo: string,
  builtUpArea: string,
  constructionType: string,
  circleRate: string,
  attribute0: string,
  attribute1: string,
  attribute2: string,
  attribute3: string,
  attribute4: string
}


export interface PropertyDocumentUploadPayload {
  documentId: number;
  documentType: string;
  propertyId: number;
  documentName: string;
  documentUploadedBy: number;
  documentUploadedOn: string;
  documentContent: string;
}


export interface AddDemandType {
  fyId: number;
  dueFromPrevYear: number;
  currentMonthlyCharge: number;
  noOfMonths: number;
  currentFyAmount: number;
  totalAmount: number;
  demandNo: string;
  amountPaid: number;
  amountPending: number;
  propertyId: number;
  demandGeneratedDate: string | null;
  demandGeneratedBy: number;
  demandFile: string;
};
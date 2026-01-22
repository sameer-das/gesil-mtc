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
  salutaion: string;
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
}
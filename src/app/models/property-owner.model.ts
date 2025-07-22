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
  salutaion: string
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
  salutaion: string
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
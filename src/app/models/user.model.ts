export interface AuthUser {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: 'M' | 'F' | string;
  dob: string;
  mobile: string;
  emailId: string;
  state: number;
  district: number;
  address: string;
  pin: string;
  userType: number;
  active: number;
}

export interface UpdateUserParentTypePayload {
  userId: number,
  parentUser: number,
  parentUserType: number
}


export interface UserBasicDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O' | string;
  dob: string | Date;
  mobile: string;
  emailId: string;
  state: number;
  district: number;
  address: string;
  pin: string;
  userType: number;
  employeeid: string | null,
  userOrganization: number
}


export interface UpdateUserBasicDetails extends UserBasicDetails {
  userId: number | undefined;
}


export interface APIResponse<T> {
  status: string;
  code: number;
  data: T
}


export interface UserType {
  userType: number;
  userTypeName: string;
}

export interface ChildUserType {
  id: number;
  userType: number;
  userTypeName: string;
  childUserType: number;
  childUserTypeName: string;
}


export interface CreateUserTypePayload {
  userTypeName: string;
}
export interface UpdateUserTypePayload {
  userType: number;
  userTypeName: string;
}

export interface ParentUserTypeForMapping {
  parentUserId: number;
  currentUserType: number;
  userTypeName: string;
  parentUserType: number;
  parentUserTypeName: string;
  parentFirstName: string;
  parentMiddleName: string;
  parentLastName: string;
  parentEmployeeid: string;
  parentMobile: string;
  active: number | null;
}

export interface ParentOptions extends ParentUserTypeForMapping {
  optionLabel: string;
}



export interface UserList {
  userId: number;
  loginId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobile: string;
  emailId: string;
  employeeid: string;
  userType: number;
  userTypeName: string;
}

export interface UserDetail {
  userId: number;
  loginId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O' | string; // Consider using 'M' | 'F' if it's limited
  dob: string; // ISO date string, or use `Date` if it's parsed
  mobile: string;
  emailId: string;
  state: number;
  district: number;
  address: string;
  pin: string;
  active: number;
  userType: number;
  parentUserId: number;
  parentName: string;
  parentUserType: number;
  parentUserTypeName: string;
  employeeid: string;
  userOrganization: number;
  userTypeName: string;
  aadharNo: string;
  pan: string;
  aadharFrontPhoto: string;
  aadharBackPhoto: string;
  panPhoto: string;
  photo: string;
  highestQualificationDoc: string;
}



export interface State {
  name: string,
  id: number
}

export interface District {
  name: string,
  id: number
}


export interface UpdateUserAadharPan {
  userId: number;
  aadharNo: string;
  pan: string;
  type: string;
}
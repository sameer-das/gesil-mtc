import { SelectType } from "./master-data.model";

export const TRANSACTION_REMARKS = [
    { label: 'Full Amount Received', value: 1 },
    { label: 'Partial Amount Received', value: 2 },
    { label: 'Landlord not available', value: 3 },
    { label: 'Asked to come later', value: 4 },
    { label: 'Will pay in 1-2 days', value: 5 },
    { label: 'Door locked', value: 6 },
    { label: 'Conflict in tax amount', value: 7 },
    { label: 'Others', value: 8 },
]

export const SALUTATION_OPTIONS: SelectType[] = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
    { label: 'Miss', value: 'Miss' },
];

export const GENDER_OPTIONS: SelectType[] = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Others', value: 'O' },
];

export const CAREOF_OPTIONS: SelectType[] = [
    { label: 'S/O', value: 'S/o' },
    { label: 'W/O', value: 'W/o' },
    { label: 'D/O', value: 'D/o' },
];


export const OWNERSHIP_TYPE: SelectType[] = [
    { label: 'Individual Building', value: '1' },
    { label: 'Flat in Appartment', value: '2' },
    { label: 'Others', value: '3' },
]


export enum PERMISSIONS {
    CREATE_USER_TYPE = 1,
    MODIFY_USER_TYPE = 2,
    VIEW_USER_TYPE = 3,

    CREATE_USER = 4,
    MODIFY_USER_DETAILS = 5,
    MODIFY_USER_AADHAR_PAN = 6,
    MODIFY_USER_DOCUMENT = 7,
    MODIFY_USER_REPORTING_STRUCTURE = 8,
    MODIFY_USER_PERMISSION = 9,
    VIEW_USER = 10,

    READ_MASTER_DATA = 11,
    MODIFY_MASTER_DATA = 12,

    ADD_PROPERTY = 13,
    MODIFY_PROPERTY = 14,
    COLLECT_PAYMENT = 15,
    GENERATE_DEMAND = 16,
}
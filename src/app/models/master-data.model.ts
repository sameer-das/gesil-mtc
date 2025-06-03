export interface Zone {
    zoneId: number;
    zoneName: string;
    active?: number;
}

export interface CreateUpdateZone {
    zoneId?: number;
    zoneName: string;
}



export interface Ward {
    wardId: number;
    wardNumber: string;
    wardName: string;
    zoneId: number;
    zoneName:string;
    active?: number;
}



export interface Category {
    categoryId: number;
    categoryName: string;
    active?: number;
}


export interface SubCategory {
    subCategoryId: number;
    subCategoryName: string;
    categoryId: number;
    categoryName: string;
    taxAmountPerMonth: number;
    active?: number;
}


export interface Fy {
    fyId: number;
    fyName: string;
    active?: number;
}

export interface DueFormatOption {
    label: string;
    value: number;
}



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
    zoneName: string;
    active?: number;
}


export interface CreateUpdateWard {
    wardId?: number;
    wardName: string;
    wardNumber: string;
    zoneId: number;
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
    taxAmountPerMonth?: number;
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


export interface RoadType {
    roadTypeId: number;
    roadTypeName: string;
}


export interface CreateUpdateCategory {
    categoryId?: number;
    categoryName: string;
}


export interface CreateUpdateSubCategory {
    subCategoryId?: number;
    categoryId: number;
    subCategoryName: string;
    taxAmountPerMonth: number;
}

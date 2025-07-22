import { DomHandler } from "primeng/dom";

export const environment = {
    // ***************** URL for which dont show loader *****************
    NO_LOADER_URLS: ['Master/searchOwner'],


    // ***************** API BASE URL *****************
    API_URL: "http://181.214.10.5/api",


    // ***************** Authentication URLs *****************
    login: '/Auth/login',
    refreshToken: '/Auth/refresh',


    // ***************** User Related API URLs *****************
    saveUserNewBasicDetails: '/Admin/saveUserBasicDetails',
    userList: '/Admin/UserList',
    roles: '/Admin/GetRoles',
    stateMaster: '/Admin/GetStates',
    districtMaster: '/Admin/GetDistricts?stateId=',
    userChildMapping: '/Admin/userChildMapping?parentUserType=',
    userParentMapping: '/Admin/parentUserTypes?childUserType=',
    createUserType: '/Admin/createUserType',
    updateUserType: '/Admin/updateUserType',
    getUserType: '/Admin/getUserType?userType=',
    getUserList: '/Admin/UserList',
    getUserDetails: '/Admin/userDetails?userId=',
    updateUserBasicDetails: '/Admin/updateUserBasicDetails',
    updateUserParentDetails: '/Admin/updateUserParent',
    userDocumentUpload: '/Admin/userDocumentUpload',
    updateUserAadharPan: '/Admin/updateUserAadharPan',
    userDownloadDocument: '/Admin/userDocumentDownload',

    // ***************** MASTER DATA Related API URLs *****************

    createZone: '/Master/createZone', //POST
    zoneList: '/Master/zoneList',
    zoneDetails: '/Master/zoneDetails',
    updateZone: '/Master/updateZone',
    
    createWard: '/Master/createWard',
    wardList: '/Master/wardList',
    wardDetails: '/Master/wardDetails',
    updateWard: '/Master/updateWard',

    createCategory: '/Master/createCategory',
    categoryList: '/Master/categoryList',
    categoryDetail: '/Master/categoryDetail',
    updateCategory: '/Master/updateCategory',

    createSubCategory: '/Master/createSubCategory',
    subCategoryList: '/Master/subCategoryList',
    subCategoryDetail: '/Master/subCategoryDetail',
    updateSubCategory: '/Master/updateSubCategory',
    subCategoriesOfCategory: '/Master/subCategoriesOfCategory',

    createFy: '/Master/createFy',
    fyList: '/Master/fyList',
    fyDetail: '/Master/fyDetail',
    updateFyMaster: '/Master/updateFyMaster',


    // ********************** OWNER DETAILS Related API URLs *****************

    createOwner: '/Master/createOwner',
    ownerDetails: '/Master/ownerDetails',
    updateOwner: '/Master/updateOwner',
    searchOwner: '/Master/searchOwner',
    ownerDocumentUpload: '/Master/ownerDocumentUpload',
    ownerDocumentDownload: '/Master/ownerDocumentDownload',
};
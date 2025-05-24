export const environment = {
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
    getUserList:'/Admin/UserList',
    getUserDetails:'/Admin/userDetails?userId=',
    updateUserBasicDetails: '/Admin/updateUserBasicDetails',
    updateUserParentDetails: '/Admin/updateUserParent'
    
};

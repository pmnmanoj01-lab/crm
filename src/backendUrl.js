export const backendRoute="http://localhost:5000"
// export const backendRoute="https://backendcrm.bhunte.com"
export const routes={
    login:"/auth/login",
    logout:"/auth/logout",
    verifyToken:"/auth/verify-token",
    createUser:"/admin/register",
    getAllUsers:"/admin/get-all-user",
    deleteUser:"/admin/delete-user/",
    updateUser:"/admin/update-user/",
    getSingleUser:"/admin/get-single-user/",
    impersonateAdmin:"/auth/impersonate/",
    exitImpersonateAdmin:"/auth/exitimpersonate",
    getUserPermissions:"/admin/get-permissions/",
    updatePermissions:"/admin/save-permissions",
    updateStatusOfUser:"/admin/update-status/",
    fetchUserOfProductionATORole:"/manager/get-users",


    //<---------------------- Dashboard routes-------------------------------->
    getDashboardStatsData:"/dashboard/get-dashboard-data-stats-card",

    //<---------------------- product routes-------------------------------->
    createProduct:"/product/create-product",
    updateProduct:"/product/update-product/",
    getAllProducts:"/product/get-all-products",
    getProductById:"/product/get-product-by-id/",
    deleteProduct:"/product/delete-product/",

    //---------------product-filing------------------------->

    createProductFiling:"/product/filing/create",
    updateProductFiling:"/product/filing/update/",
    getProductFiling:"/product/filing/get/",

    //---------------product-PrePolish------------------------->

    createProductPrePolish:"/product/prepolish/create",
    updateProductPrePolish:"/product/prepolish/update/",
    getProductPrePolish:"/product/prepolish/get/",

    //---------------product-PrePolish------------------------->

    createProductSetting:"/product/setting/create",
    updateProductSetting:"/product/setting/update/",
    getProductSetting:"/product/setting/get/",

    //---------------product-PrePolish------------------------->

    createProductPolish:"/product/polish/create",
    updateProductPolish:"/product/polish/update/",
    getProductPolish:"/product/polish/get/",

    //---------------product-PrePolish------------------------->

    createProductRepair:"/product/repair/create",
    updateProductRepair:"/product/repair/update/",
    getProductRepair:"/product/repair/get/"
}

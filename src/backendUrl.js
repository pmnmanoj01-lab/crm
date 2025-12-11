export const backendRoute="http://localhost:5000"
// export const backendRoute="https://backend-of-crm-zruj.onrender.com"

export const routes={

    login:"/auth/login",
    logout:"/auth/logout",
    verifyToken:"/auth/me",
    createUser:"/admin/register",
    getAllUsers:"/admin/get-all-user",
    deleteUser:"/admin/delete-user/",
    updateUser:"/admin/update-user/",
    getSingleUser:"/admin/get-single-user/",
    getUserPermissions:"/admin/get-permissions/",
    updatePermissions:"/admin/save-permissions",
    fetchUserOfProductionATORole:"/manager/get-users",

    //<---------------------- product routes-------------------------------->
    createProduct:"/product/create-product",
    updateProduct:"/product/update-product/",
    getAllProducts:"/product/get-all-products",
    getProductById:"/product/get-product-by-id/",

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
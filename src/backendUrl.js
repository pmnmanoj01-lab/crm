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
}
import { Navigate , Outlet } from "react-router-dom";

const ProtectedAdminRoute = () =>{
    const accessToken = localStorage.getItem("accessToken");

    if(!accessToken){
        return <Navigate to ="/admin/login" replace/>;
    }

    return <Outlet/>;
};

export default ProtectedAdminRoute;
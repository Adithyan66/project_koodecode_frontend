import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";


const AdminProtected = ({ children }: { children: React.ReactNode }) => {

    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

    
    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
    if (!isAdmin) {
        return <Navigate to="/" />
    }


    return children;
}

export default AdminProtected;


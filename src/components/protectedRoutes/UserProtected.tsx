
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import RotatingSpinner from "../common/LoadingSpinner";


const UserProtected = ({ children }: { children: React.ReactNode }) => {

    // const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const isInitialized = useAppSelector(state => state.user.isInitialized);

    if (!isInitialized) {
        return <RotatingSpinner />
    }

    // if (isAdmin) {
    //     return <Navigate to="/admin" />
    // }
    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }


    return children;
}

export default UserProtected;



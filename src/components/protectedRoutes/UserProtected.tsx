
import { useAppSelector } from "../../app/hooks";
import { Navigate } from "react-router";


const UserProtected = ({ children }: { children: React.ReactNode }) => {

    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)

    if (isAdmin) {
        return <Navigate to="/admin" />
    }

    return children;
}

export default UserProtected;
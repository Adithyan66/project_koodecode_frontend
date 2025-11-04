import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";


const AdminProtected = ({ children }: { children: React.ReactNode }) => {

    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const isInitialized = useAppSelector(state => state.user.isInitialized);

    if (!isInitialized) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white mt-4 text-lg">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
    if (!isAdmin) {
        return <Navigate to="/" />
    }


    return children;
}

export default AdminProtected;


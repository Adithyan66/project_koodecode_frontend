
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";


const UserProtected = ({ children }: { children: React.ReactNode }) => {

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

    if (isAdmin) {
        return <Navigate to="/admin" />
    }
    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    

    return children;
}

export default UserProtected;



// // import { useAppSelector } from "../../app/hooks";
// // import { Navigate, Outlet } from "react-router-dom";

// // const UserProtected = () => {
// //     const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true);

// //     if (isAdmin) {
// //         return <Navigate to="/admin" replace />;
// //     }

// //     return <Outlet />;
// // };

// // export default UserProtected;




// const UserProtected = () => {
//     const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true);
//     const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
//     const loading = useAppSelector(state => state.user.status === "loading"); // if you track auth loading

//     // console.log("is authenticated",isAuthenticated);
    

//     // if (loading) return <div>Checking session...</div>;

//     // if (!isAuthenticated) return <Navigate to="/login" replace />;
//     // if (isAdmin) return <Navigate to="/admin" replace />;

//     return <Outlet />;
// };
// export default UserProtected;
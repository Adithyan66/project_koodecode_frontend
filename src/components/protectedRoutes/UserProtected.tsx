
// import { useAppSelector } from "../../app/hooks";
// import { Navigate } from "react-router";

import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";


const UserProtected = ({ children }: { children: React.ReactNode }) => {

    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

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
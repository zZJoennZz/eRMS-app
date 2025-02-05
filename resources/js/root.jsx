import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { AuthContext } from "./contexts/AuthContext";

import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// //public
const Login = lazy(() => import("./pages/Login"));

import PreLoader from "./components/PreLoader";

import axios from "axios";
import { API_URL } from "./configs/config";

export default function Root() {
    // const [isAuth, setIsAuth] = useState(false);
    // const [isLoading, setIsLoading] = useState(true);
    // const [currId, setCurrId] = useState(0);

    // function changeAuth(value, id) {
    //     if (value === false) {
    //         localStorage.removeItem("token");
    //         setCurrId(0);
    //     }
    //     setIsAuth(value);
    //     setCurrId(id);
    // }

    // useEffect(() => {
    //     let abortController;

    //     async function checkToken() {
    //         setIsLoading(true);
    //         abortController = new AbortController();
    //         let signal = abortController.signal;

    //         await axios
    //             .post(
    //                 `${API_URL}check_token`,
    //                 { signal },
    //                 {
    //                     headers: {
    //                         Authorization: localStorage.getItem("token") || "",
    //                     },
    //                 }
    //             )
    //             .then((res) => {
    //                 setIsAuth(true);
    //                 setCurrId(res.data.data.id);
    //                 localStorage.setItem("branch", res.data.data.branch);
    //                 localStorage.setItem(
    //                     "br_account_number",
    //                     res.data.data.br_account_number
    //                 );
    //                 localStorage.setItem("dept_code", res.data.data.dept_code);
    //                 localStorage.setItem("address", res.data.data.address);
    //                 localStorage.setItem(
    //                     "branch_head",
    //                     res.data.data.branch_head
    //                 );
    //                 localStorage.setItem(
    //                     "supply_officer",
    //                     res.data.data.supply_officer
    //                 );
    //                 localStorage.setItem(
    //                     "contact_number",
    //                     res.data.data.contact_number
    //                 );
    //                 localStorage.setItem(
    //                     "email_address",
    //                     res.data.data.email_address
    //                 );
    //             })
    //             .catch(() => {
    //                 setIsAuth(false);
    //                 setCurrId(0);
    //                 localStorage.removeItem("token");
    //             });

    //         setIsLoading(false);
    //     }

    //     checkToken();

    //     return () => abortController.abort();
    // }, []);

    // const contextValue = useMemo(
    //     () => ({ isAuth, isLoading, changeAuth, currId }),
    //     [isAuth, currId, isLoading]
    // );

    return (
        <AuthContext.Provider value={contextValue}>
            <Suspense fallback={<PreLoader />}>
                <Routes>
                    <Route exact path="/" element={<PublicRoute />}>
                        <Route path="/" element={<Login />} />
                        {/* <Route
                            path="/request-release"
                            element={<RequestRelease />}
                        /> */}
                    </Route>
                    PRIVATE ROUTES
                    <Route element={<PrivateRoute />}>
                        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                    </Route>
                </Routes>
            </Suspense>
        </AuthContext.Provider>
    );
}

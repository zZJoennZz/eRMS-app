import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { AuthContext } from "./contexts/AuthContext";

import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// //public
const Login = lazy(() => import("./pages/Login"));

//private
const RDS = lazy(() => import("./pages/RDS"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const RDSRecord = lazy(() => import("./pages/RDSRecord"));
const Transaction = lazy(() => import("./pages/Transaction"));
const Setting = lazy(() => import("./pages/Setting"));
const User = lazy(() => import("./pages/User"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Cluster = lazy(() => import("./pages/Cluster"));
const Branch = lazy(() => import("./pages/Branch"));
const Borrow = lazy(() => import("./pages/Borrow"));
const Disposal = lazy(() => import("./pages/Disposal"));
const WarehouseMonitoring = lazy(() => import("./pages/WarehouseMonitoring"));
const Report = lazy(() => import("./pages/Report"));
const ReportDocuments = lazy(() => import("./pages/Report/ReportDocuments"));
const RDSRecordHistory = lazy(() => import("./pages/Report/RDSRecordHistory"));
const DisposedRecordsForm = lazy(() =>
    import("./pages/Report/DisposedRecordsForm")
);

//everyone
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

import PreLoader from "./components/PreLoader";

import axios from "axios";
import { API_URL } from "./configs/config";

export default function Root() {
    const [isAuth, setIsAuth] = useState(false);
    const [currProfile, setCurrProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [userType, setUserType] = useState("");
    const [currId, setCurrId] = useState(0);
    const [currPosition, setCurrPosition] = useState({});
    const [branchDetails, setBranchDetails] = useState({});

    function changeAuth(value, id, userType, profile, branchDets, currPos) {
        if (value === false) {
            localStorage.removeItem("token");
            setCurrId(0);
            setUserType("");
            setCurrProfile({});
            setCurrPosition({});
        }
        setUserType(userType);
        setIsAuth(value);
        setCurrId(id);
        setCurrProfile(profile);
        setBranchDetails(branchDets);
        setCurrPosition(currPos);
    }

    useEffect(() => {
        let abortController;

        async function checkToken() {
            setIsLoading(true);
            abortController = new AbortController();
            let signal = abortController.signal;

            await axios
                .post(
                    `${API_URL}check_token`,
                    { signal },
                    {
                        headers: {
                            Authorization: localStorage.getItem("token") || "",
                        },
                    }
                )
                .then((res) => {
                    setUserType(res.data.data.type);
                    setCurrId(res.data.data.id);
                    setIsAuth(true);
                    setCurrProfile(res.data.data.profile);
                    setBranchDetails(res.data.data.branch);
                    setCurrPosition(res.data.data.current_position);
                })
                .catch(() => {
                    setUserType("");
                    setIsAuth(false);
                    setCurrId(0);
                    setCurrProfile({});
                    setCurrPosition({});
                    localStorage.removeItem("token");
                });

            setIsLoading(false);
        }

        checkToken();

        return () => abortController.abort();
    }, []);

    const contextValue = useMemo(
        () => ({
            isAuth,
            isLoading,
            changeAuth,
            currId,
            userType,
            currProfile,
            branchDetails,
            currPosition,
        }),
        [
            isAuth,
            currId,
            isLoading,
            userType,
            currProfile,
            branchDetails,
            currPosition,
        ]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            <Suspense fallback={<PreLoader />}>
                <Routes>
                    <Route exact path="/" element={<PublicRoute />}>
                        <Route path="/" element={<Login />} />
                    </Route>
                    <Route element={<PublicRoute />}>
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                    </Route>
                    <Route
                        exact
                        path="/unauthorized"
                        element={<Unauthorized />}
                    />
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "EMPLOYEE",
                                    "WAREHOUSE_CUST",
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "EMPLOYEE",
                                    "WAREHOUSE_CUST",
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route path="/transactions" element={<Transaction />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "EMPLOYEE",
                                    "WAREHOUSE_CUST",
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route path="/rds-records" element={<RDSRecord />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={["DEV"]} />}>
                        <Route path="/rds" element={<RDS />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "EMPLOYEE",
                                    "WAREHOUSE_CUST",
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route path="/settings" element={<Setting />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route path="/users" element={<User />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute allowedRoles={["DEV", "ADMIN"]} />
                        }
                    >
                        <Route path="/groups" element={<Cluster />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute allowedRoles={["DEV", "ADMIN"]} />
                        }
                    >
                        <Route path="/branches" element={<Branch />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                    "EMPLOYEE",
                                ]}
                            />
                        }
                    >
                        <Route path="/borrows" element={<Borrow />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route path="/disposals" element={<Disposal />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/report/disposed-records-form/:id"
                            element={<DisposedRecordsForm />}
                        />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "WAREHOUSE_CUST",
                                    "DEV",
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/warehouse-monitoring"
                            element={<WarehouseMonitoring />}
                        />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "WAREHOUSE_CUST",
                                    "DEV",
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/print-warehouse-documents/:filters"
                            element={<ReportDocuments />}
                        />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                    "RECORDS_CUST",
                                    "EMPLOYEE",
                                    "WAREHOUSE_CUST",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/print-branch-summary/:filters"
                            element={<ReportDocuments />}
                        />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                    "EMPLOYEE",
                                    "WAREHOUSE_CUST",
                                ]}
                            />
                        }
                    >
                        <Route path="/reports" element={<Report />} />
                    </Route>
                    <Route
                        element={
                            <PrivateRoute
                                allowedRoles={[
                                    "RECORDS_CUST",
                                    "BRANCH_HEAD",
                                    "DEV",
                                    "ADMIN",
                                    "EMPLOYEE",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="/rds-record-history/:id"
                            element={<RDSRecordHistory />}
                        />
                    </Route>
                </Routes>
            </Suspense>
        </AuthContext.Provider>
    );
}

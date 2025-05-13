import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import PreLoader from "./components/PreLoader";
import axios from "axios";
import { API_URL } from "./configs/config";

// Lazy-loaded components
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transaction = lazy(() => import("./pages/Transaction"));
const RDSRecord = lazy(() => import("./pages/RDSRecord"));
const RDS = lazy(() => import("./pages/RDS"));
const Setting = lazy(() => import("./pages/Setting"));
const User = lazy(() => import("./pages/User"));
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
const Turnover = lazy(() => import("./pages/Setting/Turnover"));
const WarehouseTurnover = lazy(() =>
    import("./pages/Setting/WarehouseTurnover")
);
const TurnoverForms = lazy(() => import("./pages/Report/TurnoverForms"));
const OpenBox = lazy(() => import("./pages/OpenBox"));

export default function Root() {
    const [isAuth, setIsAuth] = useState(false);
    const [currProfile, setCurrProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [userType, setUserType] = useState("");
    const [currId, setCurrId] = useState(0);
    const [currPosition, setCurrPosition] = useState({});
    const [branchDetails, setBranchDetails] = useState({});

    function changeAuth(value, id, userType, profile, branchDets, currPos) {
        if (!value) {
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
            const signal = abortController.signal;

            try {
                const res = await axios.post(
                    `${API_URL}check_token`,
                    { signal },
                    {
                        headers: {
                            Authorization: localStorage.getItem("token") || "",
                        },
                    }
                );
                const { type, id, profile, branch, current_position } =
                    res.data.data;
                setUserType(type);
                setCurrId(id);
                setIsAuth(true);
                setCurrProfile(profile);
                setBranchDetails(branch);
                setCurrPosition(current_position);
            } catch {
                setUserType("");
                setIsAuth(false);
                setCurrId(0);
                setCurrProfile({});
                setCurrPosition({});
                localStorage.removeItem("token");
            } finally {
                setIsLoading(false);
            }
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

    const renderPrivateRoute = (allowedRoles, path, Component) => (
        <Route element={<PrivateRoute allowedRoles={allowedRoles} />}>
            <Route path={path} element={<Component />} />
        </Route>
    );

    return (
        <AuthContext.Provider value={contextValue}>
            <Suspense fallback={<PreLoader />}>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicRoute />}>
                        <Route path="/" element={<Login />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                    </Route>
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Private Routes */}
                    {renderPrivateRoute(
                        [
                            "EMPLOYEE",
                            "WAREHOUSE_CUST",
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                            "DEV",
                            "ADMIN",
                        ],
                        "/dashboard",
                        Dashboard
                    )}
                    {renderPrivateRoute(
                        [
                            "EMPLOYEE",
                            "WAREHOUSE_CUST",
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                            "DEV",
                            "ADMIN",
                        ],
                        "/transactions",
                        Transaction
                    )}
                    {renderPrivateRoute(
                        [
                            "EMPLOYEE",
                            "WAREHOUSE_CUST",
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                            "DEV",
                            "ADMIN",
                        ],
                        "/rds-records",
                        RDSRecord
                    )}
                    {renderPrivateRoute(["DEV"], "/rds", RDS)}
                    {renderPrivateRoute(
                        [
                            "EMPLOYEE",
                            "WAREHOUSE_CUST",
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                            "DEV",
                            "ADMIN",
                        ],
                        "/settings",
                        Setting
                    )}
                    {renderPrivateRoute(
                        ["RECORDS_CUST", "BRANCH_HEAD", "DEV", "ADMIN"],
                        "/users",
                        User
                    )}
                    {renderPrivateRoute(["DEV", "ADMIN"], "/groups", Cluster)}
                    {renderPrivateRoute(["DEV", "ADMIN"], "/branches", Branch)}
                    {renderPrivateRoute(
                        [
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                            "DEV",
                            "ADMIN",
                            "EMPLOYEE",
                        ],
                        "/borrows",
                        Borrow
                    )}
                    {renderPrivateRoute(
                        ["RECORDS_CUST", "BRANCH_HEAD", "DEV", "ADMIN"],
                        "/disposals",
                        Disposal
                    )}
                    {renderPrivateRoute(
                        ["RECORDS_CUST", "BRANCH_HEAD", "DEV", "ADMIN"],
                        "/report/disposed-records-form/:id",
                        DisposedRecordsForm
                    )}
                    {renderPrivateRoute(
                        ["WAREHOUSE_CUST", "DEV", "ADMIN"],
                        "/warehouse-monitoring",
                        WarehouseMonitoring
                    )}
                    {renderPrivateRoute(
                        ["WAREHOUSE_CUST", "DEV", "ADMIN"],
                        "/print-warehouse-documents/:filters",
                        ReportDocuments
                    )}
                    {renderPrivateRoute(
                        [
                            "BRANCH_HEAD",
                            "DEV",
                            "ADMIN",
                            "RECORDS_CUST",
                            "EMPLOYEE",
                            "WAREHOUSE_CUST",
                        ],
                        "/print-branch-summary/:filters",
                        ReportDocuments
                    )}
                    {renderPrivateRoute(
                        [
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                            "DEV",
                            "ADMIN",
                            "EMPLOYEE",
                            "WAREHOUSE_CUST",
                        ],
                        "/reports",
                        Report
                    )}
                    {renderPrivateRoute(
                        [
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                            "DEV",
                            "ADMIN",
                            "EMPLOYEE",
                        ],
                        "/rds-record-history/:id",
                        RDSRecordHistory
                    )}
                    {renderPrivateRoute(
                        ["BRANCH_HEAD", "RECORDS_CUST"],
                        "/turnover",
                        Turnover
                    )}
                    {renderPrivateRoute(
                        ["ADMIN", "DEV", "WAREHOUSE_CUST"],
                        "/warehouse-turnover",
                        WarehouseTurnover
                    )}
                    {renderPrivateRoute(
                        [
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                            "DEV",
                            "ADMIN",
                            "EMPLOYEE",
                        ],
                        "/rds-record-history/:id",
                        RDSRecordHistory
                    )}
                    {renderPrivateRoute(
                        ["BRANCH_HEAD", "RECORDS_CUST"],
                        "/print-turnover",
                        TurnoverForms
                    )}

                    {renderPrivateRoute(["RECORDS_CUST"], "/open-box", OpenBox)}
                </Routes>
            </Suspense>
        </AuthContext.Provider>
    );
}

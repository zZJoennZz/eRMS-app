import { useContext, useEffect, useState } from "react";
import SettingSidebar from "../../components/SettingSidebar";
import DashboardLayout from "../../components/DashboardLayout";
import SubmissionSummaryModal from "../../components/SubmissionSummaryModal";
import ComponentLoader from "../../components/ComponentLoader";
import { API_URL } from "../../configs/config";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitTurnover, getTurnover } from "../../utils/turnoverFn";
import { toast } from "react-toastify";
import TurnoverForm from "./TurnoverForm";
import { PrinterIcon } from "@heroicons/react/24/outline";

export default function Turnover() {
    const { currId, userType } = useContext(AuthContext);
    const [isSidebarOpen, setIsOpenSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [hasTurnover, setHasTurnover] = useState(false);
    const [formData, setFormData] = useState({
        selectedEmployee: "",
        designationStatus: "",
        assumptionDate: "",
        fromDate: "",
        toDate: "",
        currentJobHolderId: "",
        incomingJobHolderId: "",
    });

    const queryClient = useQueryClient();

    function toggleSideBar() {
        setIsOpenSidebarOpen(!isSidebarOpen);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsModalOpen(true);
    }

    function handleProceed() {
        postTurnover.mutate();

        console.log("Proceeding with the turnover process:", formData);
        setIsModalOpen(false);
    }

    const postTurnover = useMutation({
        mutationFn: () => submitTurnover(formData),
        onSuccess: () => {
            setFormData({
                selectedEmployee: "",
                designationStatus: "",
                assumptionDate: "",
                fromDate: "",
                toDate: "",
                currentJobHolderId: "",
                incomingJobHolderId: "",
            });
            queryClient.invalidateQueries({ queryKey: ["checkTurnover"] });
            toast.success("Turnover request submitted successfully!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getAllUsers() {
            await axios
                .get(`${API_URL}users`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let usersData = res.data.data;
                    setUsers(usersData);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getAllUsers();

        return () => {
            source.cancel();
        };
    }, []);

    const { data: turnoverData, isLoading } = useQuery(
        ["checkTurnover"],
        async () => {
            const response = await axios.get(`${API_URL}check-turnover`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            return response.data.data;
        },
        {
            onError: (err) => {
                console.error(err);
            },
        }
    );

    useEffect(() => {
        if (turnoverData) {
            setHasTurnover(turnoverData.hasTurnoverRequest);
        }
    }, [turnoverData]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <ComponentLoader />
            </DashboardLayout>
        );
    }

    if (!isLoading && !hasTurnover && userType === "BRANCH_HEAD") {
        return (
            <DashboardLayout>
                <div
                    className="flex flex-col items-center justify-center"
                    style={{ height: "60vh" }}
                >
                    <h1 className="text-2xl text-gray-800 mb-4 text-center leading-10">
                        No pending turnover requests.
                    </h1>
                    <div className="mb-10">
                        <strong>Please note:</strong> Let the new records
                        custodian to use the default password!
                    </div>
                    <div>
                        <a
                            href="/settings"
                            className="bg-yellow-600 text-white px-2 py-1 rounded-full"
                        >
                            {"<"} Go Back
                        </a>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!isLoading && hasTurnover && userType === "BRANCH_HEAD") {
        return <AdminTurnoverPage />;
    }

    if (!isLoading && hasTurnover && userType === "RECORDS_CUST") {
        return (
            <DashboardLayout>
                <div
                    className="flex flex-col items-center justify-center"
                    style={{ height: "60vh" }}
                >
                    <h1 className="text-2xl text-gray-800 mb-4 text-center leading-10">
                        Currently have existing turnover request. Please wait
                        for the decision of the branch head.
                        <div className="font-bold text-green-700">
                            Please don't forget to print the documents below.
                        </div>
                    </h1>
                    <div className="mb-6">
                        <a
                            href="/print-turnover"
                            className="bg-lime-700 text-white px-3 py-2 rounded-full text-lg"
                        >
                            <PrinterIcon className="w-4 h-4 inline mr-2" />{" "}
                            Print Documents
                        </a>
                    </div>
                    <div>
                        <a
                            href="/settings"
                            className="bg-yellow-600 text-white px-2 py-1 rounded-full"
                        >
                            {"<"} Go Back
                        </a>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex">
                <SettingSidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSideBar={toggleSideBar}
                />
                <div className="flex-1 flex flex-col">
                    <main className="p-6 flex-1">
                        {/* Navbar */}
                        <header className="bg-white flex justify-between items-center">
                            <button
                                onClick={() =>
                                    setIsOpenSidebarOpen(!isSidebarOpen)
                                }
                                className="md:hidden text-green-800 focus:outline-none"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    ></path>
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold">
                                Turnover Files/Documents
                            </h1>
                        </header>
                        <div className="overflow-x-auto">
                            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                                <form
                                    className="space-y-8"
                                    onSubmit={handleSubmit}
                                >
                                    {/* Step 1 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Step 1: Select Employee
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            If you cannot find the employee,
                                            please ask the branch head to enroll
                                            them into the system.
                                        </p>
                                        <select
                                            className="mt-3 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            value={formData.selectedEmployee}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    selectedEmployee:
                                                        e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">
                                                Select an employee
                                            </option>
                                            {users &&
                                                users.map(
                                                    (user) =>
                                                        user.id !== currId && (
                                                            <option
                                                                key={user.id}
                                                                value={user.id}
                                                            >
                                                                {
                                                                    user.profile
                                                                        .first_name
                                                                }{" "}
                                                                {
                                                                    user.profile
                                                                        .middle_name
                                                                }{" "}
                                                                {
                                                                    user.profile
                                                                        .last_name
                                                                }
                                                            </option>
                                                        )
                                                )}
                                        </select>
                                    </div>

                                    {/* Step 2 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Step 2: Select Status of Designation
                                        </h2>
                                        <select
                                            id="designationStatus"
                                            className="mt-3 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            value={formData.designationStatus}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    designationStatus: value,
                                                });
                                                document.getElementById(
                                                    "permanentFields"
                                                ).style.display =
                                                    value === "PERMANENT"
                                                        ? "block"
                                                        : "none";
                                                document.getElementById(
                                                    "temporaryFields"
                                                ).style.display =
                                                    value === "TEMPORARY"
                                                        ? "block"
                                                        : "none";
                                            }}
                                        >
                                            <option value="">
                                                Select status
                                            </option>
                                            <option value="PERMANENT">
                                                Permanent
                                            </option>
                                            <option value="TEMPORARY">
                                                Temporary
                                            </option>
                                            <option value="CO_TERMINUS">
                                                Co-terminus
                                            </option>
                                            <option value="DIRECTLY_HIRED_CONTRACTUAL">
                                                Directly-hired Contractual
                                            </option>
                                        </select>

                                        {/* Permanent Fields */}
                                        <div
                                            id="permanentFields"
                                            style={{ display: "none" }}
                                            className="mt-4"
                                        >
                                            <label className="block text-sm font-medium text-gray-700">
                                                Assumption Date
                                            </label>
                                            <input
                                                type="date"
                                                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                value={formData.assumptionDate}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        assumptionDate:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* Temporary Fields */}
                                        <div
                                            id="temporaryFields"
                                            style={{ display: "none" }}
                                            className="mt-4"
                                        >
                                            <label className="block text-sm font-medium text-gray-700">
                                                From Date
                                            </label>
                                            <input
                                                type="date"
                                                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                value={formData.fromDate}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        fromDate:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <label className="block text-sm font-medium text-gray-700 mt-4">
                                                To Date
                                            </label>
                                            <input
                                                type="date"
                                                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                value={formData.toDate}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        toDate: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Step 3: Enter ID Numbers
                                        </h2>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Currenct Record Custodian ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter current record custodian ID"
                                            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            value={formData.currentJobHolderId}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    currentJobHolderId:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        <label className="block text-sm font-medium text-gray-700 mt-4">
                                            Incoming Record Custodian ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter incoming record custodian ID"
                                            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            value={formData.incomingJobHolderId}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    incomingJobHolderId:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    {/* Step 4 */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Step 4: Approval
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            The turnover request will need to be
                                            approved by the branch head.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    >
                                        Submit Turnover Request
                                    </button>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <SubmissionSummaryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                onProceed={handleProceed}
            />
        </DashboardLayout>
    );
}

function AdminTurnoverPage() {
    const [isSidebarOpen, setIsOpenSidebarOpen] = useState(false);
    const [turnoverData, setTurnoverData] = useState({});

    function toggleSideBar() {
        setIsOpenSidebarOpen(!isSidebarOpen);
    }

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getTurnoverRequest() {
            await axios
                .get(`${API_URL}turnover`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let turnoverResData = res.data.data;
                    setTurnoverData(turnoverResData);
                    console.log(turnoverResData);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getTurnoverRequest();

        return () => {
            source.cancel();
        };
    }, []);

    return (
        <DashboardLayout>
            <div className="flex">
                <SettingSidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSideBar={toggleSideBar}
                />
                <div className="flex-1 flex flex-col">
                    <div className="p-5">
                        <h1 className="text-lg font-bold text-slate-700">
                            Turnover Request
                        </h1>
                        <div>
                            <TurnoverForm turnoverData={turnoverData} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

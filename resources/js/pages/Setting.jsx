import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

import DashboardLayout from "../components/DashboardLayout";
import SettingSidebar from "../components/SettingSidebar";
import { API_URL } from "../configs/config";

import { saveBranchDetails } from "../utils/branchFn";
import { changeOwnPassword } from "../utils/userFn";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function Setting() {
    const { changeAuth, userType } = useContext(AuthContext);
    const [isSidebarOpen, setIsOpenSidebarOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [isShowPw, setIsShowPw] = useState(false);
    const [branchDetails, setBranchDetails] = useState({
        agency_name: "",
        full_address: "",
        telephone_number: "",
        email_address: "",
        location_of_records: "",
    });

    function toggleSideBar() {
        setIsOpenSidebarOpen(!isSidebarOpen);
    }

    function frmFieldHandler(e) {
        setBranchDetails((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getBranchDetail() {
            await axios
                .get(`${API_URL}branch-detail`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let branchDetails = res.data.data;
                    setBranchDetails({
                        agency_name: branchDetails.agency_name || "",
                        full_address: branchDetails.full_address || "",
                        telephone_number: branchDetails.telephone_number || "",
                        email_address: branchDetails.email_address || "",
                        location_of_records:
                            branchDetails.location_of_records || "",
                    });
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getBranchDetail();

        return () => {
            source.cancel();
        };
    }, []);

    const saveBranchChanges = useMutation({
        mutationFn: () => saveBranchDetails(branchDetails),
        onSuccess: () => {
            toast.success("Branch details successfully saved.");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const saveNewPassword = useMutation({
        mutationFn: () => changeOwnPassword({ password }),
        onSuccess: () => {
            setPassword("");
            toast.success("New password successfully saved!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function confirmSave(e) {
        e.preventDefault();
        if (confirm("Are you sure to save changes?")) {
            saveBranchChanges.mutate();
        }
    }

    function confirmChangePw(e) {
        e.preventDefault();
        if (confirm("Are you sure to change your password?")) {
            saveNewPassword.mutate();
        }
    }

    return (
        <DashboardLayout>
            <div className="flex">
                <SettingSidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSideBar={toggleSideBar}
                />
                <div className="flex-1 flex flex-col">
                    {/* Navbar */}
                    <header className="bg-white shadow-md p-4 flex justify-between items-center">
                        <button
                            onClick={() => setIsOpenSidebarOpen(!isSidebarOpen)}
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
                        <h1 className="text-xl font-semibold">Settings</h1>
                    </header>

                    <main className="p-6 flex-1">
                        <form onSubmit={confirmChangePw}>
                            <div className="p-5">
                                <div className="font-semibold mb-1">
                                    Account Password
                                </div>
                                <div>
                                    <div className="mb-1">
                                        <label htmlFor="password">
                                            Password
                                            <span className="text-red-700">
                                                *
                                            </span>
                                            <div className="mt-1 text-xs italic text-slate-500">
                                                Please make sure to remember
                                                your new password if you decided
                                                to change it.
                                            </div>
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            type={
                                                isShowPw ? "text" : "password"
                                            }
                                            name="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="w-full"
                                            required
                                        />
                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsShowPw(!isShowPw)
                                                }
                                                className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full"
                                            >
                                                {isShowPw ? (
                                                    <>
                                                        <EyeSlashIcon className="w-4 h-4 inline" />{" "}
                                                        Hide
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeIcon className="w-4 h-4 inline" />{" "}
                                                        Show
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <button
                                    type="submit"
                                    className={`${
                                        saveNewPassword.isLoading
                                            ? "bg-gray-400 hover:bg-gray-300"
                                            : "bg-lime-600 hover:bg-lime-500"
                                    } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                                    disabled={saveNewPassword.isLoading}
                                >
                                    {saveNewPassword.isLoading
                                        ? "Saving..."
                                        : "Save Password"}
                                </button>
                            </div>
                        </form>
                        {userType === "BRANCH_HEAD" && (
                            <>
                                <form onSubmit={confirmSave}>
                                    <div className="p-5">
                                        <div className="font-semibold mb-1">
                                            Branch Details
                                        </div>
                                        <div className="text-xs italic text-slate-600 mb-4">
                                            This will appear in reports!
                                        </div>
                                        <div className="mb-4">
                                            <div className="mb-1">
                                                <label htmlFor="agency_name">
                                                    Agency Name{" "}
                                                    <span className="text-red-700">
                                                        *
                                                    </span>
                                                </label>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="agency_name"
                                                    id="agency_name"
                                                    value={
                                                        branchDetails.agency_name
                                                    }
                                                    onChange={frmFieldHandler}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="mb-1">
                                                <label htmlFor="full_address">
                                                    Full Address{" "}
                                                    <span className="text-red-700">
                                                        *
                                                    </span>
                                                </label>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="full_address"
                                                    id="full_address"
                                                    value={
                                                        branchDetails.full_address
                                                    }
                                                    onChange={frmFieldHandler}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="mb-1">
                                                <label htmlFor="telephone_number">
                                                    Telephone Number{" "}
                                                    <span className="text-red-700">
                                                        *
                                                    </span>
                                                </label>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="telephone_number"
                                                    id="telephone_number"
                                                    value={
                                                        branchDetails.telephone_number
                                                    }
                                                    onChange={frmFieldHandler}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="mb-1">
                                                <label htmlFor="email_address">
                                                    Email Address{" "}
                                                    <span className="text-red-700">
                                                        *
                                                    </span>
                                                </label>
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    name="email_address"
                                                    id="email_address"
                                                    value={
                                                        branchDetails.email_address
                                                    }
                                                    onChange={frmFieldHandler}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-1">
                                                <label htmlFor="location_of_records">
                                                    Location of Records{" "}
                                                    <span className="text-red-700">
                                                        *
                                                    </span>
                                                </label>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="location_of_records"
                                                    id="location_of_records"
                                                    value={
                                                        branchDetails.location_of_records
                                                    }
                                                    onChange={frmFieldHandler}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <button
                                            type="submit"
                                            className={`${
                                                saveBranchChanges.isLoading
                                                    ? "bg-gray-400 hover:bg-gray-300"
                                                    : "bg-lime-600 hover:bg-lime-500"
                                            } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                                            disabled={
                                                saveBranchChanges.isLoading
                                            }
                                        >
                                            {saveBranchChanges.isLoading
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </DashboardLayout>
    );
}

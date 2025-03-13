import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_URL } from "../../configs/config";

import { update, resetPassword } from "../../utils/userFn";
import { AuthContext } from "../../contexts/AuthContext";

export default function EditUser({ closeHandler, selUserId, rerender }) {
    const { userType } = useContext(AuthContext);

    const [userDetail, setUserDetail] = useState({
        username: "",
        email_address: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        others: "",
        positions_id: 0,
        type: "",
        branches_id: 0,
    });
    const [allPositions, setAllPositions] = useState([]);
    const [displayedPositions, setDisplayPositions] = useState([]);
    // const [branches, setBranches] = useState([]);

    const queryClient = useQueryClient();

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getAllPositions() {
            await axios
                .get(`${API_URL}positions`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let positionsData = res.data.data;
                    setAllPositions(positionsData);
                    setDisplayPositions(positionsData);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getAllPositions();

        return () => {
            source.cancel();
        };
    }, [rerender]);

    // useEffect(() => {
    //     const source = axios.CancelToken.source();
    //     async function getAllBranches() {
    //         await axios
    //             .get(`${API_URL}branches`, {
    //                 headers: {
    //                     Authorization: localStorage.getItem("token"),
    //                 },
    //                 cancelToken: source.token,
    //             })
    //             .then((res) => {
    //                 let branchesData = res.data.data;
    //                 setBranches(branchesData);
    //             })
    //             .catch((err) => {
    //                 if (axios.isCancel(err)) {
    //                     console.log("Request canceled");
    //                 } else {
    //                     console.log(err);
    //                 }
    //             });
    //     }

    //     if (userType !== "RECORDS_CUST" && userType !== "EMPLOYEE") {
    //         getAllBranches();
    //     }

    //     return () => {
    //         source.cancel();
    //     };
    // }, []);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getUser() {
            await axios
                .get(`${API_URL}users/${selUserId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let userData = res.data.data;
                    setUserDetail({
                        username: userData.username,
                        email_address: userData.email,
                        first_name: userData.profile.first_name,
                        middle_name: userData.profile.middle_name,
                        last_name: userData.profile.last_name,
                        positions_id: userData.profile.positions_id,
                        type: userData.type,
                        branches_id: userData.branches_id,
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
        getUser();

        return () => {
            source.cancel();
        };
    }, [rerender]);

    function frmFieldHandler(e) {
        setUserDetail((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });

        if (e.target.name === "type") {
            setDisplayPositions(
                allPositions.filter((d) => d.type === e.target.value)
            );
            setUserDetail((prev) => {
                return {
                    ...prev,
                    positions_id: 0,
                };
            });
        }
    }

    const saveUser = useMutation({
        mutationFn: () => update(userDetail, selUserId),
        onSuccess: () => {
            setUserDetail({
                username: "",
                email_address: "",
                password: "",
                first_name: "",
                middle_name: "",
                last_name: "",
                others: "",
                positions_id: 0,
                type: "EMPLOYEE",
                branches_id: 0,
            });
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
            toast.success("User account successfully updated!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const resetPw = useMutation({
        mutationFn: () => resetPassword(selUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
            toast.success(
                "User's password successfully reset! Please let the person know about the default password."
            );
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function submitUser(e) {
        e.preventDefault();
        saveUser.mutate();
    }

    function confirmResetPassword() {
        if (confirm("Are you sure to reset the password of this user?")) {
            resetPw.mutate();
        }
    }

    return (
        <>
            <form onSubmit={submitUser}>
                <div
                    className="p-5 overflow-y-scroll"
                    style={{ maxHeight: "80vh" }}
                >
                    <div className="font-semibold mb-4">User Details</div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="username">
                                Username <span className="text-red-700">*</span>
                            </label>
                            <div className="text-xs italic text-slate-600">
                                Make sure it's unique and not used by other
                                users!
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={userDetail.username}
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
                                <span className="text-red-700">*</span>
                            </label>
                            <div className="text-xs italic text-slate-600">
                                Make sure it's unique and not used by other
                                users!
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="email_address"
                                id="email_address"
                                value={userDetail.email_address}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                    {userType === "BRANCH_HEAD" && (
                        <div className="mb-4">
                            <div className="mb-2">
                                Reset Password{" "}
                                <div className="text-xs italic text-slate-600">
                                    If a user requested a reset password, click
                                    the button below to change it to the default
                                    password! {"("}BranchCodeLastName{")"}
                                </div>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={confirmResetPassword}
                                    className="px-2 py-1 bg-red-600 text-white rounded-md"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="first_name">
                                First Name{" "}
                                <span className="text-red-700">*</span>
                            </label>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={userDetail.first_name}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="middle_name">Middle Name</label>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="middle_name"
                                id="middle_name"
                                value={userDetail.middle_name}
                                onChange={frmFieldHandler}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="last_name">
                                Last Name{" "}
                                <span className="text-red-700">*</span>
                            </label>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={userDetail.last_name}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="type">
                                Account Role{" "}
                                <span className="text-red-700">*</span>
                            </label>
                        </div>
                        <div>
                            <select
                                name="type"
                                id="type"
                                value={userDetail.type}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            >
                                <option value="0">
                                    Select account role of this user
                                </option>
                                <option value="EMPLOYEE">Employee</option>
                                {(userType === "BRANCH_HEAD" ||
                                    userType === "ADMIN" ||
                                    userType === "DEV") && (
                                    <>
                                        <option value="RECORDS_CUST">
                                            Records Custodian
                                        </option>
                                        <option value="BRANCH_HEAD">
                                            Branch Head
                                        </option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="positions_id">
                                Position <span className="text-red-700">*</span>
                            </label>
                        </div>
                        <div>
                            <select
                                type="text"
                                name="positions_id"
                                id="positions_id"
                                value={userDetail.positions_id}
                                defaultValue={userDetail.positions_id}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            >
                                {displayedPositions.length === 0 && (
                                    <option>Select account role first.</option>
                                )}
                                {displayedPositions.length > 0 && (
                                    <option>
                                        Select position of this employee.
                                    </option>
                                )}
                                {displayedPositions &&
                                    displayedPositions.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    {/* {(userType === "BRANCH_HEAD" ||
                        userType === "DEV" ||
                        userType === "ADMIN") && (
                        <div className="mb-4">
                            <div className="mb-1">
                                <label htmlFor="branches_id">
                                    Branch{" "}
                                    <span className="text-red-700">*</span>
                                </label>
                            </div>
                            <div>
                                <select
                                    type="text"
                                    name="branches_id"
                                    id="branches_id"
                                    value={userDetail.branches_id}
                                    onChange={frmFieldHandler}
                                    className="w-full"
                                    required
                                >
                                    <option>Select branch</option>
                                    {branches &&
                                        branches.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    )} */}
                </div>
                <div className="absolute bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
                    <button
                        type="submit"
                        className={`${
                            saveUser.isLoading
                                ? "bg-gray-400 hover:bg-gray-300"
                                : "bg-lime-600 hover:bg-lime-500"
                        } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                        disabled={saveUser.isLoading}
                    >
                        {saveUser.isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
}

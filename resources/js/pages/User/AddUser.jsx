import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_URL } from "../../configs/config";

import { post } from "../../utils/userFn";
import { AuthContext } from "../../contexts/AuthContext";

export default function AddUser({ closeHandler }) {
    const { userType } = useContext(AuthContext);

    const [userDetail, setUserDetail] = useState({
        username: "",
        email_address: "",
        password: "",
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
    const [branches, setBranches] = useState([]);

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
    }, []);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getAllBranches() {
            await axios
                .get(`${API_URL}branches`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let branchesData = res.data.data;
                    setBranches(branchesData);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getAllBranches();

        return () => {
            source.cancel();
        };
    }, []);

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
        mutationFn: () => post(userDetail),
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
            toast.success("User account successfully created!");
            closeHandler();
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
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="password">
                                Password <span className="text-red-700">*</span>
                            </label>
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={userDetail.password}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
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
                                <option value="EMPLOYEE">
                                    Level 1 (Employee)
                                </option>
                                {(userType === "BRANCH_HEAD" ||
                                    userType === "ADMIN" ||
                                    userType === "DEV") && (
                                    <>
                                        <option value="RECORDS_CUST">
                                            Level 2 (BU Records Custodian)
                                        </option>
                                        <option value="WAREHOUSE_CUST">
                                            Level 3 (Record Center Custodian)
                                        </option>
                                        <option value="BRANCH_HEAD">
                                            Level 4 (Business Unit Head)
                                        </option>
                                        <option value="WAREHOUSE_HEAD">
                                            Level 5 (Record Center Head)
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
                    {(userType === "BRANCH_HEAD" ||
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
                                        branches.map((p) => {
                                            if (
                                                userDetail.type !==
                                                    "WAREHOUSE_CUST" &&
                                                p.name === "Warehouse"
                                            ) {
                                                return null;
                                            }

                                            if (
                                                userDetail.type ===
                                                    "WAREHOUSE_CUST" &&
                                                p.name !== "Warehouse"
                                            ) {
                                                return null;
                                            }
                                            return (
                                                <option key={p.id} value={p.id}>
                                                    {p.name === "Warehouse"
                                                        ? p.cluster.name +
                                                          " " +
                                                          p.name
                                                        : p.name}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:absolute md:bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
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

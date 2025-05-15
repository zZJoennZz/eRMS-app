import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_URL } from "../../configs/config";

import { update, resetPassword } from "../../utils/userFn";
import { AuthContext } from "../../contexts/AuthContext";

import { XMarkIcon } from "@heroicons/react/24/solid";

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
        intervening_positions: [],
    });
    const [allPositions, setAllPositions] = useState([]);
    const [displayedPositions, setDisplayPositions] = useState([]);
    const [availableForIntrvnng, setAvailableForIntrvnng] = useState([]);
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

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getUser() {
            let userData;
            await axios
                .get(`${API_URL}users/${selUserId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    userData = res.data.data;
                    const posIds = userData.profile.positions
                        .filter((obj) => obj.type !== "MAIN")
                        .map((d) => d.positions_id);
                    const mainPosition = userData.profile.positions.filter(
                        (d) => d.type === "MAIN"
                    );

                    const currIntervening = allPositions.filter((d) =>
                        posIds.includes(d.id)
                    );
                    setUserDetail({
                        username: userData.username,
                        email_address: userData.email,
                        first_name: userData.profile.first_name,
                        middle_name: userData.profile.middle_name,
                        last_name: userData.profile.last_name,
                        positions_id: mainPosition[0].positions_id,
                        type: userData.type,
                        branches_id: userData.branches_id,
                        intervening_positions: currIntervening,
                    });
                    if (userData.type === "EMPLOYEE") {
                        // Compute filtered positions first
                        const filteredPositions = allPositions.filter(
                            (d) => d.type === userData.type
                        );

                        setDisplayPositions(filteredPositions);

                        // Use functional update to ensure latest state
                        setAvailableForIntrvnng(() =>
                            filteredPositions.filter(
                                (d) => d.id !== userData.profile.positions_id && !currIntervening.some((intervene) => intervene.id === d.id)
                            )
                        );

                        console.log(currIntervening);
                    }
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
            source.cancel("Component unmounted or dependencies changed");
        };
    }, [rerender, selUserId, allPositions]);

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

        if (
            e.target.name === "positions_id" &&
            userDetail.type === "EMPLOYEE"
        ) {
            setAvailableForIntrvnng(
                displayedPositions.filter((d) => d.id !== e.target.value)
            );
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
                intervening_positions: [],
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

    function addInterveningPosition(pos) {
        setUserDetail((prev) => ({
            ...prev,
            intervening_positions: [...(prev.intervening_positions || []), pos],
        }));
        setAvailableForIntrvnng(
            availableForIntrvnng.filter((d) => d.id !== pos.id)
        );
    }

    function removePosition(pos) {
        setUserDetail((prev) => ({
            ...prev,
            intervening_positions: prev.intervening_positions.filter(
                (d) => d.id !== pos.id
            ),
        }));
        setAvailableForIntrvnng((prev) =>
            [...prev, pos].sort((a, b) => a.id - b.id)
        );
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
                    {(userType === "BRANCH_HEAD" || userType === "ADMIN" || userType === "DEV") && (
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
                    {
                        userType !== "WAREHOUSE_HEAD" && 
                        <>
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
                                {(userType === "ADMIN" ||
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
                                {userType === "BRANCH_HEAD" && (
                                    <>
                                        <option value="RECORDS_CUST">
                                            Level 2 (BU Records Custodian)
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
                        </>
                    }
                    {userDetail.type === "EMPLOYEE" && (
                        <>
                            <label className="block">
                                Additional Positions
                            </label>
                            <div className="flex flex-wrap gap-2 ">
                                {userDetail.intervening_positions?.map(
                                    (pos) => (
                                        <div
                                            key={pos.id}
                                            className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                                        >
                                            <span>{pos.name}</span>
                                            <button
                                                onClick={removePosition.bind(
                                                    this,
                                                    pos
                                                )}
                                                type="button"
                                            >
                                                <XMarkIcon className="w-5 h-5 text-red-500 cursor-pointer" />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2">
                                {availableForIntrvnng.map((pos) => (
                                    <button
                                        key={pos.id}
                                        type="button"
                                        onClick={() =>
                                            addInterveningPosition(pos)
                                        }
                                        className="border px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        {pos.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

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

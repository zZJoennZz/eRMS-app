import React, {
    Suspense,
    lazy,
    useCallback,
    useContext,
    useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";
import SettingSidebar from "../components/SettingSidebar";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { all, disableUser, allDisabled, enableUser } from "../utils/userFn";

import { toast } from "react-toastify";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";

const AddUser = lazy(() => import("./User/AddUser"));
const EditUser = lazy(() => import("./User/EditUser"));

import { PlusIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "../contexts/AuthContext";

export default function User() {
    const { userType, currId } = useContext(AuthContext);
    const getAllUsers = useQuery({
        queryKey: ["allUsers"],
        queryFn: all,
        retry: 2,
        networkMode: "always",
    });
    const getAllDisabledUsers = useQuery({
        queryKey: ["allDisabledUsers"],
        queryFn: () =>
            userType === "ADMIN" || userType === "DEV" ? allDisabled() : [],
        retry: 2,
        networkMode: "always",
    });
    const [searchTxt, setSearchTxt] = useState("");
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("");
    const [selectedForm, setSelectedForm] = useState(<></>);
    const [rerender, setRerender] = useState(0);
    const [isSidebarOpen, setIsOpenSidebarOpen] = useState(false);
    const [showDisabled, setShowDisabled] = useState(false);

    const queryClient = useQueryClient();

    function toggleSideBar() {
        setIsOpenSidebarOpen(!isSidebarOpen);
    }

    const sideDrawerClose = useCallback(() => {
        setShowDrawer(false);
    });

    const processDisableUser = useMutation({
        mutationFn: (id) => disableUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allDisabledUsers"] });
            toast.success("User account successfully disabled!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const processEnableUser = useMutation({
        mutationFn: (id) => enableUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allDisabledUsers"] });
            toast.success("User account successfully enabled!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function confirmDisableUser(id) {
        if (confirm("Are you sure to disable this user?")) {
            processDisableUser.mutate(id);
        }
    }

    function confirmEnableUser(id) {
        if (confirm("Are you sure to enable this user?")) {
            processEnableUser.mutate(id);
        }
    }

    function openDrawer(type, selUserId = 0) {
        if (type === "new") {
            setSelectedForm(
                <Suspense fallback={<ComponentLoader />}>
                    <AddUser closeHandler={sideDrawerClose} />
                </Suspense>
            );
            setDrawerTitle("Add User");
            setShowDrawer(true);
        } else if (type === "edit") {
            setRerender((prev) => prev + 1);
            setSelectedForm(
                <Suspense fallback={<ComponentLoader />}>
                    <EditUser
                        selUserId={selUserId}
                        closeHandler={sideDrawerClose}
                        rerender={rerender + 1}
                    />
                </Suspense>
            );
            setDrawerTitle("Edit User");
            setShowDrawer(true);
        } else {
            toast.error("Please refresh the page.");
        }
    }

    function filterUsers(users, searchTxt) {
        const keyword = searchTxt.toLowerCase();
        return users.filter((user) => {
            const fullName =
                `${user.profile.first_name} ${user.profile.middle_name} ${user.profile.last_name}`.toLowerCase();
            const branchName = user.branch?.name?.toLowerCase() || "";
            const clusterName = user.branch?.cluster?.name?.toLowerCase() || "";
            const position =
                user.profile.positions
                    .find((p) => p.type === "MAIN")
                    ?.position.name.toLowerCase() || "";

            return (
                fullName.includes(keyword) ||
                branchName.includes(keyword) ||
                clusterName.includes(keyword) ||
                position.includes(keyword)
            );
        });
    }

    return (
        <DashboardLayout>
            <SideDrawer
                showDrawer={showDrawer}
                closeHandler={sideDrawerClose}
                title={drawerTitle}
                content={selectedForm}
                twcssWidthClass="w-96"
            />
            <div className="flex">
                <SettingSidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSideBar={toggleSideBar}
                />
                <div className="flex-1 flex flex-col">
                    <main className="p-6 flex-1">
                        {/* Navbar */}
                        <header className="bg-white shadow-md flex justify-between items-center">
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
                                Users List
                            </h1>
                        </header>
                        {userType !== "WAREHOUSE_HEAD" && (
                            <>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        id="search"
                                        name="search"
                                        value={searchTxt}
                                        onChange={(e) =>
                                            setSearchTxt(e.target.value)
                                        }
                                        className="w-full"
                                        placeholder="Search user here"
                                    />
                                </div>
                                <div className="mb-3">
                                    <button
                                        className="px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 flex items-center"
                                        onClick={() => openDrawer("new")}
                                    >
                                        <PlusIcon className="w-4 h-4 inline mr-2" />{" "}
                                        Add User
                                    </button>
                                </div>
                            </>
                        )}
                        <div className="overflow-x-auto">
                            <table className="mb-3 w-full">
                                <thead className="text-left text-xs font-semibold border-t border-b border-lime-600">
                                    <tr>
                                        <th className="py-2">Full Name</th>
                                        <th className="py-2">Position</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getAllUsers.isLoading ? (
                                        <tr>
                                            <td colSpan={6}>
                                                <ComponentLoader />
                                            </td>
                                        </tr>
                                    ) : (
                                        getAllUsers.data &&
                                        filterUsers(
                                            getAllUsers.data,
                                            searchTxt
                                        ).map((data) => (
                                            <tr
                                                key={data.id}
                                                id={data.id}
                                                className="group cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-300"
                                            >
                                                <td className="py-2 text-left border-b border-slate-300">
                                                    {data.profile.first_name +
                                                        " " +
                                                        data.profile
                                                            .middle_name +
                                                        " " +
                                                        data.profile.last_name}

                                                    {data.type !==
                                                        "BRANCH_HEAD" &&
                                                        data.id !== currId && (
                                                            <button
                                                                type="button"
                                                                className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-600 border border-green-600 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                                onClick={() =>
                                                                    openDrawer(
                                                                        "edit",
                                                                        data.id
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>
                                                        )}

                                                    {data.type ===
                                                        "BRANCH_HEAD" &&
                                                        (userType === "ADMIN" ||
                                                            userType ===
                                                                "DEV") &&
                                                        data.id !== currId && (
                                                            <button
                                                                type="button"
                                                                className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-600 border border-green-600 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                                onClick={() =>
                                                                    openDrawer(
                                                                        "edit",
                                                                        data.id
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>
                                                        )}

                                                    {data.type ===
                                                        "BRANCH_HEAD" &&
                                                        userType !== "ADMIN" &&
                                                        userType !== "DEV" && (
                                                            <div className="inline opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-gray-400 border border-gray-400 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded">
                                                                Cannot edit
                                                                branch head
                                                            </div>
                                                        )}

                                                    {data.id === currId && (
                                                        <div className="inline opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-gray-400 border border-gray-400 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded">
                                                            Cannot edit your own
                                                            account.
                                                        </div>
                                                    )}

                                                    {(userType === "ADMIN" ||
                                                        userType === "DEV") && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-orange-600 border border-orange-600 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                confirmDisableUser(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Disable User
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="py-2 text-left border-b border-slate-300">
                                                    <div className="inline text-xs px-2 py-1 bg-slate-500 rounded-full text-white mr-2">
                                                        {data.branch.name ===
                                                        "Warehouse"
                                                            ? data.branch
                                                                  .cluster
                                                                  .name +
                                                              " Records Center"
                                                            : data.branch.name}
                                                    </div>
                                                    {
                                                        data.profile.positions.filter(
                                                            (d) =>
                                                                d.type ===
                                                                "MAIN"
                                                        )[0].position.name
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {(userType === "ADMIN" || userType === "DEV") && (
                            <div className="my-2">
                                <button
                                    className="text-xs py-1 px-3 bg-slate-600 text-white rounded-full"
                                    onClick={() =>
                                        setShowDisabled(!showDisabled)
                                    }
                                >
                                    {showDisabled
                                        ? "Hide Disabled Users"
                                        : "Show Disabled Users"}
                                </button>
                            </div>
                        )}

                        {(userType === "ADMIN" || userType === "DEV") &&
                            showDisabled && (
                                <div className="overflow-x-auto">
                                    <table className="mb-3 w-full">
                                        <thead className="text-left text-xs font-semibold border-t border-b border-lime-600">
                                            <tr>
                                                <th className="py-2">
                                                    Full Name
                                                </th>
                                                <th className="py-2">
                                                    Position
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getAllDisabledUsers.isLoading ? (
                                                <tr>
                                                    <td colSpan={6}>
                                                        <ComponentLoader />
                                                    </td>
                                                </tr>
                                            ) : (
                                                getAllDisabledUsers.data &&
                                                getAllDisabledUsers.data
                                                    .filter((i) =>
                                                        Object.values(i).some(
                                                            (value) =>
                                                                value
                                                                    ?.toString()
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        searchTxt.toLowerCase()
                                                                    )
                                                        )
                                                    )
                                                    .map((data) => (
                                                        <tr
                                                            key={data.id}
                                                            id={data.id}
                                                            className="group cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-300"
                                                        >
                                                            <td className="py-2 text-left border-b border-slate-300">
                                                                {data.profile
                                                                    .first_name +
                                                                    " " +
                                                                    data.profile
                                                                        .middle_name +
                                                                    " " +
                                                                    data.profile
                                                                        .last_name}

                                                                {(userType ===
                                                                    "ADMIN" ||
                                                                    userType ===
                                                                        "DEV") && (
                                                                    <button
                                                                        type="button"
                                                                        className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-600 border border-green-600 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                                        onClick={() =>
                                                                            confirmEnableUser(
                                                                                data.id
                                                                            )
                                                                        }
                                                                    >
                                                                        Enable
                                                                        User
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td className="py-2 text-left border-b border-slate-300">
                                                                <div className="inline text-xs px-2 py-1 bg-slate-500 rounded-full text-white mr-2">
                                                                    {
                                                                        data
                                                                            .branch
                                                                            .name
                                                                    }
                                                                </div>
                                                                {
                                                                    data.profile.positions.filter(
                                                                        (d) =>
                                                                            d.type ===
                                                                            "MAIN"
                                                                    )[0]
                                                                        .position
                                                                        .name
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                    </main>
                </div>
            </div>
        </DashboardLayout>
    );
}

import React, {
    Suspense,
    lazy,
    useCallback,
    useContext,
    useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";
import SettingSidebar from "../components/SettingSidebar";

import { useQuery } from "@tanstack/react-query";
import { all } from "../utils/userFn";

import { toast } from "react-toastify";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";

const AddUser = lazy(() => import("./User/AddUser"));
const EditRDS = lazy(() => import("./RDS/EditRDS"));

import { PlusIcon } from "@heroicons/react/24/solid";

export default function RDS() {
    const getAllUsers = useQuery({
        queryKey: ["allUsers"],
        queryFn: all,
        retry: 2,
        networkMode: "always",
    });
    const [searchTxt, setSearchTxt] = useState("");
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("");
    const [selectedForm, setSelectedForm] = useState(<></>);
    const [rerender, setRerender] = useState(0);
    const [isSidebarOpen, setIsOpenSidebarOpen] = useState(false);

    function toggleSideBar() {
        setIsOpenSidebarOpen(!isSidebarOpen);
    }

    const sideDrawerClose = useCallback(() => {
        setShowDrawer(false);
    });

    function openDrawer(type, selRds = 0) {
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
                    <EditRDS
                        selRdsId={selRds}
                        closeHandler={sideDrawerClose}
                        rerender={rerender + 1}
                    />
                </Suspense>
            );
            setDrawerTitle("Edit RDS");
            setShowDrawer(true);
        } else {
            toast.error("Please refresh the page.");
        }
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
                        <div className="mb-3">
                            <input
                                type="text"
                                id="search"
                                name="search"
                                value={searchTxt}
                                onChange={(e) => setSearchTxt(e.target.value)}
                                className="w-full"
                                placeholder="Search user here"
                            />
                        </div>
                        <div className="mb-3">
                            <button
                                className="px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 flex items-center"
                                onClick={() => openDrawer("new")}
                            >
                                <PlusIcon className="w-4 h-4 inline mr-2" /> Add
                                User
                            </button>
                        </div>
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
                                        getAllUsers.data
                                            .filter((i) =>
                                                Object.values(i).some((value) =>
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

                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-gray-400 border border-gray-400 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                openDrawer(
                                                                    "edit",
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                    <td className="py-2 text-left border-b border-slate-300">
                                                        <div className="inline text-xs px-2 py-1 bg-slate-500 rounded-full text-white mr-2">
                                                            {data.branch.name}
                                                        </div>
                                                        {
                                                            data.profile
                                                                .position.name
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        </DashboardLayout>
    );
}

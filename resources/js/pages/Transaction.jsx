import React, {
    Suspense,
    lazy,
    useCallback,
    useContext,
    useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";

import { useQuery } from "@tanstack/react-query";
import { all } from "../utils/rdsFn";

import { toast } from "react-toastify";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";

const AddTransaction = lazy(() => import("./Transaction/AddTransaction"));
const EditRDS = lazy(() => import("./RDS/EditRDS"));

import { AuthContext } from "../contexts/AuthContext";

import { PlusIcon } from "@heroicons/react/24/solid";

export default function Transaction() {
    const { userType } = useContext(AuthContext);
    const getAllTransactions = useQuery({
        queryKey: ["allTransactions"],
        queryFn: all,
        retry: 2,
        networkMode: "always",
    });

    const [searchTxt, setSearchTxt] = useState("");
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("");
    const [selectedForm, setSelectedForm] = useState(<></>);
    const [rerender, setRerender] = useState(0);

    const sideDrawerClose = useCallback(() => {
        setShowDrawer(false);
    });

    function openDrawer(type, selRds = 0) {
        if (type === "new") {
            setSelectedForm(
                <Suspense fallback={<ComponentLoader />}>
                    <AddTransaction closeHandler={sideDrawerClose} />
                </Suspense>
            );
            setDrawerTitle("Add Transaction");
            setShowDrawer(true);
        } else if (type === "edit") {
            // setRerender((prev) => prev + 1);
            // setSelectedForm(
            //     <Suspense fallback={<ComponentLoader />}>
            //         <EditRDS
            //             selRdsId={selRds}
            //             closeHandler={sideDrawerClose}
            //             rerender={rerender + 1}
            //         />
            //     </Suspense>
            // );
            // setDrawerTitle("Edit RDS");
            // setShowDrawer(true);
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
            <h1 className="text-xl font-semibold mb-2">Transactions</h1>
            <div className="mb-3">
                <input
                    type="text"
                    id="search"
                    name="search"
                    value={searchTxt}
                    onChange={(e) => setSearchTxt(e.target.value)}
                    className="w-full"
                    placeholder="Search Transaction here"
                />
            </div>
            <div className="mb-3">
                <button
                    className="px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 flex items-center"
                    onClick={() => openDrawer("new")}
                >
                    <PlusIcon className="w-4 h-4 inline mr-2" /> Add Transaction
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="mb-3 w-full">
                    <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                        <tr>
                            <th className="text-left py-2" rowSpan={2}>
                                Item Number
                            </th>
                            <th className="text-right py-2" rowSpan={2}>
                                Record Series Title and Description
                            </th>
                            <th className="text-center py-2" colSpan={3}>
                                Retention Period
                            </th>
                            <th className="text-right py-2" rowSpan={2}>
                                Remarks
                            </th>
                        </tr>
                        <tr>
                            <th>Active</th>
                            <th>Storage</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllTransactions.isLoading ? (
                            <tr>
                                <td colSpan={6}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            getAllTransactions.data &&
                            getAllTransactions.data
                                .filter((i) =>
                                    i.record_series_title_and_description
                                        .toLowerCase()
                                        .includes(searchTxt.toLowerCase())
                                )
                                .map((data) => (
                                    <tr
                                        key={data.id}
                                        id={data.id}
                                        className="group cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-300"
                                    >
                                        <td className="py-2 text-left border-b border-slate-300">
                                            {data.item_number}
                                            <button
                                                type="button"
                                                className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-gray-400 border border-gray-400 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                onClick={() =>
                                                    openDrawer("edit", data.id)
                                                }
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td className="py-2 border-b border-slate-300">
                                            {
                                                data.record_series_title_and_description
                                            }
                                            <div>
                                                <pre>
                                                    {
                                                        data.record_series_title_and_description_1
                                                    }
                                                </pre>
                                            </div>
                                        </td>
                                        <td className="py-2 text-right border-b border-slate-300">
                                            {data.active}
                                        </td>
                                        <td className="py-2 text-right border-b border-slate-300">
                                            {data.storage}
                                        </td>
                                        <td className="py-2 text-right border-b border-slate-300">
                                            {data.active + data.storage}
                                        </td>
                                        <td className="py-2 text-right border-b border-slate-300">
                                            {data.remarks}
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

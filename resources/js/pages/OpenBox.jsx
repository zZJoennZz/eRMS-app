import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DashboardLayout from "../components/DashboardLayout";

import { API_URL } from "../configs/config";

import { getOpenBoxes, createNewBoxForOpen } from "../utils/rdsRecordFn";
import { AuthContext } from "../contexts/AuthContext";
import ComponentLoader from "../components/ComponentLoader";

export default function OpenBox({ closeHandler }) {
    const { userType } = useContext(AuthContext);
    const [transaction, setTransaction] = useState({
        type: "",
        remarks: "",
    });
    const [records, setRecords] = useState([]);
    const [cart, setCart] = useState([]);

    const queryClient = useQueryClient();

    const openBoxRecords = useQuery({
        queryKey: ["openBoxRecords"],
        queryFn: getOpenBoxes,
        retry: 2,
        networkMode: "always",
    });

    const toggleCart = (product) => {
        // if (cart.some((item) => item.id === product.id)) {
        //     setCart(cart.filter((item) => item.id !== product.id));
        // } else {
        //     setCart([...cart, product]);
        // }
        if (cart.length > 0) {
            const existingProjectedDate = cart[0].projected_date_of_disposal;
            if (product.projected_date_of_disposal !== existingProjectedDate) {
                toast.error(
                    "All items in the cart must have the same projected date of disposal."
                );
                return;
            }
        }

        if (cart.some((item) => item.id === product.id)) {
            setCart(cart.filter((item) => item.id !== product.id));
        } else {
            setCart([...cart, product]);
        }
    };

    function frmFieldHandler(e) {
        setTransaction((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    const saveRdsRecord = useMutation({
        mutationFn: () => createNewBoxForOpen(cart),
        onSuccess: () => {
            setCart([]);
            queryClient.invalidateQueries({ queryKey: ["openBoxRecords"] });
            toast.success("Box successfully recorded!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function submitRds(e) {
        if (cart.length === 0) {
            toast.error("Please select at least one item to save.");
            return;
        }
        e.preventDefault();
        saveRdsRecord.mutate();
    }

    return (
        <DashboardLayout>
            <div
                style={{ minHeight: "50vh" }}
                className="overflow-x-auto mb-10 bg-gradient-to-r from-lime-100 to-green-50 shadow-md shadow-blue-200 rounded-lg p-4"
            >
                <h2 className="font-semibold mb-2">Open Box</h2>
                <button
                    type="submit"
                    className={`${
                        saveRdsRecord.isLoading
                            ? "bg-gray-400 hover:bg-gray-300"
                            : "bg-lime-600 hover:bg-lime-500"
                    } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded mb-3`}
                    disabled={saveRdsRecord.isLoading}
                    onClick={submitRds}
                >
                    {saveRdsRecord.isLoading ? "Saving..." : "Save Box"}
                </button>
                <table className="mb-3 w-full">
                    <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                        <tr>
                            <th className="py-2 text-left" rowSpan={2}>
                                RDS Item Number
                            </th>
                            <th className="text-left py-2" rowSpan={2}>
                                Source of Documents
                            </th>
                            <th className="text-left py-2" rowSpan={2}>
                                Description of Document
                            </th>
                            <th className="text-left py-2" rowSpan={2}>
                                Period Covered
                            </th>
                            <th className="text-center py-2" colSpan={4}>
                                Retention Period (Per E.O. No. 095 Series of
                                2016)
                            </th>
                            <th className="text-right py-2" rowSpan={2}>
                                Projected Date of Disposal
                            </th>
                            <th className="text-right py-2" rowSpan={2}>
                                Remarks
                            </th>
                        </tr>
                        <tr>
                            <th>Active</th>
                            <th>Storage</th>
                            <th>Total</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {openBoxRecords.isLoading ? (
                            <tr>
                                <td colSpan={10}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            openBoxRecords.data &&
                            openBoxRecords.data.map((data) => {
                                return data.documents.map((doc) => {
                                    console.log(doc);
                                    return (
                                        <tr
                                            key={doc.id}
                                            id={doc.id}
                                            className="group cursor-pointer hover:bg-white transition-all ease-in-out duration-300"
                                        >
                                            <td className="py-2 text-left border-b border-slate-300">
                                                <button
                                                    type="button"
                                                    className={`mx-1 px-2 py-1 text-xs duration-300 rounded ${
                                                        cart.some(
                                                            (item) =>
                                                                item.id ===
                                                                doc.id
                                                        )
                                                            ? "bg-green-500 text-white border border-green-500"
                                                            : "bg-green-700 text-white border border-green-700"
                                                    }`}
                                                    onClick={() =>
                                                        toggleCart(doc)
                                                    }
                                                >
                                                    {cart.some(
                                                        (item) =>
                                                            item.id === doc.id
                                                    )
                                                        ? "-"
                                                        : "+"}
                                                </button>
                                                {doc.rds.item_number}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {doc.source_of_documents}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {doc.description_of_document}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {doc.period_covered_from} to{" "}
                                                {doc.period_covered_to}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {doc.rds.active}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {doc.rds.storage}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {doc.rds.active +
                                                    doc.rds.storage}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {doc.rds.remarks}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {doc.projected_date_of_disposal}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {doc.remarks}
                                            </td>
                                        </tr>
                                    );
                                });
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

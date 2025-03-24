import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { post } from "../../utils/rdsFn";

export default function AddRDS({ closeHandler }) {
    const [rdsDetails, setRdsDetails] = useState({
        item_number: "",
        record_series_title_and_description: "",
        record_series_title_and_description_1: "",
        active: 0,
        storage: 0,
        remarks: "",
    });
    const [hasCondition, setHasCondition] = useState(false);

    const queryClient = useQueryClient();

    function frmFieldHandler(e) {
        if (e.target.name === "record_series_title_and_description_1") {
            setRdsDetails((prev) => {
                return {
                    ...prev,
                    [e.target.name]: JSON.stringify(e.target.value, null, 4),
                };
            });
        }

        setRdsDetails((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    const saveRds = useMutation({
        mutationFn: () =>
            post({
                ...rdsDetails,
                has_condition: hasCondition,
            }),
        onSuccess: () => {
            setRdsDetails({
                item_number: "",
                record_series_title_and_description: "",
                record_series_title_and_description_1: "",
                active: 0,
                storage: 0,
                remarks: "",
            });
            setHasCondition(false);
            queryClient.invalidateQueries({ queryKey: ["allRds"] });
            toast.success("RDS successfully added!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function submitRds(e) {
        e.preventDefault();
        saveRds.mutate();
    }

    return (
        <>
            <form onSubmit={submitRds}>
                <div
                    className="p-5 overflow-y-scroll"
                    style={{ maxHeight: "80vh" }}
                >
                    <div className="font-semibold mb-4">
                        Records Disposition Schedule Details
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="item_number">Item Number</label>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="item_number"
                                id="item_number"
                                value={rdsDetails.item_number}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="record_series_title_and_description">
                                Record Series Title and Description
                            </label>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="record_series_title_and_description"
                                id="record_series_title_and_description"
                                value={
                                    rdsDetails.record_series_title_and_description
                                }
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="record_series_title_and_description_1"></label>
                        </div>
                        <div>
                            <textarea
                                type="text"
                                name="record_series_title_and_description_1"
                                id="record_series_title_and_description_1"
                                value={
                                    rdsDetails.record_series_title_and_description_1
                                }
                                onChange={frmFieldHandler}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="active">Active (in Years)</label>
                        </div>
                        <div>
                            <input
                                type="number"
                                name="active"
                                id="active"
                                value={rdsDetails.active}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="storage">Storage (in Years)</label>
                        </div>
                        <div>
                            <input
                                type="number"
                                name="storage"
                                id="storage"
                                value={rdsDetails.storage}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="storage">Total (in Years)</label>
                        </div>
                        <div>
                            {parseInt(rdsDetails.active) +
                                parseInt(rdsDetails.storage) ?? 0}
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="remarks">Remarks</label>
                        </div>
                        <div>
                            <textarea
                                name="remarks"
                                id="remarks"
                                value={rdsDetails.remarks}
                                onChange={frmFieldHandler}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label>
                                Has Condition for Disposal?{" "}
                                <small>
                                    (Make sure to put the condition in remarks)
                                </small>
                            </label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                name="has_condition"
                                id="has_condition"
                                onChange={() => setHasCondition(!hasCondition)}
                            />{" "}
                            <label htmlFor="has_condition">Yes</label>
                        </div>
                    </div>
                </div>
                <div className="md:absolute md:bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
                    <button
                        type="submit"
                        className={`${
                            saveRds.isLoading
                                ? "bg-gray-400 hover:bg-gray-300"
                                : "bg-lime-600 hover:bg-lime-500"
                        } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                        disabled={saveRds.isLoading}
                    >
                        {saveRds.isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
}

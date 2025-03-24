import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { put } from "../../utils/rdsFn";
import { API_URL } from "../../configs/config";
import ComponentLoader from "../../components/ComponentLoader";

export default function EditRDS({ closeHandler, selRdsId, rerender }) {
    const [isLoading, setIsLoading] = useState(true);
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

    const saveRdsChanges = useMutation({
        mutationFn: () =>
            put(
                {
                    ...rdsDetails,
                    has_condition: hasCondition,
                },
                selRdsId
            ),
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
            toast.success("RDS successfully updated!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function submitUnit(e) {
        e.preventDefault();
        saveRdsChanges.mutate();
    }

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getRds() {
            setIsLoading(true);
            await axios
                .get(`${API_URL}rds/${selRdsId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let rdsData = res.data.data;
                    setRdsDetails({
                        item_number: rdsData.item_number,
                        record_series_title_and_description:
                            rdsData.record_series_title_and_description,
                        record_series_title_and_description_1:
                            rdsData.record_series_title_and_description_1,
                        active: rdsData.active,
                        storage: rdsData.storage,
                        remarks: rdsData.remarks ?? "n/a",
                    });
                    setHasCondition(rdsData.has_condition);
                    setIsLoading(false);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getRds();

        return () => {
            source.cancel();
        };
    }, [selRdsId, rerender]);

    if (isLoading) return <ComponentLoader />;
    return (
        <>
            <form onSubmit={submitUnit}>
                <div
                    className="p-5 overflow-y-scroll"
                    style={{ maxHeight: "80vh" }}
                >
                    <div className="font-semibold mb-4">
                        Update Records Disposition Schedule Details
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="item_number">Item Number</label>
                        </div>
                        <div>
                            {rdsDetails.item_number}
                            {/* <input
                                type="text"
                                name="item_number"
                                id="item_number"
                                value={rdsDetails.item_number}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            /> */}
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
                                Has Condition When to Start Retention Period?{" "}
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
                                checked={hasCondition}
                            />{" "}
                            <label htmlFor="has_condition">Yes</label>
                        </div>
                    </div>
                </div>
                <div className="md:absolute md:bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
                    <button
                        type="submit"
                        className={`${
                            saveRdsChanges.isLoading
                                ? "bg-gray-400 hover:bg-gray-300"
                                : "bg-lime-600 hover:bg-lime-500"
                        } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                        disabled={saveRdsChanges.isLoading}
                    >
                        {saveRdsChanges.isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
}

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { API_URL } from "../../configs/config";

import { post, all } from "../../utils/rdsRecordFn";

export default function AddRDSRecord({ closeHandler }) {
    const [rdsDetails, setRdsDetails] = useState({
        records_disposition_schedules_id: 0,
        description_of_document: "",
        period_covered_from: "",
        period_covered_to: "",
        remarks: "",
    });

    const [rds, setRds] = useState([]);

    const queryClient = useQueryClient();

    function frmFieldHandler(e) {
        setRdsDetails((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getRds() {
            await axios
                .get(`${API_URL}rds`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let rdsData = res.data.data;
                    setRds(rdsData);
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
    }, []);

    const saveRdsRecord = useMutation({
        mutationFn: () => post(rdsDetails),
        onSuccess: () => {
            setRdsDetails({
                records_disposition_schedules_id: 0,
                description_of_document: "",
                period_covered_from: "",
                period_covered_to: "",
                remarks: "",
            });
            queryClient.invalidateQueries({ queryKey: ["allRdsRecords"] });
            toast.success("RDS Record successfully added!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function submitRds(e) {
        e.preventDefault();
        saveRdsRecord.mutate();
    }

    return (
        <>
            <form onSubmit={submitRds}>
                <div
                    className="p-5 overflow-y-scroll"
                    style={{ maxHeight: "80vh" }}
                >
                    <div className="font-semibold mb-4">Records Details</div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="records_disposition_schedules_id">
                                RDS
                            </label>
                        </div>
                        <div>
                            <select
                                type="text"
                                name="records_disposition_schedules_id"
                                id="records_disposition_schedules_id"
                                value={
                                    rdsDetails.records_disposition_schedules_id
                                }
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            >
                                <option disabled selected>
                                    Select RDS
                                </option>
                                {rds.length > 0 ? (
                                    rds.map((rds) => (
                                        <option key={rds.id} value={rds.id}>
                                            {rds.item_number} -{" "}
                                            {
                                                rds.record_series_title_and_description
                                            }
                                        </option>
                                    ))
                                ) : (
                                    <option>NO RDS AVAILABLE</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="description_of_document">
                                Description of Document
                            </label>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="description_of_document"
                                id="description_of_document"
                                value={rdsDetails.description_of_document}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="period_covered_from">
                                Period Covered From Date
                            </label>
                        </div>
                        <div>
                            <input
                                type="date"
                                name="period_covered_from"
                                id="period_covered_from"
                                value={rdsDetails.period_covered_from}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="period_covered_to">
                                Period Covered To Date
                            </label>
                        </div>
                        <div>
                            <input
                                type="date"
                                name="period_covered_to"
                                id="period_covered_to"
                                value={rdsDetails.period_covered_to}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
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
                </div>
                <div className="absolute bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
                    <button
                        type="submit"
                        className={`${
                            saveRdsRecord.isLoading
                                ? "bg-gray-400 hover:bg-gray-300"
                                : "bg-lime-600 hover:bg-lime-500"
                        } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                        disabled={saveRdsRecord.isLoading}
                    >
                        {saveRdsRecord.isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
}

import React, { useState, useEffect, lazy } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { API_URL } from "../../configs/config";

import { post, all } from "../../utils/rdsRecordFn";

const CustomSelectRDS = lazy(() => import("../../components/CustomSelectRDS"));

export default function AddRDSRecord({ closeHandler }) {
    const [rdsDetails, setRdsDetails] = useState({
        records_disposition_schedules_id: 0,
        description_of_document: "",
        period_covered_from: "",
        period_covered_to: "",
        remarks: "",
    });

    const [rdsRecords, setRdsRecords] = useState([
        {
            records_disposition_schedules_id: "",
            description_of_document: "",
            period_covered_from: "",
            period_covered_to: "",
            remarks: "",
        },
    ]);

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

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRecords = [...rdsRecords];
        updatedRecords[index][name] = value;
        setRdsRecords(updatedRecords);
    };

    const saveRdsRecord = useMutation({
        mutationFn: () => post({ rdsRecords }),
        onSuccess: () => {
            setRdsRecords([
                {
                    records_disposition_schedules_id: "",
                    description_of_document: "",
                    period_covered_from: "",
                    period_covered_to: "",
                    remarks: "",
                },
            ]);
            queryClient.invalidateQueries({ queryKey: ["allRdsRecords"] });
            toast.success("RDS Record successfully added!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const addRecord = () => {
        if (rdsRecords.length === 1) {
            if (
                rdsRecords[0].records_disposition_schedules_id === "" ||
                rdsRecords[0].records_disposition_schedules_id === 0 ||
                rdsRecords[0].records_disposition_schedules_id === null
            ) {
                alert("Please select RDS first.");
                return;
            }
            const selectedRds = rds.filter((r) => {
                return (
                    r.id ===
                    parseInt(rdsRecords[0].records_disposition_schedules_id)
                );
            });

            const retentionPeriod =
                parseInt(selectedRds[0].active) +
                parseInt(selectedRds[0].storage);

            let newRds = rds.filter((r) => {
                return (
                    parseInt(r.active) + parseInt(r.storage) === retentionPeriod
                );
            });

            setRds(newRds);

            // setRdsRecords(rdsRecords.filter((_, i) => i !== index));
        }

        setRdsRecords([
            ...rdsRecords,
            {
                records_disposition_schedules_id: "",
                description_of_document: "",
                period_covered_from: "",
                period_covered_to: "",
                remarks: "",
            },
        ]);
    };

    const removeRecord = (index) => {
        if (rdsRecords.length > 1 && index !== 0) {
            setRdsRecords(rdsRecords.filter((_, i) => i !== index));
        }
    };

    function submitRds(e) {
        e.preventDefault();
        saveRdsRecord.mutate();
    }

    return (
        <>
            <form onSubmit={submitRds}>
                <div
                    className="p-5 overflow-y-scroll"
                    style={{ height: "80vh" }}
                >
                    <div className="font-semibold">Records Details</div>
                    <div className="text-xs text-gray-600 mb-4 italic">
                        Please refresh the page if you made a mistake
                    </div>
                    {rdsRecords.map((record, index) => (
                        <div
                            key={index}
                            className="mb-6 p-4 border rounded bg-gray-100 flex items-center space-x-1"
                        >
                            <div className="mb-4">
                                <label>RDS - Description of Document</label>
                                {/* <select
                                    name="records_disposition_schedules_id"
                                    value={
                                        record.records_disposition_schedules_id
                                    }
                                    onChange={(e) =>
                                        handleInputChange(index, e)
                                    }
                                    className="w-full"
                                    required
                                >
                                    <option disabled value="">
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
                                </select> */}
                                <CustomSelectRDS
                                    rds={rds}
                                    index={index}
                                    handleInputChange={handleInputChange}
                                />
                            </div>
                            {/* <div className="mb-4">
                                <label>Description of Document</label>
                                <input
                                    type="text"
                                    name="description_of_document"
                                    value={record.description_of_document}
                                    onChange={(e) =>
                                        handleInputChange(index, e)
                                    }
                                    className="w-full"
                                    required
                                />
                            </div> */}
                            <div className="mb-4">
                                <label>Period Covered From</label>
                                <input
                                    type="date"
                                    name="period_covered_from"
                                    value={record.period_covered_from}
                                    onChange={(e) =>
                                        handleInputChange(index, e)
                                    }
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label>Period Covered To</label>
                                <input
                                    type="date"
                                    name="period_covered_to"
                                    value={record.period_covered_to}
                                    onChange={(e) =>
                                        handleInputChange(index, e)
                                    }
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label>Remarks</label>
                                <textarea
                                    name="remarks"
                                    value={record.remarks}
                                    onChange={(e) =>
                                        handleInputChange(index, e)
                                    }
                                    className="w-full"
                                />
                            </div>
                            {index !== 0 && (
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => removeRecord(index)}
                                >
                                    Remove Record
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={addRecord}
                    >
                        + Add Another Record
                    </button>
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

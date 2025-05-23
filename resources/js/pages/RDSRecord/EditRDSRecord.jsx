import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRdsRecord } from "../../utils/rdsRecordFn";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../configs/config";

import CustomSelectRDSForEdit from "../../components/CustomSelectRDSForEdit";

export default function EditRDSRecord({ closeHandler, record }) {
    const [rdsRecords, setRdsRecords] = useState([]);
    const [rds, setRds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const queryClient = useQueryClient();

    useEffect(() => {
        const source = axios.CancelToken.source();

        async function fetchRdsRecord() {
            try {
                const res = await axios.get(
                    `${API_URL}rds-records/${record.id}`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                        cancelToken: source.token,
                    }
                );
                setRdsRecords(res.data.data.documents || []);
                setIsLoading(false);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    toast.error("Failed to fetch RDS record.");
                }
            }
        }

        async function getRds() {
            try {
                const res = await axios.get(`${API_URL}rds`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                });
                setRds(res.data.data);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.error(err);
                }
            }
        }

        fetchRdsRecord();
        getRds();

        return () => {
            source.cancel();
        };
    }, [record.id]);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRecords = [...rdsRecords];
        updatedRecords[index][name] = value;
        setRdsRecords(updatedRecords);
    };

    const updateRecord = useMutation({
        mutationFn: () => updateRdsRecord({ documents: rdsRecords }, record.id),
        onSuccess: () => {
            queryClient.invalidateQueries(["allRdsRecords"]);
            toast.success("RDS Record successfully updated!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
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
        if (rdsRecords.length > 1) {
            setRdsRecords(rdsRecords.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateRecord.mutate();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-5 overflow-y-scroll" style={{ height: "80vh" }}>
                <div className="font-semibold">Edit Records Details</div>
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
                            <CustomSelectRDSForEdit
                                rds={rds}
                                index={index}
                                handleInputChange={handleInputChange}
                                selectedValue={
                                    record.records_disposition_schedules_id
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label>Period Covered From</label>
                            <input
                                type="date"
                                name="period_covered_from"
                                value={record.period_covered_from}
                                onChange={(e) => handleInputChange(index, e)}
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
                                onChange={(e) => handleInputChange(index, e)}
                                className="w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label>Remarks</label>
                            <textarea
                                name="remarks"
                                value={record.remarks || ""}
                                onChange={(e) => handleInputChange(index, e)}
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
            <div className="md:absolute md:bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
                <button
                    type="submit"
                    className={`${
                        updateRecord.isLoading
                            ? "bg-gray-400 hover:bg-gray-300"
                            : "bg-lime-600 hover:bg-lime-500"
                    } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                    disabled={updateRecord.isLoading}
                >
                    {updateRecord.isLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

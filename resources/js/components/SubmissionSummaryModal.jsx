import { useEffect, useState } from "react";
import { API_URL } from "../configs/config";

export default function SubmissionSummaryModal({
    isOpen,
    onClose,
    formData,
    onProceed,
}) {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getAllRecords() {
            await axios
                .get(`${API_URL}branch-records`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let recordsData = res.data.data;
                    setRecords(recordsData);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getAllRecords();

        return () => {
            source.cancel();
        };
    }, []);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-3/4 h-3/4 max-w-2xl rounded-lg shadow-lg p-6 overflow-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Submission Summary
                </h2>
                <div className="space-y-4">
                    {/* Summary Section */}
                    <div>
                        <p className="text-sm text-gray-700">
                            <strong>Employee:</strong>{" "}
                            {formData.selectedEmployee || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Status of Designation:</strong>{" "}
                            {formData.designationStatus || "N/A"}
                        </p>
                        {formData.designationStatus === "PERMANENT" && (
                            <p className="text-sm text-gray-700">
                                <strong>Assumption Date:</strong>{" "}
                                {formData.assumptionDate || "N/A"}
                            </p>
                        )}
                        {formData.designationStatus === "TEMPORARY" && (
                            <>
                                <p className="text-sm text-gray-700">
                                    <strong>From Date:</strong>{" "}
                                    {formData.fromDate || "N/A"}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>To Date:</strong>{" "}
                                    {formData.toDate || "N/A"}
                                </p>
                            </>
                        )}
                        <p className="text-sm text-gray-700">
                            <strong>Current Job Holder ID:</strong>{" "}
                            {formData.currentJobHolderId || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Incoming Job Holder ID:</strong>{" "}
                            {formData.incomingJobHolderId || "N/A"}
                        </p>
                    </div>

                    {/* Table Section */}
                    <div>
                        <h3 className="text-md uppercase font-medium text-gray-800 mb-2">
                            Records
                        </h3>
                        <table className="w-full border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                        Document
                                    </th>
                                    {/* <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                        Form
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                        Location
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                        Remarks, if any
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {records &&
                                    records.map((record) =>
                                        record.documents.map((doc) => (
                                            <tr key={doc.id}>
                                                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                                    {doc.description_of_document ||
                                                        "N/A"}
                                                </td>
                                                {/* <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700"></td>
                                                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700"></td>
                                                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700"></td> */}
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                        Close
                    </button>
                    <button
                        onClick={onProceed}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    );
}

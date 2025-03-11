import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function WarehouseRecords({ reportData }) {
    const { currProfile } = useContext(AuthContext);
    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div>
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    SUMMARY OF WAREHOUSE RECORDS
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-1/4 p-2">
                                RDS
                            </th>
                            <th className="border-r border-black w-2/5 p-2">
                                Documents
                            </th>
                            <th className="border-r border-black w-1/5 p-2">
                                Period
                            </th>
                            <th className="border-black w-1/5 p-2">
                                Date Transferred
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((d) =>
                            d.documents.map(
                                (doc) =>
                                    d.latest_history.action === "TRANSFER" && (
                                        <tr
                                            key={doc.id}
                                            className="border-b border-black"
                                        >
                                            <td className="border-r border-black p-2">
                                                {doc.rds.item_number}
                                            </td>
                                            <td className="border-r border-black p-2">
                                                {doc.description_of_document}
                                            </td>
                                            <td className="border-r border-black p-2">
                                                {doc.period_covered_from} to{" "}
                                                {doc.period_covered_to}
                                            </td>
                                            <td className="p-2">
                                                {formatDate(
                                                    d.latest_history.created_at
                                                )}
                                            </td>
                                        </tr>
                                    )
                            )
                        )}
                    </tbody>
                </table>
                <div className="mt-16 text-center w-2/12">
                    {currProfile.first_name} {currProfile.middle_name}{" "}
                    {currProfile.last_name}
                </div>
                <div className="text-center border-t border-black pt-2 w-2/12">
                    Prepared By:
                </div>
            </div>
        </div>
    );
}

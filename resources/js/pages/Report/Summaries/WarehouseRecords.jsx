import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function WarehouseRecords({ reportData }) {
    const { currProfile } = useContext(AuthContext);

    // Sort the reportData array by branch name
    const sortedReportData = [...reportData].sort((a, b) =>
        a.branch.name.localeCompare(b.branch.name)
    );

    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div>
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    SUMMARY OF BOX AT RECORDS CENTER
                </div>
                
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-1/4 p-2">
                                Branch
                            </th>
                            <th className="border-r border-black w-2/5 p-2">
                                Box Number
                            </th>
                            <th className="border-black w-1/5 p-2">
                                Date Transferred
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReportData.map((d) => (
                            <tr
                                key={"d" + d.id}
                                className="border-b border-black"
                            >
                                <td className="border-r border-black">
                                    {d.branch.name}
                                </td>
                                <td className="border-r border-black">
                                    {d.box_number}
                                </td>
                                <td className="border-black">
                                    {formatDate(d.latest_history.created_at)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-left mt-16  pt-2 w-2/12">
                    Prepared By:
                </div>
                <div className="mt-10 border-t border-black text-center w-2/12">
                    {currProfile.first_name} {currProfile.middle_name}{" "}
                    {currProfile.last_name}
                </div>
                
            </div>
        </div>
    );
}

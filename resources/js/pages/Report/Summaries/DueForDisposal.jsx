import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function WarehouseSummary({ reportData }) {
    const { currProfile } = useContext(AuthContext);
    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div>
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    RECORDS DUE FOR DISPOSAL
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                <thead>
    <tr className="border-b border-black">
        <th className="border-r border-black w-3/12 p-2">BRANCH</th>
        <th className="border-r border-black w-2/12 p-2">BOX NUMBER</th>
        <th className="border-r border-black w-3/12 p-2">PROJECTED DATE OF DISPOSAL</th>
        <th className="border-r border-black w-2/12 p-2">AGING</th>
    </tr>
</thead>
<tbody>
    {reportData.overdue_disposals.map((d) => {
        const projectedDate = new Date(d.documents[0].projected_date_of_disposal);
        const now = new Date();
        const diffTime = now - projectedDate;
        const agingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

        return (
            <tr key={d.id} className="border-b border-black">
                <td className="border-r border-black p-2">{d.branch.name}</td>
                <td className="border-r border-black p-2">{d.box_number}</td>
                <td className="border-r border-black p-2">
                    {d.documents[0].projected_date_of_disposal}
                </td>
                <td className="border-r border-black p-2">
                    {agingDays} days
                </td>
            </tr>
        );
    })}
</tbody>
                </table>
                <div className="text-left mt-16 pt-2 w-2/12">
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

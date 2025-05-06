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
                    DUE FOR DISPOSAL
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-5/12 p-2">
                                Branch
                            </th>
                            <th className="border-r border-black w-4/12 p-2">
                                # of Boxes at the Warehouse
                            </th>
                            <th className="border-r border-black w-3/12 p-2">
                                Projected Date of Disposal
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.overdue_disposals.map((d) => (
                            <tr key={d.id} className="border-b border-black">
                                <td className="border-r border-black p-2">
                                    {d.branch.name}
                                </td>
                                <td className="border-r border-black p-2">
                                    {d.box_number}
                                </td>
                                <td className="border-r border-black p-2">
                                    {d.documents[0].projected_date_of_disposal}
                                </td>
                            </tr>
                        ))}
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

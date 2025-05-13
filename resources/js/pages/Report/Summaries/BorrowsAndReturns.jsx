import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function BorrowsAndReturns({ reportData }) {
    const { currProfile, branchDetails } = useContext(AuthContext);
    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                {/* <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div> */}
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    Borrows and Returns
                </div>
                <div className="text-lg font-bold text-center mt-1 mb-5">
                    {branchDetails.name}
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-1/12 p-2">
                                RDS Item Number
                            </th>
                            <th className="border-r border-black w-5/12 p-2">
                               Records Series Title and Decsription
                            </th>
                            <th className="border-r border-black w-2/12 p-2">
                                Period Covered
                            </th>
                            <th className="border-r border-black w-3/12 p-2">
                                Borrower
                            </th>
                            <th className="border-black w-1/12 p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((d) => (
                            <tr
                                key={"d" + d.id}
                                className="border-b border-black"
                            >
                                <td className="border-r border-black p-2">
                                    {d.document.rds.item_number}
                                </td>
                                <td className="border-r border-black p-2">
                                    {d.document.description_of_document}
                                </td>
                                <td className="border-r border-black p-2">
                                    {d.document.period_covered_from} to{" "}
                                    {d.document.period_covered_to}
                                </td>
                                <td className="p-2 border-r border-black">
                                    {d.action_by.profile.first_name}{" "}
                                    {d.action_by.profile.middle_name}{" "}
                                    {d.action_by.profile.last_name}
                                </td>
                                <td className="p-2 text-xs text-slate-600">
                                    {d.status === "PENDING" && "Pending"}
                                    {d.status === "PROCESSING" && "Processing"}
                                    {d.status === "RECEIVING" && "Receiving"}
                                    {d.status === "BORROWED" && "Borrowed"}
                                    {d.status === "RETURNED" && "Returned"}
                                    {d.status === "DECLINED" && "Declined"}
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

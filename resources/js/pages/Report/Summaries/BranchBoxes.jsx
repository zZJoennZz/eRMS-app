import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function BranchRecords({ reportData, filters }) {
    const { currProfile, branchDetails } = useContext(AuthContext);
    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div>
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    SUMMARY OF{" "}
                    {JSON.parse(filters).scope === "branch_only" && "BUSINESS UNIT"}
                    {JSON.parse(filters).scope === "warehouse_only" &&
                        "RECORD CENTER"}
                    {JSON.parse(filters).scope === "both" &&
                        "BUSINESS UNIT AND RECORDS CENTER"}{" "}
                    BOXES
                </div>
                <div className="text-lg font-bold text-center mt-1 mb-5">
                    {branchDetails.name}
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-1/4 p-2">
                                Box Number
                            </th>
                            <th className="border-r border-black w-1/4 p-2">
                                # of Documents
                            </th>
                            <th className="border-r border-black w-1/4 p-2">
                                Projected Date of Disposal
                            </th>
                            <th className="border-black w-1/4 p-2">
                                Submitted By
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((d) => (
                            <tr
                                key={"d" + d.id}
                                className="border-b border-black"
                            >
                                <td className="border-r border-black p-2">
                                    {d.box_number}
                                </td>
                                <td className="border-r border-black p-2">
                                    {d.documents.length}
                                </td>
                                <td className="border-r border-black p-2">
                                    {d.documents[0].projected_date_of_disposal}
                                </td>
                                <td className="p-2">
                                    {d.submitted_by_user.profile.first_name}{" "}
                                    {d.submitted_by_user.profile.middle_name}{" "}
                                    {d.submitted_by_user.profile.last_name}
                                </td>
                            </tr>
                        ))}
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

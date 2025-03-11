import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function EmployeeBorrows({ reportData }) {
    const { currProfile, branchDetails } = useContext(AuthContext);
    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                {/* <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div> */}
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    Current Borrowed Documents
                </div>
                <div className="text-center mb-2">
                    By: {currProfile.first_name} {currProfile.middle_name}{" "}
                    {currProfile.last_name}
                </div>
                <div className="text-lg font-bold text-center mt-1 mb-5">
                    {branchDetails.name}
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-2/12 p-2">
                                RDS
                            </th>
                            <th className="border-r border-black w-4/12 p-2">
                                Name of Documents
                            </th>
                            <th className="border-r border-black w-3/12 p-2">
                                Period Covered
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
                                    {d.document.rds.item_number}
                                </td>
                                <td className="border-r border-black p-2">
                                    {d.document.description_of_document}
                                </td>
                                <td className="border-r border-black p-2">
                                    {d.document.period_covered_from} to{" "}
                                    {d.document.period_covered_to}
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

import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function SubmittedDocuments({ reportData }) {
    const { currProfile, branchDetails } = useContext(AuthContext);
    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                {/* <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div> */}
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    SUMMARY OF SUBMITTED DOCUMENTS
                </div>
               { /*<div className="text-center mb-2">
                    {currProfile.first_name} {currProfile.middle_name}{" "}
                    {currProfile.last_name}
            </div>*/}
                <div className="text-lg font-bold text-center mt-1 mb-5">
                    {branchDetails.name}
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-1/5 p-2">
                                RDS Item Number
                            </th>
                            <th className="border-r border-black w-2/5 p-2">
                                Records Series Title and Description
                            </th>
                            <th className="border-r border-black w-1/5 p-2">
                                Period
                            </th>
                            <th className="border-black w-2/5 p-2">
                                Record Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((d) => (
                            <>
                                <tr key={"d" + d.id}>
                                    <td
                                        colSpan={4}
                                        className="border-b border-black p-2"
                                    >
                                        {d.status === "PENDING" && (
                                            <div className="bg-gray-300 text-xs inline text-white py-0.5 px-2 rounded-full ml-1">
                                                Pending
                                            </div>
                                        )}
                                        {d.status === "PENDING_DISPOSAL" && (
                                            <div className="inline ml-2 rounded-full bg-slate-400 text-white px-1.5 py-0.5 text-xs">
                                                Submitted for Disposal
                                            </div>
                                        )}
                                        {d.status === "DISPOSED" && (
                                            <div className="inline ml-2 rounded-full bg-slate-800 text-white px-1.5 py-0.5 text-xs">
                                                Disposed
                                            </div>
                                        )}
                                        {d.status === "APPROVED" && (
                                            <div className="inline ml-2 rounded-full bg-slate-500 text-white px-1.5 py-0.5 text-xs">
                                                Approved
                                            </div>
                                        )}{" "}
                                        - {d.box_number}
                                    </td>
                                </tr>
                                {d.documents.map((doc) => (
                                    <>
                                        <tr
                                            key={"doc" + doc.id}
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
                                                {formatDate(d.created_at)}
                                            </td>
                                        </tr>
                                    </>
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>

                <div className="text-left pt-2 w-2/12 mt-16">
                    Prepared By:
                </div>
                <div className="  border-t  border-black mt-10 text-center w-2/12 ">
                    {currProfile.first_name} {currProfile.middle_name}{" "}
                    {currProfile.last_name}
                </div>
                
            </div>
        </div>
    );
}

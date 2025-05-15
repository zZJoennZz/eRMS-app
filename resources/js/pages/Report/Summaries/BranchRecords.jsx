import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function BranchRecords({ reportData, filters }) {
    const { currProfile, branchDetails } = useContext(AuthContext);

    // Group documents by box number
    const groupedByBox = {};

    reportData.forEach((record) => {
        const boxNumber = record.box_number;
        if (!groupedByBox[boxNumber]) {
            groupedByBox[boxNumber] = [];
        }

        record.documents.forEach((doc) => {
            groupedByBox[boxNumber].push({
                ...doc,
                recordDate: record.created_at,
            });
        });
    });

    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div>
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    SUMMARY OF RECORDS{" "}
                    <div  className="text-l text-center">
                    {JSON.parse(filters).scope === "branch_only" && "BUSINESS UNIT"}
                    {JSON.parse(filters).scope === "warehouse_only" &&
                        "RECORDS CENTER"}
                    {JSON.parse(filters).scope === "both" &&
                        "BUSINESS UNIT AND RECORDS CENTER"}{" "}
                    </div>
                </div>
                <div className="text-lg font-bold text-center mt-1 mb-5">
                    {branchDetails.name}
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-.5/5 p-2">
                                Box Number
                            </th>
                            <th className="border-r border-black w-.75/4 p-2">
                                RDS Item Number
                            </th>
                            <th className="border-r border-black w-3/5 p-2">
                                Record Series Title and Description
                            </th>
                            <th className="border-r border-black w-1/5 p-2">
                                Period Covered
                            </th>
                            <th className="border-black w-1/5 p-2">
                                Record Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedByBox).map(([boxNumber, docs]) =>
                            docs.map((doc, index) => (
                                <tr
                                    key={doc.id}
                                    className="border-b border-black"
                                >
                                    {index === 0 ? (
                                        <td
                                            className="border-r border-black p-2"
                                            rowSpan={docs.length}
                                        >
                                            {boxNumber}
                                        </td>
                                    ) : null}
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
                                        {formatDate(doc.recordDate)}
                                    </td>
                                </tr>
                            ))
                        )}
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

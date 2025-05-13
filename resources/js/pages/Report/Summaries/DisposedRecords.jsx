import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function DisposedRecords({ reportData }) {
    const { currProfile, branchDetails } = useContext(AuthContext);

    // Group documents by box number
    const groupedByBox = {};

    reportData.forEach((d) => {
        d.items.forEach((item) => {
            const boxNumber = item.record.box_number;
            if (!groupedByBox[boxNumber]) {
                groupedByBox[boxNumber] = [];
            }

            item.record.documents.forEach((doc) => {
                groupedByBox[boxNumber].push({
                    ...doc,
                    disposalDate: d.created_at,
                });
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
                    SUMMARY OF DISPOSED RECORDS
                </div>
                <div className="text-lg font-bold text-center mt-1 mb-5">
                    {branchDetails.name}
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-1/5 p-2">
                                Box Number
                            </th>
                            <th className="border-r border-black w-1/5 p-2">
                                RDS
                            </th>
                            <th className="border-r border-black w-1/5 p-2">
                                Source of Documents
                            </th>
                            <th className="border-r border-black w-2/5 p-2">
                                Description of Documents
                            </th>
                            <th className="border-black w-1/5 p-2">
                                Disposal Date
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
                                        {doc.source_of_documents}
                                    </td>
                                    <td className="border-r border-black p-2">
                                        {doc.description_of_document}
                                    </td>
                                    <td className="border-black p-2">
                                        {formatDate(doc.disposalDate)}
                                    </td>
                                </tr>
                            ))
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

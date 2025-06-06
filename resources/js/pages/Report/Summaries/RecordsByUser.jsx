import React, { useContext } from "react";
import { formatDate } from "../../../utils/utilities";
import { AuthContext } from "../../../contexts/AuthContext";

export default function RecordsByUser({ reportData }) {
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
                projectedDisposal:
                    record.documents[0].projected_date_of_disposal,
            });
        });
    });

    const submittedUser = reportData[0]?.submitted_by_user?.profile;

    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div>
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    SUMMARY OF RECORDS
                </div>
                <div className="mt-1 mb-4 text-center font-bold">
                    {submittedUser &&
                        `${submittedUser.first_name} ${submittedUser.middle_name} ${submittedUser.last_name}`}
                </div>
                <div className="text-lg font-bold text-center mt-1 mb-5">
                    {branchDetails.name}
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-.90/3 p-2">
                                Box Number
                            </th>
                            <th className="border-r border-black w-2/3 p-2">
                                Record Series Title and Description
                            </th>
                            <th className="border-black w-1/3 p-2">
                                Projected Date of Disposal
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedByBox).map(([boxNumber, docs]) =>
                            docs.map((doc, index) => (
                                <tr
                                    key={doc.id + index}
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
                                        {doc.description_of_document}
                                    </td>
                                    <td className="p-2">
                                        {formatDate(doc.projectedDisposal)}
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

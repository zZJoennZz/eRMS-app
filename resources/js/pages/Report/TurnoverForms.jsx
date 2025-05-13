import React, { useEffect, useState } from "react";
import { API_URL } from "../../configs/config";
import { formatDate } from "../../utils/utilities";
import landbankLogo from "../../img/landbank_logo.jpeg";

const TurnoverForms = () => {
    const [turnoverDetails, setTurnoverDetails] = useState({});
    const [branchHead, setBranchHead] = useState({});
    const [branchDetails, setBranchDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getRdsRecords() {
            await axios
                .get(`${API_URL}turnover-report`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let recordData = res.data.data;
                    setTurnoverDetails(recordData.turnover);
                    setBranchHead(recordData.branch_head);
                    setBranchDetails(recordData.branch);
                })
                .finally(() => {
                    setIsLoading(false);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getRdsRecords();

        return () => {
            source.cancel();
        };
    }, []);
    let rowCtr = 0;
    if (isLoading) return "Loading...";
    return (
        <>
            <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
                <div className="block">
                    <div className="text-2xl font-bold text-right">CLASS D</div>
                    <div className="italic text-lg font-bold text-right">
                        Exhibit 2
                    </div>
                </div>
                <div className="mt-5 text-center font-bold text-lg">
                    TURN-OVER OF RECORDS/DOCUMENTS FORM
                </div>
                <div className="mb-3">
                    <p>
                        <strong>Date:</strong>{" "}
                        <u>{formatDate(turnoverDetails.created_at)}</u>
                    </p>
                </div>
                <div className="my-2">
                    <p className="float-end">
                        <strong>Unit:</strong> <u>{branchDetails.name}</u>
                    </p>
                    <p>
                        <strong>Position Title:</strong>{" "}
                        <u>Records Custodian</u>
                    </p>
                </div>
                <div className="my-2">
                    <p>
                        <strong>Job Designation:</strong>{" "}
                        <u>Customer Associate</u>
                    </p>
                </div>
                <div className="flex justify-between my-2">
                    <div className="w-4/12">
                        <strong>Status of Designation:</strong>{" "}
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            checked={
                                turnoverDetails.designation_status ===
                                "PERMANENT"
                            }
                            disabled
                        />{" "}
                        Permanent
                    </div>
                    <div>
                        <strong>Assumption Date:</strong>{" "}
                        <u>{turnoverDetails.assumption_date}</u>
                    </div>
                </div>
                <div className="flex justify-between my-2">
                    <div className="text-white w-4/12"></div>
                    <div>
                        <input
                            type="checkbox"
                            checked={
                                turnoverDetails.designation_status ===
                                "TEMPORARY"
                            }
                            disabled
                        />{" "}
                        Temporary
                    </div>
                    <div>
                        <strong>From:</strong>{" "}
                        <u>{turnoverDetails.from_date ?? "___________"}</u>
                        <strong>to:</strong>{" "}
                        <u>{turnoverDetails.to_date ?? "___________"}</u>
                    </div>
                </div>
                <div className="flex justify-between my-2">
                    <div className="text-white w-4/12"></div>
                    <div>
                        <input
                            type="checkbox"
                            checked={
                                turnoverDetails.designation_status ===
                                "CO_TERMINUS"
                            }
                            disabled
                        />{" "}
                        Co-terminus
                    </div>
                    <div className="opacity-0">
                        From:{" "}
                        <u>{turnoverDetails.from_date ?? "___________"}</u>
                        to: <u>{turnoverDetails.to_date ?? "___________"}</u>
                    </div>
                </div>
                <div className="flex justify-between my-2">
                    <div className="text-white w-4/12"></div>
                    <div>
                        <input
                            type="checkbox"
                            checked={
                                turnoverDetails.designation_status ===
                                "DIRECTLY_HIRED_CONTRACTUAL"
                            }
                            disabled
                        />{" "}
                        Directly-hired Contractual
                    </div>
                    <div className="opacity-0">1123123123123</div>
                </div>

                <div className="flex my-2 space-x-3 items-center">
                    <div className="flex w-8/12 space-x-3">
                        <div className="font-bold">
                            Outgoing Record Custodian:
                        </div>
                        <div className="flex-grow border-b border-black">
                            {turnoverDetails.added_by_user.profile.first_name}{" "}
                            {turnoverDetails.added_by_user.profile.middle_name}{" "}
                            {turnoverDetails.added_by_user.profile.last_name}
                        </div>
                    </div>
                    <div className="flex w-4/12 space-x-3">
                        <div className="font-bold">I.D. No.:</div>
                        <div className="flex-grow border-b border-black">
                            {turnoverDetails.current_job_holder_id}
                        </div>
                    </div>
                </div>

                <div className="flex my-2 space-x-3 items-center">
                    <div className="flex w-8/12 space-x-3">
                        <div className="font-bold">
                            Incoming Record Custodian:
                        </div>
                        <div className="flex-grow border-b border-black">
                            {turnoverDetails.user.profile.first_name}{" "}
                            {turnoverDetails.user.profile.middle_name}{" "}
                            {turnoverDetails.user.profile.last_name}
                        </div>
                    </div>
                    <div className="flex w-4/12 space-x-3">
                        <div className="font-bold">I.D. No.:</div>
                        <div className="flex-grow border-b border-black">
                            {turnoverDetails.incoming_job_holder_id}
                        </div>
                    </div>
                </div>

                <table className="w-full border border-black mt-4">
                    <thead>
                        <tr>
                            <th className="border border-black w-1/12 p-1">
                                <div className="text-lg font-bold">
                                    Box Number
                                </div>
                            </th>
                            <th className="border border-black w-5/12 p-1">
                                <div className="text-lg font-bold">
                                    Record Series Title and Description
                                </div>
                            </th>
                            <th className="border border-black w-2/12">
                                <div className="text-lg font-bold">
                                    Location
                                </div>
                                <div className="font-bold italic">
                                    (e.g., Branch Unit, Record Center)
                                </div>
                            </th>
                            <th className="border border-black w-2/12">
                                <div className="text-lg font-bold">
                                    Remarks, if any
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                        <td className="border-r border-black p-1">1</td>
                        <td className="border-r border-black p-1">1</td>
                        <td className="border-r border-black p-1">1</td>
                        <td className="p-1">1</td>
                    </tr> */}
                        {turnoverDetails.items.map((item) =>
                            item.rds_record.documents.map((doc) => (
                                <tr key={item.id + "id" + doc.id}>
                                    <td className="border-r border-b border-black p-1">
                                        {item.rds_record.box_number}
                                    </td>
                                    <td className="border-r border-b border-black p-1">
                                        {doc.description_of_document}
                                    </td>
                                    <td className="border-r border-b border-black p-1">
                                        {item.rds_record.latest_history
                                            .location === "Warehouse"
                                            ? "Record Center"
                                            : item.rds_record.latest_history
                                                  .location}
                                    </td>
                                    <td className="border-b border-black p-1"></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="italic text-center mt-1">
                    <strong>Note:</strong> Name of File/Document should follow
                    the given Record Series Title as stated in the Records
                    Disposition Schedule of the Bank.
                </div>

                <div className="mt-5 mb-2">
                    I hereby certify that I have delivered the following
                    documents to{" "}
                    <u>
                        {turnoverDetails.user.profile.first_name}{" "}
                        {turnoverDetails.user.profile.middle_name}{" "}
                        {turnoverDetails.user.profile.last_name}
                    </u>
                    , as the officially assigned personnel who will continue the
                    transaciton/operations.
                </div>

                <div className="mt-10 flex space-x-3">
                    <div className="w-1/3">
                        <div className="text-lg font-bold mb-16">
                            TURNED-OVER BY:
                        </div>
                        <div className="border-b border-black text-center">
                            {turnoverDetails.added_by_user.profile.first_name}{" "}
                            {turnoverDetails.added_by_user.profile.middle_name}{" "}
                            {turnoverDetails.added_by_user.profile.last_name}
                        </div>
                        <div className="text-center font-bold italic">
                            Printed Name and Signature of Current Record
                            Custodian
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="text-lg font-bold mb-16">
                            ACKNOWLEDGED BY:
                        </div>
                        <div className="border-b border-black text-center">
                            {turnoverDetails.user.profile.first_name}{" "}
                            {turnoverDetails.user.profile.middle_name}{" "}
                            {turnoverDetails.user.profile.last_name}
                        </div>
                        <div className="text-center font-bold italic">
                            Printed Name and Signature of Incoming Record
                            Custodian
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="text-lg font-bold mb-16">NOTED BY:</div>
                        <div className="border-b border-black text-center">
                            {branchHead.profile.first_name}{" "}
                            {branchHead.profile.middle_name}{" "}
                            {branchHead.profile.last_name}
                        </div>
                        <div className="text-center font-bold italic">
                            Printed Name and Signature of Department Head or
                            next level higher
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1 force-next-page">
                <div className="block">
                    <div className="text-2xl font-bold text-right">CLASS D</div>
                    <div className="italic text-lg font-bold text-right">
                        Exhibit 2
                    </div>
                </div>
                <img src={landbankLogo} className="w-10 h-10 inline mr-3" />{" "}
                <div className="inline text-lg font-bold">
                    LANDBANK OF THE PHILIPPINES
                </div>
                <div className="my-10">
                    <div className="font-bold text-lg text-center">
                        TURN-OVER OF RECORDS TO SUCCESSOR
                    </div>
                </div>
                <div className="w-10/12 m-auto text-justify">
                    I hereby certify that I have delivered the following
                    documents to{" "}
                    <u>
                        {turnoverDetails.user.profile.first_name}{" "}
                        {turnoverDetails.user.profile.middle_name}{" "}
                        {turnoverDetails.user.profile.last_name}
                    </u>
                    , as the officially assigned personnel who will continue the
                    transaciton/operations:
                    <div className="mt-5">
                        <div>Record Series:</div>
                        {turnoverDetails.items.map((item) => (
                            <div key={item.id}>
                                {item.rds_record.box_number}
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex space-x-16">
                        <div className="w-1/2">
                            <div className="border-b border-black text-center">
                                {
                                    turnoverDetails.added_by_user.profile
                                        .first_name
                                }{" "}
                                {
                                    turnoverDetails.added_by_user.profile
                                        .middle_name
                                }{" "}
                                {
                                    turnoverDetails.added_by_user.profile
                                        .last_name
                                }
                                , Records Custodian
                            </div>
                            <div className="text-center font-bold italic">
                                Name and Position
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="border-b border-black text-white text-center">
                                -
                            </div>
                            <div className="text-center font-bold italic">
                                Date Accomplished
                            </div>
                        </div>
                    </div>
                    <div className="my-5">
                        I hereby certify that I have received the abovementioned
                        documents from{" "}
                        <u>
                            {turnoverDetails.added_by_user.profile.first_name}{" "}
                            {turnoverDetails.added_by_user.profile.middle_name}{" "}
                            {turnoverDetails.added_by_user.profile.last_name}
                        </u>
                    </div>
                    <div className="mt-10 flex space-x-16">
                        <div className="w-1/2">
                            <div className="border-b border-black text-center">
                                {turnoverDetails.user.profile.first_name}{" "}
                                {turnoverDetails.user.profile.middle_name}{" "}
                                {turnoverDetails.user.profile.last_name}
                            </div>
                            <div className="text-center font-bold italic">
                                Name and Position
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="border-b border-black text-white text-center">
                                -
                            </div>
                            <div className="text-center font-bold italic">
                                Date Accomplished
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 flex space-x-16">
                        <div className="w-1/2">
                            <div className="mb-5">Attested by:</div>
                            <div className="border-b border-black text-center">
                                {branchHead.profile.first_name}{" "}
                                {branchHead.profile.middle_name}{" "}
                                {branchHead.profile.last_name}
                            </div>
                            <div className="text-center font-bold italic">
                                Department Head
                            </div>
                        </div>
                        <div className="w-1/2"></div>
                    </div>
                    <div className="mt-10 border-t border-black text-xs">
                        Turn-over of Records to Successor Form
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default TurnoverForms;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../configs/config";
import { formatDate } from "../../utils/utilities";

const DisposedRecordsForm = () => {
    const { id } = useParams();
    const [recordDisposal, setRecordDisposal] = useState({});
    const [branchHead, setBranchHead] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getRdsRecords() {
            await axios
                .get(`${API_URL}disposals/print/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let recordData = res.data.data.disposal_form;
                    let bhData = res.data.data.branch_head;
                    setRecordDisposal(recordData);
                    setBranchHead(bhData);
                })
                .then(() => {
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

    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            {!isLoading && recordDisposal.status === "PENDING" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <span className="text-9xl font-bold text-gray-500 rotate-45">
                        PENDING
                    </span>
                </div>
            )}
            <div className="float-right">Accomplish in 3 copies</div>
            <div>NAP Form No.3</div>
            <div>Revised 2012</div>
            <table className="w-full border border-black mt-4">
                <thead>
                    <tr>
                        <th colSpan={4} className="p-0">
                            <table className="w-full p-0">
                                <thead>
                                    <tr>
                                        <th rowSpan={2}>
                                            <div className="font-bold">
                                                NATIONAL ARCHIVES OF THE
                                                PHILIPPINES
                                            </div>
                                            <div className="mb-4 italic font-normal">
                                                Pambansang Sinupan ng Pilipinas
                                            </div>
                                            <div className="mb-5">
                                                REQUEST FOR AUTHORITY TO DISPOSE{" "}
                                                <br />
                                                OF RECORDS
                                            </div>
                                        </th>
                                        <th className="border-l border-black p-1 align-top w-1/2">
                                            <div className="text-left text-xs mb-5">
                                                AGENCY NAME:
                                            </div>
                                            <div className="text-left text-xs uppercase">
                                                {!isLoading &&
                                                    recordDisposal.user.branch
                                                        .agency_name}
                                            </div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="border-t border-l border-black p-1">
                                            <div className="text-left text-xs mb-5">
                                                ADDRESS:
                                            </div>
                                            <div className="text-left text-xs uppercase">
                                                {!isLoading &&
                                                    recordDisposal.user.branch
                                                        .full_address}
                                            </div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="border-t border-r border-black align-top text-left p-1">
                                            <div className="text-left text-xs">
                                                DATE:
                                            </div>
                                            <div className="text-left text-xs uppercase mb-2">
                                                {formatDate(
                                                    !isLoading &&
                                                        recordDisposal.created_at
                                                )}
                                            </div>
                                        </th>
                                        <th className="border-t border-black p-1">
                                            <div className="text-left text-xs">
                                                TELEPHONE NUMBER:
                                            </div>
                                            <div className="text-left text-xs uppercase mb-2">
                                                {!isLoading &&
                                                    recordDisposal.user.branch
                                                        .telephone_number}
                                            </div>
                                            <div className="text-left text-xs">
                                                EMAIL ADDRESS:
                                            </div>
                                            <div className="text-left text-xs">
                                                {!isLoading &&
                                                    recordDisposal.user.branch
                                                        .email_address}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                        </th>
                    </tr>
                    <tr>
                        <th className="border border-black w-1/12 p-1">
                            GRDS/RDS ITEM NO.
                        </th>
                        <th className="border border-black w-5/12">
                            RECORD SERIES TITLE AND DESCRIPTION
                        </th>
                        <th className="border border-black w-3/12">
                            PERIOD COVERED
                        </th>
                        <th className="border border-black w-3/12">
                            RETENTION PERIOD AND PROVISION/S COMPLIED (If any)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading &&
                        recordDisposal.items.map((item) =>
                            item.record.documents.map((doc) => {
                                return (
                                    <tr key={doc.id}>
                                        <td className="border-r border-black p-2 text-xs">
                                            {doc.rds.item_number}
                                        </td>
                                        <td className="border-r border-black p-2">
                                            {doc.description_of_document}
                                            <pre>
                                                {
                                                    doc.rds
                                                        .record_series_title_and_description_1
                                                }
                                            </pre>
                                        </td>
                                        <td className="border-r border-black p-2 text-xs">
                                            {doc.period_covered_from} to{" "}
                                            {doc.period_covered_to}
                                        </td>
                                        <td className="border-r border-black p-2">
                                            {doc.rds.remarks}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2" className="border border-black p-2">
                            <div className="text-left text-xs mb-5 font-bold">
                                LOCATION OF RECORDS:
                            </div>
                            <div className="text-left text-xs uppercase">
                                {!isLoading &&
                                    recordDisposal.user.branch.agency_name}
                            </div>
                        </td>
                        <td colSpan="2" className="border border-black p-2">
                            <div className="text-left text-xs mb-5 font-bold">
                                VOLUME IN CUBIC METER:
                            </div>
                            <div className="text-left text-xs">
                                {!isLoading && recordDisposal.items.length} No.
                                of boxes x 0.0349 ={" "}
                                {!isLoading &&
                                    recordDisposal.items.length * 0.0349}{" "}
                                cu. m.
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" className="border border-black p-2">
                            <div className="text-left text-xs mb-5 font-bold">
                                PREPARED BY:
                            </div>
                            <div className="text-left text-xs uppercase">
                                {!isLoading &&
                                    recordDisposal.user.profile.first_name +
                                        " " +
                                        recordDisposal.user.profile
                                            .middle_name +
                                        " " +
                                        recordDisposal.user.profile.last_name}
                            </div>
                        </td>
                        <td colSpan="2" className="border border-black p-2">
                            <div className="text-left text-xs mb-5 font-bold">
                                POSITION:
                            </div>
                            <div className="text-left text-xs uppercase">
                                {!isLoading &&
                                    recordDisposal.user.profile.position.name}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td
                            colSpan="4"
                            className="border-r border-black text-center p-1"
                        >
                            <div className="text-left text-xs mb-5 font-bold">
                                CERTIFIED AND APPROVED BY:
                            </div>
                            <div className="text-xs">
                                This is to certify that the above-mentioned
                                records are no longer needed and
                                <br /> are not involved in any administrative or
                                judicial cases.
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}></td>
                        <td colSpan="2">
                            <div className="w-10/12 border-b border-black mt-10 text-center">
                                {!isLoading &&
                                    branchHead.profile.first_name +
                                        " " +
                                        branchHead.profile.middle_name +
                                        " " +
                                        branchHead.profile.last_name}
                            </div>
                            <div className="text-center w-10/12 text-xs">
                                Name and Signature of Agency Head
                            </div>
                            <div className="text-center w-10/12 text-xs mb-2">
                                or Duly Authorized Representative
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default DisposedRecordsForm;

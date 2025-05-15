import React, { useContext, useEffect, useState } from "react";
import { formatDate } from "../../utils/utilities";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { API_URL } from "../../configs/config";

export default function DisposalReport() {
    const { type } = useParams();
    const { currProfile, branchDetails } = useContext(AuthContext);
    const [reportData, setReportData] = useState();

    useEffect(() => {
        console.log(branchDetails);
        const source = axios.CancelToken.source();
        async function getReportData() {
            await axios
                .get(`${API_URL}disposal-reports`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let fetchedReport = res.data.data;
                    setReportData(fetchedReport);
                    console.log(fetchedReport);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getReportData();

        return () => {
            source.cancel();
        };
    }, []);

    if (!reportData) return <>Loading...</>;

    let reportToRun = type === "overdue" ? reportData.overdue_disposals : reportData.upcoming_disposals;

    return (
        <div className="p-4 w-full max-w-4xl mx-auto text-sm font-sans print:m-0 print:p-1">
            <div className="text-sm mb-5">
                <div className="float-right font-bold italic text-xl">
                    CLASS D
                </div>
                eRMS Report
                <div className="text-xl font-bold text-center mt-10">
                    {type === "overdue" && "RECORDS DUE FOR DISPOSAL"}
                    {type === "upcoming" && "UPCOMING RECORDS FOR DISPOSAL"}
                </div>
                <div className="mt-1 text-center">
                    {branchDetails.name}
                </div>
            </div>
            <div>
                <table className="w-full border border-black text-left">
                <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black w-2/12 p-2">BOX NUMBER</th>
                            <th className="border-r border-black w-3/12 p-2">PROJECTED DATE OF DISPOSAL</th>
                            {type === "overdue" && <th className="border-r border-black w-2/12 p-2">AGING</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {reportToRun.map((d) => {
                            const projectedDate = new Date(d.documents[0].projected_date_of_disposal);
                            const now = new Date();
                            const diffTime = now - projectedDate;
                            const agingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

                            return (
                                <tr key={d.id} className="border-b border-black">
                                    <td className="border-r border-black p-2">{d.box_number}</td>
                                    <td className="border-r border-black p-2">
                                        {d.documents[0].projected_date_of_disposal}
                                    </td>
                                    {type === "overdue" && <td className="border-r border-black p-2">
                                        {agingDays} days
                                    </td>}
                                </tr>
                            );
                        })}
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

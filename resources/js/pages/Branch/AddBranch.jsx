import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_URL } from "../../configs/config";

import { post } from "../../utils/branchFn";
import { AuthContext } from "../../contexts/AuthContext";

export default function AddBranch({ closeHandler }) {
    const { userType } = useContext(AuthContext);

    const [branchDetail, setBranchDetail] = useState({
        code: "",
        name: "",
        others: "",
        clusters_id: 0,
        is_warehouse: false,
    });
    const [allClusters, setAllClusters] = useState([]);

    const queryClient = useQueryClient();

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getAllClusters() {
            await axios
                .get(`${API_URL}clusters`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let clustersData = res.data.data;
                    setAllClusters(clustersData);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getAllClusters();

        return () => {
            source.cancel();
        };
    }, []);

    function frmFieldHandler(e) {
        setBranchDetail((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    const saveBranch = useMutation({
        mutationFn: () => post(branchDetail),
        onSuccess: () => {
            setBranchDetail({
                code: "",
                name: "",
                others: "",
                clusters_id: 0,
            });
            queryClient.invalidateQueries({ queryKey: ["allBranches"] });
            toast.success("Branch successfully created!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function submitBranch(e) {
        e.preventDefault();
        saveBranch.mutate();
    }

    return (
        <>
            <form onSubmit={submitBranch}>
                <div
                    className="p-5 overflow-y-scroll"
                    style={{ maxHeight: "80vh" }}
                >
                    <div className="font-semibold mb-4">Branch Details</div>
                    <div className="mb-4">
                        <div className="mb-1">
                            Is Record Center?
                            <div className="text-xs italic text-slate-600">
                                Enable to mark as Record Center.
                            </div>
                        </div>
                        <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={branchDetail.is_warehouse}
                                    onChange={() =>
                                        setBranchDetail({
                                            ...branchDetail,
                                            is_warehouse:
                                                !branchDetail.is_warehouse,
                                        })
                                    }
                                />
                                <div
                                    className={`w-11 h-6 rounded-full transition-colors duration-300 
          ${branchDetail.is_warehouse ? "bg-blue-600" : "bg-gray-300"} 
          ${
              branchDetail.is_warehouse
                  ? "peer-checked:bg-green-600"
                  : "peer-checked:bg-blue-600"
          }`}
                                ></div>
                                <div
                                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform 
          ${branchDetail.is_warehouse ? "translate-x-5" : "translate-x-0"}`}
                                ></div>
                            </label>
                        </div>
                    </div>
                    {!branchDetail.is_warehouse && (
                        <div className="mb-4">
                            <div className="mb-1">
                                <label htmlFor="name">
                                    Name <span className="text-red-700">*</span>
                                </label>
                                <div className="text-xs italic text-slate-600">
                                    This will appear in reports and dashboard
                                    like the location of the box!
                                </div>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={branchDetail.name}
                                    onChange={frmFieldHandler}
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    {!branchDetail.is_warehouse && (
                        <div className="mb-4">
                            <div className="mb-1">
                                <label htmlFor="code">Code</label>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="code"
                                    id="code"
                                    value={branchDetail.code}
                                    onChange={frmFieldHandler}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="clusters_id">
                                Group <span className="text-red-700">*</span>
                            </label>
                            <div className="text-xs italic text-slate-600">
                                This will not appear anywhere but it is
                                important to select the CORRECT group for this
                                branch.
                            </div>
                        </div>
                        <div>
                            <select
                                type="text"
                                name="clusters_id"
                                id="clusters_id"
                                value={branchDetail.clusters_id}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            >
                                <option value="0">
                                    Please select this branch's group
                                </option>
                                {allClusters.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="md:absolute md:bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
                    <button
                        type="submit"
                        className={`${
                            saveBranch.isLoading
                                ? "bg-gray-400 hover:bg-gray-300"
                                : "bg-lime-600 hover:bg-lime-500"
                        } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                        disabled={saveBranch.isLoading}
                    >
                        {saveBranch.isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
}

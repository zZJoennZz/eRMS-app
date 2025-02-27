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

    const saveUser = useMutation({
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

    function submitUser(e) {
        e.preventDefault();
        saveUser.mutate();
    }

    return (
        <>
            <form onSubmit={submitUser}>
                <div
                    className="p-5 overflow-y-scroll"
                    style={{ maxHeight: "80vh" }}
                >
                    <div className="font-semibold mb-4">Branch Details</div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="name">
                                Name <span className="text-red-700">*</span>
                            </label>
                            <div className="text-xs italic text-slate-600">
                                This will appear in reports and dashboard like
                                the location of the box!
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
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="clusters_id">
                                Cluster <span className="text-red-700">*</span>
                            </label>
                            <div className="text-xs italic text-slate-600">
                                This will not appear anywhere but it is
                                important to select the CORRECT cluster for this
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
                                    Please select this branch's cluster
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
                <div className="absolute bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
                    <button
                        type="submit"
                        className={`${
                            saveUser.isLoading
                                ? "bg-gray-400 hover:bg-gray-300"
                                : "bg-lime-600 hover:bg-lime-500"
                        } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                        disabled={saveUser.isLoading}
                    >
                        {saveUser.isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
}

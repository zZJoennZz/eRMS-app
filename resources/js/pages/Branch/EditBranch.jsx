import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_URL } from "../../configs/config";

import { put, getBranch } from "../../utils/branchFn";
import { AuthContext } from "../../contexts/AuthContext";

export default function EditBranch({ closeHandler, selBranchId, rerender }) {
    const { userType } = useContext(AuthContext);

    const [branchDetail, setBranchDetail] = useState({
        code: "",
        name: "",
        others: "",
    });
    const queryClient = useQueryClient();

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getBranch() {
            await axios
                .get(`${API_URL}branches/${selBranchId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let branchData = res.data.data;
                    setBranchDetail({
                        code: branchData.code,
                        name: branchData.name,
                    });
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getBranch();

        return () => {
            source.cancel();
        };
    }, [rerender]);

    function frmFieldHandler(e) {
        setBranchDetail((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    const saveBranch = useMutation({
        mutationFn: () => put(branchDetail, selBranchId),
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

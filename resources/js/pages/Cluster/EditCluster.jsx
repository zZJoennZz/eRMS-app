import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_URL } from "../../configs/config";

import { update } from "../../utils/clusterFn";
import { AuthContext } from "../../contexts/AuthContext";

export default function EditCluster({ closeHandler, selClusterId, rerender }) {
    const { userType } = useContext(AuthContext);

    const [cluster, setCluster] = useState("");

    const queryClient = useQueryClient();

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getCluster() {
            await axios
                .get(`${API_URL}clusters/${selClusterId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let clusterData = res.data.data;
                    setCluster(clusterData.name);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getCluster();

        return () => {
            source.cancel();
        };
    }, [rerender]);

    const saveCluster = useMutation({
        mutationFn: () => update({ cluster }, selClusterId),
        onSuccess: () => {
            setCluster("");
            queryClient.invalidateQueries({ queryKey: ["allClusters"] });
            toast.success("Group successfully updated!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function submitCluster(e) {
        e.preventDefault();
        saveCluster.mutate();
    }

    return (
        <>
            <form onSubmit={submitCluster}>
                <div
                    className="p-5 overflow-y-scroll"
                    style={{ maxHeight: "80vh" }}
                >
                    <div className="font-semibold mb-4">Group Details</div>

                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="name">
                                Name <span className="text-red-700">*</span>
                            </label>
                            <div className="text-xs italic text-slate-600">
                                This will NOT appear in reports. This is only
                                for internal identification.
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={cluster}
                                onChange={(e) => setCluster(e.target.value)}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
                    <button
                        type="submit"
                        className={`${
                            saveCluster.isLoading
                                ? "bg-gray-400 hover:bg-gray-300"
                                : "bg-lime-600 hover:bg-lime-500"
                        } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                        disabled={saveCluster.isLoading}
                    >
                        {saveCluster.isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
}

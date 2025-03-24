import { useState, useEffect, useContext } from "react";
import { UserIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { API_URL } from "../configs/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { switchPos } from "../utils/positionFn";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

export default function PositionSwitcher({ profileId }) {
    const { currProfile } = useContext(AuthContext);
    const [selectedPosition, setSelectedPosition] = useState("Developer");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [positions, setPositions] = useState([]);

    const queryClient = useQueryClient();

    const handleSwitch = async (position) => {
        if (position === selectedPosition) return;
        setLoading(true);
        await onSwitch(position);
        setSelectedPosition(position);
        setLoading(false);
        setIsOpen(false);
    };

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getAllPositions() {
            await axios
                .get(`${API_URL}get-positions/${profileId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let positionsData = res.data.data;
                    setPositions(positionsData);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getAllPositions();

        return () => {
            source.cancel();
        };
    }, []);

    const switchPosition = useMutation({
        mutationFn: (id) => switchPos(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["acctSummary"] });
            toast.success("Switching position successful!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function confirmSwitchPos(id) {
        if (confirm("Are you sure to switch position?")) {
            switchPosition.mutate(id);
        }
    }

    return (
        <div className="fixed bottom-1/2 left-12 transform -translate-x-1/2 flex items-center z-50">
            <div className="relative flex items-center gap-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 flex items-center justify-center border border-lime-500 rounded-full shadow-lg bg-green-700 hover:bg-lime-600 transition-all ${
                        isOpen ? "rounded-l-full rounded-r-none pl-4 pr-6" : ""
                    }`}
                    disabled={loading}
                >
                    {loading ? (
                        <RefreshIcon className="w-6 h-6 animate-spin text-white" />
                    ) : (
                        <UserIcon className="w-6 h-6 text-white" />
                    )}
                </button>
                {isOpen && (
                    <div className="absolute left-full flex flex-col w-48 bg-green-800 border border-lime-500 rounded-lg shadow-lg z-10 text-sm overflow-hidden ml-2">
                        {positions &&
                            positions.map((position) => (
                                <div
                                    key={position.id}
                                    onClick={() =>
                                        confirmSwitchPos(position.id)
                                    }
                                    className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-lime-600 transition-all text-white"
                                >
                                    {position.position.name}{" "}
                                    <ChevronRightIcon className="w-5 h-5 text-white" />
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

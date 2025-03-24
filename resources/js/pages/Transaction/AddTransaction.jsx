import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { API_URL } from "../../configs/config";

import { post } from "../../utils/transactionFn";
import { AuthContext } from "../../contexts/AuthContext";

export default function AddTransaction({ closeHandler }) {
    const { userType } = useContext(AuthContext);
    const [transaction, setTransaction] = useState({
        type: "",
        remarks: "",
    });
    const [records, setRecords] = useState([]);
    const [cart, setCart] = useState([]);

    const queryClient = useQueryClient();

    const toggleCart = (product) => {
        if (cart.some((item) => item.id === product.id)) {
            setCart(cart.filter((item) => item.id !== product.id));
        } else {
            setCart([...cart, product]);
        }
    };

    function frmFieldHandler(e) {
        setTransaction((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getRdsRecords() {
            await axios
                .get(`${API_URL}rds-records`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let recordData = res.data.data;
                    setRecords(recordData);
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

    const saveRdsRecord = useMutation({
        mutationFn: () =>
            post({
                transaction,
                cart,
            }),
        onSuccess: () => {
            setTransaction({
                type: "",
                receiver: 0,
                issuer: 0,
                remarks: "",
            });
            queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
            toast.success("Transaction successfully recorded!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function submitRds(e) {
        e.preventDefault();
        saveRdsRecord.mutate();
    }

    return (
        <>
            <form onSubmit={submitRds}>
                <div
                    className="p-5 overflow-y-scroll"
                    style={{ maxHeight: "80vh" }}
                >
                    <div className="font-semibold mb-4">
                        Transaction Details
                    </div>
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="type">Transaction Type</label>
                        </div>
                        <div>
                            <select
                                type="text"
                                name="type"
                                id="type"
                                value={transaction.type}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            >
                                <option>Select type of transaction!</option>

                                {userType === "EMPLOYEE" ? (
                                    <>
                                        <option value="BORROW">Borrow</option>
                                        <option value="RETURN">Return</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="TRANSFER">
                                            Transfer
                                        </option>
                                        <option value="WITHDRAW">
                                            Withdraw
                                        </option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                    {transaction.type === "TRANSFER" && (
                        <div className="mb-4">
                            <div className="mb-1">
                                <label htmlFor="warehouse">To:</label>
                            </div>
                            <div>Warehouse</div>
                        </div>
                    )}
                    {transaction.type === "WITHDRAW" && (
                        <div className="mb-4">
                            <div className="mb-1">
                                <label htmlFor="warehouse">From:</label>
                            </div>
                            <div>Warehouse</div>
                        </div>
                    )}
                    {transaction.type === "BORROW" && (
                        <div className="mb-4">
                            <div className="mb-1">
                                <label htmlFor="records-custodian">From:</label>
                            </div>
                            <div>Records Custodian</div>
                        </div>
                    )}
                    {transaction.type === "RETURN" && (
                        <div className="mb-4">
                            <div className="mb-1">
                                <label htmlFor="records-custodian">To:</label>
                            </div>
                            <div>Records Custodian</div>
                        </div>
                    )}
                    <div className="mb-1">
                        <label>Box Numbers:</label>
                    </div>
                    {transaction.type === "TRANSFER" &&
                        records.map(
                            (record) =>
                                record.status === "APPROVED" &&
                                record.history[0].location !== "Warehouse" &&
                                record.documents.filter(
                                    (doc) => doc.current_status === "AVAILABLE"
                                ).length === record.documents.length && (
                                    <div className="mb-4" key={record.id}>
                                        <li className="flex justify-between py-1">
                                            {record.box_number}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleCart(record)
                                                }
                                                className={`ml-2 px-2 py-1 transition-all duration-500 rounded ${
                                                    cart.some(
                                                        (item) =>
                                                            item.id ===
                                                            record.id
                                                    )
                                                        ? "bg-red-500 text-white"
                                                        : "bg-blue-500 text-white"
                                                }`}
                                            >
                                                {cart.some(
                                                    (item) =>
                                                        item.id === record.id
                                                )
                                                    ? "Remove"
                                                    : "Add to List"}
                                            </button>
                                        </li>
                                    </div>
                                )
                        )}

                    {transaction.type === "WITHDRAW" &&
                        records.map(
                            (record) =>
                                record.status === "APPROVED" &&
                                record.history[0].location === "Warehouse" && (
                                    <div className="mb-4" key={record.id}>
                                        <li className="flex justify-between py-1">
                                            {record.box_number}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleCart(record)
                                                }
                                                className={`ml-2 px-2 py-1 transition-all duration-500 rounded ${
                                                    cart.some(
                                                        (item) =>
                                                            item.id ===
                                                            record.id
                                                    )
                                                        ? "bg-red-500 text-white"
                                                        : "bg-blue-500 text-white"
                                                }`}
                                            >
                                                {cart.some(
                                                    (item) =>
                                                        item.id === record.id
                                                )
                                                    ? "Remove"
                                                    : "Add to List"}
                                            </button>
                                        </li>
                                    </div>
                                )
                        )}
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="remarks">Remarks</label>
                        </div>
                        <div>
                            <textarea
                                name="remarks"
                                id="remarks"
                                value={transaction.remarks}
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
                            saveRdsRecord.isLoading
                                ? "bg-gray-400 hover:bg-gray-300"
                                : "bg-lime-600 hover:bg-lime-500"
                        } transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
                        disabled={saveRdsRecord.isLoading}
                    >
                        {saveRdsRecord.isLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </>
    );
}

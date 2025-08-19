import { useState } from "react";
import { API_URL } from "../../configs/config";
import axios from "axios";
import { toast } from "react-toastify";
import {
    EyeIcon,
    EyeSlashIcon,
    ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

export default function ForceChangePassword() {
    const [isShowNewPw, setIsShowNewPw] = useState(false);
    const [isShowConfirmPw, setIsShowConfirmPw] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    function onChangeHandler(e) {
        setPasswordData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handlePasswordChange(e) {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirmation password don't match");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}force-reset-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            alert("Password changed successfully! PLEASE RE-LOGIN!");
            window.location.reload();
        } catch (err) {
            if (err.response) {
                toast.error(
                    err.response.data.message || "Failed to change password"
                );
            } else {
                toast.error("Network error. Please try again.");
            }
        }
    }

    return (
        <>
            <div className="bg-gradient-to-tr from-lime-700 to-green-400 h-screen flex flex-col">
                <div className="m-auto bg-white p-5 rounded-lg shadow-lg bg-opacity-70 w-11/12 md:w-auto">
                    <div className="text-center font-bold mb-4">
                        Change Your Password
                    </div>
                    <form onSubmit={handlePasswordChange}>
                        <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={onChangeHandler}
                            className="w-full mb-3"
                            placeholder="Current password"
                            required
                        />
                        <input
                            type={isShowNewPw ? "text" : "password"}
                            name="newPassword"
                            id="newPassword"
                            value={passwordData.newPassword}
                            onChange={onChangeHandler}
                            className="w-full mb-3"
                            placeholder="New password"
                            required
                        />
                        <input
                            type={isShowConfirmPw ? "text" : "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={onChangeHandler}
                            className="w-full mb-3"
                            placeholder="Confirm new password"
                            required
                        />
                        <div className="flex space-x-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setIsShowNewPw(!isShowNewPw)}
                                className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full"
                            >
                                {isShowNewPw ? (
                                    <>
                                        <EyeSlashIcon className="w-4 h-4 inline" />{" "}
                                        Hide New
                                    </>
                                ) : (
                                    <>
                                        <EyeIcon className="w-4 h-4 inline" />{" "}
                                        Show New
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsShowConfirmPw(!isShowConfirmPw)
                                }
                                className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full"
                            >
                                {isShowConfirmPw ? (
                                    <>
                                        <EyeSlashIcon className="w-4 h-4 inline" />{" "}
                                        Hide Confirm
                                    </>
                                ) : (
                                    <>
                                        <EyeIcon className="w-4 h-4 inline" />{" "}
                                        Show Confirm
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="mb-3 flex justify-center">
                            <button
                                type="submit"
                                className="text-white bg-lime-700 hover:bg-lime-600 hover:rounded transition-all ease-in-out duration-300 px-3 py-2 flex items-center rounded-lg"
                            >
                                Change Password
                                <ChevronDoubleRightIcon className="inline ml-2 w-4 h-4" />
                            </button>
                        </div>
                    </form>
                    <div className="text-gray-400 italic text-xs text-center">
                        Password must be at least 8 characters long.
                    </div>
                </div>
            </div>
        </>
    );
}

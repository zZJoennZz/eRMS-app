import { useState, useContext } from "react";
import { toast } from "react-toastify";

import logo from "../img/erms-logo.png";

import axios from "axios";
import { API_URL } from "../configs/config";

import { AuthContext } from "../contexts/AuthContext";

import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";

export default function Login() {
    const [loginCredentials, setLoginCredentials] = useState({
        username: "",
        password: "",
    });

    const { isAuth, changeAuth, userType } = useContext(AuthContext);

    function onChangeHandler(e) {
        setLoginCredentials((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    async function performLogin(e) {
        e.preventDefault();
        axios
            .post(`${API_URL}login`, loginCredentials)
            .then((res) => {
                console.log(res);
                localStorage.setItem("token", "Bearer " + res.data.data.token);

                changeAuth(true, res.data.data.id);
                toast.success("Login success!");
            })
            .catch((err) => {
                if (err.name && err.name === "AxiosError") {
                    toast.error(err.response.data.message);
                    localStorage.removeItem("token");
                }
            });
    }

    return (
        <>
            <div className="bg-gradient-to-tr from-lime-700 to-green-400 h-screen flex flex-col">
                <div className="m-auto bg-white p-5 rounded-lg shadow-lg bg-opacity-70 w-11/12 md:w-auto">
                    <div>
                        <img
                            src={logo}
                            alt="Land Bank Logo"
                            className="w-40 m-auto mb-5"
                        />
                    </div>
                    <form onSubmit={performLogin}>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            value={loginCredentials.username}
                            onChange={onChangeHandler}
                            className="w-full mb-3"
                            placeholder="Enter your username"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            value={loginCredentials.password}
                            onChange={onChangeHandler}
                            className="w-full mb-3"
                            placeholder="Enter your password"
                            required
                        />
                        <div className="mb-3 flex justify-end">
                            <button className="text-white bg-lime-700 hover:bg-lime-600 hover:rounded transition-all ease-in-out duration-300 px-3 py-2 flex items-center rounded-lg">
                                Login{" "}
                                <ChevronDoubleRightIcon className="inline ml-2 w-4 h-4" />
                            </button>
                        </div>
                    </form>
                    <div className="text-gray-400 italic text-xs">
                        Having issues? Please contact the web developer.
                    </div>
                </div>
            </div>
        </>
    );
}

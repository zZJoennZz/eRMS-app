import Lottie from "lottie-react";
import DashboardLayout from "../components/DashboardLayout";
import unauthorizedAnimation from "../assets/unauthorizedAnimation.json";

export default function Unauthorized() {
    return (
        <DashboardLayout>
            <h1 className="text-center text-3xl mt-10 font-bold text-red-500">
                Uh oh!
            </h1>
            <p className="text-xl text-center text-slate-700">
                You are not allowed to access this page!
            </p>
            <div className="text-center mt-3">
                <a
                    href="/dashboard"
                    className="text-white rounded-full px-3 py-2 bg-gradient-to-r from-orange-600 to-yellow-500 shadow-slate-300 shadow-xl transition-all ease-in-out duration-500 hover:shadow-none hover:from-slate-200 hover:to-slate-50 hover:text-orange-800 hover:border hover:border-orange-700"
                >
                    {`<`} Go back to dashboard
                </a>
            </div>
            <div className="w-10/12 object-contain m-auto py-20">
                <Lottie
                    animationData={unauthorizedAnimation}
                    loop={true}
                    className="w-1/2 m-auto my-12"
                />
            </div>
        </DashboardLayout>
    );
}

import "./bootstrap";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//pages
import Root from "./root";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("app")).render(
    <QueryClientProvider client={queryClient}>
        <Router>
            <Root />
        </Router>
        <ToastContainer
            autoClose={3000}
            closeOnClick
            pauseOnHover
            theme="colored"
            position="bottom-right"
        />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
);

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
    getWarehouseTurnovers,
    submitWarehouseTurnover,
} from "../../utils/warehouseTurnoverFn";

export default function WarehouseTurnover() {
    const [turnovers, setTurnovers] = useState([]);
    const [formData, setFormData] = useState({
        selectedEmployee: "",
        designationStatus: "",
        assumptionDate: "",
        fromDate: "",
        toDate: "",
    });

    useEffect(() => {
        async function fetchTurnovers() {
            const data = await getWarehouseTurnovers();
            setTurnovers(data);
        }
        fetchTurnovers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitWarehouseTurnover(formData);
        alert("Warehouse Turnover submitted!");
    };

    return (
        <DashboardLayout>
            <h1>Warehouse Turnover</h1>
            <form onSubmit={handleSubmit}>
                {/* Form Fields */}
                <button type="submit">Submit</button>
            </form>
            <div>
                <h2>Past Turnovers</h2>
                <ul>
                    {turnovers.map((turnover) => (
                        <li key={turnover.id}>{turnover.status}</li>
                    ))}
                </ul>
            </div>
        </DashboardLayout>
    );
}

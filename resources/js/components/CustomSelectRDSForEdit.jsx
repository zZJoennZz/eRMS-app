import React from "react";

export default function CustomSelectRDSForEdit({
    rds,
    index,
    handleInputChange,
    selectedValue,
}) {
    return (
        <select
            name="records_disposition_schedules_id"
            value={selectedValue || ""}
            onChange={(e) => handleInputChange(index, e)}
            className="w-full border-gray-300 rounded-md shadow-sm"
            required
        >
            <option disabled value="">
                Select RDS
            </option>
            {rds.length > 0 ? (
                rds.map((rdsItem) => (
                    <option key={rdsItem.id} value={rdsItem.id}>
                        {rdsItem.item_number} -{" "}
                        {rdsItem.record_series_title_and_description}
                    </option>
                ))
            ) : (
                <option>NO RDS AVAILABLE</option>
            )}
        </select>
    );
}

import { useState } from "react";

const SearchableDropdown = ({ record, rds, index, handleInputChange }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // Filter options based on search term
    const filteredRds = rds.filter(
        (r) =>
            r.item_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.record_series_title_and_description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    // Handle input change
    const handleSelect = (selectedRds) => {
        handleInputChange(index, {
            target: {
                name: "records_disposition_schedules_id",
                value: selectedRds.id,
            },
        });
        setSearchTerm(
            `${selectedRds.item_number} - ${selectedRds.record_series_title_and_description}`
        );
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full">
            {/* Searchable Input */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Select RDS"
                required
            />

            {/* Dropdown */}
            {showDropdown && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg z-10">
                    {filteredRds.length > 0 ? (
                        filteredRds.map((rdsItem) => (
                            <li
                                key={rdsItem.id}
                                onClick={() => handleSelect(rdsItem)}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                            >
                                {rdsItem.item_number} -{" "}
                                {rdsItem.record_series_title_and_description}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">No RDS Available</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableDropdown;

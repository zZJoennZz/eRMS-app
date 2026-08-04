export function strPad(str, pad_length, pad_string, pad_type) {
    const len = pad_length - str.length;
    if (len < 0) return str;
    const pad = new Array(len + 1).join(pad_string);
    if (pad_type === "STR_PAD_LEFT") return pad + str;
    return str + pad;
}
export function updateItemArray(
    oldArray,
    itemIdToUpdate,
    updatedValues,
    isRegularCart = true
) {
    // Find the index of the item with the given ID
    const index = oldArray.findIndex((item) =>
        isRegularCart
            ? item.itemId === itemIdToUpdate
            : item.id === itemIdToUpdate
    );
    // If the item is not found, return the original array
    if (index === -1) return oldArray;
    // Create a new array with the updated item values
    const newArray = [...oldArray];
    newArray[index] = { ...newArray[index], ...updatedValues };
    return newArray;
}

export function formatDate(getDate) {
    let date = new Date(getDate);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
}

export function formatToPhp(number) {
    // Check if the input is a valid number
    if (isNaN(number)) {
        throw new Error("Invalid input. Please provide a valid number.");
    }

    // Convert the number to a fixed-point representation with two decimal places
    const fixedNumber = parseFloat(number).toFixed(2);

    // Split the number into integer and decimal parts
    const [integerPart, decimalPart] = fixedNumber.split(".");

    // Add a comma separator for thousands in the integer part
    const formattedIntegerPart = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
    );

    // Concatenate the integer and decimal parts with the PHP currency symbol
    const formattedNumber = `₱${formattedIntegerPart}.${decimalPart}`;

    return formattedNumber;
}

export function calculateAging(fromDate) {
    const startDate = new Date(fromDate);
    const endDate = new Date();

    // Calculate difference in milliseconds
    const diffInMs = endDate - startDate;

    // Convert milliseconds to days
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
}

/**
 * Custom Native Date Formatter
 * @param {string|Date} dateString 
 * @returns {string} formatted date
 */
export const formatAuditDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    
    // Check for invalid dates
    if (isNaN(date.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
};

/**
 * Returns a simple string for file naming (YYYYMMDD_HHMM)
 */
export const getFileTimestamp = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    
    const y = now.getFullYear();
    const m = pad(now.getMonth() + 1);
    const d = pad(now.getDate());
    const h = pad(now.getHours());
    const min = pad(now.getMinutes());
    
    return `${y}${m}${d}_${h}${min}`;
};
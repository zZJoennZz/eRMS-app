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
        .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")} ${
        date.getHours() % 12 || 12
    }:${date.getMinutes().toString().padStart(2, "0")}${
        date.getHours() < 12 ? "AM" : "PM"
    }`;
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

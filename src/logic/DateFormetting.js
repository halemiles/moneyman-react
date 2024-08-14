export function formatDateToMonthYear(dateString) {
    console.log(dateString);
    // Parse the input date string into a Date object
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date)) {
        return "Invalid Date";
    }

    // Define an array of month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get the month and year from the date object
    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    // Return the formatted date string
    const final =  `${day}/${month}`;
    console.log(final);
    return final;
}
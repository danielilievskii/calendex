export const calculateDaysBetween = (startDate, endDate) => { //from 2025-01-27 to 2025-01-29 -> 2
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInMs = end.getTime() - start.getTime();
    return Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
}

export const calculateWeeksBetween = (startDate, endDate) => { //from 2025-02-02 to 2025-02-19 -> 2
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInMs = end.getTime() - start.getTime();
    return Math.ceil(differenceInMs / (1000 * 60 * 60 * 24 * 7)) - 1;
}

export const calculateYearsBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end.getFullYear() - start.getFullYear() - (end < new Date(start.getFullYear(), end.getMonth(), end.getDate()) ? 1 : 0);
};

export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

export function getNumValueForICSDay(targetDay) {
    const icsDayMap = {
        'SU': 6, // Sunday
        'MO': 0, // Monday
        'TU': 1, // Tuesday
        'WE': 2, // Wednesday
        'TH': 3, // Thursday
        'FR': 4, // Friday
        'SA': 5  // Saturday
    };
    return icsDayMap[targetDay] ?? null;
}

export const getNumValueForJSDay = (JSDay) => {
    switch (JSDay) {
        case 0: { // Sunday
            return 6;
        }
        case 1: { // Monday
            return 0;
        }
        case 2: { // Tuesday
            return 1;
        }
        case 3: { // Wednesday
            return 2;
        }
        case 4: { // Thursday
            return 3
        }
        case 5: { // Friday
            return 4
        }
        case 6: {  // Saturday
            return 5
        }
    }
}

export const formatDate = (date) => {
    return new Date(date).toLocaleString('en-CA').split(",")[0];
}

export const formatDuration = (startDateTime, endDateTime) => {
    let startHours = startDateTime.getHours();
    let startMinutes = startDateTime.getMinutes();

    let endHours = endDateTime.getHours();
    let endMinutes = endDateTime.getMinutes();

    const suffixStart = startHours >= 12 ? 'PM' : 'AM';
    const suffixEnd = endHours >= 12 ? 'PM' : 'AM';

    if (startHours > 12) {
        startHours -= 12;
    } else if (startHours === 0) {
        startHours = 12;
    }

    if (endHours > 12) {
        endHours -= 12;
    } else if (endHours === 0) {
        endHours = 12;
    }

    return `${startHours.toString()}:${startMinutes.toString().padStart(2, "0")} ${suffixStart} - ${endHours.toString()}:${endMinutes.toString().padStart(2, "0")} ${suffixEnd}`
}
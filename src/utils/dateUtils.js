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

export const calculateMonthsBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth();

    return yearsDiff * 12 + monthsDiff - (end < new Date(start.getFullYear(), start.getMonth(), end.getDate()) ? 1 : 0);
};

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

export const getFullDay = (short) => {
    const daysMap = {
        "MO": "Monday",
        "TU": "Tuesday",
        "WE": "Wednesday",
        "TH": "Thursday",
        "FR": "Friday",
        "SA": "Saturday",
        "SU": "Sunday"
    };

    return daysMap[short] || "Invalid day";
}


export const extractDateISOFromObj = (dateTimeObj) => {
    const localDateTime = dateTimeObj.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        millisecond: '3-digit',
        hour12: false,
        timeZoneName: 'short'
    }).replace(/,/g, '').replace(' ', 'T');

    let date = localDateTime.split("T")[0].split("/")

    return date[2] + '-' + date[0] + '-' + date[1] ;
};

export const extractDateISOFromString = (dateTime) => {
    const localDateTime = new Date(dateTime).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        millisecond: '3-digit',
        hour12: false,
        timeZoneName: 'short'
    }).replace(/,/g, '').replace(' ', 'T');

    let date = localDateTime.split("T")[0].split("/")

    return date[2] + '-' + date[0] + '-' + date[1] ;
};

export const extractTimeFromObj = (dateTimeObj) => {
    const localDateTime = dateTimeObj.toLocaleString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });

    const [hours, minutes] = localDateTime.split(':').map((part) => parseInt(part));
    return hours + minutes / 60;
}
export const subtractOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    return newDate;
}

export const isSameDate = (date1, date2) => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

export const formatFromStringToDateISO = (date) => {
    return new Date(date).toLocaleString(undefined).split(",")[0];
}

export const formatFromStringToDateTime = (date) => {
    return new Date(date).toLocaleString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

export const formatFromStringToDate = (date) => {
    return new Date(date).toLocaleString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export const formatFromStringToDateShort = (date) => {
    return new Date(date).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
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

export const formatDurationToString = (duration) => {
    if(typeof duration === 'object' && duration !== null) {
        const weeks = duration.weeks || 0;
        const days = duration.days || 0;
        const hours = duration.hours || 0;
        const minutes = duration.minutes || 0;
        const seconds = duration.seconds || 0;

        const parts = [];
        if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

        return parts.length > 0 ? parts.join(', ') : 'None';
    }
}
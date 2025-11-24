import {
    calculateDaysBetween,
    calculateWeeksBetween,
    calculateYearsBetween,
    getNumValueForICSDay,
    getNumValueForJSDay,
} from "@/utils/dateUtils.js";

export const getSingleDayEvents = (normalizedEvents) => (date) => {
    return normalizedEvents.filter((event) => {
        if (event.startDate === event.endDate) {
            if (!event.endsNever) {
                return event.startDate === date;
            } else {
                return handleNeverEndingEvent(event, date);
            }
        }
    });
};

export const getMultiDayEvents = (normalizedEvents) => (date) => {
    return normalizedEvents.filter((event) => {
        const targetDate = new Date(date);

        if (event.startDate !== event.endDate) {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            return start <= targetDate && targetDate <= end;
        }
    });
};

const handleNeverEndingEvent = (event, date) => {
    switch (event.freq) {
        case 'DAILY':
            return handleDailyNeverEnding(event, date);
        case 'WEEKLY':
            return handleWeeklyNeverEnding(event, date);
        case 'MONTHLY':
            return handleMonthlyNeverEnding(event, date);
        case 'YEARLY':
            return handleYearlyNeverEnding(event, date);
        default:
            return false;
    }
};

const handleDailyNeverEnding = (event, date) => {
    if (date >= event.startDate) {
        if (!event.interval) {
            return true;
        } else {
            const days = calculateDaysBetween(event.startDate, date);
            return days % event.interval === 0;
        }
    }
    return false;
};

const handleWeeklyNeverEnding = (event, date) => {
    if (date >= event.startDate) {
        const byDays = typeof event.byDay === 'string' ? [event.byDay] : event.byDay;
        const dateJS = new Date(date);
        const targetWeekDay = getNumValueForJSDay(dateJS.getDay());

        for (let day of byDays) {
            const eventWeekDay = getNumValueForICSDay(day);
            if (!event.wkst) {
                if (eventWeekDay === targetWeekDay) return true;
            } else {
                const weeks = calculateWeeksBetween(event.startDate, date) + 1;
                if (weeks % (event.wkst + 1) === 0) {
                    if (eventWeekDay === targetWeekDay) return true;
                }
            }
        }
    }
    return false;
};

const handleMonthlyNeverEnding = (event, date) => {
    if (date >= event.startDate) {
        // Handle monthly logic here if needed
        return false;
    }
    return false;
};

const handleYearlyNeverEnding = (event, date) => {
    if (date >= event.startDate) {
        const dateJS = new Date(date);
        const eventStartJS = new Date(event.startDate);

        if (!event.interval) {
            if (dateJS.getMonth() === eventStartJS.getMonth() &&
                dateJS.getDate() === eventStartJS.getDate()) {
                return true;
            }
        } else {
            const years = calculateYearsBetween(event.startDate, date);
            if (dateJS.getMonth() === eventStartJS.getMonth() &&
                dateJS.getDate() === eventStartJS.getDate()) {
                return years % event.interval === 0;
            }
        }
    }
    return false;
};


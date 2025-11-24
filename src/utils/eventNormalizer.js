import { format } from "date-fns";
import {
    calculateDaysBetween,
    calculateWeeksBetween,
    calculateMonthsBetween,
    calculateYearsBetween,
    getDaysInYear,
    getNumValueForICSDay,
    getNumValueForJSDay,
} from "@/utils/dateUtils.js";

export const normalizeEvents = (rawEvents) => {
    const normalizedEvents = [];

    rawEvents.forEach(event => {
        if (event.startDate === event.endDate && !event.freq) {
            normalizedEvents.push(event);
        } else {
            if (!event.freq) {
                handleMultiDayEvents(normalizedEvents, event);
            } else {
                switch (event.freq) {
                    case 'DAILY':
                        handleDailyFrequency(normalizedEvents, event);
                        break;
                    case 'WEEKLY':
                        handleWeeklyFrequency(normalizedEvents, event);
                        break;
                    case 'MONTHLY':
                        handleMonthlyFrequency(normalizedEvents, event);
                        break;
                    case 'YEARLY':
                        handleYearlyFrequency(normalizedEvents, event);
                        break;
                }
            }
        }
    });

    return normalizedEvents;
};

const handleMultiDayEvents = (normalizedEvents, event) => {
    normalizedEvents.push(event);
};

const handleDailyFrequency = (normalizedEvents, event) => {
    if (event.until) {
        const days = calculateDaysBetween(event.startDate, event.until) + 1;
        handleDailyEvents(normalizedEvents, event, days, event.interval ?? 1);
    } else if (event.count) {
        const days = event.count
        handleDailyEvents(normalizedEvents, event, days, event.interval ?? 1);
    } else {
        normalizedEvents.push({...event, endsNever: true});
    }
};

const handleWeeklyFrequency = (normalizedEvents, event) => {
    if (event.until) {
        const weeks = calculateWeeksBetween(event.startDate, event.until) + 1;
        handleWeeklyEvents(normalizedEvents, event, weeks, event.wkst ? event.wkst + 1 : undefined);
    } else if (event.count) {
        const weeks = event.count
        handleWeeklyEvents(normalizedEvents, event, weeks, event.wkst ? event.wkst + 1 : undefined);
    } else {
        normalizedEvents.push({...event, endsNever: true});
    }
};

const handleMonthlyFrequency = (normalizedEvents, event) => {
    if (event.until) {
        const months = calculateMonthsBetween(event.startDate, event.until);
        handleMonthlyEvents(normalizedEvents, event, months, event.interval ?? 1);
    } else if (event.count) {
        handleMonthlyEvents(normalizedEvents, event, event.count, event.interval ?? 1);
    } else {
        normalizedEvents.push({...event, endsNever: true});
    }
};

const handleYearlyFrequency = (normalizedEvents, event) => {
    if (event.until) {
        const years = calculateYearsBetween(event.startDate, event.until) + 1;
        handleYearlyEvents(normalizedEvents, event, years, event.interval ?? 1);
    } else if (event.count) {
        handleYearlyEvents(normalizedEvents, event, event.count, event.interval ?? 1);
    } else {
        normalizedEvents.push({...event, endsNever: true});
    }
};

const handleDailyEvents = (normalizedEvents, event, days, interval = 1) => {

    // Destruct event in multiple objects for each day
    if (event.startDate === event.endDate) {
        for (let i = 0; i < days; i++) {
            const newStartDate = new Date(event.startDate);
            newStartDate.setDate(newStartDate.getDate() + (i * interval));
            const newStartDateISO = format(newStartDate, "yyyy-MM-dd");

            // Ensure the event is within the valid recurrence range
            if (!event.until || newStartDateISO <= event.untilISO) {
                normalizedEvents.push({
                    ...event,
                    uid: event.uid + '' + i,
                    startDate: newStartDateISO,
                    endDate: newStartDateISO,
                    multiDay: false,
                    freq: null
                });
            }
        }
    } else {
        // Scenario when the duration is more than 24hours, but happens daily
    }
};

const handleWeeklyEvents = (normalizedEvents, event, weeks, interval = 1) => {

    // Destruct event in multiple objects for each week
    if (event.startDate === event.endDate) {
        for (let i = 0; i < weeks; i++) {
            const byDays = typeof event.byDay === 'string' ? [event.byDay] : event.byDay;

            for (let day of byDays) {
                const newStartDate = new Date(event.startDate);
                const startWeekDay = getNumValueForJSDay(newStartDate.getDay());
                const eventWeekDay = getNumValueForICSDay(day);

                let daysBetween = eventWeekDay - startWeekDay;
                newStartDate.setDate(newStartDate.getDate() + (i * 7 * interval) + daysBetween);

                const newStartDateISO = format(newStartDate, "yyyy-MM-dd");

                // Ensure the event is within the valid recurrence range
                if (newStartDateISO >= event.startDate && (!event.until || newStartDateISO <= event.untilISO)) {
                    normalizedEvents.push({
                        ...event,
                        uid: event.uid + '' + i,
                        startDate: newStartDateISO,
                        endDate: newStartDateISO,
                        multiDay: false,
                        freq: null
                    });
                }
            }
        }
    } else {
        // Scenario when the duration is more than 24hours, but happens weekly
    }
};

const handleMonthlyEvents = (normalizedEvents, event, months, interval = 1) => {

    // Destruct event in multiple objects for each month
    if (event.startDate === event.endDate) {

        const daysMap = {
            SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6
        };

        for (let i = 0; i < months; i++) {
            const newStartDate = new Date(event.startDate);

            if (typeof event.byDay === 'string') {
                // Handle events occurring on specific weekdays ("1SU" for first Sunday)

                const match = event.byDay.match(/^(-?\d+)([A-Z]{2})$/);
                if (match) {
                    const weekNumber = parseInt(match[1], 10);
                    const weekDayStr = match[2];
                    const weekDayNum = daysMap[weekDayStr];

                    newStartDate.setMonth(newStartDate.getMonth() + (i * interval));

                    if (weekNumber > 0) {
                        // Handling positive week numbers ("2MO" = second Monday)

                        newStartDate.setDate(1); // First day of the month

                        let count = 0;
                        while (count < weekNumber) {
                            if (newStartDate.getDay() === weekDayNum) {
                                count++;
                            }
                            if (count < weekNumber) {
                                newStartDate.setDate(newStartDate.getDate() + 1);
                            }
                        }
                    } else {
                        // Handling negative week numbers ("-1SU" = last Sunday)

                        newStartDate.setMonth(newStartDate.getMonth() + 1, 0); // Last day of the month

                        let count = 0;

                        while (count > weekNumber) {
                            if (newStartDate.getDay() === weekDayNum) {
                                count--;
                            }
                            if (count > weekNumber) {
                                newStartDate.setDate(newStartDate.getDate() - 1);
                            }
                        }
                    }
                }
            } else if (typeof event.byMonthDay === 'number') {
                // Handle events occurring on a specific day of the month
                newStartDate.setMonth(newStartDate.getMonth() + (i * interval));
            }

            const newStartDateISO = format(newStartDate, "yyyy-MM-dd");

            // Ensure the event is within the valid recurrence range
            if (newStartDateISO >= event.startDate && (!event.until || newStartDateISO <= event.untilISO)) {
                normalizedEvents.push({
                    ...event,
                    uid: event.uid + '' + i,
                    startDate: newStartDateISO,
                    endDate: newStartDateISO,
                    freq: null
                });
            }
        }
    } else {
        // Scenario when the duration is more than 24hours, but happens monthly
    }
};

const handleYearlyEvents = (normalizedEvents, event, years, interval = 1) => {

    // Destruct event in multiple objects for each year
    if (event.startDate === event.endDate) {
        for (let i = 0; i < years; i++) {
            const newStartDate = new Date(event.startDate);
            const year = newStartDate.getFullYear();
            const daysInYear = getDaysInYear(year);

            newStartDate.setDate(newStartDate.getDate() + (i * daysInYear * interval));
            const newStartDateISO = format(newStartDate, "yyyy-MM-dd");

            // Ensure the event is within the valid recurrence range
            if (!event.until || newStartDateISO <= event.untilISO) {
                normalizedEvents.push({
                    ...event,
                    uid: event.uid + '' + i,
                    startDate: newStartDateISO,
                    endDate: newStartDateISO,
                    multiDay: false,
                    freq: null
                });
            }
        }
    } else {
        // Scenario when the duration is more than 24hours, but happens yearly
    }
};
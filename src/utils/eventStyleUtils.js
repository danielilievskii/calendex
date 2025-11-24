import {extractDateISOFromObj, getNumValueForJSDay} from "@/utils/dateUtils.js";

export const getSingleDayEventStyle = (event, date, filteredEventsByDate) => {
    const overlappingEvents = filteredEventsByDate.filter(e => {
        return e.startTime < event.endTime && e.endTime > event.startTime;
    });

    overlappingEvents.sort((a, b) => a.startTime - b.startTime);
    const index = overlappingEvents.findIndex(e => e.uid === event.uid);

    let baseWidth = 90;
    let width = baseWidth / (2 ** index);
    let left = 5;

    for (let i = 0; i < index; i++) {
        left += baseWidth / (2 ** (i + 1));
    }

    return {
        top: `${event.startTime * 50}px`,
        height: `${(event.endTime - event.startTime) * 50}px`,
        width: `${width}%`,
        left: `${left}%`,
        zIndex: Math.round(event.startTime),
    };
};

export const getMultiDayEventStyle = (event, date) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (event.endTime === 0) {
        endDate.setDate(endDate.getDate() - 1);
    }

    const targetDate = new Date(date);
    const targetWeekDay = getNumValueForJSDay(targetDate.getDay());
    const targetWeekStartDate = new Date(targetDate);
    targetWeekStartDate.setDate(targetWeekStartDate.getDate() - targetWeekDay);
    const weekStartDateISO = targetWeekStartDate.toISOString().split('T')[0];

    const targetWeekEndDate = new Date(targetWeekStartDate);
    targetWeekEndDate.setDate(targetWeekEndDate.getDate() + 6);

    const startWeekDay = getNumValueForJSDay(startDate.getDay());
    const endWeekDay = getNumValueForJSDay(endDate.getDay());

    if (startDate <= targetDate && targetDate <= endDate) {
        const baseStyle = { height: '30px' };
        const rowIndex = getWeekRowTracker(event, weekStartDateISO);

        const getGridStyle = {
            gridRowStart: rowIndex,
            gridColumnStart: targetWeekStartDate >= startDate ? 1 : startWeekDay + 1,
            gridColumnEnd: targetWeekEndDate <= endDate ? 8 : endWeekDay + 2
        };

        if (date === event.startDate && date === extractDateISOFromObj(endDate)) {
            return {
                ...baseStyle,
                ...getGridStyle,
                borderLeft: `2px solid ${event.calendarColor}`,
                borderTopLeftRadius: '5px',
                borderBottomLeftRadius: '5px',
                borderRight: `2px solid ${event.calendarColor}`,
                borderTopRightRadius: '5px',
                borderBottomRightRadius: '5px',
                left: '5%',
                right: '5%',
            };
        }

        if (date === event.startDate) {
            return {
                ...baseStyle,
                ...getGridStyle,
                borderLeft: `2px solid ${event.calendarColor}`,
                borderTopLeftRadius: '5px',
                borderBottomLeftRadius: '5px',
                left: '5%',
            };
        }

        if (date === extractDateISOFromObj(endDate)) {
            return {
                ...baseStyle,
                ...getGridStyle,
                borderRight: `2px solid ${event.calendarColor}`,
                borderTopRightRadius: '5px',
                borderBottomRightRadius: '5px',
                right: '5%',
            };
        }

        if (date !== event.startDate && date !== extractDateISOFromObj(endDate)) {
            return {
                ...baseStyle,
                ...getGridStyle,
            };
        }
    }

    return { display: 'none' };
};

const getWeekRowTracker = (() => {
    let weekTrackers = {};

    return (event, weekDate) => {
        if (!weekTrackers[weekDate]) {
            weekTrackers[weekDate] = {
                eventRows: {},
                currentRow: 1,
            };
        }

        const weekTracker = weekTrackers[weekDate];

        if (!weekTracker.eventRows[event.uid]) {
            weekTracker.eventRows[event.uid] = weekTracker.currentRow;
            weekTracker.currentRow += 1;
        }

        return weekTracker.eventRows[event.uid];
    };
})();
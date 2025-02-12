import ICAL from 'ical.js';
import {
    extractDateISOFromObj,
    extractDateISOFromString,
    extractTimeFromObj,
    formatDurationToString,
    formatDuration
} from "@/utils/dateUtils.js";

/**
 * Extracts events from an ICS file content and converts them into a structured format.
 * @param icsContent The raw ICS file content as a string.
 * @returns Array of event objects
 */
export const extractEvents = (icsContent) => {
    const jcalData = ICAL.parse(icsContent);
    const vcalendar = new ICAL.Component(jcalData);
    const vevents = vcalendar.getAllSubcomponents('vevent');

    return vevents.map(event => {
        const icalEvent = new ICAL.Event(event);

        return {
            uid: icalEvent.uid,
            startDateTime: icalEvent.startDate.toJSDate(),
            startDate: extractDateISOFromObj(icalEvent.startDate.toJSDate()),
            startTime: extractTimeFromObj(icalEvent.startDate.toJSDate()),
            endDateTime: icalEvent.endDate.toJSDate(),
            endDate: extractDateISOFromObj(icalEvent.endDate.toJSDate()),
            endTime: extractTimeFromObj(icalEvent.endDate.toJSDate()),
            freq: icalEvent.component.jCal[1][2][3].freq ?? null,
            until: icalEvent.component.jCal[1][2][3].until ?? null,
            untilISO: icalEvent.component.jCal[1][2][3].until ? extractDateISOFromString(icalEvent.component.jCal[1][2][3].until) : null,
            count: icalEvent.component.jCal[1][2][3].count ?? null,
            interval: icalEvent.component.jCal[1][2][3].interval ?? null,
            wkst: icalEvent.component.jCal[1][2][3].wkst ?? null,
            byDay: icalEvent.component.jCal[1][2][3].byday ?? [],
            byMonthDay: icalEvent.component.jCal[1][2][3].bymonthday ?? null,
            duration: formatDurationToString(icalEvent.duration),
            formattedDuration: formatDuration(icalEvent.startDate.toJSDate(), icalEvent.endDate.toJSDate()),
            summary: icalEvent.summary,
            description: icalEvent.description,
            location: icalEvent.location,
            sequence: icalEvent.sequence,
            organizer: icalEvent.organizer,
            attendees: icalEvent.attendees,
        };
    });
};
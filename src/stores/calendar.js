import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendar', {
    state: () => ({
        calendars: [],
        filteredEvents: []
    }),
    actions: {
        addCalendar(calendar) {
            this.calendars.push(calendar)
        },
        updateFilteredEvents(selectedCalendars) {
            if(selectedCalendars.length > 0) {
                this.filteredEvents = this.calendars
                    .filter(cal => selectedCalendars.includes(cal.name))
                    .map(cal => cal.events
                        .map(event => ({
                        ...event,
                        calendarName: cal.name
                    }))
                    )
                    .flat()
            } else {
                this.filteredEvents = []
            }
        },

    },

});
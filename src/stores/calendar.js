import { defineStore } from 'pinia';
import { toRaw } from 'vue';
export const useCalendarStore = defineStore('calendar', {
    state: () => ({
        calendars: JSON.parse(localStorage.getItem('calendars')) || [],
        filteredEvents: []
    }),
    actions: {
        addCalendar(calendar) {
            const newCalendar = {
                uid: calendar.uid,
                name: calendar.name,
                color: calendar.color || '#000000',
                type: calendar.type,
                selected: calendar.selected,
                url: calendar.url,
                events: toRaw(calendar.events).map(event => ({
                    ...toRaw(event),
                    duration: event.duration?.toString() || event.duration,
                }))
            };

            this.calendars.push(newCalendar);
            this.saveToLocalStorage();
        },
        editCalendar(calendar, id) {
            const index = this.calendars.findIndex(calendar => calendar.uid === id);
            if (index !== -1) {
                this.calendars[index] = {
                    uid: calendar.uid,
                    name: calendar.name,
                    color: calendar.color || '#000000',
                    type: calendar.type,
                    selected: calendar.selected,
                    url: calendar.url,
                    events: toRaw(calendar.events).map(event => ({
                        ...toRaw(event),
                        duration: event.duration?.toString() || event.duration,
                    }))
                };
                this.saveToLocalStorage();

            }
        },
        deleteCalendar(uid) {
            this.calendars = this.calendars.filter(calendar => calendar.uid !== uid);
            this.saveToLocalStorage();
        },
        selectCalendar(uid) {
            const index = this.calendars.findIndex(calendar => calendar.uid === uid);
            if(index !== -1) {
                this.calendars[index].selected = !this.calendars[index].selected;
                this.saveToLocalStorage();
            }

        },
        updateFilteredEvents(selectedCalendars) {
            // this.calendars.forEach(cal => {
            //     cal.selected = selectedCalendars.includes(cal.uid);
            // });
            // this.saveToLocalStorage()

            if(selectedCalendars.length > 0) {
                this.filteredEvents = this.calendars
                    .filter(cal => selectedCalendars.includes(cal.uid))
                    .map(cal => cal.events
                        .map(event => ({
                        ...event,
                        calendarName: cal.name,
                        calendarColor: cal.color
                    }))
                    )
                    .flat()
            } else {
                this.filteredEvents = []
            }
        },


        saveToLocalStorage() {
            console.log("Saving to localStorage:", this.calendars);
            localStorage.setItem('calendars', JSON.stringify(this.calendars));
        },
        getCalendarById(id) {
            return this.calendars.find(calendar => calendar.uid === id);
        }
    },
});
import {defineStore} from 'pinia';
import {toRaw} from 'vue';
import {extractEvents} from "@/utils/icsParser.js";
import {corsProxyUrl} from "@/config/config.js";
import {useToast} from '@/components/ui/toast/use-toast'

const {toast} = useToast();
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
            if (index !== -1) {
                this.calendars[index].selected = !this.calendars[index].selected;
                this.saveToLocalStorage();
            }

        },
        updateFilteredEvents() {
            this.filteredEvents = this.calendars
                .filter(cal => cal.selected)
                .map(cal => cal.events
                    .map(event => ({
                        ...event,
                        calendarName: cal.name,
                        calendarColor: cal.color
                    }))
                )
                .flat()
        },


        saveToLocalStorage() {
            // console.log("Saving to localStorage:", this.calendars);
            localStorage.setItem('calendars', JSON.stringify(this.calendars));
        },
        getCalendarById(id) {
            return this.calendars.find(calendar => calendar.uid === id);
        },

        async refreshCalendars() {
            for (const calendar of this.calendars) {
                if (!calendar.url) continue;

                try {
                    let response = await fetch(corsProxyUrl + calendar.url);
                    let data = await response.text();
                    let events = extractEvents(data);

                    if (events?.length) {
                        const index = this.calendars.findIndex(cal => cal.uid === calendar.uid);
                        if (index !== -1) {
                            this.calendars[index].events = toRaw(events).map(event => ({
                                ...toRaw(event),
                                duration: event.duration?.toString() || event.duration,
                            }));
                            this.saveToLocalStorage();

                            toast({
                                id: calendar.uid,
                                title: `The calendar ${calendar.name} has been refreshed.`,
                                variant: 'success',

                            });
                        }
                    }
                } catch (error) {
                    console.error(`Error refreshing calendar ${calendar.name}:`, error);

                    toast({
                        id: calendar.uid,
                        title: `There was an error refreshing the calendar ${calendar.name}.`,
                        variant: 'destructive',

                    });
                }
            }

        }
    },
});
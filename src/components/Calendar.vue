<template>
  <h1 class="text-4xl font-bold text-[#31776c] mb-8">Calendar</h1>

  <div class="calendar rounded-lg m-auto w-full bg-[#fff] shadow-lg">
    <div class="calendar-header rounded-md flex justify-between align-center px-4 py-4 font-bold text-lg">
      <button @click="prevWeek">‹</button>
      <h2>{{ formattedWeek }}</h2>
      <button @click="nextWeek">›</button>
    </div>

    <div class="calendar-semi-header flex">
      <div class="w-[65px] bg-[#fff]"></div>

      <div class="calendar-week-day-grid grid grid-cols-7 flex-1">
        <div v-for="day in weekDays" :key="day.date" class="calendar-week-day bg-white">
          <h3 :class="[day.date === todayISO ?
          'bg-[#31776c] text-white' : 'bg-[#f5f5f5] transition duration-300 ease-in-out hover:bg-[#e0e0e0]',
          'font-semibold m-2 rounded-md shadow-sm text-center p-1.5']"
          >{{ day.label }}</h3>
        </div>
      </div>
    </div>

    <div class="calendar-container flex rounded-md">
      <div class="time-column w-[65px] bg-[#fff] border-[#ddd]">
        <div v-for="hour in hours" :key="hour.value"
             class="time-slot flex items-center justify-center text-sm h-[50px]">
          {{ hour.label }}
        </div>
      </div>

      <div class="calendar-week-day-grid relative grid grid-cols-7 flex-1">
        <div class="current-time-line absolute left-0 right-0 w-full h-[2px]
                    before:absolute before:text-white before:left-[-65px] before:top-[-10px] before:text-sm before:font-bold
                    before:z-5 before:px-1.5 before:py-0.5 before:bg-cornflowerblue before:rounded"
             :style="currentTimeStyle"
             :currentTime="formattedCurrentTime">
        </div>

        <div v-for="day in weekDays" :key="day.date" class="calendar-week-day bg-white">
          <div class="calendar-hour-slot-grid grid grid-rows-24 relative border-l border-[#ddd]">
            <div v-for="hour in hours" :key="hour" class="calendar-hour-slot border-[#ddd] border-t  h-[50px]"
                 :class="[day.date === todayISO && 'bg-green-50']"></div>

            <div
                v-for="event in getEventsForDay(day.date)"
                :key="event.uid"
                class="event absolute w-[90%] p-1.5 rounded-md text-sm shadow-md border-l-[5px]"
                :style="{ ...getEventStyle(event)}"
                :class="[colorStore.getBorderColor(event.calendarColor), colorStore.getBackgroundLightColor(event.calendarColor)]"
            >
              <h2 class="font-semibold">{{ event.summary }}</h2>
              <!--              <p class="text-gray-500">{{ formatDuration(event.startDateTime, event.endDateTime) }}</p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useColorStore} from '@/stores/colors';
import {useCalendarStore} from '@/stores/calendar';

import {ref, computed, onMounted} from "vue";
import {format, addDays, startOfWeek} from "date-fns";
import {
  calculateDaysBetween,
  calculateWeeksBetween,
  calculateYearsBetween,
  formatDate, formatDuration,
  getDaysInYear,
  getNumValueForICSDay, getNumValueForJSDay
} from "@/utils/dateUtils.js";

const colorStore = useColorStore();
const calendarStore = useCalendarStore();

//
// let events = computed(() => {
//   return calendarStore.filteredEvents
// })

const events = ref([
  {
    uid: 1,
    summary: "Workout",
    startDate: "2025-02-03",
    endDate: '2025-02-03',
    multiDay: true,
    freq: 'DAILY',
    until: null,
    count: null,
    interval: 1,
    wkst: null,
    byDay: null,
    startTime: 6,
    endTime: 7,
    calendarColor: 'blue'
  },
  {
    uid: 5,
    summary: "Yearly",
    startDate: "2025-02-05",
    endDate: '2025-02-05',
    multiDay: true,
    freq: 'YEARLY',
    until: null,
    count: null,
    interval: 2,
    wkst: null,
    byDay: null,
    startTime: 12,
    endTime: 13,
    calendarColor: 'red'
  },
  {
    uid: 2,
    summary: "Brunch with Alex",
    startDate: "2025-01-28",
    endDate: '2025-01-28',
    multiDay: true,
    freq: 'WEEKLY',
    until: null,
    count: 5,
    interval: null,
    wkst: 1,
    byDay: ['MO', 'FR', 'TH'],
    startTime: 9,
    endTime: 10.5,
    calendarColor: 'orange'
  },
  {
    uid: 3,
    summary: "Roadmap Planning",
    startDate: "2025-01-29",
    endDate: '2025-01-29',
    multiDay: false,
    freq: null,
    until: null,
    byDay: null,
    startTime: 11,
    endTime: 13,
    calendarColor: 'purple'
  },
  {
    uid: 4,
    summary: "Lunch with Steve",
    startDate: "2025-01-27",
    endDate: '2025-01-27',
    multiDay: false,
    freq: null,
    until: null,
    byDay: null,
    startTime: 12.5,
    endTime: 14,
    calendarColor: 'blue'
  },
]);

const normalizedEvents = computed(() => {
  return normalizeEvents(events.value);
})

let now = ref(new Date());
const todayISO = ref(format(now.value, "yyyy-MM-dd"))

onMounted(() => {
  setInterval(() => {
    now.value = new Date()
  }, 60000)
})

// Formatted week displayed in calendar header
const formattedWeek = computed(() => {
  const start = format(startOfWeek(now.value, {weekStartsOn: 1}), "MMMM dd");
  const end = format(addDays(startOfWeek(now.value, {weekStartsOn: 1}), 6), "MMMM dd");
  return `${start} - ${end}`;
});

// Current time displayed before the line in calendar grid
const formattedCurrentTime = computed(() => {
  let currentHour = now.value.getHours();
  let currentMinutes = now.value.getMinutes();

  const suffix = currentHour >= 12 ? 'PM' : 'AM';

  if (currentHour > 12) {
    currentHour -= 12;
  } else if (currentHour === 0) {
    currentHour = 12;
  }

  return `${currentHour.toString()}:${currentMinutes.toString().padStart(2, "0")} ${suffix}`;
})

const currentTimeStyle = computed(() => {
  const currentHour = now.value.getHours();
  const currentMinutes = now.value.getMinutes();
  let position = (currentHour * 60 + currentMinutes) / (24 * 60) * 100;
  return {top: `${position}%`}
})

const hours = Array.from({length: 24}, (_, i) => ({
  value: i,
  label: i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`,
}));

const weekDays = computed(() => {
  return Array.from({length: 7}, (_, i) => {
    const date = addDays(startOfWeek(now.value, {weekStartsOn: 1}), i);
    return {date: format(date, "yyyy-MM-dd"), label: format(date, "dd EEEE")};
  });
});

const prevWeek = () => {
  now.value = addDays(now.value, -7);
};
const nextWeek = () => {
  now.value = addDays(now.value, 7);
};

const getEventsForDay = (date) => {
  return normalizedEvents.value.filter((event) => {
    if (!event.endsNever) { // Checks if the event has ending or not
      return event.startDate === date
    } else {
      switch (event.freq) {
        case 'DAILY': {
          if (date >= event.startDate) {
            if (!event.interval) { // If the event doesn't have interval, it returns each event for each day
              return true
            } else { // Otherwise, it returns the events for the corresponding day based on the interval
              const days = calculateDaysBetween(event.startDate, date)
              if (days % event.interval === 0) return true
            }
          }
          break;
        }
        case 'WEEKLY': {
          if (date >= event.startDate) {
            if (typeof event.byDay == 'string') {
              event.byDay = Array.of(event.byDay)
            }

            const dateJS = new Date(date)
            const targetWeekDay = getNumValueForJSDay(dateJS.getDay())

            for (let day of event.byDay) {
              const eventWeekDay = getNumValueForICSDay(day)
              if (eventWeekDay === targetWeekDay) return true
            }

          }
        }
        case 'MONTHLY': {

        }
        case 'YEARLY': {
          if (date >= event.startDate) {
            const dateJS = new Date(date);
            const eventStartJS = new Date(event.startDate);

            if (!event.interval) {  // If the event doesn't have interval, it returns each event for every year
              if (dateJS.getMonth() === eventStartJS.getMonth() && dateJS.getDate() === eventStartJS.getDate()) {
                return true;
              }
            } else {  // Otherwise, it returns the events for the corresponding year based on the interval
              const years = calculateYearsBetween(event.startDate, date)

              if (dateJS.getMonth() === eventStartJS.getMonth() && dateJS.getDate() === eventStartJS.getDate()) {
                if (years % event.interval === 0) return true
              }
            }
          }
          break;
        }
      }
    }

  });
};

// TODO: Refactor
const normalizeEvents = (rawEvents) => {
  let normalizedEvents = []
  rawEvents.forEach(event => {
    if (!event.multiDay) {
      normalizedEvents.push(event)
    } else {
      if (!event.freq) {
        const days = calculateDaysBetween(event.startDate, event.endDate) + 1
        destructEventInMultipleDays(normalizedEvents, event, days)

      } else {
        switch (event.freq) {
          case 'DAILY': {
            if (event.until) { // Ends on x date:
              const days = calculateDaysBetween(event.startDate, event.until) + 1
              if (event.interval) {
                destructEventInMultipleDays(normalizedEvents, event, days, event.interval)
              } else {
                destructEventInMultipleDays(normalizedEvents, event, days)
              }

            } else if (event.count) { // Ends after x days:
              const days = event.count
              if (event.interval) {
                destructEventInMultipleDays(normalizedEvents, event, days, event.interval)
              } else {
                destructEventInMultipleDays(normalizedEvents, event, days)
              }
            } else { // Ends never:
              normalizedEvents.push({
                ...event,
                endsNever: true //handled in getEventsForDay()
              })
            }
            break
          }
          case 'WEEKLY': {
            if (event.until) { // Ends on x date:
              const weeks = calculateWeeksBetween(event.startDate, event.until) + 1
              destructEventInMultipleWeeks(normalizedEvents, event, weeks, event.wkst)
            } else if (event.count) { // Ends after x weeks:
              const weeks = event.count
              destructEventInMultipleWeeks(normalizedEvents, event, weeks, event.wkst)
            } else {
              normalizedEvents.push({
                ...event,
                endsNever: true // handled in getEventsForDay()
              })
            }
            break
          }
          case 'MONTHLY': {

          }
          case 'YEARLY': {
            if (event.until) { // Ends on x date:
              const years = calculateYearsBetween(event.startDate, event.until) + 1
              if (event.interval) {
                destructEventInMultipleYears(normalizedEvents, event, years, event.interval)
              } else {
                destructEventInMultipleYears(normalizedEvents, event, years)
              }

            } else if (event.count) { // Ends after x days:
              const years = event.count
              if (event.interval) {
                destructEventInMultipleYears(normalizedEvents, event, years, event.interval)
              } else {
                destructEventInMultipleYears(normalizedEvents, event, years)
              }
            } else { // Ends never:
              normalizedEvents.push({
                ...event,
                endsNever: true //handled in getEventsForDay()
              })
            }
            break

          }

        }
      }
    }
  })
  return normalizedEvents
}

const destructEventInMultipleDays = (normalizedEvents, event, days, interval = 1) => {
  for (let i = 0; i < days; i++) {
    const newStartDate = new Date(event.startDate)
    newStartDate.setDate(newStartDate.getDate() + (i * interval))

    normalizedEvents.push({
      ...event,
      uid: event.uid + '' + i,
      startDate: format(newStartDate, "yyyy-MM-dd"),
      endDate: format(newStartDate, "yyyy-MM-dd"),
      multiDay: false,
      freq: null
    })
  }
}
const destructEventInMultipleWeeks = (normalizedEvents, event, weeks, interval = 1) => {

  if (event.startDate === event.endDate) {
    for (let i = 0; i < weeks; i++) {

      if (typeof event.byDay == 'string') {
        event.byDay = Array.of(event.byDay)
      }

      for (let day of event.byDay) {
        const newStartDate = new Date(event.startDate)
        const startWeekDay = getNumValueForJSDay(newStartDate.getDay())
        const eventWeekDay = getNumValueForICSDay(day)

        let daysBetween = eventWeekDay - startWeekDay
        newStartDate.setDate(newStartDate.getDate() + (i * 7 * interval) + daysBetween)


        if (formatDate(newStartDate) > event.startDate) { // Saving the weekly events after the start date
          // if(daysBetween >= 0 || i !== 0) {
          normalizedEvents.push({
            ...event,
            uid: event.uid + '' + i,
            startDate: format(newStartDate, "yyyy-MM-dd"),
            endDate: format(newStartDate, "yyyy-MM-dd"),
            multiDay: false,
            freq: null
          })
        }
      }
    }

  } else { // Edge case when the duration is more than 1 day, but happens weekly

  }
}

const destructEventInMultipleYears = (normalizedEvents, event, years, interval = 1) => {

  for (let i = 0; i < years; i++) {
    const newStartDate = new Date(event.startDate)
    const year = newStartDate.getFullYear()
    const daysInYear = getDaysInYear(year)

    newStartDate.setDate(newStartDate.getDate() + (i * daysInYear * interval))

    normalizedEvents.push({
      ...event,
      uid: event.uid + '' + i,
      startDate: format(newStartDate, "yyyy-MM-dd"),
      endDate: format(newStartDate, "yyyy-MM-dd"),
      multiDay: false,
      freq: null
    })
  }
}


const getEventStyle = (event) => {
  const startHour = event.startTime;
  const duration = event.endTime - event.startTime;

  return {
    top: `${startHour * 50}px`,
    height: `${duration * 50}px`,
    left: `5%`,
  };
};


</script>

<style scoped>
.current-time-line {
  background: #B8001F;
  z-index: 5;
}

.current-time-line::before {
  content: attr(currentTime);
  background-color: #B8001F;
}

</style>

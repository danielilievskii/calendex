<template>

  <h1 class="text-4xl font-bold text-[#31776c] mb-8">Calendar</h1>

  <div class="calendar rounded-lg m-auto w-full bg-[#fff] shadow-lg">
    <div class="calendar-header rounded-md flex justify-between align-center px-4 py-4 font-bold text-lg">
      <button class="px-3.5 py-1 rounded-md bg-gray-100 hover:bg-gray-300 duration-200" @click="prevWeek">‹</button>
      <h2>{{ formattedWeek }}</h2>
      <button class="px-3.5 py-1 rounded-md bg-gray-100 hover:bg-gray-300 duration-200" @click="nextWeek">›</button>
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

    <!--    Multi-day events (more than 24 hours) -->
    <div class="calendar-container-head flex">
      <div class="w-[65px] bg-[#fff]"></div>

      <div class="calendar-week-day-grid grid grid-cols-7 flex-1"
      >
        <template v-for="day in weekDays" :key="day.date"
                  class="calendar-week-day bg-white"
                  :style="{
          display: 'grid',
          gridTemplateRows: `repeat(auto-fill, 35px)`}" >
          <div
              @click="toggleModal(event)"
              v-for="event in getMultiDayEvents(day.date)"
              :key="event.uid"
              class="event p-1.5 text-sm mb-1 cursor-pointer"
              :style="{
           ...getEventStyle(event, day.date),

         }"
              :class="[colorStore.getBorderColor(event.calendarColor), colorStore.getBackgroundLightColor(event.calendarColor)]"
          >
            <h2 class="font-semibold text-center">{{ event.summary }}</h2>
          </div>

        </template>
      </div>

    </div>
    <!--      Single-day events (less than 24 hours -->
    <div ref="calendarContainerRef" class="calendar-container flex rounded-md">
      <div class="time-column w-[65px] bg-[#fff] border-[#ddd] pb-4">
        <div v-for="hour in hours" :key="hour.value"
             class="time-slot flex items-center justify-center text-sm h-[50px]">
          {{ hour.label }}
        </div>
      </div>

      <div class="calendar-week-day-grid relative grid grid-cols-7 flex-1"> <!-- mb-7 -->
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
                @click="toggleModal(event)"
                v-for="event in getSingleDayEvents(day.date)"
                :key="event.uid"
                class="event absolute p-1.5 rounded-md text-sm shadow-md border-l-[5px] cursor-pointer overflow-hidden"
                :style="{ ...getEventStyle(event, day.date)}"
                :class="[colorStore.getBorderColor(event.calendarColor), colorStore.getBackgroundLightColor(event.calendarColor)]"
            >
              <h2 class="font-semibold truncate whitespace-nowrap">{{ event.summary }}</h2>
              <p class="text-gray-500"> {{event.formattedDuration}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal v-show="showModal" :toggleModal="toggleModal" :showModal="showModal" :selectedEvent="selectedEvent.value"/>

</template>

<script setup>
import {useColorStore} from '@/stores/colors';
import {useCalendarStore} from '@/stores/calendar';

import {ref, computed, onMounted, reactive, nextTick} from "vue";
import {format, addDays, startOfWeek} from "date-fns";
import {
  calculateDaysBetween,
  calculateWeeksBetween,
  calculateMonthsBetween,
  calculateYearsBetween,
  formatFromStringToDateISO, formatDuration,
  getDaysInYear,
  getNumValueForICSDay, getNumValueForJSDay, isSameDate, subtractOneDay, extractDateISOFromObj
} from "@/utils/dateUtils.js";
import Modal from "@/components/EventDetailsModal.vue";

const colorStore = useColorStore();
const calendarStore = useCalendarStore();

const showModal = ref(false);
const selectedEvent = reactive({});

const toggleModal = (event) => {
  showModal.value = !showModal.value;

  if(event) {
    selectedEvent.value = event;
    console.log(event)
  }
}


let events = computed(() => {
  return calendarStore.filteredEvents
})

const normalizedEvents = computed(() => {
  return normalizeEvents(events.value);
})

let now = ref(new Date());
let weekSwitch = ref(new Date());
const todayISO = ref(format(now.value, "yyyy-MM-dd"))

onMounted(() => {
  setInterval(() => {
    now.value = new Date()
  }, 60000)
})

// Formatted week displayed in calendar header
const formattedWeek = computed(() => {
  const start = format(startOfWeek(weekSwitch.value, {weekStartsOn: 1}), "dd MMMM");
  const end = format(addDays(startOfWeek(weekSwitch.value, {weekStartsOn: 1}), 6), "dd MMMM");

  const year = format(weekSwitch.value, "yyyy")
  return `${start} - ${end}, ${year}`;
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
  const position = (currentHour * 50) + (currentMinutes * (50 / 60));

  return { top: `${position}px` };
})

const calendarContainerRef = ref(null);

const scrollToCurrentTime = () => {
  if (calendarContainerRef.value) {
    const currentHour = now.value.getHours();
    const currentMinutes = now.value.getMinutes();
    const scrollPosition = (currentHour * 50) + (currentMinutes * (50 / 60)) - 300;
    calendarContainerRef.value.scrollTop = scrollPosition;
  }
};

onMounted(() => {
  nextTick(() => {
    scrollToCurrentTime();
  });
});

const hours = Array.from({length: 24}, (_, i) => ({
  value: i,
  label: i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`,
}));

const weekDays = computed(() => {
  return Array.from({length: 7}, (_, i) => {
    const date = addDays(startOfWeek(weekSwitch.value, {weekStartsOn: 1}), i);
    return {date: format(date, "yyyy-MM-dd"), label: format(date, "dd EEEE")};
  });
});

const prevWeek = () => {
  weekSwitch.value = addDays(weekSwitch.value, -7);
};
const nextWeek = () => {
  weekSwitch.value = addDays(weekSwitch.value, 7);
};

const getSingleDayEvents = (date) => {
  return normalizedEvents.value.filter((event) => {
    if(event.startDate === event.endDate) {
      if (!event.endsNever) { // If the event has ending, that means the event is already descrutured in separate objects
        return event.startDate === date
      } else {
        switch (event.freq) {
          case 'DAILY': { // Scenario when the event has no ending, but happens daily
            if (date >= event.startDate) {
              if (!event.interval) { // If the event doesn't have interval, it returns each event for each day
                return true
              } else { // Otherwise, it returns the event for the corresponding day based on the interval
                const days = calculateDaysBetween(event.startDate, date)
                if (days % event.interval === 0) return true
              }
            }
            break;
          }
          case 'WEEKLY': { // Scenario when the event has NO ending, but happens weekly
            if (date >= event.startDate) {
              if (typeof event.byDay == 'string') {
                event.byDay = Array.of(event.byDay)
              }

              const dateJS = new Date(date)
              const targetWeekDay = getNumValueForJSDay(dateJS.getDay())

              for (let day of event.byDay) {
                const eventWeekDay = getNumValueForICSDay(day)
                if(!event.wkst) { // If the event doesn't have interval, it returns each event for each corresponding week day
                  if (eventWeekDay === targetWeekDay) return true
                } else {  // Otherwise, it returns the event for the corresponding week day based on the interval
                  const weeks = calculateWeeksBetween(event.startDate, date) + 1;
                  if(weeks % (event.wkst + 1) === 0) {
                    if (eventWeekDay === targetWeekDay) return true
                  }
                }

              }

            }
            break
          }
          case 'MONTHLY': { // Scenario when the event has NO ending, but happens monthly
            if(date >= event.startDate) {

            }
            break;

          }
          case 'YEARLY': { // Scenario when the event has NO ending, but happens yearly
            if (date >= event.startDate) {
              const dateJS = new Date(date);
              const eventStartJS = new Date(event.startDate);

              if (!event.interval) {  // If the event doesn't have interval, it returns the event for each year
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
    }
  });
};

const getMultiDayEvents = (date) => {
  return normalizedEvents.value.filter((event) => {
    const targetDate = new Date(date);

    if(event.startDate !== event.endDate) {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      if(start <= targetDate && targetDate <= end) {
        return true
      }
    }
  })
}


const normalizeEvents = (rawEvents) => {
  // console.log('RAW EVENTS: ')
  // console.log(rawEvents)

  let normalizedEvents = []
  rawEvents.forEach(event => {
    if (event.startDate === event.endDate && !event.freq) {
      normalizedEvents.push(event)
    } else {
      if (!event.freq) {
        handleMultiDayEvents(normalizedEvents, event)

      } else {
        switch (event.freq) {
          case 'DAILY': {
            if (event.until) { // Ends on x date
              const days = calculateDaysBetween(event.startDate, event.until) + 1
              handleDailyEvents(normalizedEvents, event, days, event.interval ?? 1);

            } else if (event.count) { // Ends after x days
              const days = event.count
              handleDailyEvents(normalizedEvents, event, days, event.interval ?? 1);
            } else { // Ends never:
              normalizedEvents.push({
                ...event,
                endsNever: true //handled in getSingleDayEvents()
              })
            }
            break
          }
          case 'WEEKLY': {
            if (event.until) { // Ends on x date
              const weeks = calculateWeeksBetween(event.startDate, event.until) + 1
              handleWeeklyEvents(normalizedEvents, event, weeks, event.wkst ? event.wkst + 1 : undefined);

            } else if (event.count) { // Ends after x weeks
              const weeks = event.count
              handleWeeklyEvents(normalizedEvents, event, weeks, event.wkst ? event.wkst + 1 : undefined);
            } else {
              normalizedEvents.push({
                ...event,
                endsNever: true //handled in getSingleDayEvents()
              })
            }
            break
          }
          case 'MONTHLY': {
            if(event.until) { // Ends on x date
              const months = calculateMonthsBetween(event.startDate, event.until)
              handleMonthlyEvents(normalizedEvents, event, months, event.interval ?? 1)

            } else if (event.count) { // Ends after x months
              const months = event.count
              handleMonthlyEvents(normalizedEvents, event, months, event.interval ?? 1)
            } else {
              normalizedEvents.push({
                ...event,
                endsNever: true //handled in getSingleDayEvents()
              })
            }
            break
          }
          case 'YEARLY': {
            if (event.until) { // Ends on x date
              const years = calculateYearsBetween(event.startDate, event.until) + 1
              handleYearlyEvents(normalizedEvents, event, years, event.interval ?? 1)

            } else if (event.count) { // Ends after x years
              const years = event.count
              handleYearlyEvents(normalizedEvents, event, years, event.interval ?? 1)

            } else { // Ends never:
              normalizedEvents.push({
                ...event,
                endsNever: true //handled in getSingleDayEvents()
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

const handleMultiDayEvents = (normalizedEvents, event) => {
  normalizedEvents.push(event)
}

const handleDailyEvents = (normalizedEvents, event, days, interval = 1) => {

  if(event.startDate === event.endDate) { // Destruct event in multiple objects for each day
    for (let i = 0; i < days; i++) {
      const newStartDate = new Date(event.startDate)
      newStartDate.setDate(newStartDate.getDate() + (i * interval))

      const newStartDateISO = format(newStartDate, "yyyy-MM-dd");

      // Ensure the event is within the valid recurrence range
      if(!event.until || newStartDateISO <= event.untilISO) {
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
  } else {  // Scenario when the duration is more than 24hours, but happens daily

  }
}
const handleWeeklyEvents = (normalizedEvents, event, weeks, interval = 1) => {

  if (event.startDate === event.endDate) { // Destruct event in multiple objects for each week

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

  } else { // Scenario when the duration is more than 24hours, but happens weekly

  }
}

const handleMonthlyEvents = (normalizedEvents, event, months, interval = 1) => {

  if (event.startDate === event.endDate) { // Destruct event in multiple objects for each month
    const daysMap = {
      SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6
    };

    for (let i = 0; i < months; i++) {
      const newStartDate = new Date(event.startDate);

      if (typeof event.byDay == 'string') { // Handle events occurring on specific weekdays ("1SU" for first Sunday)
        const match = event.byDay.match(/^(-?\d+)([A-Z]{2})$/);
        if (match) {
          const weekNumber = parseInt(match[1], 10);

          const weekDayStr = match[2];
          const weekDayNum = daysMap[weekDayStr];

          newStartDate.setMonth(newStartDate.getMonth() + (i * interval));

          if (weekNumber > 0) { // Handling positive week numbers ("2MO" = second Monday)
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
          } else { // Handling negative week numbers ("-1SU" = last Sunday)
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

      } else if (typeof event.byMonthDay === 'number') { // Handle events occurring on a specific day of the month
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

  } else { // Scenario when the duration is more than 24hours, but happens monthly

  }
};

const handleYearlyEvents = (normalizedEvents, event, years, interval = 1) => {

  if(event.startDate === event.endDate) {  // Destruct event in multiple objects for each year
    for (let i = 0; i < years; i++) {
      const newStartDate = new Date(event.startDate)
      const year = newStartDate.getFullYear()
      const daysInYear = getDaysInYear(year)

      newStartDate.setDate(newStartDate.getDate() + (i * daysInYear * interval))

      const newStartDateISO = format(newStartDate, "yyyy-MM-dd");

      // Ensure the event is within the valid recurrence range
      if(!event.until || newStartDateISO <= event.untilISO) {
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
  } else {  // Scenario when the duration is more than 24hours, but happens yearly

  }

}


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
const getEventStyle = (event, targetDayDate) => {
  if (event.startDate === event.endDate) {
    const overlappingEvents = getSingleDayEvents(targetDayDate).filter(e => {
      return e.startTime < event.endTime && e.endTime > event.startTime
    })

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
  } else { //TODO: Refactor
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if(event.endTime === 0) {
      endDate.setDate(endDate.getDate() - 1) // 01 April 12:00 AM to 02 April 12:00AM is only 1 day (24hrs)
    }


    const targetDate = new Date(targetDayDate);

    const targetWeekDay = getNumValueForJSDay(targetDate.getDay())
    const targetWeekStartDate = new Date(targetDate);
    targetWeekStartDate.setDate(targetWeekStartDate.getDate() - targetWeekDay);
    const weekStartDateISO = targetWeekStartDate.toISOString().split('T')[0];

    const targetWeekEndDate = new Date(targetWeekStartDate);
    targetWeekEndDate.setDate(targetWeekEndDate.getDate() + 6)

    const startWeekDay = getNumValueForJSDay(startDate.getDay())
    const startWeekDate = new Date(startDate)
    startWeekDate.setDate(startWeekDate.getDate() - startWeekDay)

    const endWeekDay = getNumValueForJSDay(endDate.getDay())
    const endWeekDate = new Date(endDate)
    endWeekDate.setDate(endWeekDate.getDate() - endWeekDay)


    if (startDate <= targetDate && targetDate <= endDate) {

      const baseStyle = { height: '30px' };
      const rowIndex = getWeekRowTracker(event, weekStartDateISO);

      const getGridStyle = {
        gridRowStart: rowIndex,
        gridColumnStart: targetWeekStartDate >= startDate ? 1 : startWeekDay + 1,
        gridColumnEnd: targetWeekEndDate <= endDate ? 8 : endWeekDay + 2
      };

      if(targetDayDate === event.startDate && targetDayDate === extractDateISOFromObj(endDate)) {
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

      if (targetDayDate === event.startDate) {
        // TODO: fix overlapped syle

        return {
          ...baseStyle,
          ...getGridStyle,
          // background: 'green',
          borderLeft: `2px solid ${event.calendarColor}`,
          borderTopLeftRadius: '5px',
          borderBottomLeftRadius: '5px',
          left: '5%',
        };
      }

      if (targetDayDate === extractDateISOFromObj(endDate)) {
        return {
          ...baseStyle,
          ...getGridStyle,
          borderRight: `2px solid ${event.calendarColor}`,
          borderTopRightRadius: '5px',
          borderBottomRightRadius: '5px',
          right: '5%',
        };
      }

      if(targetDayDate !== event.startDate && targetDayDate !== extractDateISOFromObj(endDate)) {
        return {
          ...baseStyle,
          ...getGridStyle,
        };
      }

    } else {
      return {
        display: 'none'
      }
    }
  }
};




</script>

<style scoped>
.current-time-line {
  background: #B8001F;
  z-index: 20;
}

.current-time-line::before {
  content: attr(currentTime);
  background-color: #B8001F;
}

.calendar-container {
  max-height: calc(65vh);
  overflow-y: auto;
  position: relative;
  scroll-behavior: smooth;
}

.calendar-container::-webkit-scrollbar {
  width: 8px;
}

.calendar-container::-webkit-scrollbar-track {
  background: #fff;
}

.calendar-container::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}

.calendar-container::-webkit-scrollbar-thumb:hover {
  background: #d0d0d0;
}

</style>

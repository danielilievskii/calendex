<template>

  <div class="calendar rounded-lg m-auto w-full bg-[#f5f5f5] shadow-lg">
    <div class="calendar-header rounded-md flex justify-between align-center px-4 py-4 font-bold text-lg">
      <button @click="prevWeek">‹</button>
      <h2>{{ formattedDate }}</h2>
      <button @click="nextWeek">›</button>
    </div>

    <div class="calendar-semi-header flex">
      <div class="w-[65px] bg-[#fff]"></div>

      <div class="calendar-week-day-grid grid grid-cols-7 flex-1">
        <div v-for="day in weekDays" :key="day.date" class="calendar-week-day bg-white">
          <h3 :class="[day.date === todayISO ?
          'bg-[#587acc] text-white' : 'bg-[#f5f5f5] transition duration-300 ease-in-out hover:bg-[#e0e0e0]',
          'font-semibold m-2 rounded-md shadow-sm text-center p-1.5']"
          >{{ day.label }}</h3>
        </div>
      </div>
    </div>

    <div class="calendar-container flex border border-[#ddd]">
      <div class="time-column w-[65px] bg-[#fafafa] border-r border-[#ddd]">
        <div v-for="hour in hours" :key="hour.value" class="time-slot flex items-center justify-center text-sm h-[50px]">
          {{ hour.label }}
        </div>
      </div>

      <div class="calendar-week-day-grid relative grid grid-cols-7 flex-1" >
        <div class="current-time-line absolute left-0 right-0 w-full h-[2px]
                    before:absolute before:text-white before:left-[-65px] before:top-[-10px] before:text-sm before:font-bold
                    before:z-5 before:px-1.5 before:py-0.5 before:bg-cornflowerblue before:rounded"
             :style="currentTimeStyle"
             :currentTime="formattedCurrentTime">
        </div>

        <div v-for="day in weekDays" :key="day.date" class="calendar-week-day bg-white">
          <div class="calendar-hour-slot-grid grid grid-rows-24 relative border-l border-[#ddd]">
            <div v-for="hour in hours" :key="hour" class="calendar-hour-slot border-b border-[#ddd] h-[50px]" :class="[day.date === todayISO && 'bg-blue-50']"></div>

            <div
                v-for="event in getEventsForDay(day.date)"
                :key="event.id"
                class="event absolute left-[5%] w-[90%] p-1.5 rounded-md text-sm shadow-md border-l-4"
                :style="{ ...getEventStyle(event)}"
                :class="[colorStore.getBorderColor(event.color), colorStore.getBackgroundLightColor(event.color)]"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useColorStore } from '@/stores/colors';

import {ref, computed, onMounted} from "vue";
import { format, addDays, startOfWeek } from "date-fns";

const colorStore = useColorStore();
let now = ref(new Date());
const todayISO = ref(format(now.value, "yyyy-MM-dd"))

onMounted(() => {
  setInterval(() => {
    now.value = new Date()
  }, 60000)
})

const formattedCurrentTime = computed(() => {
  let currentHour = now.value.getHours();
  let currentMinutes = now.value.getMinutes();
  let suffix;

  if(currentHour === 0) {
    suffix = 'AM';
  } else if (currentHour >= 12) {
    suffix = 'PM'
    currentHour = currentHour-12;
  }

  return `${currentHour.toString()}:${currentMinutes.toString().padStart(2, "0")} ${suffix}`;
})

const currentTimeStyle = computed(() => {
  const currentHour = now.value.getHours();
  const currentMinutes = now.value.getMinutes();
  let position = (currentHour * 60 + currentMinutes) / (24 * 60) * 100;
  return {top: `${position}%`}
})

const events = ref([
  { id: 1, title: "Workout", date: "2025-01-27", start: 8, end: 9, color: 'green' },
  { id: 2, title: "Brunch with Alex", date: "2025-01-28", start: 9, end: 10.5, color: 'orange' },
  { id: 3, title: "Roadmap Planning", date: "2025-01-29", start: 11, end: 13, color: 'purple' },
  { id: 4, title: "Lunch with Steve", date: "2025-01-27", start: 12.5, end: 14 , color: 'blue' },
]);

const hours = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`,
}));

const weekDays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(now.value, { weekStartsOn: 1 }), i);
    return { date: format(date, "yyyy-MM-dd"), label: format(date, "dd EEEE") };
  });
});

const getEventsForDay = (date) => {
  return events.value.filter((event) => event.date === date);
};

const getEventStyle = (event) => {
  const startHour = event.start;
  const duration = event.end - event.start;
  return {
    top: `${startHour * 50}px`,
    height: `${duration * 50}px`,
  };
};
const prevWeek = () => {
  now.value = addDays(now.value, -7);
};
const nextWeek = () => {
  now.value = addDays(now.value, 7);
};

const formattedDate = computed(() => {
  const start = format(startOfWeek(now.value, { weekStartsOn: 1 }), "MMMM dd");
  const end = format(addDays(startOfWeek(now.value, { weekStartsOn: 1 }), 6), "MMMM dd");
  return `${start} - ${end}`;
});
</script>

<style scoped>
.current-time-line {
  background: cornflowerblue;
  z-index: 5;
}

.current-time-line::before {
  content: attr(currentTime);
  background-color: cornflowerblue;
}

</style>

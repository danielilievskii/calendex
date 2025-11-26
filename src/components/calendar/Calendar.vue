<template>
  <div class="pt-24 px-6 md:px-24">

    <div class="calendar rounded-lg w-full bg-[#fff] shadow-lg">

      <CalendarHeader
          :formatted-week="formattedWeek"
          :week-days="weekDays"
          :today-i-s-o="currentDate"
          @prev-week="prevWeek"
          @next-week="nextWeek"
      />

      <CalendarMultiDayRow
          :week-days="weekDays"
          :normalized-events="normalizedEvents"
          @toggle-modal="toggleModal"
      />

      <CalendarDayGrid
          ref="calendarContainerRef"
          :week-days="weekDays"
          :hours="hours"
          :current-date="currentDate"
          :normalized-events="normalizedEvents"
          :current-time-style="currentTimeStyle"
          :formatted-current-time="formattedCurrentTime"
          @toggle-modal="toggleModal"
      />
    </div>

    <Modal
        v-show="showModal"
        :toggle-modal="toggleModal"
        :show-modal="showModal"
        :selected-event="selectedEvent.value"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, nextTick } from "vue";
import { format, addDays, startOfWeek } from "date-fns";
import { useCalendarStore } from '@/stores/calendar.js';
import CalendarMultiDayRow from '@/components/calendar/calendar-multi-day-row/CalendarMultiDayRow.vue';
import CalendarDayGrid from '@/components/calendar/calendar-day-grid/CalendarDayGrid.vue';
import Modal from "@/components/calendar/EventDetailsModal.vue";

import { normalizeEvents } from '@/utils/eventNormalizer.js';
import CalendarHeader from "@/components/calendar/calendar-header/CalendarHeader.vue";

const calendarStore = useCalendarStore();

const showModal = ref(false);
const selectedEvent = reactive({});

const toggleModal = (event) => {
  showModal.value = !showModal.value;

  if(event) {
    selectedEvent.value = event;
  }
};

const events = computed(() => calendarStore.filteredEvents);
const normalizedEvents = computed(() => normalizeEvents(events.value));

const now = ref(new Date());
const weekSwitch = ref(new Date());
const currentDate = ref(format(now.value, "yyyy-MM-dd"));

onMounted(() => {
  setInterval(() => {
    now.value = new Date();
  }, 60000);
});

const formattedWeek = computed(() => {
  const start = format(startOfWeek(weekSwitch.value, {weekStartsOn: 1}), "dd MMMM");
  const end = format(addDays(startOfWeek(weekSwitch.value, {weekStartsOn: 1}), 6), "dd MMMM");
  const year = format(weekSwitch.value, "yyyy");
  return `${start} - ${end}, ${year}`;
});

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
});

const currentTimeStyle = computed(() => {
  const currentHour = now.value.getHours();
  const currentMinutes = now.value.getMinutes();
  const position = (currentHour * 50) + (currentMinutes * (50 / 60));

  return { top: `${position}px` };
});

const calendarContainerRef = ref(null);

const scrollToCurrentTime = () => {
  if (calendarContainerRef.value) {
    calendarContainerRef.value.scrollToCurrentTime(now.value);
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

    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "dd EEEE"),
      dayNumber: format(date, "dd"),
      dayName: format(date, "EEEE"),
      dayInitial: format(date, "EEEEEE")
    };
  });
});

const prevWeek = () => {
  weekSwitch.value = addDays(weekSwitch.value, -7);
};

const nextWeek = () => {
  weekSwitch.value = addDays(weekSwitch.value, 7);
};
</script>
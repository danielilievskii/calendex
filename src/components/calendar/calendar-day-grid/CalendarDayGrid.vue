<template>
  <div ref="containerRef" class="calendar-container flex rounded-md">
    <TimeColumn :hours="hours" />

    <div class="calendar-week-day-grid relative grid grid-cols-7 flex-1">
      <CurrentTimeLine
          :style="currentTimeStyle"
          :current-time="formattedCurrentTime"
      />

      <CalendarDayColumn
          v-for="day in weekDays"
          :key="day.date"
          :day-date="day.date"
          :hours="hours"
          :current-date="currentDate"
          :filtered-events-by-date="getSingleDayEvents(normalizedEvents)(day.date)"
          @toggle-modal="$emit('toggle-modal', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TimeColumn from './TimeColumn.vue';
import CurrentTimeLine from './CurrentTimeLine.vue';
import CalendarDayColumn from './CalendarDayColumn.vue';
import { getSingleDayEvents } from '@/utils/eventFilters.js';

const props = defineProps({
  weekDays: {type: Array, required: true},
  currentDate: {type: String, required: true},
  hours: {type: Array, required: true},
  normalizedEvents: {type: Array, required: true},
  currentTimeStyle: {type: Object, required: true},
  formattedCurrentTime: {type: String, required: true},
});

defineEmits(['toggle-modal']);

const containerRef = ref(null);

const scrollToCurrentTime = (now) => {
  if (containerRef.value) {
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const scrollPosition = (currentHour * 50) + (currentMinutes * (50 / 60)) - 300;
    containerRef.value.scrollTop = scrollPosition;
  }
};

defineExpose({
  scrollToCurrentTime
});
</script>

<style scoped>
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
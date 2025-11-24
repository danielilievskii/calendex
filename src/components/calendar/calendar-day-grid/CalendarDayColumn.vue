<template>
  <div class="calendar-week-day bg-white">
    <div class="calendar-hour-slot-grid grid grid-rows-24 relative border-l border-[#ddd]">
      <div
          v-for="hour in hours"
          :key="hour"
          class="calendar-hour-slot border-[#ddd] border-t h-[50px]"
          :class="[dayDate === currentDate && 'bg-green-50']"
      >
      </div>

      <SingleDayEventItem
          v-for="event in filteredEventsByDate"
          :key="event.uid"
          :event="event"
          :filteredEventsByDate="filteredEventsByDate"
          :day-date="dayDate"
          @click="$emit('toggle-modal', event)"
      />
    </div>
  </div>
</template>

<script setup>
import SingleDayEventItem from './SingleDayEventItem.vue';

defineProps({
  dayDate: {
    type: String,
    required: true
  },
  hours: {
    type: Array,
    required: true
  },
  currentDate: {
    type: String,
    required: true
  },
  filteredEventsByDate: {
    type: Array,
    required: true
  }
});

defineEmits(['toggle-modal']);


</script>
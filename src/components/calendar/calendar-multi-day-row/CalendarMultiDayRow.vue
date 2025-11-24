<template>
  <div class="calendar-container-head flex">
    <div class="w-[65px] bg-[#fff]"></div>

    <div class="calendar-week-day-grid grid grid-cols-7 flex-1">
      <template
          v-for="day in weekDays"
          :key="day.date"
          class="calendar-week-day bg-white"
          :style="{
          display: 'grid',
          gridTemplateRows: `repeat(auto-fill, 35px)`
        }"
      >
        <MultiDayEventItem
            v-for="event in getMultiDayEvents(normalizedEvents)(day.date)"
            :key="event.uid"
            :event="event"
            :date="day.date"
            @toggle-modal="$emit('toggle-modal', $event)"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { getMultiDayEvents } from '@/utils/eventFilters.js';
import MultiDayEventItem from './MultiDayEventItem.vue';

const props = defineProps({
  weekDays: {
    type: Array,
    required: true
  },
  normalizedEvents: {
    type: Array,
    required: true
  }
});

defineEmits(['toggle-modal']);
</script>
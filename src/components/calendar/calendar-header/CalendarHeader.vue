<template>
  <div>
    <CalendarNavigation
        :formatted-week="formattedWeek"
        @prev-week="$emit('prev-week')"
        @next-week="$emit('next-week')"
    />

    <CalendarWeekDays
        :week-days="weekDays"
        :today-i-s-o="todayISO"
    />
  </div>
</template>

<script setup>
import CalendarNavigation from './CalendarNavigation.vue';
import CalendarWeekDays from './CalendarWeekDays.vue';

defineProps({
  formattedWeek: {
    type: String,
    required: true
  },
  weekDays: {
    type: Array,
    required: true
  },
  todayISO: {
    type: String,
    required: true
  }
});

defineEmits(['prev-week', 'next-week']);
</script>
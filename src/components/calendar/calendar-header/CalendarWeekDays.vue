<template>
  <div class="calendar-semi-header flex">
    <div class="w-[65px] bg-[#fff]"></div>

    <div class="calendar-week-day-grid grid grid-cols-7 flex-1">
      <div
          v-for="day in weekDays"
          :key="day.date"
          class="calendar-week-day bg-white"
      >
        <h3
            :class="[
            day.date === todayISO
              ? 'bg-[#31776c] text-white'
              : 'bg-[#f5f5f5] transition duration-300 ease-in-out hover:bg-[#e0e0e0]',
            'font-semibold m-2 rounded-md shadow-sm text-center p-1.5'
          ]"
        >
          {{ day.label }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  weekDays: {
    type: Array,
    required: true
  },
  todayISO: {
    type: String,
    required: true
  }
});
</script>
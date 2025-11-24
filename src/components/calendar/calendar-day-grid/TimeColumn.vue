<template>
  <div class="time-column w-[65px] bg-[#fff] border-[#ddd] pb-4">
    <div
        v-for="hour in hours"
        :key="hour.value"
        class="time-slot flex items-center justify-center text-sm h-[50px]"
    >
      {{ hour.label }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  hours: {
    type: Array,
    required: true
  }
});
</script>
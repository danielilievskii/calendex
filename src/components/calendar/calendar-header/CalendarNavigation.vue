<template>
  <div class="calendar-header rounded-md flex justify-between align-center px-4 py-4 font-bold text-lg">
    <button
        class="px-3.5 py-1 rounded-md bg-gray-100 hover:bg-gray-300 duration-200"
        @click="$emit('prev-week')"
    >
      ‹
    </button>
    <h2 class="hidden sm:block">{{ formattedWeek }}</h2>
    <h2 class="sm:hidden">{{ formattedShortWeek }}</h2>
    <button
        class="px-3.5 py-1 rounded-md bg-gray-100 hover:bg-gray-300 duration-200"
        @click="$emit('next-week')"
    >
      ›
    </button>
  </div>
</template>

<script setup>
defineProps({
  formattedWeek: {
    type: String,
    required: true
  },
  formattedShortWeek: {
    type: String,
    required: true
  }
});

defineEmits(['prev-week', 'next-week']);
</script>
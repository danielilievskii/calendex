<template>
  <div class="flex items-end justify-end px-5 pt-6 pb-4">
    <button
        class="sidebar-toggle-inner flex items-center justify-center w-9 h-9 rounded-lg bg-white hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
        @click="$emit('toggle')"
        aria-label="Toggle sidebar"
    >
      <ChevronLeftIcon class="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors"/>
    </button>
  </div>

  <div class="flex justify-center">
    <img src="/calendex-black.png" alt="Calendex Logo" width="180" height="20"/>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';

defineEmits<{
  toggle: []
}>();
</script>

<style scoped>
.sidebar-toggle-inner:active {
  transform: scale(0.95);
}
</style>
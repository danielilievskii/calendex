<template>
  <Transition name="toggle-fade">
    <button
        v-if="sidebarStore.isSidebarCollapsed"
        class="sidebar-toggle-external fixed top-7 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-lg bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
        @click="sidebarStore.toggleSidebar"
        aria-label="Open sidebar"
    >
      <Bars3Icon class="h-5 w-5 text-gray-700 group-hover:text-gray-900 transition-colors"/>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { useSidebarStore } from '@/stores/sidebar';

const sidebarStore = useSidebarStore();
</script>

<style scoped>
.toggle-fade-enter-active,
.toggle-fade-leave-active {
  transition: all 0.2s ease;
}

.toggle-fade-enter-from,
.toggle-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.sidebar-toggle-external:active {
  transform: scale(0.95);
}
</style>
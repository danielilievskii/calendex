<template>
  <Transition name="fade">
    <div
        v-if="!sidebarStore.isSidebarCollapsed"
        class="sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        @click="sidebarStore.toggleSidebar"
    ></div>
  </Transition>
</template>

<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar';

const sidebarStore = useSidebarStore();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
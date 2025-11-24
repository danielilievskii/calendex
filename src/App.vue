<script setup>
import { onMounted, onUnmounted } from "vue";
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/toast'

import { useSidebarStore } from '@/stores/sidebar';
import { useCalendarStore } from '@/stores/calendar';
import Sidebar from "@/components/layout/Sidebar.vue";

const sidebarStore = useSidebarStore();
const calendarStore = useCalendarStore()


let intervalId = null;

onMounted(() => {
  // calendarStore.refreshCalendars();
  calendarStore.updateFilteredEvents();

  intervalId = setInterval(async () => {
    await calendarStore.refreshCalendars();
    calendarStore.updateFilteredEvents();
  }, 600000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});


</script>

<template>
  <Sidebar />
  <div :class="['transition-all duration-300', sidebarStore.isSidebarCollapsed ? 'ml-0': 'lg:ml-[300px]']">
    <RouterView  />
    <Toaster />
  </div>
</template>



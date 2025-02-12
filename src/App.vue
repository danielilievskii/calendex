<script setup>
import { onMounted, onUnmounted } from "vue";
import { RouterView } from 'vue-router'
import SidebarView from "@/views/SidebarView.vue";
import { Toaster } from '@/components/ui/toast'

import { useSidebarStore } from '@/stores/sidebar';
import { useCalendarStore } from '@/stores/calendar';

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
  <SidebarView/>
  <div :class="['transition-all duration-300', sidebarStore.isSidebarCollapsed ? 'ml-0': 'lg:ml-[300px]']">
    <RouterView  />
    <Toaster />
  </div>
</template>



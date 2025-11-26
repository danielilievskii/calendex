<script setup>
import { onMounted, onUnmounted } from "vue";
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/toast'

import { useSidebarStore } from '@/stores/sidebar';
import { useCalendarStore } from '@/stores/calendar';
import Sidebar from "@/components/layout/sidebar/Sidebar.vue";

const sidebarStore = useSidebarStore();
const calendarStore = useCalendarStore()


let intervalId = null;

onMounted(() => {
  // calendarStore.refreshCalendars();
  calendarStore.updateFilteredEvents();

  if (window.innerWidth < 1024) {
    sidebarStore.isSidebarCollapsed = true;
  }

  window.addEventListener('resize', handleResize);

  intervalId = setInterval(async () => {
    await calendarStore.refreshCalendars();
    calendarStore.updateFilteredEvents();
  }, 600000);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);

  if (intervalId) {
    clearInterval(intervalId);
  }
});

const handleResize = () => {
  const isMobile = window.innerWidth < 1024;

  if (isMobile && !sidebarStore.isSidebarCollapsed) {}
  else if (!isMobile && sidebarStore.isSidebarCollapsed) {
    sidebarStore.isSidebarCollapsed = false;
  }
};

</script>

<template>
  <div class="app-container">
    <Sidebar />
    <main :class="['main-content transition-all duration-300',
                   sidebarStore.isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded']">
      <RouterView />
      <Toaster />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  min-width: 0;
  width: 100%;
}

@media (max-width: 1023px) {
  .main-content {
    margin-left: 0 !important;
  }
}

@media (min-width: 1024px) {
  .main-content.sidebar-expanded {
    margin-left: 300px;
  }

  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>



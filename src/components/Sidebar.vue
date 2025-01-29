<template>
  <!-- Sidebar Toggle Button -->
  <span
      class="fixed text-white text-4xl top-5 left-4 cursor-pointer z-50"
      @click="sidebarStore.toggleSidebar">
    <i :class="['bi-filter-left px-2 rounded-md transition-all',
        sidebarStore.isSidebarCollapsed ? 'bg-blue-700' : 'bg-gray-900'
      ]"
    ></i>
  </span>

  <!-- Sidebar -->
  <div :class="['sidebar fixed top-0 bottom-0 h-screen shadow overflow-y-auto transition-all duration-300',
      sidebarStore.isSidebarCollapsed ? 'w-0 lg:w-[0px]' : 'w-[300px] lg:w-[300px]']">

    <div class="relative left-20 top-6" v-if="!sidebarStore.isSidebarCollapsed">
      <img src="/public/calendex.png" alt="" width="200">
    </div>
    
    <!-- Sidebar Content -->
    <div class="text-xl pt-12 lg:pt-12" v-if="!sidebarStore.isSidebarCollapsed">

      <Calendar v-model="value" :weekday-format="'short'" class="rounded-md border mx-auto lg:w-[280px]" />

      <hr class="my-3" />

      <nav>
        <RouterLink to="/"
            class="side-link p-2.5 mt-2 flex items-center rounded-md mx-5 duration-200 cursor-pointer">
          <i class="bi bi-calendar2-day"></i>
          <span class="text-[18px] ml-4"> Calendar </span>
        </RouterLink>

        <RouterLink to="/events"
            class="side-link p-2.5 mt-2 flex items-center rounded-md mx-5 duration-200 cursor-pointer">
          <i class="fa-solid fa-list"></i>
          <span class="text-[18px] ml-4">Events</span>
        </RouterLink>
      </nav>

      <hr class="my-4" />

      <!-- Dropdown Section -->
      <div class="side-link py-1 px-2.5 mt-2 flex items-center rounded-md mx-5 duration-200 cursor-pointer"
          @click="toggleDropdown">
        <div class="flex items-center gap-2">

          <span class="text-sm transition-transform" :class="{ '-rotate-90': !dropdownOpen }">
            <i class="bi bi-caret-down-fill"></i>
          </span>
          <span class="text-[15px]">All calendars</span>
        </div>
      </div>
      <div class="text-left text-sm font-thin mt-2 w-4/5 mx-auto" v-if="dropdownOpen">
        <div v-if="calendarStore.calendars.length === 0" class="px-2 py-1">
          Empty
        </div>
        <label v-else v-for="calendar in calendarStore.calendars" :key="calendar.id" 
        class="flex items-center cursor-pointer px-2 py-1 side-link rounded-md mt-1" 
        :style="{ backgroundColor: calendar.color}"
        >
          <input type="checkbox" :value="calendar.name" v-model="selectedCalendars" class="form-checkbox rounded-md" />
            <span class="ml-2 text-black text-lg font-bold">{{calendar.name}}</span>
        </label>
      </div>

      <div class="flex justify-center mt-5">
        <RouterLink to="/calendar-import" class="inline-flex">
          <button class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 duration-200 rounded-lg">
            Import calendar
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Calendar from "@/components/ui/calendar/Calendar.vue";
import { getLocalTimeZone, today } from '@internationalized/date'
import { useSidebarStore } from '@/stores/sidebar';
import { useCalendarStore } from '@/stores/calendar';

const sidebarStore = useSidebarStore();
const calendarStore = useCalendarStore();

const selectedCalendars = ref([]);

watch(selectedCalendars, (newVal) => {
  calendarStore.updateFilteredEvents(newVal)
}, { immediate: true });

const value = ref(today(getLocalTimeZone()))

const dropdownOpen = ref(true);
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

</script>

<style scoped>
.sidebar {
  background: #F6F5F8;
}

.side-link:hover, h1:hover {
  background: #E2E1E6;
}

nav a.router-link-exact-active {
  background: #E2E1E6;
}
</style>

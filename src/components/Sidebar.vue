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
            class="side-hover p-2.5 mt-2 flex items-center rounded-md mx-5 duration-200 cursor-pointer">
          <i class="bi bi-calendar2-day"></i>
          <span class="text-[18px] ml-4"> Calendar </span>
        </RouterLink>

        <RouterLink to="/events"
            class="side-hover p-2.5 mt-2 flex items-center rounded-md mx-5 duration-200 cursor-pointer">
          <i class="fa-solid fa-list"></i>
          <span class="text-[18px] ml-4">Events</span>
        </RouterLink>
        <RouterLink to="/faq"
            class="side-hover p-2.5 mt-2 flex items-center rounded-md mx-5 duration-200 cursor-pointer">
            <i class="bi bi-info-circle"></i>
          <span class="text-[18px] ml-4">Help & FAQ</span>
        </RouterLink>
      </nav>

      <hr class="my-4" />

      <!-- Dropdown Section -->
      <div class="side-hover py-1 px-2.5 mt-2 flex items-center rounded-md mx-5 duration-200 cursor-pointer"
          @click="toggleDropdown">
        <div class="flex items-center gap-2">

          <span class="text-sm transition-transform" :class="{ '-rotate-90': !dropdownOpen }">
            <i class="bi bi-caret-down-fill"></i>
          </span>
          <span class="text-[15px] tracking-widest font-semibold">ALL CALENDARS</span>
        </div>
      </div>
      <div class="text-left text-sm font-thin mt-2 w-4/5 mx-auto" v-if="dropdownOpen">
        <div v-if="calendarStore.calendars.length === 0" class="px-2 py-1">
          Empty
        </div>
        <label v-else v-for="calendar in calendarStore.calendars" :key="calendar.id" 
        class="flex items-center flex-row justify-between w-full side-hover cursor-pointer px-2 rounded-md mt-1"
        >
          <div class="flex items-center">
            <div class="relative h-5 w-5">
              <input type="checkbox" :value="calendar.name" v-model="selectedCalendars"
                     class="h-5 w-5 rounded-md appearance-none border-2 cursor-pointer transition-all duration-150 ease-in-out"
                     :class="[selectedCalendars.includes(calendar.name) ? colorStore.getBackgroundColor(calendar.color) : 'bg-white',
                            colorStore.getBorderColor(calendar.color)
               ]"/>
              <svg v-if="selectedCalendars.includes(calendar.name)"
                   class="absolute inset-0 m-auto h-4 w-4 text-white"
                   fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span :class="['ml-2 font-[600] text-[15px]']"
                  :style="{color: selectedCalendars.includes(calendar.name) ? '#000000' : '#c4c4c7'}"
            >{{calendar.name}}
            </span>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger class="">
                <Button variant="ghost" size="icon" class="side-hover rounder-50">
                  <MoreVerticalIcon class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="editCalendar(calendar.id)">Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="text-red-500" @click="deleteCalendar(calendar.id)">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </label>
      </div>

      <div class="flex justify-center mt-5">
        <RouterLink to="/calendar-import" class="inline-flex">
          <button class="bg-[#587acc] hover:bg-[#6c8ccf] text-lg font-medium text-white py-2 px-4 duration-200 rounded-lg">
            + Import Calendar
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Calendar from "@/components/ui/calendar/Calendar.vue";
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import Button from '@/components/ui/button/Button.vue'

import { useSidebarStore } from '@/stores/sidebar';
import { useCalendarStore } from '@/stores/calendar';
import { useColorStore } from '@/stores/colors';

import {MoreVerticalIcon} from 'lucide-vue-next'

import { ref, watch } from "vue";
import { getLocalTimeZone, today } from '@internationalized/date'


const sidebarStore = useSidebarStore();
const calendarStore = useCalendarStore();
const colorStore = useColorStore();

const selectedCalendars = ref([]);

watch(selectedCalendars, (newVal) => {
  calendarStore.updateFilteredEvents(newVal)
}, { immediate: true });

const value = ref(today(getLocalTimeZone()))

const dropdownOpen = ref(true);
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

const deleteCalendar = (id: string) => {
  calendarStore.deleteCalendar(id);
};

const editCalendar = (id: string) => {
  const newName = prompt("Enter new calendar name:");
  if (newName) {
    calendarStore.editCalendarName(id, newName);
  }
};

</script>

<style scoped>
.sidebar {
  background: #F6F5F8;
}

.side-hover:hover, h1:hover {
  background: #E2E1E6 !important;
}

.rounder-50 {
  border-radius: 50% !important;
}

nav a.router-link-exact-active {
  background: #E2E1E6;
}
</style>

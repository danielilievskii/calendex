<template>
  <!-- Sidebar Toggle Button -->
  <span
      class="fixed text-white text-4xl top-5 left-4 cursor-pointer z-50"
      @click="sidebarStore.toggleSidebar">
    <i :class="['bi-filter-left px-2 rounded-md transition-all',
        sidebarStore.isSidebarCollapsed ? 'bg-[#3e9c86]' : 'bg-gray-900'
      ]"
    ></i>
  </span>

  <!-- Sidebar -->
  <div :class="['sidebar  bg-[#F6F5F8] fixed top-0 bottom-0 h-screen shadow overflow-y-auto transition-all duration-300 z-40',
      sidebarStore.isSidebarCollapsed ? 'w-0 lg:w-[0px]' : 'w-[300px] lg:w-[300px]']">

    <div class="relative left-20 top-6" v-if="!sidebarStore.isSidebarCollapsed">
      <img src="/calendex.png" alt="" width="210">
    </div>

    <!-- Sidebar Content -->
    <div class="text-xl pt-12 lg:pt-12" v-if="!sidebarStore.isSidebarCollapsed">

      <Calendar v-model="value" :weekday-format="'short'" class="rounded-md border mx-auto lg:w-[280px]"/>

      <hr class="my-3"/>

      <nav>
        <RouterLink to="/"
                    class="side-hover px-2.5 py-1.5 mt-1 flex items-center rounded-md mx-5 duration-200 cursor-pointer">
          <i class="bi bi-calendar2-day"></i>
          <span class="text-[18px] ml-4"> Calendar </span>
        </RouterLink>

        <RouterLink to="/agenda"
                    class="side-hover px-2.5 py-1.5 mt-1 flex items-center rounded-md mx-5 duration-200 cursor-pointer">
          <i class="fa-solid fa-list"></i>
          <span class="text-[18px] ml-4">Agenda</span>
        </RouterLink>


      </nav>

      <hr class="my-4"/>

      <!-- Dropdown Section -->
      <div class="flex items-center gap-2">
        <div class="side-hover py-1 px-2.5 flex w-3/5 items-center rounded-md mx-5 duration-200 cursor-pointer"
             @click="toggleDropdown">
          <div class="flex items-center gap-2">

          <span class="text-sm transition-transform" :class="{ '-rotate-90': !dropdownOpen }">
            <i class="bi bi-caret-down-fill"></i>
          </span>
            <span class="text-[15px] tracking-widest font-semibold">CALENDARS</span>

          </div>
        </div>
        <RouterLink to="/calendar-import" class="inline-flex">
          <button
              class="bg-[#31776c] hover:bg-[#3e9c86] w-8 h-8 text-[20px] font-semibold text-white duration-200 rounded-full">
            <i class="fa-solid fa-plus"></i></button>
        </RouterLink>

      </div>

      <div class="text-left text-sm font-thin mt-2 w-4/5 mx-auto" v-if="dropdownOpen">
        <div v-if="calendarStore.calendars.length === 0" class="px-2 py-1">
          Empty
        </div>
        <label v-else v-for="calendar in calendarStore.calendars" :key="calendar.uid"
               class="flex items-center flex-row justify-between w-full side-hover cursor-pointer px-2 rounded-md mt-1"
        >
          <div class="flex items-center">
            <div class="relative h-5 w-5">
              <input type="checkbox" :value="calendar.uid" @click="selectCalendar(calendar.uid)"
                     class="h-5 w-5 rounded-md appearance-none border-2 cursor-pointer transition-all duration-150 ease-in-out"
                     :class="[selectedCalendars.includes(calendar.uid) ? colorStore.getBackgroundColor(calendar.color) : 'bg-white',
                            colorStore.getBorderColor(calendar.color)
               ]"/>
              <svg v-if="selectedCalendars.includes(calendar.uid)"
                   class="absolute inset-0 m-auto h-4 w-4 text-white"
                   fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span :class="['ml-2 font-[600] text-[15px]']"
                  :style="{color: selectedCalendars.includes(calendar.uid) ? '#000000' : '#c4c4c7'}"
            >{{ calendar.name }}
            </span>
          </div>


          <div>
            <DropdownMenu>
              <DropdownMenuTrigger class="">
                <Button variant="ghost" size="icon" class="side-hover rounder-50">
                  <MoreVerticalIcon class="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <RouterLink :to="{path:'/calendar-import', query:{id: calendar.uid}}">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </RouterLink>
                <DropdownMenuSeparator/>
                <DropdownMenuItem class="text-red-500" @click="deleteCalendar(calendar.uid, calendar.name)">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </label>
      </div>

      <!--      <div class="flex justify-center mt-5">-->
      <!--        <RouterLink to="/calendar-import" class="inline-flex">-->
      <!--          <button class="bg-[#31776c] hover:bg-[#3e9c86] text-md font-medium text-white py-2 px-4 duration-200 rounded-lg">-->
      <!--            + Add calendar-->
      <!--          </button>-->
      <!--        </RouterLink>-->
      <!--      </div>-->


      <hr class="my-4"/>

      <nav class="absolute bottom-0 w-full">
        <RouterLink to="/guides"
                    class="side-hover px-2.5 py-1.5 mt-1 flex items-center rounded-md mx-5 duration-200 cursor-pointer">
          <i class="bi bi-info-circle"></i>

          <span class="text-[18px] ml-4">Guides</span>
        </RouterLink>
        <RouterLink to="/faq"
                    class="side-hover px-2.5 py-1.5 mt-1 flex items-center rounded-md mx-5 duration-200 cursor-pointer">

          <i class="bi bi-question-circle"></i>

          <span class="text-[18px] ml-4">FAQ</span>
        </RouterLink>
      </nav>

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
import { useToast } from '@/components/ui/toast/use-toast'

import {useSidebarStore} from '@/stores/sidebar';
import {useCalendarStore} from '@/stores/calendar';
import {useColorStore} from '@/stores/colors';

import {MoreVerticalIcon} from 'lucide-vue-next'

import {computed, ref, watch} from "vue";
import {getLocalTimeZone, today} from '@internationalized/date'
import router from "@/router";


const sidebarStore = useSidebarStore();
const calendarStore = useCalendarStore();
const colorStore = useColorStore();

const { toast } = useToast()

const selectedCalendars = computed(() =>
    calendarStore.calendars.filter(cal => cal.selected).map(cal => cal.uid)
);

watch(selectedCalendars, (newVal) => {
  calendarStore.updateFilteredEvents(newVal)
}, {immediate: true});

const value = ref(today(getLocalTimeZone()))

const dropdownOpen = ref(true);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

const selectCalendar = (uid: string) => {
    calendarStore.selectCalendar(uid)
}

const deleteCalendar = (uid: string, name) => {

  toast({
    title: `The calendar has been deleted successfully. `,
    variant: 'success'
  });

  calendarStore.deleteCalendar(uid);
};


</script>

<style scoped>
.sidebar {
  /*background: #F6F5F8;*/
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

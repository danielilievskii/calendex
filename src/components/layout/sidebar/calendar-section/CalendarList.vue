<template>
  <div class="text-left text-sm font-thin mt-2 w-4/5 mx-auto">
    <div v-if="calendarStore.calendars.length === 0" class="px-2 py-1">
      Empty
    </div>

    <CalendarItem
        v-else
        v-for="calendar in calendarStore.calendars"
        :key="calendar.uid"
        :calendar="calendar"
        :is-selected="selectedCalendars.includes(calendar.uid)"
        @select="selectCalendar"
        @delete="deleteCalendar"
        @close-mobile="$emit('close-mobile')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import { useToast } from '@/components/ui/toast/use-toast';
import CalendarItem from './CalendarItem.vue';

defineEmits<{
  'close-mobile': []
}>();

const calendarStore = useCalendarStore();
const { toast } = useToast();

const selectedCalendars = computed(() =>
    calendarStore.calendars.filter(cal => cal.selected).map(cal => cal.uid)
);

const selectCalendar = (uid: string) => {
  calendarStore.selectCalendar(uid);
  calendarStore.updateFilteredEvents();
};

const deleteCalendar = (uid: string) => {
  toast({
    title: `The calendar has been deleted successfully.`,
    variant: 'success'
  });

  calendarStore.deleteCalendar(uid);
  calendarStore.updateFilteredEvents();
};
</script>
<template>
  <div
      class="event absolute p-1.5 rounded-md text-sm shadow-md border-l-[5px] cursor-pointer overflow-hidden"
      :style="eventStyle"
      :class="[
      colorStore.getBorderColor(event.calendarColor),
      colorStore.getBackgroundLightColor(event.calendarColor)
    ]"
  >
    <h2 class="font-semibold truncate whitespace-nowrap">{{ event.summary }}</h2>
    <p class="text-gray-500">{{ event.formattedDuration }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {useColorStore} from "@/stores/colors.js";
import {getSingleDayEventStyle} from "@/utils/eventStyleUtils.js";

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  filteredEventsByDate: {
    type: Array,
    required: true
  },
  dayDate: {
    type: String,
    required: true
  },
});

const colorStore = useColorStore();

const eventStyle = computed(() => {
  return getSingleDayEventStyle(props.event, props.dayDate, props.filteredEventsByDate);
});
</script>
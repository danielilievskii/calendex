<template>
  <div
      class="event p-1.5 text-sm mb-1 cursor-pointer overflow-hidden"
      :style="getMultiDayEventStyle(event, date)"
      :class="[
      colorStore.getBorderColor(event.calendarColor),
      colorStore.getBackgroundLightColor(event.calendarColor)
    ]"
      @click="$emit('toggle-modal', event)"
  >
    <h2 class="font-semibold text-center">{{ event.summary }}</h2>
  </div>
</template>

<script setup>
import { useColorStore } from "@/stores/colors.js";
import { getMultiDayEventStyle } from "@/utils/eventStyleUtils.js";

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

const colorStore = useColorStore();

defineEmits(['toggle-modal']);
</script>
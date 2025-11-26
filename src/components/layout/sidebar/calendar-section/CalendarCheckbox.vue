<template>
  <div class="relative h-5 w-5">
    <input
        type="checkbox"
        :value="calendarUid"
        @click="$emit('select')"
        class="h-5 w-5 rounded-md appearance-none border-2 cursor-pointer transition-all duration-150 ease-in-out"
        :class="checkboxClasses"
        :aria-label="`Toggle calendar`"
    />

    <svg
        v-if="isSelected"
        class="absolute inset-0 m-auto h-4 w-4 text-white pointer-events-none"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useColorStore } from '@/stores/colors';

const props = defineProps<{
  calendarUid: string
  calendarColor: string
  isSelected: boolean
}>();

defineEmits<{
  select: []
}>();

const colorStore = useColorStore();

const checkboxClasses = computed(() => [
  props.isSelected ? colorStore.getBackgroundColor(props.calendarColor) : 'bg-white',
  colorStore.getBorderColor(props.calendarColor)
]);
</script>
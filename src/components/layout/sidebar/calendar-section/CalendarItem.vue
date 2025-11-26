<template>
  <label class="flex items-center flex-row justify-between w-full side-hover cursor-pointer px-2 rounded-md mt-1">
    <div class="flex items-center">
      <CalendarCheckbox
          :calendar-uid="calendar.uid"
          :calendar-color="calendar.color"
          :is-selected="isSelected"
          @select="$emit('select', calendar.uid)"
      />

      <span
          :class="['ml-2 font-[600] text-[15px]']"
          :style="{color: isSelected ? '#000' : '#c4c4c7'}"
      >
        {{ calendar.name }}
      </span>
    </div>

    <CalendarActions
        :calendar-uid="calendar.uid"
        @delete="$emit('delete', calendar.uid)"
        @close-mobile="$emit('close-mobile')"
    />
  </label>
</template>

<script setup lang="ts">
import CalendarCheckbox from './CalendarCheckbox.vue';
import CalendarActions from './CalendarActions.vue';

interface Calendar {
  uid: string
  name: string
  color: string
}

defineProps<{
  calendar: Calendar
  isSelected: boolean
}>();

defineEmits<{
  select: [uid: string]
  delete: [uid: string]
  'close-mobile': []
}>();
</script>

<style scoped>
.side-hover:hover {
  background: #e2eff0 !important;
}
</style>
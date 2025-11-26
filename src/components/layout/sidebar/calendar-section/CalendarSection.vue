<template>
  <div>
    <CalendarSectionHeader
        :is-open="dropdownOpen"
        @toggle="toggleDropdown"
        @close-mobile="$emit('close-mobile')"
    />

    <CalendarList
        v-if="dropdownOpen"
        @close-mobile="$emit('close-mobile')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CalendarSectionHeader from "@/components/layout/sidebar/calendar-section/CalendarSectionHeader.vue";
import CalendarList from "@/components/layout/sidebar/calendar-section/CalendarList.vue";

defineEmits<{
  'close-mobile': []
}>();

const dropdownOpen = ref(true);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
</script>
<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/toast'
import { useSidebarStore } from '@/stores/sidebar';
import SidebarView from "@/views/SidebarView.vue";
const sidebarStore = useSidebarStore();

</script>

<template>
  <SidebarView/>
  <div :class="['transition-all duration-300', sidebarStore.isSidebarCollapsed ? 'ml-0': 'lg:ml-[300px]']">
    <RouterView  />
    <Toaster />
  </div>
</template>



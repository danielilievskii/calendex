<template>
  <SidebarOverlay/>

  <aside :class="sidebarClasses">
    <SidebarHeader @toggle="sidebarStore.toggleSidebar"/>

    <div class="text-xl flex-1 mt-12">
      <hr class="my-3"/>
      <SidebarNavigation @close-mobile="closeSidebarOnMobile"/>
      <hr class="my-4"/>
      <CalendarSection @close-mobile="closeSidebarOnMobile"/>
    </div>

    <SidebarFooter/>
  </aside>

  <SidebarToggleButton/>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useSidebarStore} from '@/stores/sidebar';
import SidebarOverlay from './SidebarOverlay.vue';
import SidebarHeader from './SidebarHeader.vue';
import SidebarNavigation from './SidebarNavigation.vue';
import SidebarFooter from './SidebarFooter.vue';
import SidebarToggleButton from './SidebarToggleButton.vue';
import CalendarSection from './calendar-section/CalendarSection.vue';

const sidebarStore = useSidebarStore();

const sidebarClasses = computed(() => [
  'sidebar fixed top-0 left-0 bottom-0 h-full bg-[#F6F5F8] shadow-2xl overflow-y-auto transition-transform duration-300 z-40 flex flex-col',
  sidebarStore.isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
]);

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024 && !sidebarStore.isSidebarCollapsed) {
    sidebarStore.toggleSidebar();
  }
};
</script>

<style scoped>
@media (max-width: 1023px) {
  .sidebar {
    width: 370px;
  }
}

@media (min-width: 1024px) {
  .sidebar {
    width: 300px;
  }
}
</style>
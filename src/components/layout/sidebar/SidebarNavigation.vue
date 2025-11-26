<template>
  <nav>
    <RouterLink
        v-for="item in sidebarItems"
        :key="item.to"
        :to="item.to"
        class="side-hover px-4 py-2 mx-3 mt-1 flex items-center rounded-lg transition-all duration-100 cursor-pointer"
        @click="$emit('close-mobile')"
    >
      <component :is="item.icon" class="w-6 h-6 text-gray-400"/>
      <span class="text-[18px] ml-4">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { sidebarItems } from '@/config/sidebarItems';

defineEmits<{
  'close-mobile': []
}>();
</script>

<style scoped>
.side-hover:hover {
  background: #e2eff0 !important;
}

nav a.router-link-exact-active {
  background: #e2eff0;
  border-left: 3px solid #139874;
  color: #139874;
}

nav a.router-link-exact-active svg {
  color: #139874;
}
</style>
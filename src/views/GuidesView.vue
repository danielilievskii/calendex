<template>
  <section :class="isMobileView ? 'md:px-24 px-6 py-16' : 'md:px-24'">
    <Guides/>
  </section>
</template>

<style>
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Guides from "@/components/Guides.vue";

const isMobileView = ref(false);

const checkMobileView = () => {
  isMobileView.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobileView();
  window.addEventListener('resize', checkMobileView);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobileView);
});
</script>
<template>
  <section class="z-50">
    <Sidebar/>
  </section>

</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
<script setup>
import Sidebar from "@/components/Sidebar.vue";
</script>
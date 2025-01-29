<template>
  <section class="p-24">
    <Calendar/>
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
import Calendar from "@/components/Calendar.vue";
</script>

<template>
  <section class="p-24">
    <ImportCalendar/>
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
import ImportCalendar from "@/components/ImportCalendar.vue";
</script>

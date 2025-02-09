<template>
  <section class="md:px-24 md:py-24 p-6 pt-20">
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

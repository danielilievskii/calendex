<template>
  <section class="p-24">
    <Events/>
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
import Events from "@/components/Agenda.vue";
</script>
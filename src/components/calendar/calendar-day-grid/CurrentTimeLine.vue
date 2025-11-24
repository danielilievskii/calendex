<template>
  <div
      class="current-time-line absolute left-0 right-0 w-full h-[2px]
           before:absolute before:text-white before:left-[-65px] before:top-[-10px] before:text-sm before:font-bold
           before:z-5 before:px-1.5 before:py-0.5 before:bg-cornflowerblue before:rounded"
      :currentTime="currentTime"
  >
  </div>
</template>

<script setup>
defineProps({
  currentTime: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.current-time-line {
  background: #B8001F;
  z-index: 20;
}

.current-time-line::before {
  content: attr(currentTime);
  background-color: #B8001F;
}
</style>
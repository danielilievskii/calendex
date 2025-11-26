<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <div v-if="title || subtitle" class="text-center mb-12 md:mb-12">
      <h1 v-if="title" class="text-4xl md:text-4xl lg:text-4xl font-bold text-[#31776c] mb-4">
        {{ title }}
      </h1>

      <p v-if="subtitle" class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
        {{ subtitle }}
      </p>
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: false
  },
  subtitle: {
    type: String,
    required: false
  }
})
</script>

<style scoped></style>

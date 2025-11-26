<template>
  <div class="flex items-center gap-2">
    <div
        class="side-hover py-1 px-2.5 flex w-3/5 items-center rounded-md mx-5 duration-200 cursor-pointer"
        @click="$emit('toggle')"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm transition-transform" :class="{ '-rotate-90': !isOpen }">
          <i class="bi bi-caret-down-fill"></i>
        </span>
        <span class="text-[15px] tracking-widest font-semibold">CALENDARS</span>
      </div>
    </div>

    <RouterLink to="/calendar-import" class="inline-flex" @click="$emit('close-mobile')">
      <button
          class="bg-[#31776c] hover:bg-[#3e9c86] w-8 h-8 text-[20px] font-semibold text-white duration-200 rounded-full shadow-md hover:shadow-lg"
          aria-label="Add calendar"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>();

defineEmits<{
  toggle: []
  'close-mobile': []
}>();
</script>

<style scoped>
.side-hover:hover {
  background: #e2eff0 !important;
}
</style>
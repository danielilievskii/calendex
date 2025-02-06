<template>
  <!-- Modal Background -->
  <Transition >
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <!-- Modal Box -->
      <Transition>
        <div class="bg-white w-[90%] max-w-lg p-6 rounded-lg shadow-lg relative transform transition-all">
          <!-- Header -->
          <div class="flex items-center justify-between border-b pb-3">
            <h2 class="text-xl font-semibold text-gray-800">
              <i class="bi bi-calendar-event mr-2 text-[#52b788]"></i> Event Details
            </h2>
            <button
                class="text-gray-500 hover:text-gray-700"
                @click="toggleModal()"
            >
              <i class="bi bi-x-circle text-2xl"></i>
            </button>
          </div>

          <!-- Event Info -->
          <div class="mt-4 space-y-3 text-gray-700">
            <p v-if="props.selectedEvent?.summary" class="text-lg font-semibold text-center">
              <i class="bi bi-card-text mr-2"></i>{{ props.selectedEvent.summary }}
            </p>

            <p v-if="props.selectedEvent?.description" class="text-sm">
              <i class="bi bi-chat-left-text mr-2 text-gray-500"></i>{{ props.selectedEvent.description }}
            </p>

            <p v-if="props.selectedEvent?.location" class="text-sm">
              <i class="bi bi-geo-alt mr-2 text-red-500"></i>{{ props.selectedEvent.location }}
            </p>

            <p v-if="props.selectedEvent?.formattedDuration" class="text-sm">
              <i class="bi bi-clock mr-2 text-blue-500"></i> Duration: {{ props.selectedEvent.formattedDuration }}
            </p>

            <p v-if="props.selectedEvent?.startDate" class="text-sm">
              <i class="bi bi-calendar-check mr-2 text-green-500"></i> Start: {{ props.selectedEvent.startDate }}
            </p>

            <p v-if="props.selectedEvent?.endDate" class="text-sm">
              <i class="bi bi-calendar-x mr-2 text-red-500"></i> End: {{ props.selectedEvent.endDate }}
            </p>

            <p v-if="props.selectedEvent?.freq" class="text-sm">
              <i class="bi bi-repeat mr-2 text-purple-500"></i> Frequency: {{ props.selectedEvent.freq }}
            </p>

            <p v-if="props.selectedEvent?.until" class="text-sm">
              <i class="bi bi-calendar-event mr-2 text-orange-500"></i> Until: {{ props.selectedEvent.until }}
            </p>

            <p v-if="props.selectedEvent?.count" class="text-sm">
              <i class="bi bi-hash mr-2 text-indigo-500"></i> Count: {{ props.selectedEvent.count }}
            </p>

            <p v-if="props.selectedEvent?.interval" class="text-sm">
              <i class="bi bi-arrow-repeat mr-2 text-cyan-500"></i> Interval: {{ props.selectedEvent.interval }}
            </p>

            <p v-if="props.selectedEvent?.wkst" class="text-sm">
              <i class="bi bi-list-task mr-2 text-gray-500"></i> Week Start: {{ props.selectedEvent.wkst }}
            </p>

            <p v-if="props.selectedEvent?.byDay" class="text-sm">
              <i class="bi bi-calendar-week mr-2 text-teal-500"></i> Days: {{ props.selectedEvent.byDay }}
            </p>
          </div>

          <!-- Close Button -->
          <div class="flex justify-center mt-4">
            <button
                class="bg-[#52b788] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#409f69] transition"
                @click="toggleModal()"
            >
              Close
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import {ref, watch, watchEffect} from 'vue';

import { defineProps, defineEmits } from 'vue';

// Define props
const props = defineProps<{
  showModal: boolean;
  toggleModal: Function;
  selectedEvent?: any;
}>();

</script>


<style>

</style>

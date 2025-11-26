<template>
  <div>
    <div class="grid md:grid-cols-1 gap-6 lg:gap-8">
      <div
          v-for="(item, index) in accordionItems"
          :key="item.value"
          class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#52B788]/30"
      >
        <button
            @click="toggleItem(item.value)"
            class="w-full p-6 md:p-8 flex items-start justify-between text-left transition-colors"
            :class="openItem === item.value ? 'bg-gradient-to-r from-[#31776c]/5 to-[#52B788]/5' : ''"
        >
          <div class="flex-1 pr-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#31776c] to-[#52B788] flex items-center justify-center text-white font-bold text-sm">
                {{ index + 1 }}
              </div>
              <h3 class="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-[#31776c] transition-colors">
                {{ item.title }}
              </h3>
            </div>
          </div>
          <div class="flex-shrink-0 ml-4">
            <div
                class="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#31776c] flex items-center justify-center transition-all duration-300"
                :class="openItem === item.value ? 'bg-[#31776c] rotate-180' : ''"
            >
              <svg
                  class="w-5 h-5 transition-colors"
                  :class="openItem === item.value ? 'text-white' : 'text-gray-600 group-hover:text-white'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="openItem === item.value" class="overflow-hidden">
            <div class="px-6 md:px-8 pb-6 md:pb-8">
              <div class="pl-11 pt-2">
                <p class="text-gray-600 leading-relaxed text-sm md:text-base">
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const openItem = ref(null)

const accordionItems = ref([
  {
    value: 'item-1',
    title: 'What is an ICS file?',
    content: 'An ICS file is a calendar file saved in a universal calendar format used by several email and calendar programs. It allows you to share calendar events across different platforms seamlessly.'
  },
  {
    value: 'item-2',
    title: 'How do I find my calendar ICS file?',
    content: 'You can import an ICS file by opening it with your calendar application or by using the import feature within the application. Most calendar apps have an "Import" or "Add Calendar" option in their settings.'
  },
  {
    value: 'item-3',
    title: 'Can I share my calendar with others?',
    content: 'Yes, you can share your calendar by exporting it as an ICS file and sending it to others. This makes it easy to coordinate schedules and share event information with colleagues, friends, or family.'
  },
  {
    value: 'item-4',
    title: 'What applications support ICS files?',
    content: 'Applications like Google Calendar, Apple Calendar, Microsoft Outlook, and many others support ICS files. This universal format ensures compatibility across virtually all modern calendar applications.'
  },
  {
    value: 'item-5',
    title: 'How do I create an ICS file?',
    content: 'You can create an ICS file by exporting your calendar from your calendar application. Look for "Export," "Download," or "Save As" options in your calendar settings, then select the ICS or iCalendar format.'
  },
  {
    value: 'item-6',
    title: 'Are ICS files compatible across different platforms?',
    content: 'Yes, ICS files are designed to be compatible across different platforms and calendar applications. This cross-platform compatibility is one of the key advantages of using the ICS format.'
  },
  {
    value: 'item-7',
    title: 'What information is stored in an ICS file?',
    content: 'An ICS file typically contains event details such as title, date, time, location, description, reminders, and recurrence patterns. It can also include attendee information and time zone data.'
  },
])

const toggleItem = (value) => {
  openItem.value = openItem.value === value ? null : value
}
</script>

<style scoped>

</style>
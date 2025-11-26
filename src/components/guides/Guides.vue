<template>
  <div>
    <!-- Tabs Section -->
    <div class="max-w-3xl mx-auto">
      <Tabs v-model="selectedTab" class="flex flex-col">
        <TabsList class="self-center bg-gray-100 p-1.5 rounded-2xl mb-4 inline-flex gap-1">
          <TabsTrigger
              v-for="tab in tabs"
              :key="tab.path"
              :value="tab.path"
              class="px-6 py-3 text-sm md:text-base font-semibold rounded-xl transition-all duration-300
                data-[state=active]:bg-white data-[state=active]:text-[#31776c] data-[state=active]:shadow-md
                data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#31776c]"
          >
            <div class="flex items-center gap-2">
              <i :class="getIcon(tab.name)" class="text-lg"></i>
              <span>{{ tab.name }}</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <!-- Video Content -->
        <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <TabsContent
              v-for="tab in tabs"
              :key="tab.path"
              :value="tab.path"
              class="p-0 m-0"
          >
            <div class="relative w-full bg-gray-900" style="padding-bottom: 56.25%;">
              <video
                  class="absolute top-0 left-0 w-full h-full"
                  controls
                  playsinline
              >
                <source :src="selectedVideo" type="video/mp4"/>
                Your browser does not support the video tag.
              </video>
            </div>

            <!-- Video Info -->
            <div class="p-6 md:p-8 bg-gradient-to-br from-white to-gray-50">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#31776c] to-[#52B788] flex items-center justify-center">
                  <i :class="getIcon(tab.name)" class="text-2xl text-white"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    Import {{ tab.name }} Calendar
                  </h3>
                  <p class="text-gray-600 text-sm md:text-base">
                    Follow this step-by-step guide to find the ICS link of your {{ tab.name }} Calendar.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>

  </div>
</template>

<script setup>
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs/index.js'
import { ref, computed } from "vue"

const tabs = [
  { name: "Google", path: "google.mp4" },
  { name: "Outlook", path: "outlook.mp4" },
  { name: "Apple", path: "apple.mp4" },
]

const videos = import.meta.glob("/src/assets/guides/*.mp4", { eager: true })

const selectedTab = ref(tabs[0].path)

const selectedVideo = computed(() => videos[`/src/assets/guides/${selectedTab.value}`]?.default || "")

const getIcon = (name) => {
  const icons = {
    Google: 'bi bi-google',
    Outlook: 'bi bi-microsoft',
    Apple: 'bi bi-apple'
  }
  return icons[name] || icons.Google
}
</script>

<style scoped>

</style>
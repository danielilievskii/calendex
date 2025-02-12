<template>
  <div>
    <h1 class="text-4xl font-bold text-[#31776c] mb-8">Guides</h1>
    <Tabs v-model="selectedTab" class="mb-8 flex flex-col">
      <TabsList class="self-start p-0">
        <TabsTrigger
            v-for="(tab, index) in tabs"
            :key="tab.path"
            :value="tab.path"
            class="rounded-b-none text-lg transition-colors duration-200
              data-[state=active]:bg-white data-[state=active]:text-[#31776c]
              data-[state=inactive]:bg-[#31776c] data-[state=inactive]:text-white"
            :class="{ 'border-r border-[#40916C]': index !== tabs.length - 1 }"
        >
          {{ tab.name }}
        </TabsTrigger>
      </TabsList>
      <div class="bg-white backdrop-blur-sm rounded-b-xl rounded-r-xl shadow-lg p-6 sm:p-8 mt-0 flex justify-center">
        <TabsContent v-for="tab in tabs" :key="tab.path" :value="tab.path">
          <video class="rounded-lg mx-auto" width="80%" controls>
            <source :src="selectedVideo" type="video/mp4"/>
          </video>
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>


<script setup>
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import {ref, computed} from "vue";

const tabs = ref([
  {name: "Google", path: "google.mp4"},
  {name: "Outlook", path: "outlook.mp4"},
  {name: "Apple", path: "apple.mp4"},
]);

const videos = import.meta.glob("/src/assets/guides/*.mp4", {eager: true});

const selectedTab = ref(tabs.value[0].path);

const selectedVideo = computed(() => videos[`/src/assets/guides/${selectedTab.value}`]?.default || "");

</script>

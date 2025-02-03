<template>
  <h1 class="text-4xl font-bold text-[#31776c] mb-8">Guides</h1>

  <div class="min-h-screen ">
    <div class="">

      <Tabs default-value="Google" class="mb-8 flex flex-col">
        <TabsList class="self-start p-0">
          <TabsTrigger
            v-for="(tab, index) in tabs"
            :key="tab"
            :value="tab"
            class="rounded-b-none text-lg transition-colors duration-200 
            data-[state=active]:bg-white data-[state=active]:text-[##52B788]
            data-[state=inactive]:bg-[#B7E4C7] data-[state=inactive]:text-[#40916C]"
            :class="{
              'rounded-r-none': tab === 'Google', 
              'rounded-r-none': tab === 'Outlook',
              'border-r border-[#40916C]': index !== tabs.length - 1
            }"
          >
            {{ tab }}
          </TabsTrigger>
        </TabsList>

        <div class="bg-white bg-opacity-50 backdrop-blur-sm rounded-b-xl shadow-lg p-6 sm:p-8 mt-0">
          <TabsContent v-for="tab in tabs" :key="tab" :value="tab">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
              <Card
                v-for="index in 6"
                :key="index"
                class="bg-white hover:bg-gradient-to-r hover:from-[#52B788] hover:to-[#40916C] hover:text-white shadow-lg rounded-lg"
              >
                <CardContent class="p-8">
                  <h2 class="text-2xl font-bold mb-4">
                    Widget Customization Guide
                  </h2>
                  <h3 class="text-xl mb-12">
                    Customize Widget using the EaseAccess Dashboard
                  </h3>
                  <p class="text-lg">
                    All the settings, options, Additional Features and how to integrate them - from drafts to publishing versions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

export default {
  components: {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Card,
    CardContent
  },
  data() {
    return {
      tabs: ['Google', 'Outlook', 'Apple']
    }
  }
}
</script>

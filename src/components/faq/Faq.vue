<template>
  <div class="flex flex-col md:flex-row justify-between gap-22">
    
    <div class="flex-1 p-6 pt-20 md:p-24">
      <h1 class="text-4xl font-bold text-[#31776c] mb-8 text-left">Frequently Asked Questions</h1>
      <Accordion type="single" class="bg-white rounded-lg px-3" collapsible :default-value="defaultValue">
        <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
          <AccordionTrigger class="text-left">{{ item.title }}</AccordionTrigger>
          <AccordionContent class="text-left">
            {{ item.content }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    <div class="flex-1 flex justify-center hidden md:block mr-20 mt-14">
      <img src="/src/assets/faq/faq-removebg.png" alt="Frequently Asked Questions" class="" />
    </div>

  </div>
</template>

<script>
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion/index.js'

export default {
  components: {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
  },
  data() {
    return {
      accordionItems: [
        { value: 'item-1', title: 'What is an ICS file?', content: 'An ICS file is a calendar file saved in a universal calendar format used by several email and calendar programs.' },
        { value: 'item-2', title: 'How do I find my calendar ICS file?', content: 'You can import an ICS file by opening it with your calendar application or by using the import feature within the application.' },
        { value: 'item-3', title: 'Can I share my calendar with others?', content: 'Yes, you can share your calendar by exporting it as an ICS file and sending it to others.' },
        { value: 'item-4', title: 'What applications support ICS files?', content: 'Applications like Google Calendar, Apple Calendar, Microsoft Outlook, and many others support ICS files.' },
        { value: 'item-5', title: 'How do I create an ICS file?', content: 'You can create an ICS file by exporting your calendar from your calendar application.' },
        { value: 'item-6', title: 'Are ICS files compatible across different platforms?', content: 'Yes, ICS files are designed to be compatible across different platforms and calendar applications.' },
        { value: 'item-7', title: 'What information is stored in an ICS file?', content: 'An ICS file typically contains event details such as title, date, time, location, and description.' },
      ]
    }
  }
}
</script>

<style scoped>
</style>

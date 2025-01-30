<template>
    <Accordion type="single" class="w-1/2" collapsible :default-value="defaultValue">
    <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
      <AccordionTrigger>{{ item.title }}</AccordionTrigger>
      <AccordionContent>
        {{ item.content }}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>

<script>
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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
        { value: 'item-2', title: 'How do I import an ICS file?', content: 'You can import an ICS file by opening it with your calendar application or by using the import feature within the application.' },
        { value: 'item-3', title: 'Can I share my calendar with others?', content: 'Yes, you can share your calendar by exporting it as an ICS file and sending it to others.' },
        { value: 'item-4', title: 'What applications support ICS files?', content: 'Applications like Google Calendar, Apple Calendar, Microsoft Outlook, and many others support ICS files.' },
        { value: 'item-5', title: 'How do I create an ICS file?', content: 'You can create an ICS file by exporting your calendar from your calendar application.' },
        { value: 'item-6', title: 'Are ICS files compatible across different platforms?', content: 'Yes, ICS files are designed to be compatible across different platforms and calendar applications.' },
        { value: 'item-7', title: 'Can I edit an ICS file?', content: 'Yes, you can edit an ICS file using a text editor or within your calendar application.' },
        { value: 'item-8', title: 'What information is stored in an ICS file?', content: 'An ICS file typically contains event details such as title, date, time, location, and description.' },
      ]
    }
  }
}
</script>

<style scoped>
.faq {
    padding: 20px;
}

.faq-title {
    font-size: 24px;
    margin-bottom: 20px;
}

.faq-item {
    margin-bottom: 10px;
}

.faq-question {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.faq-answer {
    margin-top: 5px;
    font-size: 16px;
}
</style>
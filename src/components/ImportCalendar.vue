<template>
  <form @submit.prevent="handleSubmit" class="w-2/3">
    <div class="grid grid-cols-4 border-b border-gray-900/10 pb-12">
      <div class="col-span-3">
        <label for="name" class="block text-sm/6 font-medium">Calendar name</label>
        <div class="rounded-md outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
          <input v-model="calendarName" type="text" name="name" id="name" class="w-full py-1.5 pl-3 pr-3 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6" placeholder="" />
        </div>
      </div>

      <div class="sm:col-span-2 mt-5">
        <label for="card" class="block text-sm/6 font-medium">Calendar type</label>
        <RadioGroup v-model="calendarType" default-value="card" class="grid grid-cols-3 gap-4">
          <div>
            <RadioGroupItem id="google" value="google" class="peer sr-only" />
            <label
                for="google"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <i class="bi bi-google"></i>
              Google
            </label>
          </div>
          <div>
            <RadioGroupItem id="outlook" value="outlook" class="peer sr-only"/>
            <label
                for="outlook"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <i class="bi bi-microsoft"></i>
              Outlook
            </label>
          </div>
          <div>
            <RadioGroupItem id="apple" value="apple" class="peer sr-only" />
            <label
                for="apple"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <i class="bi bi-apple"></i>
              Apple
            </label>
          </div>
        </RadioGroup>
      </div>

      <div class="sm:col-span-4 mt-3">
        <span class="block text-sm/6 font-medium">Import Method</span>
        <div class="flex gap-4 mt-2">
          <button type="button" class="px-3 py-1.5 rounded-md border text-sm" :class="importMethod === 'url' ? 'bg-indigo-600 text-white' : 'bg-gray-200'" @click="importMethod = 'url'">Use URL</button>
          <button type="button" class="px-3 py-1.5 rounded-md border text-sm" :class="importMethod === 'file' ? 'bg-indigo-600 text-white' : 'bg-gray-200'" @click="importMethod = 'file'">Upload File</button>
        </div>
      </div>

      <div v-if="importMethod === 'url'" class="sm:col-span-3 mt-3">
        <label for="icsUrl" class="block text-sm/6 font-medium">ICS URL</label>
        <div class="rounded-md outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
          <input v-model="calendarUrl" type="text" id="icsUrl" class="w-full py-1.5 pl-2  placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                 placeholder="https://calendar.google.com/calendar/ical/email/public/basic.ics" />
        </div>
      </div>

      <div v-if="importMethod === 'file'" class="sm:col-span-3 mt-3">
        <label for="iscFile" class="block text-sm/6 font-medium">ICS FILE</label>
        <div class="">
          <input ref="calendarFile" type="file" id="iscFile" class="rounded-md bg-white px-2.5 py-1.5 font-semibold hover:bg-gray-50" />
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button>
      <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500">Save</button>
    </div>
  </form>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import axios from 'axios'
import * as ICAL from 'ical.js'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCalendarStore } from '@/stores/calendar';

const calendarStore = useCalendarStore();

const calendarName = ref('')
const calendarType = ref('')
const importMethod = ref<'url' | 'file'>('url')
const calendarUrl = ref('')
const calendarFile = ref<HTMLInputElement | null>(null)

let events = ref([])

const myURL = ref('https://calendar.google.com/calendar/ical/boban.joksimoski@gmail.com/public/basic.ics')
const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'

const handleSubmit = async () => {
  // TODO: Change the form validation

  if (!calendarName.value) {
    alert('Please provide a calendar name')
    return
  }

  if (!calendarType.value) {
    alert('Please select a calendar type')
    return
  }

  if (importMethod.value === 'url' && !calendarUrl.value) {
    alert('Please provide an ICS URL')
    return
  }
  if (importMethod.value === 'file' && !calendarFile.value?.files?.length) {
    alert('Please upload an ICS file')
    return
  }


  if (importMethod.value === 'url') {
    let result = await handleURLDownload();
    events.value = result;
  } else {
    let result = await handleFileUpload()
    events.value = result as [];
  }

  const calendar = {
    name: calendarName.value,
    type: calendarType.value,
    url: calendarUrl.value,
    events: events.value,
  }

  calendarStore.addCalendar(calendar);
  alert("Calendar added successfully")
  resetForm()
}

const resetForm = () => {
  calendarName.value = '';
  calendarType.value = '';
  calendarUrl.value = '';
  events.value = [];

  importMethod.value = 'url';
  calendarFile.value = null
}

const extractEvents = (icsContent: string) => {
  const jcalData = ICAL.default.parse(icsContent)
  const vcalendar = new ICAL.default.Component(jcalData)
  const vevents = vcalendar.getAllSubcomponents('vevent')

  return vevents.map(event => {
    const icalEvent = new ICAL.default.Event(event)
    return {
      summary: icalEvent.summary,
      description: icalEvent.description,
      location: icalEvent.location,
      startDate: icalEvent.startDate.toJSDate(),
      endDate: icalEvent.endDate.toJSDate(),
      duration: icalEvent.duration,
      sequence: icalEvent.sequence,
      organizer: icalEvent.organizer,
      attendees: icalEvent.attendees,
      color: icalEvent.color,
      uid: icalEvent.uid,
    }
  })
}

const handleFileUpload = () => {
  return new Promise((resolve, reject) => {
    try {
      const file = calendarFile.value?.files?.[0];
      if (!file) return resolve([]);

      const reader = new FileReader();
      reader.onload = () => {
        const icsContent = reader.result as string;
        let results = extractEvents(icsContent);
        console.log('Vo handleFileUpload:', results);
        resolve(results ?? []);
      };
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
};
const handleURLDownload = async () => {
  try {
    let response = await fetch(corsProxyUrl + calendarUrl.value);
    let data = await response.text();
    let events = extractEvents(data);
    return events ?? [];
  } catch (error) {
    console.error("Error fetching URL:", error);
    return [];
  }
};
</script>

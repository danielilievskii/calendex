<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-8 bg-white rounded-lg shadow-md w-full sm:w-auto">
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-1/2">
        <label for="name" class="block text-sm font-medium text-gray-700">Calendar Name</label>
        <input v-model="calendarName" type="text" name="name" id="name" 
        class="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 
        focus:ring-indigo-500 sm:text-sm p-1.5" 
        placeholder="Enter calendar name" />
      </div>

      <div class="w-full sm:w-1/2 ">
        <label for="color" class="block text-sm font-medium text-gray-700">Choose Color</label>
        <div class="mt-1 grid grid-cols-3 sm:grid-cols-9 gap-2 pt-1 pr-1">
          <button
            v-for="(colorClass, colorName) in colorMap"
            :key="colorName"
            @click="calendarColor = colorName"
            :class="['w-6 h-6 rounded-full cursor-pointer', 
            colorClass, calendarColor === colorName ? 'ring-2 ring-offset-2' : '']"
          ></button>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700">Calendar Type</label>
      <RadioGroup v-model="calendarType" default-value="google" class="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="option in radioOptions" :key="option.value" @click="calendarType = option.value" class="relative">
          <RadioGroupItem :id="option.value" :value="option.value" class="peer sr-only" />
          <label :for="option.value" class="flex flex-col items-center justify-between 
          rounded-md border-2 border-gray-300 bg-white p-4 hover:bg-gray-50 
          peer-checked:border-blue-500">
            <i :class="option.icon"></i>
            {{ option.label }}
          </label>
          <div
            :class="[
              'absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg border-blue-500',
              calendarType === option.value ? 'border-[3px]' : 'border-0'
            ]"
          ></div>
        </div>
      </RadioGroup>
    </div>

    <div class="mb-6">
      <span class="block text-sm font-medium text-gray-700">Import Method</span>
      <div class="mt-2 flex flex-col sm:flex-row gap-4">

        <button type="button" class="px-4 py-2 rounded-md border text-sm font-medium" 
        :class="importMethod === 'url' ? 'bg-indigo-600 text-white' : 'bg-gray-200'" 
        @click="importMethod = 'url'">Use URL</button>

        <button type="button" class="px-4 py-2 rounded-md border text-sm font-medium" 
        :class="importMethod === 'file' ? 'bg-indigo-600 text-white' : 'bg-gray-200'" 
        @click="importMethod = 'file'">Use downloaded file</button>

      </div>
    </div>

    <div v-if="importMethod === 'url'" class="mb-6">
      <label for="icsUrl" class="block text-sm font-medium text-gray-700">Calendar URL</label>
      <input v-model="calendarUrl" type="text" id="icsUrl" 
      class="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 
        focus:ring-indigo-500 sm:text-sm p-2"
       placeholder="https://calendar.google.com/calendar/ical/email/public/basic.ics" />
    </div>

    <div v-if="importMethod === 'file'" class="mb-6">
      <label for="iscFile" class="block text-sm font-medium text-gray-700">Upload downloaded ICS File</label>
      <input ref="calendarFile" type="file" id="iscFile" 
      class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
      file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 
      file:text-indigo-600 hover:file:bg-indigo-100" />
    </div>

    <div class="flex items-center justify-end gap-4">
      <button type="button" class="text-sm font-medium text-gray-700" @click="resetdiv">Cancel</button>
      
      <button @click="handleSubmit" type="submit" class="px-4 py-2 rounded-md bg-indigo-600 
      text-sm font-medium text-white shadow-sm hover:bg-indigo-500">Save</button>
    </div>
  </div>
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
const calendarColor = ref('')
const calendarUrl = ref('')
const calendarFile = ref<HTMLInputElement | null>(null)

const colorMap = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  teal: 'bg-teal-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500'
}

const radioOptions = [
  { value: 'google', label: 'Google', icon: 'bi bi-google' },
  { value: 'outlook', label: 'Outlook', icon: 'bi bi-microsoft' },
  { value: 'apple', label: 'Apple', icon: 'bi bi-apple' }
]

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
    color: calendarColor.value,
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
  calendarColor.value = '';
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

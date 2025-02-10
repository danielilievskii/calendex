<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-8 bg-white rounded-md border border-gray-200 shadow-lg w-full sm:w-auto">
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-1/2">
        <label for="name" class="block font-medium text-gray-700">Calendar name</label>
        <input v-model="calendarName" type="text" name="name" id="name" 
        class="mt-1 block w-full rounded-md border border-gray-400 shadow-sm
        focus:border-[#52b788] focus:ring-1 focus:ring-[#52b788] focus:outline-none
         sm:text-sm p-1.5"
        placeholder="Enter calendar name" />
        <span v-if="errCalName" class="text-red-500">Please enter a calendar name</span>
      </div>

      <div class="w-full sm:w-1/2 ">
        <label for="color" class="block font-medium text-gray-700">Calendar color</label>
        <div class="mt-1 grid grid-cols-3 sm:grid-cols-9 gap-2 pt-1 pr-1">
          <button
            v-for="(colorClass, colorName) in colorMap"
            :key="colorName"
            @click="calendarColor = colorName"
            :class="['w-6 h-6 rounded-full cursor-pointer', 
            colorClass, calendarColor === colorName ? 'ring-2 ring-offset-2 ring-[#52b788]' : '']"
          ></button>
        </div>
        <span v-if="errCalColor" class="text-red-500">Please choose a color</span>
      </div>
    </div>

    <div class="mb-6">
      <label class="block font-medium text-gray-700">Calendar type</label>
      <RadioGroup v-model="calendarType" default-value="google" class="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="option in radioOptions" :key="option.value" @click="calendarType = option.value" class="relative">
          <RadioGroupItem :id="option.value" :value="option.value" class="peer sr-only" />
          <label :for="option.value" class="flex flex-col items-center justify-between 
          rounded-md border-2 border-gray-300 bg-white p-4 hover:bg-gray-50 
          peer-checked:border-[#31776c]">
            <i :class="option.icon"></i>
            {{ option.label }}
          </label>
          <div
            :class="[
              'absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg border-[#52b788]',
              calendarType === option.value ? 'border-[3px]' : 'border-0'
            ]"
          ></div>
        </div>
      </RadioGroup>
      <span v-if="errCalType" class="text-red-500">Please choose a type</span>
    </div>

    <div class="mb-6">
      <span class="block font-medium text-gray-700">Import method</span>
      <div class="mt-2 flex flex-col sm:flex-row gap-3">

        <button type="button" class="px-4 py-2 rounded-md border text-sm font-medium" 
        :class="importMethod === 'url' ? 'green-btn' : 'gray-btn'"
        @click="importMethod = 'url'">Use ICS URL</button>

        <button type="button" class="px-4 py-2 rounded-md border text-sm font-medium" 
        :class="importMethod === 'file' ? 'green-btn' : 'gray-btn'"
        @click="importMethod = 'file'">Use ICS file</button>

      </div>
    </div>

    <div v-if="importMethod === 'url'" class="mb-6">
      <div class="flex justify-between">
        <label for="icsUrl" class="block font-medium text-gray-700">Calendar ICS URL</label>
        <router-link to="/guides" class="text-gray-400 hover:underline">Need help finding it?</router-link>
      </div>

      <input v-model="calendarUrl" type="text" id="icsUrl" 
      class="mt-1 block w-full rounded-md border border-gray-400 shadow-sm
      focus:border-[#52b788] focus:ring-1 focus:ring-[#52b788] focus:outline-none sm:text-sm p-2"
       placeholder="https://calendar.google.com/calendar/ical/email/public/basic.ics" />

       
       <span v-if="errCalUrl" class="text-red-500">Please enter a valid URL</span><br>

    </div>

    <div v-if="importMethod === 'file'" class="mb-6">
      <label for="iscFile" class="block font-medium text-gray-700">Calendar ICS file</label>
      <input ref="calendarFile" type="file" id="iscFile" 
      class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50
      file:text-[#587acc] hover:file:bg-indigo-100 cursor-pointer" />

      <span v-if="errCalFile" class="text-red-500">Please choose a valid file</span><br>
    </div>

    <div class="flex items-center justify-end gap-3">
      <button type="button" class="px-4 py-2 rounded-md text-sm font-medium gray-btn" @click="resetForm">Cancel</button>
      
      <button @click="handleSubmit" type="submit" class="px-4 py-2 rounded-md
      text-sm font-medium shadow-sm green-btn">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import * as ICAL from 'ical.js'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/toast/use-toast'

import { useCalendarStore } from '@/stores/calendar';
import { formatDuration, extractDate, extractTime, extractStringDate} from  "@/utils/dateUtils.js"

const calendarStore = useCalendarStore();

const route = useRoute();
const {toast} = useToast();

const calendarName = ref('');
const calendarType = ref('');
const importMethod = ref<'url' | 'file'>('url');
const calendarColor = ref('');
const calendarUrl = ref('');
const calendarFile = ref(null);
const calendarSelected = ref(false);

const calendar = ref(null); 
const id = ref(null);

const fetchCalendarData = (calendarId) => {
    if (calendarId) {
        calendar.value = calendarStore.getCalendarById(calendarId);
        console.log('Fetched calendar:', calendar.value);

        if (calendar.value) {
            calendarName.value = calendar.value.name ?? '';
            calendarType.value = calendar.value.type ?? '';
            calendarColor.value = calendar.value.color ?? '';
            calendarUrl.value = calendar.value.url ?? '';
            calendarSelected.value = calendar.value.selected;
        } else {
            calendarName.value = '';
            calendarType.value = '';
            calendarColor.value = '';
            calendarUrl.value = '';
            calendarSelected.value = false
        }
    } else {
        console.log('No calendar ID provided.');
        calendarName.value = '';
        calendarType.value = '';
        calendarColor.value = '';
        calendarUrl.value = '';
        calendarSelected.value = false
        calendar.value = null;
    }
};

watch(
    () => route.query.id,
    (newId) => {
      console.log("route.query.id changed", newId);
      id.value = newId
        fetchCalendarData(newId);
    },
    { immediate: true }
);

let errCalName = ref(false)
let errCalColor = ref(false)
let errCalType = ref(false)
let errCalUrl = ref(false)
let errCalFile = ref(false)


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

const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'

//TODO:
const handleSubmit = async (values: any) => {

  errCalName.value = !calendarName.value;
  errCalColor.value = !calendarColor.value;
  errCalType.value = !calendarType.value;

  if (importMethod.value === 'url') {
    errCalUrl.value = !calendarUrl.value;
    errCalFile.value = false;
  } else {
    errCalFile.value = !(calendarFile.value && calendarFile.value?.files[0]);
    errCalUrl.value = false;
  }

  if(errCalName.value || errCalColor.value || errCalType.value || (errCalUrl.value || errCalFile.value)){
    return;
  }


  if (importMethod.value === 'url') {
    
    let result = await handleURLDownload();
    if(!result){
      toast({
        title: 'There was an error fetching the calendar.',
        variant: 'destructive'
      });
      return;
    }
    events.value = result as [];
  } else {
    let result = await handleFileUpload()
    if(!result){
      toast({
        title: 'There was an error parsing the file.',
        variant: 'destructive'
      });
      return;
    }
    events.value = result as [];
  }

  const calendar = {
    uid: generateUniqueId(calendarName.value, calendarUrl.value ?? 'file'),
    name: calendarName.value,
    color: calendarColor.value,
    type: calendarType.value,
    selected: calendarSelected.value,
    url: calendarUrl.value,
    events: events.value,
  }

  console.log(events.value)

  if(id.value){
    calendarStore.editCalendar(calendar, id.value);
    toast({
      title: `The calendar has been updated successfully.`,
      variant: 'success'
    });
    return;
  }
  else{
    calendarStore.addCalendar(calendar);
    toast({
      title: `The calendar has been added successfully.`,
      variant: 'success'
    });
    resetForm()
  }
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

function generateUniqueId(name, url) {
  const input = name + url;
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

const extractEvents = (icsContent: string) => {
  const jcalData = ICAL.default.parse(icsContent)
  const vcalendar = new ICAL.default.Component(jcalData)
  const vevents = vcalendar.getAllSubcomponents('vevent')

  return vevents.map(event => {
    const icalEvent = new ICAL.default.Event(event)

    return {
      uid: icalEvent.uid,
      startDateTime: icalEvent.startDate.toJSDate(),
      startDate: extractDate(icalEvent.startDate.toJSDate()),
      startTime: extractTime(icalEvent.startDate.toJSDate()),
      endDateTime: icalEvent.endDate.toJSDate(),
      endDate: extractDate(icalEvent.endDate.toJSDate()),
      endTime: extractTime(icalEvent.endDate.toJSDate()),
      freq: icalEvent.component.jCal[1][2][3].freq ?? null,
      until: icalEvent.component.jCal[1][2][3].until ?? null,
      untilISO: icalEvent.component.jCal[1][2][3].until ? extractStringDate(icalEvent.component.jCal[1][2][3].until) : null,
      count: icalEvent.component.jCal[1][2][3].count ?? null,
      interval: icalEvent.component.jCal[1][2][3].interval ?? null,
      wkst: icalEvent.component.jCal[1][2][3].wkst ?? null,
      byDay: icalEvent.component.jCal[1][2][3].byday ?? [],
      byMonthDay: icalEvent.component.jCal[1][2][3].bymonthday ?? null,
      duration: formatDurationToString(icalEvent.duration),
      formattedDuration: formatDuration(icalEvent.startDate.toJSDate(), icalEvent.endDate.toJSDate()),
      summary: icalEvent.summary,
      description: icalEvent.description,
      location: icalEvent.location,
      sequence: icalEvent.sequence,
      organizer: icalEvent.organizer,
      attendees: icalEvent.attendees,
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
    return null;
  }
};

//TODO: fix duration since we are now saving pure string
const formatDurationToString = (duration: any) => {
    if(typeof duration === 'object' && duration !== null) {
      const weeks = duration.weeks || 0;
      const days = duration.days || 0;
      const hours = duration.hours || 0;
      const minutes = duration.minutes || 0;
      const seconds = duration.seconds || 0;

      const parts = [];
      if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
      if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
      if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
      if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
      if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

      return parts.length > 0 ? parts.join(', ') : 'None';
    }
}
</script>

<style scoped>

.green-btn {
  color: white;
  background-color: #31776c;
  transition: background-color 0.3s ease, color 0.3s ease;
}


.green-btn:hover {
  background-color: #3e9c86;
}


.gray-btn {
  color: #555;
  background-color: #F0F0F0;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.gray-btn:hover {
  background-color: #e0e0e0;
  color: #000;
}

</style>

<template>

  <Table>
    <TableCaption>A list of your events</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Calendar</TableHead>
        <TableHead>
          Summary
        </TableHead>
        <TableHead>Location</TableHead>
        <TableHead >
          Start date
        </TableHead>
        <TableHead>End date</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow 
        v-for="event in calendarStore.filteredEvents" 
        :key="event.uid" 
        :style="{ backgroundColor: event.calendarColor }"
        class="tml-2 text-white text-lg font-bold"
      >
        <TableCell>
          {{ event.calendarName }}
        </TableCell>
        <TableCell class="font-medium">
          {{ event.summary }}
        </TableCell>
        <TableCell>{{ event.location ? event.location : "No location provided" }}</TableCell>
        <TableCell>
          {{ event.startDate }}
        </TableCell>
        <TableCell>
          {{ event.endDate }}
        </TableCell>
      </TableRow>
      <TableRow v-if="calendarStore.filteredEvents.length === 0">
        <TableCell colspan="5" class="text-center">No events found</TableCell>
      </TableRow>
    </TableBody>
  </Table>


</template>

<script setup lang="ts">

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useCalendarStore } from '@/stores/calendar';
const calendarStore = useCalendarStore();

</script>

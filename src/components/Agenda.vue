<template>
      <h1 class="text-4xl font-bold text-[#31776c] mb-8">Agenda</h1>

    <div class="rounded-md border border-gray-200 shadow-lg">

      <Table class="table-fixed w-full">
        <TableHeader class="">
          <TableRow class="bg-white hover:bg-gray-200/50">
            <TableHead
                v-for="header in headers"
                :key="header.key"
                class="font-bold text-lg cursor-pointer px-4 py-2 text-left text-[#31776c]"
                :class="{
          'w-1/5': header.key === 'calendarName',
          'w-1/4': header.key === 'summary',
          'w-1/6': header.key === 'location',
          'w-1/6': header.key === 'date',
          'w-1/6': header.key === 'duration'
        }"
                @click="sortBy(header.key)"
            >
              {{ header.label }}
              <span v-if="sortKey === header.key">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody class="bg-white">
          <TableRow
              v-for="event in sortedEvents"
              :key="event.uid"
              class="hover:bg-[#e0f1eb]"
          >
            <TableCell class="w-1/5 px-4 py-2">
              <div class="flex items-center gap-2">
                <div
                    class="w-3 h-3 rounded-full"
                    :class="[colorStore.getBackgroundColor(event.calendarColor)]"
                ></div>
                {{ event.calendarName }}
              </div>
            </TableCell>
            <TableCell class="w-1/4 px-4 py-2 font-medium text-black">
              {{ event.summary }}
            </TableCell>
            <TableCell class="w-1/6 px-4 py-2">{{ event.location || "No location" }}</TableCell>
            <TableCell class="w-1/6 px-4 py-2">{{ formatFromStringToDateTime(event.startDateTime) }}</TableCell>
            <TableCell class="w-1/6 px-4 py-2 pl-8">
                <Badge class="bg-[#52B788]">{{ event.duration || 'Unknown' }}</Badge>
            </TableCell>
          </TableRow>

          <TableRow v-if="calendarStore.filteredEvents.length === 0">
            <TableCell colspan="5" class="text-center">No events found</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="flex items-center justify-between px-4 py-4 border-t border-gray-300 bg-white">
        <div class="text-sm text-gray-400">
          {{ selectedEvents.length }} of {{ calendarStore.filteredEvents.length }} row(s) selected.
        </div>
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-400">Rows per page</span>
            <Select v-model="rowsPerPage">
              <SelectTrigger class="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <ChevronLeftIcon class="h-4 w-4" />
            </Button>
            <span class="text-sm text-gray-400">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <Button 
              variant="outline" 
              size="icon"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <ChevronRightIcon class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Table from '@/components/ui/table/Table.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import Select from '@/components/ui/select/Select.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/badge/Badge.vue'

import {
  ChevronLeftIcon, 
  ChevronRightIcon,
} from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import { useColorStore } from '@/stores/colors';
import {formatFromStringToDateTime} from "../utils/dateUtils.js";

const calendarStore = useCalendarStore()
const colorStore = useColorStore()

const selectedEvents = ref<string[]>([])
const currentPage = ref(1)
const rowsPerPage = ref('10')
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const headers = [
  { key: 'calendarName', label: 'Calendar Name' },
  { key: 'summary', label: 'Summary' },
  { key: 'location', label: 'Location' },
  { key: 'startDate', label: 'Scheduled Time' },
  { key: 'duration', label: 'Duration' }
]

const totalPages = computed(() => 
  Math.ceil(calendarStore.filteredEvents.length / Number(rowsPerPage.value))
)

const sortedEvents = computed(() => {
  const events = [...calendarStore.filteredEvents]
  if (sortKey.value) {
    events.sort((a, b) => {
      const aValue = a[sortKey.value as keyof typeof a]
      const bValue = b[sortKey.value as keyof typeof b]
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  const start = (currentPage.value - 1) * Number(rowsPerPage.value)
  const end = start + Number(rowsPerPage.value)
  return events.slice(start, end)
})




const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}
</script>

<style scoped>
:deep(.dark) {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
}
</style>

<template>
  <div class="min-h-screen p-4 text-black">
    <div class="rounded-md border border-gray-800">
      <div class="flex items-center justify-between p-4">
        <h2 class="text-lg font-semibold">Events</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox @change="toggleAll" :checked="allSelected" />
            </TableHead>
            <TableHead
              v-for="header in headers"
              :key="header.key"
              class="font-bold text-lg cursor-pointer"
              @click="sortBy(header.key)"
            >
              {{ header.label }}
              <span v-if="sortKey === header.key">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </TableHead>
            <TableHead class="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow 
            v-for="event in sortedEvents" 
            :key="event.uid"
            class="hover:bg-gray-800/50"
          >
            <TableCell>
              <Checkbox 
                :checked="selectedEvents.includes(event.uid)"
                @change="toggleEvent(event.uid)"
              />
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-2">
                <div 
                  class="w-3 h-3 rounded-full" 
                  :style="{ backgroundColor: event.calendarColor }"
                ></div>
                {{ event.calendarName }}
              </div>
            </TableCell>
            <TableCell :class="{'text-black': true, 'font-medium': true}">
              {{ event.summary }}
            </TableCell>
            <TableCell>{{ event.location || "No location" }}</TableCell>
            <TableCell>{{ formatDate(event.startDate) }}</TableCell>
            <TableCell>{{ formatDate(event.endDate) }}</TableCell>
            <TableCell>
              <Badge >
                {{ event.duration || 'Unknown' }}
              </Badge>
            </TableCell>
            
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow v-if="calendarStore.filteredEvents.length === 0">
            <TableCell colspan="9" class="text-center">No events found</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="flex items-center justify-between px-4 py-4 border-t border-gray-800">
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
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import Select from '@/components/ui/select/Select.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import { 
  MoreVerticalIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  FilterIcon,
  SettingsIcon
} from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'

const calendarStore = useCalendarStore()
const selectedEvents = ref<string[]>([])
const currentPage = ref(1)
const rowsPerPage = ref('10')
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const headers = [
  { key: 'calendarName', label: 'Calendar Name' },
  { key: 'summary', label: 'Summary' },
  { key: 'location', label: 'Location' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'duration', label: 'Duration' }
]

const allSelected = computed(() => 
  calendarStore.filteredEvents.length > 0 && 
  selectedEvents.value.length === calendarStore.filteredEvents.length
)

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

const toggleAll = (checked: boolean) => {
  selectedEvents.value = checked 
    ? calendarStore.filteredEvents.map(event => event.uid)
    : []
}

const toggleEvent = (uid: string) => {
  const index = selectedEvents.value.indexOf(uid)
  if (index === -1) {
    selectedEvents.value.push(uid)
  } else {
    selectedEvents.value.splice(index, 1)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

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

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" class="side-hover rounder-50">
          <MoreVerticalIcon class="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <RouterLink
            :to="{path:'/calendar-import', query:{id: calendarUid}}"
            @click="$emit('close-mobile')"
        >
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </RouterLink>

        <DropdownMenuSeparator/>

        <DropdownMenuItem
            class="text-red-500"
            @click="$emit('delete')"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import DropdownMenu from '../../../ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuContent from '../../../ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '../../../ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuSeparator from '../../../ui/dropdown-menu/DropdownMenuSeparator.vue';
import DropdownMenuTrigger from '../../../ui/dropdown-menu/DropdownMenuTrigger.vue';
import Button from '../../../ui/button/Button.vue';
import { MoreVerticalIcon } from 'lucide-vue-next';

defineProps<{
  calendarUid: string
}>();

defineEmits<{
  delete: []
  'close-mobile': []
}>();
</script>

<style scoped>
.side-hover:hover {
  background: #e2eff0 !important;
}

.rounder-50 {
  border-radius: 50% !important;
}
</style>
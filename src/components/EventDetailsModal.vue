<template>
  <!-- Modal Background -->
  <Transition name="fade">
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <!-- Modal Box -->

      <div class="bg-white w-[90%] max-w-3xl p-6 rounded-lg shadow-lg relative transform transition-all">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3">
          <h2 v-if="props.selectedEvent?.summary" class="text-2xl font-bold text-gray-800">
            {{ props.selectedEvent.summary }}
          </h2>
          <button
              class="text-gray-400 hover:text-gray-700"
              @click="toggleModal()"
          >
            <i class="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <!-- Event Info -->
        <div class="mt-4 space-y-3 text-gray-700">

          <div class="rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.4)] px-5 py-2.5 text-md">
            <p >
              <i class="bi bi-geo-alt-fill mr-2 text-red-500"></i>{{
                props.selectedEvent?.location || ' No location provided'
              }}
            </p>

            <p >
              <i
                  :class="'bi bi-clock text-blue-500'"
                  class="mr-2"
              ></i>
              {{
                props.selectedEvent?.startDate === props.selectedEvent?.endDate
                    ? formatFromStringToDate(props.selectedEvent?.startDateTime || '') + ' ' + (props.selectedEvent?.formattedDuration || '')
                    : formatFromStringToDateTime(props.selectedEvent?.startDateTime || '') + ' - ' + formatFromStringToDateTime(props.selectedEvent?.endDateTime || '')
              }}
            </p>

            <p class="text-gray-400 mt-3">
             {{
                getFrequency(props.selectedEvent?.freq,
                    props.selectedEvent?.byDay,
                    props.selectedEvent?.interval,
                    props.selectedEvent?.wkst,
                    props.selectedEvent?.until,
                    props.selectedEvent?.count)
              }}
            </p>

          </div>


          <p class="text-md" v-html="getSanitizedDescription(props.selectedEvent?.description)"></p>
        </div>

        <!-- Close Button -->
        <div class="flex justify-center mt-4">
          <button
              class="bg-[#52b788] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#409f69] transition"
              @click="toggleModal()"
          >
            Close
          </button>
        </div>
      </div>

    </div>
  </Transition>
</template>

<script lang="ts" setup>
import DOMPurify from 'dompurify';

import {defineProps} from 'vue';
import {formatFromStringToDate, formatFromStringToDateTime, getFullDay, formatFromStringToDateShort} from "../utils/dateUtils.js";

// Define props
const props = defineProps<{
  showModal: boolean;
  toggleModal: Function;
  selectedEvent?: any;
}>();

const getSanitizedDescription = (description) => {
  return description ? DOMPurify.sanitize(description) : 'No description provided.';
};

const getFrequency = (freq, byDay, interval, wkst, until, count) => {
  console.log("inside get freq")
  let text = 'This event ';

  switch (freq) {
    case 'DAILY':
      text += interval ? `occurs every ${interval} days` : 'daily';
      break;

    case 'WEEKLY':
      // handled in default because of edge cases

    case 'YEARLY':
      text += interval ? `occurs every ${interval} years` : 'annually';
      break;

    default:

      if (byDay) {
        if(typeof byDay === 'string')
          byDay = Array.of(byDay)

        if(byDay.length >= 1) {
          if(wkst) {
            text += wkst > 1 ? `occurs every ${wkst} weeks` : ' every week';
          }
          text += ` on ${byDay.map(getFullDay).join(', ')}`;
          break
        }
      }

      text += 'takes place one time only';
      break
  }

  if (until) {
    text += `, ending on ${formatFromStringToDateShort(until)}.`;
  } else if (count) {
    text += ` for a total of ${count} occurrences.`;
  }

  return text;
};
</script>


<style>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

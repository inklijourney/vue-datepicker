<script lang="ts" setup>
import dayjs from 'dayjs'
import { useDate } from '@/composables/date'

const { dateObject } = useDate()
const dateMode = inject('dateMode')

const navToggle = (toggle: number) => {
  dateMode === 'month'
    ? dateObject.value = dayjs(dateObject.value).add(toggle, 'month').startOf('month').toObject()
    : dateObject.value = dayjs(dateObject.value).add(toggle, 'week').startOf('week').toObject()
}
</script>

<template>
  <div class="flex justify-between items-center w-full">
    <button
      class="hover:bg-gray-200 rounded text-2xl cursor-pointer"
      @click.stop="navToggle(-1)"
    >
      <ri-arrow-left-s-line class="text-gray-500" />
    </button>

    <div class="font-semibold">
      {{ dayjs(dateObject).format('YYYY M月') }}
    </div>
    <button
      class="hover:bg-gray-200 rounded text-2xl cursor-pointer"
      @click.stop="navToggle(1)"
    >
      <ri-arrow-right-s-line class="text-gray-500" />
    </button>
  </div>
</template>

<style scoped>

</style>

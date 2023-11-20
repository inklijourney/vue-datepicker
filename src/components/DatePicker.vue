<script lang="ts" setup>
import dayjs from 'dayjs'
import { useDate } from '@/composables/date'
import type { DateMode } from '@/components/Main.vue'

const dateMode = inject<DateMode>('dateMode', 'month')

const { dateObject, pickedDateObject } = useDate()

// 一个月的第一周的第一天
const startWeek = computed(() => dayjs(dateObject.value).startOf('month').startOf('week'))

// 一个月的最后一周的最后一天
const endWeek = computed(() => dayjs(dateObject.value).endOf('month').endOf('week'))

// 一个月的第一天或者是一周的第一天
const startDate = computed(() => {
  if (dateMode === 'month')
    return dayjs(dateObject.value).startOf('month')
  else
    return dayjs(dateObject.value).startOf('week')
})

// 一个月的最后一天或者是一周的最后一天
const endDate = computed(() => {
  if (dateMode === 'month')
    return dayjs(dateObject.value).endOf('month')
  else
    return dayjs(dateObject.value).endOf('week')
})

const dateRange = computed(() => {
  const daysInMonth = dateMode === 'month'
    ? endWeek.value.diff(startWeek.value, 'day') + 1
    : endDate.value.diff(startDate.value, 'day') + 1
  return Array.from({ length: daysInMonth }, (_, index) =>
    dateMode === 'month' ? startWeek.value.add(index, 'day') : startDate.value.add(index, 'day'),
  )
})

const weeks = ref<string[]>([])

const clickDay = (day: Date) => {
  pickedDateObject.value.years = dayjs(day).toObject().years
  pickedDateObject.value.months = dayjs(day).toObject().months
  pickedDateObject.value.date = dayjs(day).toObject().date
  if (!dayjs(day).isBetween(startDate.value, endDate.value, 'date', '[]'))
    dateObject.value = dayjs(day).startOf('month').toObject()
}

onMounted(() => {
  weeks.value = [...dayjs.weekdaysMin().slice(1), dayjs.weekdaysMin()[0]]
})
</script>

<template>
  <div class="grid grid-cols-7">
    <div
      v-for="week in weeks" :key="week"
      class="p-1 text-center text-[14px] font-semibold text-gray-600"
    >
      {{ week }}
    </div>
  </div>
  <div class="grid grid-cols-7 group">
    <div
      v-for="(date, index) in dateRange" :key="index"
      class="flex justify-center items-center"
      @click="clickDay(date.toDate())"
    >
      <div
        class="text-center rounded-full cursor-pointer w-6 h-6"
        :class="[
          dayjs(date).isBetween(startDate, endDate, 'date', '[]') ? 'text-gray-600' : 'text-gray-300',
          date.isSame(pickedDateObject, 'date') ? 'bg-blue-600 white' : 'hover:bg-gray-100',
        ]"
      >
        {{ date.get('D') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.white{
  color: white !important;
}
</style>

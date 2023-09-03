<script lang="ts" setup>
import type { Options } from '@popperjs/core'
import dayjs from 'dayjs'
import { useDate } from '@/composables/date'
import Popover from '@/components//Popover.vue'

const props = defineProps({
  timeMode: String,
})

const { pickedDateObject } = useDate()

// const mode = ref(inject('mode'))
const timeMode = props.timeMode

const timePickerRef = ref<HTMLElement | null>(null)

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)

const popoerOptions = ref<Options>({
  placement: 'bottom',
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 2],
      },
    },
  ],
  strategy: 'absolute',
})

const hours = ref(Array.from({ length: 24 }, (_, index) => index))
const minutes = ref(Array.from({ length: 60 }, (_, index) => index))

// 显示时间个数
const visibleItems = ref(5)

/**
 *
 * @param arr 数组
 * @param count 显示几个数
 * @param middleValue 中间的数字
 */
const extractValuesAroundMiddle = (arr: number[], count: number, middleValue: number): number[] | null => {
  // 确保数组长度大于等于要取出的数量
  if (arr.length < count)
    return null
  // 找到中间值在数组中的索引
  const middleIndex = arr.indexOf(middleValue)
  // 计算左侧和右侧要取出的数量
  const leftCount = Math.floor(count / 2)
  const rightCount = count - leftCount
  const result: number[] = []
  // 从左侧开始添加值
  for (let i = middleIndex - leftCount; i < middleIndex; i++) {
    if (i < 0)
      result.push(arr[arr.length + i])
    else
      result.push(arr[i])
  }
  // 添加中间值
  result.push(middleValue)
  // 从右侧开始添加值
  for (let i = middleIndex + 1; i < middleIndex + rightCount; i++) {
    if (i >= arr.length)
      result.push(arr[i - arr.length])
    else
      result.push(arr[i])
  }
  return result
}

const displayedHours = computed(() => {
  return extractValuesAroundMiddle(hours.value, visibleItems.value, pickedDateObject.value.hours)
})

const displayedMinutes = computed(() => {
  return extractValuesAroundMiddle(minutes.value, visibleItems.value, pickedDateObject.value.minutes)
})

// 让分钟始终显示两位数
const formatMinute = (minute: number) => {
  return minute.toString().padStart(2, '0')
}

const decrease = (type: 'hour' | 'minute') => {
  if (type === 'hour') {
    if (pickedDateObject.value.hours - 1 >= 0)
      pickedDateObject.value.hours = pickedDateObject.value.hours - 1
    else
      pickedDateObject.value.hours = hours.value[pickedDateObject.value.hours - 1 + hours.value.length]
  }
  else if (type === 'minute') {
    if (pickedDateObject.value.minutes - 1 >= 0)
      pickedDateObject.value.minutes = pickedDateObject.value.minutes - 1
    else
      pickedDateObject.value.minutes = minutes.value[pickedDateObject.value.minutes - 1 + minutes.value.length]
  }
}

const increase = (type: 'hour' | 'minute') => {
  if (type === 'hour') {
    if (pickedDateObject.value.hours + 1 < hours.value.length)
      pickedDateObject.value.hours = pickedDateObject.value.hours + 1
    else
      pickedDateObject.value.hours = hours.value[pickedDateObject.value.hours + 1 - hours.value.length]
  }
  else if (type === 'minute') {
    if (pickedDateObject.value.minutes + 1 < minutes.value.length)
      pickedDateObject.value.minutes = pickedDateObject.value.minutes + 1
    else
      pickedDateObject.value.minutes = minutes.value[pickedDateObject.value.minutes + 1 - minutes.value.length]
  }
}

const handleMouseWheel = (event: WheelEvent, type: 'hour' | 'minute') => {
  if (event.deltaY > 0)
    increase(type)
  else if (event.deltaY < 0)
    decrease(type)
}

const getFontSize = (index: number, length: number) => {
  // 最大字体大小
  const maxFontSize = 14
  // 最小字体大小
  const minFontSize = 6
  const middleIndex = Math.floor(length / 2)
  const diff = Math.abs(index - middleIndex)
  const fontSize = maxFontSize - (diff * (maxFontSize - minFontSize)) / middleIndex
  return fontSize
}

const confirm = () => {
  popoverRef.value?.hide()
}

// 检查点击事件的目标是否在按钮和弹窗之外
const clickOutside = (event: MouseEvent) => {
  if (timePickerRef.value && popoverRef.value?.popoverRef) {
    if (!timePickerRef.value.contains(event.target as Node) && !popoverRef.value?.popoverRef.contains(event.target as Node))

      popoverRef.value?.hide()
  }
}

onMounted(() => {
  popoverRef.value?.initPopover(timePickerRef.value!, popoerOptions.value)

  document.addEventListener('mousedown', clickOutside)

  if (timeMode === 'simple')
    visibleItems.value = 3
})

onUnmounted(() => {
  window.removeEventListener('mousedown', clickOutside)
})
</script>

<template>
  <!-- 默认模式 -->
  <div v-if="timeMode === 'default'" class="flex justify-center items-center">
    <div class="w-12 text-center">
      <div
        v-if="displayedHours"
        class="bg-gray-200 rounded-3xl"
        @wheel="handleMouseWheel($event, 'hour')"
      >
        <div
          v-for="(hour, index) in displayedHours"
          :key="index"
          class="px-[6px] py-2 relative text-gray-400"
          :class="index === Math.floor(displayedHours.length / 2) && 'line'"
          :style="{
            fontSize: `${getFontSize(index, displayedHours.length)}px`,
          }"
        >
          {{ hour }}
        </div>
      </div>
    </div>
    <div class="font-semibold text-lg mx-4">
      :
    </div>
    <div class="w-12 text-center">
      <div
        v-if="displayedMinutes"
        class="bg-gray-200 rounded-3xl"
        @wheel="handleMouseWheel($event, 'minute')"
      >
        <div
          v-for="(Minute, index) in displayedMinutes"
          :key="index"
          class="px-[6px] py-2 relative text-gray-400"
          :class="index === Math.floor(displayedMinutes.length / 2) && 'line'"
          :style="{
            fontSize: `${getFontSize(index, displayedMinutes.length)}px`,
          }"
        >
          {{ formatMinute(Minute) }}
        </div>
      </div>
    </div>
  </div>
  <!-- 简单模式 -->
  <div
    v-else
    ref="timePickerRef"
    class="flex justify-center items-center rounded-lg border border-gray-400 w-20"
    @click="popoverRef?.toggleVisible"
  >
    <ri-time-line class="mx-[2px] text-gray-500" />
    {{ dayjs(pickedDateObject).format('HH:mm') }}
  </div>
  <Popover ref="popoverRef" :target-ref="timePickerRef!">
    <div class="bg-white border border-gray-500 rounded-md w-20">
      <div
        class="flex justify-center items-center "
      >
        <div
          v-if="displayedHours"
          @wheel="handleMouseWheel($event, 'hour')"
        >
          <div
            v-for="(hour, index) in displayedHours"
            :key="index"
            class="px-1 py-1 relative text-gray-400 text-center"
            :class="index === Math.floor(displayedHours.length / 2) && 'line'"
            :style="{
              fontSize: `${getFontSize(index, displayedHours.length)}px`,
            }"
          >
            {{ formatMinute(hour) }}
          </div>
        </div>
        <div class="font-semibold text-lg">
          :
        </div>

        <div
          v-if="displayedMinutes"
          @wheel="handleMouseWheel($event, 'minute')"
        >
          <div
            v-for="(Minute, index) in displayedMinutes"
            :key="index"
            class="px-1 py-1 relative text-gray-400 text-center"
            :class="index === Math.floor(displayedMinutes.length / 2) && 'line'"
            :style="{
              fontSize: `${getFontSize(index, displayedMinutes.length)}px`,
            }"
          >
            {{ formatMinute(Minute) }}
          </div>
        </div>
      </div>
      <div class="flex">
        <button
          class="text-[12px] bg-blue-600 hover:bg-blue-700 rounded text-white px-1 ml-auto mr-1 my-1 flex items-center justify-center"
          @click="confirm"
        >
          确定
        </button>
      </div>
    </div>
  </Popover>
</template>

<style scoped>
.line{
@apply
before:w-full before:border before:border-solid before:border-gray-300 before:absolute before:left-0 before:top-0
after:w-full after:border after:border-solid after:border-gray-300 after:absolute after:left-0 after:bottom-0
text-black
}
</style>

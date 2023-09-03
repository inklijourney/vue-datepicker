<script lang="ts">
import dayjs from 'dayjs'
import type { Options } from '@popperjs/core'
import type { PropType } from 'vue'
import RiCalendar2Line from '~icons/ri/calendar2-line'
import BaseHeader from '@/components/BaseHeader.vue'
import BaseFooter from '@/components/BaseFooter.vue'
import DatePicker from '@/components/DatePicker.vue'
import Popover from '@/components//Popover.vue'
import TimePicker from '@/components/TimePicker.vue'
import { useDate } from '@/composables/date'

export type Mode = 'date' | 'dateTime' | 'time'
export type DateMode = 'month' | 'week'
export type TimeMode = 'default' | 'simple'

export const props = {
  modelValue: { type: Date, required: true },
  mode: { type: String as PropType<Mode>, required: false, default: 'date' },
  format: { type: String },
  timeMode: { type: String as PropType<TimeMode> },
  dateMode: { type: String as PropType<DateMode>, required: false, default: 'month' },
}

export default defineComponent({
  name: 'DatePicker',
  inheritAttrs: false,
  props,
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const { dateObject, pickedDateObject } = useDate()

    const datePickerProps = ref({ ...props })

    const targetRef = ref<HTMLElement | null>(null)

    const popover = ref<InstanceType<typeof Popover> | null>(null)

    const popoerOptions = ref<Options>({
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 6],
          },
        },
      ],
      strategy: 'absolute',
    })

    const timePicker = () => h(TimePicker, { timeMode: datePickerProps.value.timeMode })

    const datePicker = () => h(DatePicker)

    const baseHeader = () => h(BaseHeader)

    const baseFooter = () => {
      return h(
        BaseFooter,
        {
          onConfirm: () => {
            popover.value?.hide()
            emit('update:modelValue', dayjs(pickedDateObject.value).toDate())
          },
        },
        {
          switch: () => props.mode === 'dateTime' && timePicker(),
        },
      )
    }

    const content = () => {
      let main = null
      switch (props.mode) {
        case 'date':
          main = [baseHeader(), datePicker(), baseFooter()]
          break
        case 'dateTime':
          main = [baseHeader(), datePicker(), baseFooter()]
          break
        case 'time':
          main = [timePicker(), baseFooter()]
          break
      }

      return h(
        'div',
        {
          class: 'border border-gray-300 rounded-xl p-2 shadow w-56',
        },
        main,
      )
    }

    const defaultSlot = () => {
      let formatDate = props.format

      if (!formatDate) {
        switch (props.mode) {
          case 'date':
            formatDate = 'YYYY/MM/DD'
            break
          case 'dateTime':
            formatDate = 'YYYY/MM/DD HH:mm'
            break
          case 'time':
            formatDate = 'HH:mm'
            break
        }
      }
      if (slots.default != null) {
        return h('div',
          {
            ref: targetRef,
            onClick: popover.value?.toggleVisible,
            class: 'w-fit ',
          },
          slots.default!({
            formatDate: dayjs(props.modelValue).format(formatDate),
          }),
        )
      }
      else {
        return h('div', {
          ref: targetRef,
          onClick: popover.value?.toggleVisible,
          class: 'w-fit flex justify-center items-center border border-gray-500 rounded-md px-1',
        },
        [
          h(RiCalendar2Line, { class: 'mr-1 text-gray-700' }),
          dayjs(props.modelValue).format(formatDate),
        ])
      }
    }

    // 检查点击事件的目标是否在按钮和弹窗之外
    const handleClickOutside = (event: MouseEvent) => {
      if (targetRef.value && popover.value?.popoverRef) {
        if (!targetRef.value.contains(event.target as Node) && !popover.value?.popoverRef.contains(event.target as Node))
          popover.value?.hide()
      }
    }

    watchEffect(() => {
      if (popover.value?.isVisible) {
        dateObject.value = dayjs(props.modelValue).toObject()
        pickedDateObject.value = dayjs(props.modelValue).toObject()
      }
    })

    watch(() => props.mode, () => {
      if (!props.timeMode) {
        if (props.mode !== 'time')
          datePickerProps.value.timeMode = 'simple'
        else
          datePickerProps.value.timeMode = 'default'
      }
    }, { immediate: true })

    provide('mode', datePickerProps.value.mode)
    provide('dateMode', datePickerProps.value.dateMode)
    provide('timeMode', datePickerProps.value.timeMode)

    onMounted(() => {
      popover.value?.initPopover(targetRef.value!, popoerOptions.value)

      window.addEventListener('mousedown', handleClickOutside)
    })

    onUnmounted(() => {
      window.removeEventListener('mousedown', handleClickOutside)
    })

    return () => h('div', null, [
      defaultSlot(),
      h(Popover, { targetRef: targetRef.value!, ref: popover, class: 'z-50' }, { default: content }),
    ])
  },
})
</script>

<style scoped>

</style>

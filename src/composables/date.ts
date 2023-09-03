import { ref } from 'vue'

export interface DateObject {
  years: number
  months: number
  date: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

const dateObject = ref<DateObject>({
  years: 0,
  months: 0,
  date: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
})

const pickedDateObject = ref<DateObject>({
  years: 0,
  months: 0,
  date: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
})

export function useDate() {
  return {
    pickedDateObject,
    dateObject,
  }
}

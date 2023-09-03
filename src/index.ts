import './style.css'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import isToday from 'dayjs/plugin/isToday'
import objectSupport from 'dayjs/plugin/objectSupport'
import toObject from 'dayjs/plugin/toObject'
import isBetween from 'dayjs/plugin/isBetween'
import DatePicker from '@/components/Main.vue'

dayjs.extend(localeData)
dayjs.extend(weekday)
dayjs.extend(isToday)
dayjs.extend(objectSupport)
dayjs.extend(toObject)
dayjs.extend(isBetween)
dayjs.locale('zh-cn')

export default DatePicker

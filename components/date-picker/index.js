import VcCalendar from '../vc-calendar'
import MonthCalendar from '../vc-calendar/src/MonthCalendar'
import createPicker from './createPicker'
import wrapPicker from './wrapPicker'
import RangePicker from './RangePicker'
import WeekPicker from './WeekPicker'
import { DatePickerProps, MonthPickerProps, WeekPickerProps, RangePickerProps } from './interface'

const DatePicker = wrapPicker({ ...createPicker(VcCalendar, DatePickerProps()), name: 'ADatePicker' }, DatePickerProps())

const MonthPicker = wrapPicker({ ...createPicker(MonthCalendar, MonthPickerProps()), name: 'AMonthPicker' }, MonthPickerProps(), 'YYYY-MM')

Object.assign(DatePicker, {
  RangePicker: wrapPicker(RangePicker, RangePickerProps()),
  MonthPicker,
  WeekPicker: wrapPicker(WeekPicker, WeekPickerProps(), 'gggg-wo'),
})

export default DatePicker

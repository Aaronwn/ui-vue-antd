import CalendarLocale from '../../vc-calendar/src/locale/en_US'
import TimePickerLocale from '../../time-picker/locale/en_US'

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Chọn thời điểm',
    rangePlaceholder: [
      'Ngày bắt đầu', 'Ngày kết thúc',
    ],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
}

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/lo
// cale/example.json

export default locale

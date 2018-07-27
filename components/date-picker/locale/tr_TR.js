import CalendarLocale from '../../vc-calendar/src/locale/en_US'
import TimePickerLocale from '../../time-picker/locale/tr_TR'

// Merge into a locale object
const locale = {
  lang: {
    placeholder: 'Tarih Seç',
    rangePlaceholder: [
      'Başlangıç Tarihi', 'Bitiş Tarihi',
    ],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
}

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/l
// o cale/example.json

export default locale

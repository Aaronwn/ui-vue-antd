
import PropTypes from '../_util/vue-types'
import * as moment from 'moment'
import interopDefault from '../_util/interopDefault'
import { changeConfirmLocale } from '../modal/locale'

// export interface Locale {
//   locale: string;
//   Pagination?: Object;
//   DatePicker?: Object;
//   TimePicker?: Object;
//   Calendar?: Object;
//   Table?: Object;
//   Modal?: ModalLocale;
//   Popconfirm?: Object;
//   Transfer?: Object;
//   Select?: Object;
//   Upload?: Object;
// }

function setMomentLocale (locale) {
  if (locale && locale.locale) {
    interopDefault(moment).locale(locale.locale)
  } else {
    interopDefault(moment).locale('en')
  }
}

export default {
  name: 'ALocaleProvider',
  props: {
    locale: PropTypes.object.def({}),
  },
  data () {
    return {
      antLocale: {
        ...this.locale,
        exist: true,
      },
    }
  },
  provide () {
    return {
      localeData: this.$data,
    }
  },
  watch: {
    locale (val) {
      this.antLocale = {
        ...this.locale,
        exist: true,
      }
      setMomentLocale(val)
    },
  },
  beforeMount () {
    const { locale } = this
    setMomentLocale(locale)
    changeConfirmLocale(locale && locale.Modal)
  },
  updated () {
    const { locale } = this
    changeConfirmLocale(locale && locale.Modal)
  },
  beforeDestroy () {
    changeConfirmLocale()
  },
  render () {
    return this.$slots.default[0]
  },
}


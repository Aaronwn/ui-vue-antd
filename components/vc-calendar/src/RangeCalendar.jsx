
import PropTypes from '../../_util/vue-types'
import BaseMixin from '../../_util/BaseMixin'
import { getOptionProps, hasProp, mergeProps } from '../../_util/props-util'
import moment from 'moment'
import CalendarPart from './range-calendar/CalendarPart'
import TodayButton from './calendar/TodayButton'
import OkButton from './calendar/OkButton'
import TimePickerButton from './calendar/TimePickerButton'
import CommonMixin from './mixin/CommonMixin'
import enUs from './locale/en_US'
import { syncTime, getTodayTime, isAllowedDate } from './util/'

function noop () {}

function isEmptyArray (arr) {
  return Array.isArray(arr) && (arr.length === 0 || arr.every(i => !i))
}

function isArraysEqual (a, b) {
  if (a === b) return true
  if (a === null || typeof a === 'undefined' || b === null || typeof b === 'undefined') {
    return false
  }
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function getValueFromSelectedValue (selectedValue) {
  const [start, end] = selectedValue
  const newEnd = end && end.isSame(start, 'month') ? end.clone().add(1, 'month') : end
  return [start, newEnd]
}

function normalizeAnchor (props, init) {
  const selectedValue = props.selectedValue || init && props.defaultSelectedValue
  const value = props.value || init && props.defaultValue
  const normalizedValue = value
    ? getValueFromSelectedValue(value)
    : getValueFromSelectedValue(selectedValue)
  return !isEmptyArray(normalizedValue)
    ? normalizedValue : init && [moment(), moment().add(1, 'months')]
}

function generateOptions (length, extraOptionGen) {
  const arr = extraOptionGen ? extraOptionGen().concat() : []
  for (let value = 0; value < length; value++) {
    if (arr.indexOf(value) === -1) {
      arr.push(value)
    }
  }
  return arr
}

function onInputSelect (direction, value) {
  if (!value) {
    return
  }
  const originalValue = this.sSelectedValue
  const selectedValue = originalValue.concat()
  const index = direction === 'left' ? 0 : 1
  selectedValue[index] = value
  if (selectedValue[0] && this.compare(selectedValue[0], selectedValue[1]) > 0) {
    selectedValue[1 - index] = this.showTimePicker ? selectedValue[index] : undefined
  }
  this.__emit('inputSelect', selectedValue)
  this.fireSelectValueChange(selectedValue)
}

const RangeCalendar = {
  props: {
    locale: PropTypes.object.def(enUs),
    visible: PropTypes.bool.def(true),
    prefixCls: PropTypes.string.def('rc-calendar'),
    dateInputPlaceholder: PropTypes.any,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    hoverValue: PropTypes.any,
    mode: PropTypes.arrayOf(PropTypes.oneOf(['date', 'month', 'year', 'decade'])),
    showDateInput: PropTypes.bool.def(true),
    timePicker: PropTypes.any,
    showOk: PropTypes.bool,
    showToday: PropTypes.bool.def(true),
    defaultSelectedValue: PropTypes.array.def([]),
    selectedValue: PropTypes.array,
    showClear: PropTypes.bool,
    showWeekNumber: PropTypes.bool,
    // locale: PropTypes.object,
    // onChange: PropTypes.func,
    // onSelect: PropTypes.func,
    // onValueChange: PropTypes.func,
    // onHoverChange: PropTypes.func,
    // onPanelChange: PropTypes.func,
    format: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    // onClear: PropTypes.func,
    type: PropTypes.any.def('both'),
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.func.def(noop),
    renderFooter: PropTypes.func.def(() => null),
    renderSidebar: PropTypes.func.def(() => null),
    dateRender: PropTypes.func,
  },

  mixins: [BaseMixin, CommonMixin],

  data () {
    const props = this.$props
    const selectedValue = props.selectedValue || props.defaultSelectedValue
    const value = normalizeAnchor(props, 1)
    return {
      sSelectedValue: selectedValue,
      prevSelectedValue: selectedValue,
      firstSelectedValue: null,
      sHoverValue: props.hoverValue || [],
      sValue: value,
      showTimePicker: false,
      sMode: props.mode || ['date', 'date'],
    }
  },
  watch: {
    value (val) {
      const newState = {}
      newState.sValue = normalizeAnchor(this.$props, 0)
      this.setState(newState)
    },
    hoverValue (val) {
      if (!isArraysEqual(this.sHoverValue, val)) {
        this.setState({ sHoverValue: val })
      }
    },
    selectedValue (val) {
      const newState = {}
      newState.sSelectedValue = val
      newState.prevSelectedValue = val
      this.setState(newState)
    },
    mode (val) {
      if (!isArraysEqual(this.sMode, val)) {
        this.setState({ sMode: val })
      }
    },
  },

  methods: {
    onDatePanelEnter () {
      if (this.hasSelectedValue()) {
        this.fireHoverValueChange(this.sSelectedValue.concat())
      }
    },

    onDatePanelLeave () {
      if (this.hasSelectedValue()) {
        this.fireHoverValueChange([])
      }
    },

    onSelect (value) {
      const { type, sSelectedValue, prevSelectedValue, firstSelectedValue } = this
      let nextSelectedValue
      if (type === 'both') {
        if (!firstSelectedValue) {
          syncTime(prevSelectedValue[0], value)
          nextSelectedValue = [value]
        } else if (this.compare(firstSelectedValue, value) < 0) {
          syncTime(prevSelectedValue[1], value)
          nextSelectedValue = [firstSelectedValue, value]
        } else {
          syncTime(prevSelectedValue[0], value)
          syncTime(prevSelectedValue[1], firstSelectedValue)
          nextSelectedValue = [value, firstSelectedValue]
        }
      } else if (type === 'start') {
        syncTime(prevSelectedValue[0], value)
        const endValue = sSelectedValue[1]
        nextSelectedValue = endValue && this.compare(endValue, value) > 0 ? [value, endValue] : [value]
      } else { // type === 'end'
        const startValue = sSelectedValue[0]
        if (startValue && this.compare(startValue, value) <= 0) {
          syncTime(prevSelectedValue[1], value)
          nextSelectedValue = [startValue, value]
        } else {
          syncTime(prevSelectedValue[0], value)
          nextSelectedValue = [value]
        }
      }

      this.fireSelectValueChange(nextSelectedValue)
    },

    onDayHover (value) {
      let hoverValue = []
      const { sSelectedValue, firstSelectedValue, type } = this
      if (type === 'start' && sSelectedValue[1]) {
        hoverValue = this.compare(value, sSelectedValue[1]) < 0
          ? [value, sSelectedValue[1]] : [value]
      } else if (type === 'end' && sSelectedValue[0]) {
        hoverValue = this.compare(value, sSelectedValue[0]) > 0
          ? [sSelectedValue[0], value] : []
      } else {
        if (!firstSelectedValue) {
          return
        }
        hoverValue = this.compare(value, firstSelectedValue) < 0
          ? [value, firstSelectedValue] : [firstSelectedValue, value]
      }
      this.fireHoverValueChange(hoverValue)
    },

    onToday () {
      const startValue = getTodayTime(this.sValue[0])
      const endValue = startValue.clone().add(1, 'months')
      this.setState({ sValue: [startValue, endValue] })
    },

    onOpenTimePicker () {
      this.setState({
        showTimePicker: true,
      })
    },
    onCloseTimePicker () {
      this.setState({
        showTimePicker: false,
      })
    },

    onOk () {
      const { sSelectedValue } = this
      if (this.isAllowedDateAndTime(sSelectedValue)) {
        this.__emit('ok', sSelectedValue)
      }
    },

    onStartInputSelect (...oargs) {
      const args = ['left'].concat(oargs)
      return onInputSelect.apply(this, args)
    },

    onEndInputSelect (...oargs) {
      const args = ['right'].concat(oargs)
      return onInputSelect.apply(this, args)
    },

    onStartValueChange (leftValue) {
      const value = [...this.sValue]
      value[0] = leftValue
      return this.fireValueChange(value)
    },

    onEndValueChange (rightValue) {
      const value = [...this.sValue]
      value[1] = rightValue
      return this.fireValueChange(value)
    },

    onStartPanelChange (value, mode) {
      const { sMode, sValue } = this
      const newMode = [mode, sMode[1]]
      const newValue = [value || sValue[0], sValue[1]]
      this.__emit('panelChange', newValue, newMode)
      if (!hasProp(this, 'mode')) {
        this.setState({
          sMode: newMode,
        })
      }
    },

    onEndPanelChange (value, mode) {
      const { sMode, sValue } = this
      const newMode = [sMode[0], mode]
      const newValue = [sValue[0], value || sValue[1]]
      this.__emit('panelChange', newValue, newMode)
      if (!hasProp(this, 'mode')) {
        this.setState({
          sMode: newMode,
        })
      }
    },

    getStartValue () {
      let value = this.sValue[0]
      const selectedValue = this.sSelectedValue
      // keep selectedTime when select date
      if (selectedValue[0] && this.timePicker) {
        value = value.clone()
        syncTime(selectedValue[0], value)
      }
      if (this.showTimePicker && selectedValue[0]) {
        return selectedValue[0]
      }
      return value
    },

    getEndValue () {
      const { sValue, sSelectedValue, showTimePicker } = this
      const endValue = sValue[1] ? sValue[1].clone() : sValue[0].clone().add(1, 'month')
      // keep selectedTime when select date
      if (sSelectedValue[1] && this.timePicker) {
        syncTime(sSelectedValue[1], endValue)
      }
      if (showTimePicker) {
        return sSelectedValue[1] ? sSelectedValue[1] : this.getStartValue()
      }
      return endValue
    },
    // get disabled hours for second picker
    getEndDisableTime () {
      const { sSelectedValue, sValue, disabledTime } = this
      const userSettingDisabledTime = disabledTime(sSelectedValue, 'end') || {}
      const startValue = sSelectedValue && sSelectedValue[0] || sValue[0].clone()
      // if startTime and endTime is same day..
      // the second time picker will not able to pick time before first time picker
      if (!sSelectedValue[1] || startValue.isSame(sSelectedValue[1], 'day')) {
        const hours = startValue.hour()
        const minutes = startValue.minute()
        const second = startValue.second()
        let { disabledHours, disabledMinutes, disabledSeconds } = userSettingDisabledTime
        const oldDisabledMinutes = disabledMinutes ? disabledMinutes() : []
        const olddisabledSeconds = disabledSeconds ? disabledSeconds() : []
        disabledHours = generateOptions(hours, disabledHours)
        disabledMinutes = generateOptions(minutes, disabledMinutes)
        disabledSeconds = generateOptions(second, disabledSeconds)
        return {
          disabledHours () {
            return disabledHours
          },
          disabledMinutes (hour) {
            if (hour === hours) {
              return disabledMinutes
            }
            return oldDisabledMinutes
          },
          disabledSeconds (hour, minute) {
            if (hour === hours && minute === minutes) {
              return disabledSeconds
            }
            return olddisabledSeconds
          },
        }
      }
      return userSettingDisabledTime
    },

    isAllowedDateAndTime (selectedValue) {
      return isAllowedDate(selectedValue[0], this.disabledDate, this.disabledStartTime) &&
    isAllowedDate(selectedValue[1], this.disabledDate, this.disabledEndTime)
    },

    isMonthYearPanelShow (mode) {
      return ['month', 'year', 'decade'].indexOf(mode) > -1
    },

    hasSelectedValue () {
      const { sSelectedValue } = this
      return !!sSelectedValue[1] && !!sSelectedValue[0]
    },

    compare (v1, v2) {
      if (this.timePicker) {
        return v1.diff(v2)
      }
      return v1.diff(v2, 'days')
    },

    fireSelectValueChange (selectedValue, direct) {
      const { timePicker, prevSelectedValue } = this
      if (timePicker) {
        const timePickerProps = getOptionProps(timePicker)
        if (timePickerProps.defaultValue) {
          const timePickerDefaultValue = timePickerProps.defaultValue
          if (!prevSelectedValue[0] && selectedValue[0]) {
            syncTime(timePickerDefaultValue[0], selectedValue[0])
          }
          if (!prevSelectedValue[1] && selectedValue[1]) {
            syncTime(timePickerDefaultValue[1], selectedValue[1])
          }
        }
      }
      // 尚未选择过时间，直接输入的话
      if (!this.sSelectedValue[0] || !this.sSelectedValue[1]) {
        const startValue = selectedValue[0] || moment()
        const endValue = selectedValue[1] || startValue.clone().add(1, 'months')
        this.setState({
          sSelectedValue: selectedValue,
          sValue: selectedValue && selectedValue.length === 2 ? getValueFromSelectedValue([startValue, endValue]) : this.sValue,
        })
      }

      if (selectedValue[0] && !selectedValue[1]) {
        this.setState({ firstSelectedValue: selectedValue[0] })
        this.fireHoverValueChange(selectedValue.concat())
      }
      this.__emit('change', selectedValue)
      if (direct || selectedValue[0] && selectedValue[1]) {
        this.setState({
          prevSelectedValue: selectedValue,
          firstSelectedValue: null,
        })
        this.fireHoverValueChange([])
        this.__emit('select', selectedValue)
      }
      if (!hasProp(this, 'selectedValue')) {
        this.setState({
          sSelectedValue: selectedValue,
        })
      }
    },

    fireValueChange (value) {
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value,
        })
      }
      this.__emit('valueChange', value)
    },

    fireHoverValueChange (hoverValue) {
      if (!hasProp(this, 'hoverValue')) {
        this.setState({ sHoverValue: hoverValue })
      }
      this.__emit('hoverChange', hoverValue)
    },

    clear () {
      this.fireSelectValueChange([], true)
      this.__emit('clear')
    },

    disabledStartTime (time) {
      return this.disabledTime(time, 'start')
    },

    disabledEndTime (time) {
      return this.disabledTime(time, 'end')
    },

    disabledStartMonth (month) {
      const { sValue } = this
      return month.isSameOrAfter(sValue[1], 'month')
    },

    disabledEndMonth (month) {
      const { sValue } = this
      return month.isSameOrBefore(sValue[0], 'month')
    },
  },

  render () {
    const props = getOptionProps(this)
    const {
      prefixCls, dateInputPlaceholder,
      timePicker, showOk, locale, showClear,
      showToday, type,
    } = props
    const {
      sHoverValue,
      sSelectedValue,
      sMode,
      showTimePicker,
      sValue,
      $listeners,
    } = this
    const className = {
      [prefixCls]: 1,
      [`${prefixCls}-hidden`]: !props.visible,
      [`${prefixCls}-range`]: 1,
      [`${prefixCls}-show-time-picker`]: showTimePicker,
      [`${prefixCls}-week-number`]: props.showWeekNumber,
    }
    const baseProps = {
      props,
      on: $listeners,
    }
    const newProps = {
      props: {
        selectedValue: sSelectedValue,
      },
      on: {
        select: this.onSelect,
        dayHover: type === 'start' && sSelectedValue[1] ||
          type === 'end' && sSelectedValue[0] || !!sHoverValue.length
          ? this.onDayHover : noop,
      },
    }

    let placeholder1
    let placeholder2

    if (dateInputPlaceholder) {
      if (Array.isArray(dateInputPlaceholder)) {
        [placeholder1, placeholder2] = dateInputPlaceholder
      } else {
        placeholder1 = placeholder2 = dateInputPlaceholder
      }
    }
    const showOkButton = showOk === true || showOk !== false && !!timePicker
    const cls = {
      [`${prefixCls}-footer`]: true,
      [`${prefixCls}-range-bottom`]: true,
      [`${prefixCls}-footer-show-ok`]: showOkButton,
    }

    const startValue = this.getStartValue()
    const endValue = this.getEndValue()
    const todayTime = getTodayTime(startValue)
    const thisMonth = todayTime.month()
    const thisYear = todayTime.year()
    const isTodayInView =
            startValue.year() === thisYear && startValue.month() === thisMonth ||
            endValue.year() === thisYear && endValue.month() === thisMonth
    const nextMonthOfStart = startValue.clone().add(1, 'months')
    const isClosestMonths = nextMonthOfStart.year() === endValue.year() &&
            nextMonthOfStart.month() === endValue.month()
    const leftPartProps = mergeProps(baseProps, newProps, {
      props: {
        hoverValue: sHoverValue,
        direction: 'left',
        disabledTime: this.disabledStartTime,
        disabledMonth: this.disabledStartMonth,
        format: this.getFormat(),
        value: startValue,
        mode: sMode[0],
        placeholder: placeholder1,
        showDateInput: this.showDateInput,
        timePicker: timePicker,
        showTimePicker: showTimePicker,
        enablePrev: true,
        enableNext: !isClosestMonths || this.isMonthYearPanelShow(sMode[1]),
      },
      on: {
        inputSelect: this.onStartInputSelect,
        valueChange: this.onStartValueChange,
        panelChange: this.onStartPanelChange,
      },
    })
    const rightPartProps = mergeProps(baseProps, newProps, {
      props: {
        hoverValue: sHoverValue,
        direction: 'right',
        format: this.getFormat(),
        timePickerDisabledTime: this.getEndDisableTime(),
        placeholder: placeholder2,
        value: endValue,
        mode: sMode[1],
        showDateInput: this.showDateInput,
        timePicker: timePicker,
        showTimePicker: showTimePicker,
        disabledTime: this.disabledEndTime,
        disabledMonth: this.disabledEndMonth,
        enablePrev: !isClosestMonths || this.isMonthYearPanelShow(sMode[0]),
        enableNext: true,
      },
      on: {
        inputSelect: this.onEndInputSelect,
        valueChange: this.onEndValueChange,
        panelChange: this.onEndPanelChange,
      },
    })
    let TodayButtonNode = null
    if (showToday) {
      const todayButtonProps = mergeProps(baseProps, {
        props: {
          disabled: isTodayInView,
          value: sValue[0],
          text: locale.backToToday,
        },
        on: {
          today: this.onToday,
        },
      })
      TodayButtonNode = <TodayButton {...todayButtonProps}/>
    }

    let TimePickerButtonNode = null
    if (props.timePicker) {
      const timePickerButtonProps = mergeProps(baseProps, {
        props: {
          showTimePicker: showTimePicker,
          timePickerDisabled: !this.hasSelectedValue() || sHoverValue.length,
        },
        on: {
          openTimePicker: this.onOpenTimePicker,
          closeTimePicker: this.onCloseTimePicker,
        },
      })
      TimePickerButtonNode = <TimePickerButton {...timePickerButtonProps} />
    }

    let OkButtonNode = null
    if (showOkButton) {
      const okButtonProps = mergeProps(baseProps, {
        props: {
          okDisabled: !this.isAllowedDateAndTime(sSelectedValue) || !this.hasSelectedValue() || sHoverValue.length,
        },
        on: {
          ok: this.onOk,
        },
      })
      OkButtonNode = <OkButton {...okButtonProps}/>
    }

    return (
      <div
        ref='rootInstance'
        class={className}
        tabIndex='0'
      >
        {props.renderSidebar()}
        <div class={`${prefixCls}-panel`}>
          {showClear && sSelectedValue[0] && sSelectedValue[1]
            ? <a
              class={`${prefixCls}-clear-btn`}
              role='button'
              title={locale.clear}
              onClick={this.clear}
            /> : null}
          <div
            class={`${prefixCls}-date-panel`}
            onMouseleave={type !== 'both' ? this.onDatePanelLeave : noop}
            onMouseenter={type !== 'both' ? this.onDatePanelEnter : noop}
          >
            <CalendarPart {...leftPartProps}/>
            <span class={`${prefixCls}-range-middle`}>~</span>
            <CalendarPart {...rightPartProps}/>
          </div>
          <div class={cls}>
            {props.renderFooter()}
            {showToday || props.timePicker || showOkButton ? (
              <div class={`${prefixCls}-footer-btn`}>
                {TodayButtonNode}
                {TimePickerButtonNode}
                {OkButtonNode}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  },
}

export default RangeCalendar


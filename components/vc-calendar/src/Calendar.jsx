
import PropTypes from '../../_util/vue-types'
import BaseMixin from '../../_util/BaseMixin'
import { getOptionProps, hasProp } from '../../_util/props-util'
import { cloneElement } from '../../_util/vnode'
import KeyCode from '../../_util/KeyCode'
import * as moment from 'moment'
import DateTable from './date/DateTable'
import CalendarHeader from './calendar/CalendarHeader'
import CalendarFooter from './calendar/CalendarFooter'
import CalendarMixin from './mixin/CalendarMixin'
import CommonMixin from './mixin/CommonMixin'
import DateInput from './date/DateInput'
import enUs from './locale/en_US'
import { getTimeConfig, getTodayTime, syncTime } from './util'
function goStartMonth () {
  const next = this.sValue.clone()
  next.startOf('month')
  this.setValue(next)
}

function goEndMonth () {
  const next = this.sValue.clone()
  next.endOf('month')
  this.setValue(next)
}

function goTime (direction, unit) {
  const next = this.sValue.clone()
  next.add(direction, unit)
  this.setValue(next)
}

function goMonth (direction) {
  return goTime.call(this, direction, 'months')
}

function goYear (direction) {
  return goTime.call(this, direction, 'years')
}

function goWeek (direction) {
  return goTime.call(this, direction, 'weeks')
}

function goDay (direction) {
  return goTime.call(this, direction, 'days')
}

function isMoment (value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.findIndex((val) => val === undefined || moment.isMoment(val)) !== -1
  } else {
    return value === undefined || moment.isMoment(value)
  }
}
const MomentType = PropTypes.custom(isMoment)
const Calendar = {
  props: {
    locale: PropTypes.object.def(enUs),
    format: PropTypes.string,
    visible: PropTypes.bool.def(true),
    prefixCls: PropTypes.string.def('rc-calendar'),
    // prefixCls: PropTypes.string,
    defaultValue: MomentType,
    value: MomentType,
    selectedValue: MomentType,
    mode: PropTypes.oneOf(['time', 'date', 'month', 'year', 'decade']),
    // locale: PropTypes.object,
    showDateInput: PropTypes.bool.def(true),
    showWeekNumber: PropTypes.bool,
    showToday: PropTypes.bool.def(true),
    showOk: PropTypes.bool,
    // onSelect: PropTypes.func,
    // onOk: PropTypes.func,
    // onKeyDown: PropTypes.func,
    timePicker: PropTypes.any,
    dateInputPlaceholder: PropTypes.any,
    // onClear: PropTypes.func,
    // onChange: PropTypes.func,
    // onPanelChange: PropTypes.func,
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.any,
    renderFooter: PropTypes.func.def(() => null),
    renderSidebar: PropTypes.func.def(() => null),
    dateRender: PropTypes.func,
  },

  mixins: [BaseMixin, CommonMixin, CalendarMixin],

  data () {
    return {
      sMode: this.mode || 'date',
    }
  },
  watch: {
    mode (val) {
      this.setState({ sMode: val })
    },
  },
  methods: {
    onKeyDown (event) {
      if (event.target.nodeName.toLowerCase() === 'input') {
        return undefined
      }
      const keyCode = event.keyCode
      // mac
      const ctrlKey = event.ctrlKey || event.metaKey
      const { disabledDate, sValue: value } = this
      switch (keyCode) {
        case KeyCode.DOWN:
          goWeek.call(this, 1)
          event.preventDefault()
          return 1
        case KeyCode.UP:
          goWeek.call(this, -1)
          event.preventDefault()
          return 1
        case KeyCode.LEFT:
          if (ctrlKey) {
            goYear.call(this, -1)
          } else {
            goDay.call(this, -1)
          }
          event.preventDefault()
          return 1
        case KeyCode.RIGHT:
          if (ctrlKey) {
            goYear.call(this, 1)
          } else {
            goDay.call(this, 1)
          }
          event.preventDefault()
          return 1
        case KeyCode.HOME:
          goStartMonth.call(this)
          event.preventDefault()
          return 1
        case KeyCode.END:
          goEndMonth.call(this)
          event.preventDefault()
          return 1
        case KeyCode.PAGE_DOWN:
          goMonth.call(this, 1)
          event.preventDefault()
          return 1
        case KeyCode.PAGE_UP:
          goMonth.call(this, -1)
          event.preventDefault()
          return 1
        case KeyCode.ENTER:
          if (!disabledDate || !disabledDate(value)) {
            this.onSelect(value, {
              source: 'keyboard',
            })
          }
          event.preventDefault()
          return 1
        default:
          this.__emit('keydown', event)
          return 1
      }
    },

    onClear () {
      this.onSelect(null)
      this.__emit('clear')
    },

    onOk () {
      const { sSelectedValue } = this
      if (this.isAllowedDate(sSelectedValue)) {
        this.__emit('ok', sSelectedValue)
      }
    },

    onDateInputChange (value) {
      this.onSelect(value, {
        source: 'dateInput',
      })
    },
    onDateTableSelect (value) {
      const { timePicker, sSelectedValue } = this
      if (!sSelectedValue && timePicker) {
        const timePickerProps = getOptionProps(timePicker)
        const timePickerDefaultValue = timePickerProps.defaultValue
        if (timePickerDefaultValue) {
          syncTime(timePickerDefaultValue, value)
        }
      }
      this.onSelect(value)
    },
    onToday () {
      const { sValue } = this
      const now = getTodayTime(sValue)
      this.onSelect(now, {
        source: 'todayButton',
      })
    },
    onPanelChange (value, mode) {
      const { sValue } = this
      if (!hasProp(this, 'mode')) {
        this.setState({ sMode: mode })
      }
      this.__emit('panelChange', value || sValue, mode)
    },
    getRootDOMNode () {
      return this.$el
    },
    openTimePicker () {
      this.onPanelChange(null, 'time')
    },
    closeTimePicker () {
      this.onPanelChange(null, 'date')
    },
  },

  render () {
    const {
      locale, prefixCls, disabledDate,
      dateInputPlaceholder, timePicker,
      disabledTime, showDateInput, renderSidebar,
      sValue, sSelectedValue, sMode,
      $props: props,
    } = this
    const showTimePicker = sMode === 'time'
    const disabledTimeConfig = showTimePicker && disabledTime && timePicker
      ? getTimeConfig(sSelectedValue, disabledTime) : null

    let timePickerEle = null

    if (timePicker && showTimePicker) {
      const timePickerOriginProps = getOptionProps(timePicker)
      const timePickerProps = {
        props: {
          showHour: true,
          showSecond: true,
          showMinute: true,
          ...timePickerOriginProps,
          ...disabledTimeConfig,
          value: sSelectedValue,
          disabledTime,
        },
        on: {
          change: this.onDateInputChange,
        },
      }

      if (timePickerOriginProps.defaultValue !== undefined) {
        timePickerProps.props.defaultOpenValue = timePickerOriginProps.defaultValue
      }
      timePickerEle = cloneElement(timePicker, timePickerProps)
    }

    const dateInputElement = showDateInput ? (
      <DateInput
        format={this.getFormat()}
        key='date-input'
        value={sValue}
        locale={locale}
        placeholder={dateInputPlaceholder}
        showClear
        disabledTime={disabledTime}
        disabledDate={disabledDate}
        onClear={this.onClear}
        prefixCls={prefixCls}
        selectedValue={sSelectedValue}
        onChange={this.onDateInputChange}
      />
    ) : null
    const children = [
      renderSidebar(),
      (<div class={`${prefixCls}-panel`} key='panel'>
        {dateInputElement}
        <div class={`${prefixCls}-date-panel`}>
          <CalendarHeader
            locale={locale}
            mode={sMode}
            value={sValue}
            onValueChange={this.setValue}
            onPanelChange={this.onPanelChange}
            showTimePicker={showTimePicker}
            prefixCls={prefixCls}
          />
          {timePicker && showTimePicker
            ? (<div class={`${prefixCls}-time-picker`}>
              <div class={`${prefixCls}-time-picker-panel`}>
                {timePickerEle }
              </div>
            </div>)
            : null}
          <div class={`${prefixCls}-body`}>
            <DateTable
              locale={locale}
              value={sValue}
              selectedValue={sSelectedValue}
              prefixCls={prefixCls}
              dateRender={props.dateRender}
              onSelect={this.onDateTableSelect}
              disabledDate={disabledDate}
              showWeekNumber={props.showWeekNumber}
            />
          </div>

          <CalendarFooter
            showOk={props.showOk}
            renderFooter={props.renderFooter}
            locale={locale}
            prefixCls={prefixCls}
            showToday={props.showToday}
            disabledTime={disabledTime}
            showTimePicker={showTimePicker}
            showDateInput={props.showDateInput}
            timePicker={timePicker}
            selectedValue={sSelectedValue}
            value={sValue}
            disabledDate={disabledDate}
            okDisabled={!this.isAllowedDate(sSelectedValue)}
            onOk={this.onOk}
            onSelect={this.onSelect}
            onToday={this.onToday}
            onOpenTimePicker={this.openTimePicker}
            onCloseTimePicker={this.closeTimePicker}
          />
        </div>
      </div>),
    ]

    return this.renderRoot({
      children,
      class: props.showWeekNumber ? `${prefixCls}-week-number` : '',
    })
  },
}

export default Calendar


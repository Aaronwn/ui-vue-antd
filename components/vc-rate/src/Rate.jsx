import PropTypes from '../../_util/vue-types'
import classNames from 'classnames'
import KeyCode from '../../_util/KeyCode'
import { initDefaultProps, hasProp, getOptionProps } from '../../_util/props-util'
import BaseMixin from '../../_util/BaseMixin'
import { getOffsetLeft } from './util'
import Star from './Star'

const rateProps = {
  disabled: PropTypes.bool,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  count: PropTypes.number,
  allowHalf: PropTypes.bool,
  allowClear: PropTypes.bool,
  prefixCls: PropTypes.string,
  character: PropTypes.any,
  tabIndex: PropTypes.number,
  autoFocus: PropTypes.bool,
}

function noop () {}

export default {
  name: 'Rate',
  mixins: [BaseMixin],
  props: initDefaultProps(rateProps, {
    defaultValue: 0,
    count: 5,
    allowHalf: false,
    allowClear: true,
    prefixCls: 'rc-rate',
    tabIndex: 0,
    character: '★',
  }),
  model: {
    prop: 'value',
    event: 'change',
  },
  data () {
    let value = this.value
    if (!hasProp(this, 'value')) {
      value = this.defaultValue
    }
    return {
      sValue: value,
      focused: false,
      cleanedValue: null,
      hoverValue: undefined,
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.autoFocus && !this.disabled) {
        this.focus()
      }
    })
  },
  watch: {
    value (val) {
      this.setState({
        sValue: val,
      })
    },
  },
  methods: {
    onHover (event, index) {
      const hoverValue = this.getStarValue(index, event.pageX)
      const { cleanedValue } = this
      if (hoverValue !== cleanedValue) {
        this.setState({
          hoverValue,
          cleanedValue: null,
        })
      }
      this.$emit('hoverChange', hoverValue)
    },
    onMouseLeave () {
      this.setState({
        hoverValue: undefined,
        cleanedValue: null,
      })
      this.$emit('hoverChange', undefined)
    },
    onClick (event, index) {
      const value = this.getStarValue(index, event.pageX)
      let isReset = false
      if (this.allowClear) {
        isReset = value === this.sValue
      }
      this.onMouseLeave(true)
      this.changeValue(isReset ? 0 : value)
      this.setState({
        cleanedValue: isReset ? value : null,
      })
    },
    onFocus () {
      this.setState({
        focused: true,
      })
      this.$emit('focus')
    },
    onBlur () {
      this.setState({
        focused: false,
      })
      this.$emit('blur')
    },
    onKeyDown (event) {
      const { keyCode } = event
      const { count, allowHalf } = this
      let { sValue } = this
      if (keyCode === KeyCode.RIGHT && sValue < count) {
        if (allowHalf) {
          sValue += 0.5
        } else {
          sValue += 1
        }
        this.changeValue(sValue)
        event.preventDefault()
      } else if (keyCode === KeyCode.LEFT && sValue > 0) {
        if (allowHalf) {
          sValue -= 0.5
        } else {
          sValue -= 1
        }
        this.changeValue(sValue)
        event.preventDefault()
      }
      this.$emit('keydown', event)
    },
    getStarDOM (index) {
      return this.$refs['stars' + index].$el
    },
    getStarValue (index, x) {
      let value = index + 1
      if (this.allowHalf) {
        const starEle = this.getStarDOM(index)
        const leftDis = getOffsetLeft(starEle)
        const width = starEle.clientWidth
        if ((x - leftDis) < width / 2) {
          value -= 0.5
        }
      }
      return value
    },
    focus () {
      if (!this.disabled) {
        this.$refs.rateRef.focus()
      }
    },
    blur () {
      if (!this.disabled) {
        this.$refs.rateRef.blur()
      }
    },
    changeValue (value) {
      if (!hasProp(this, 'value')) {
        this.setState({
          sValue: value,
        })
      }
      this.$emit('change', value)
    },
  },
  render () {
    const {
      count,
      allowHalf,
      prefixCls,
      disabled,
      character,
      tabIndex,
    } = getOptionProps(this)
    const { sValue, hoverValue, focused } = this
    const stars = []
    const disabledClass = disabled ? `${prefixCls}-disabled` : ''
    const slotCharacter = this.$slots.character
    for (let index = 0; index < count; index++) {
      const starProps = {
        props: {
          index,
          disabled,
          prefixCls: `${prefixCls}-star`,
          allowHalf,
          value: hoverValue === undefined ? sValue : hoverValue,
          character: slotCharacter === undefined ? character : undefined,
          focused,
        },
        on: {
          click: this.onClick,
          hover: this.onHover,
        },
        key: index,
        ref: `stars${index}`,
      }
      stars.push(
        <Star
          {...starProps}
        >
          {
            slotCharacter !== undefined ? (<template slot='character'>{slotCharacter}</template>) : null
          }
        </Star>
      )
    }
    return (
      <ul
        class={classNames(prefixCls, disabledClass)}
        onMouseleave={disabled ? noop : this.onMouseLeave}
        tabIndex={disabled ? -1 : tabIndex}
        onFocus={disabled ? noop : this.onFocus}
        onBlur={disabled ? noop : this.onBlur}
        onKeydown={disabled ? noop : this.onKeyDown}
        ref='rateRef'
      >
        {stars}
      </ul>
    )
  },
}

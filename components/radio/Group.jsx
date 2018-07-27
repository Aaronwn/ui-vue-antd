import PropTypes from '../_util/vue-types'
import Radio from './Radio'
export default {
  name: 'ARadioGroup',
  props: {
    prefixCls: {
      default: 'ant-radio-group',
      type: String,
    },
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    size: {
      default: 'default',
      validator (value) {
        return ['large', 'default', 'small'].includes(value)
      },
    },
    options: {
      default: () => [],
      type: Array,
    },
    disabled: Boolean,
    name: String,
  },
  data () {
    const { value, defaultValue } = this
    return {
      stateValue: value || defaultValue,
    }
  },
  model: {
    prop: 'value',
  },
  provide () {
    return {
      radioGroupContext: this,
    }
  },
  computed: {
    radioOptions () {
      const { disabled } = this
      return this.options.map(option => {
        return typeof option === 'string'
          ? { label: option, value: option }
          : { ...option, disabled: option.disabled === undefined ? disabled : option.disabled }
      })
    },
    classes () {
      const { prefixCls, size } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${size}`]: size,
      }
    },
  },
  methods: {
    handleChange (event) {
      const target = event.target
      const { value: targetValue } = target
      if (this.value === undefined) {
        this.stateValue = targetValue
      }
      this.$emit('input', targetValue)
      this.$emit('change', event)
    },
    onMouseEnter (e) {
      this.$emit('mouseenter', e)
    },
    onMouseLeave (e) {
      this.$emit('mouseleave', e)
    },
  },
  watch: {
    value (val) {
      this.stateValue = val
    },
  },
  render () {
    const { radioOptions, classes, $slots, name,
      onMouseEnter,
      onMouseLeave,
    } = this
    return (
      <div
        class={classes}
        onMouseenter={onMouseEnter}
        onMouseleave={onMouseLeave}
      >
        {radioOptions.map(({ value, disabled, label }) =>
          <Radio key={value} value={value} disabled={disabled} name={name}>{label}</Radio>)}
        { radioOptions.length === 0 && ($slots.default || []).filter(c => c.tag || c.text.trim() !== '')}
      </div>
    )
  },
}


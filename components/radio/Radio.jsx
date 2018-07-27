import PropTypes from '../_util/vue-types'
import hasProp from '../_util/props-util'
export default {
  name: 'ARadio',
  props: {
    prefixCls: {
      default: 'ant-radio',
      type: String,
    },
    defaultChecked: Boolean,
    checked: { type: Boolean, default: undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: PropTypes.any,
    name: String,
    id: String,
    autoFocus: Boolean,
  },
  model: {
    prop: 'checked',
  },
  inject: {
    radioGroupContext: { default: undefined },
  },
  data () {
    const { radioGroupContext, checked, defaultChecked, value } = this
    let stateChecked
    if (radioGroupContext && radioGroupContext.stateValue !== undefined) {
      stateChecked = radioGroupContext.stateValue === value
    }
    return {
      stateChecked: stateChecked === undefined
        ? !hasProp(this, 'checked') ? defaultChecked : checked
        : stateChecked,
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.autoFocus) {
        this.$refs.input.focus()
      }
    })
  },
  methods: {
    handleChange (event) {
      const targetChecked = event.target.checked
      this.$emit('input', targetChecked)
      const { name, value, radioGroupContext } = this
      if ((!hasProp(this, 'checked') && !radioGroupContext) || (radioGroupContext && radioGroupContext.value === undefined)) {
        this.stateChecked = targetChecked
      }
      const target = {
        name,
        value,
        checked: targetChecked,
      }
      if (this.radioGroupContext) {
        this.radioGroupContext.handleChange({ target })
      } else {
        this.$emit('change', {
          target,
          stopPropagation () {
            event.stopPropagation()
          },
          preventDefault () {
            event.preventDefault()
          },
        })
      }
    },
    focus () {
      this.$refs.input.focus()
    },
    blur () {
      this.$refs.input.blur()
    },
    onFocus (e) {
      this.$emit('focus', e)
    },
    onBlur (e) {
      this.$emit('blur', e)
    },
    onMouseEnter (e) {
      this.$emit('mouseenter', e)
    },
    onMouseLeave (e) {
      this.$emit('mouseleave', e)
    },
  },
  watch: {
    checked (val) {
      this.stateChecked = val
    },
    'radioGroupContext.stateValue': function (stateValue) {
      this.stateChecked = stateValue === this.value
    },
  },
  render () {
    const { id, prefixCls,
      stateChecked, handleChange, $slots,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      radioGroupContext,
    } = this
    let { name, disabled } = this
    if (radioGroupContext) {
      name = radioGroupContext.name
      disabled = disabled || radioGroupContext.disabled
    }
    const wrapperClassString = {
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: stateChecked,
      [`${prefixCls}-wrapper-disabled`]: disabled,
    }
    const checkboxClass = {
      [`${prefixCls}`]: true,
      [`${prefixCls}-checked`]: stateChecked,
      [`${prefixCls}-disabled`]: disabled,
    }

    return (
      <label
        class={wrapperClassString}
        onMouseenter={onMouseEnter}
        onMouseleave={onMouseLeave}
      >
        <span class={checkboxClass}>
          <input name={name} type='radio' disabled={disabled}
            class={`${prefixCls}-input`} checked={stateChecked}
            onChange={handleChange} id={id} ref='input'
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <span class={`${prefixCls}-inner`} />
        </span>
        {$slots.default ? <span>
          {$slots.default}
        </span> : null}
      </label>
    )
  },
}


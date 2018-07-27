import classNames from 'classnames'
import hasProp, { getClass, getStyle } from '../_util/props-util'
import PropTypes from '../_util/vue-types'
export default {
  inheritAttrs: false,
  name: 'ACheckbox',
  props: {
    prefixCls: {
      default: 'ant-checkbox',
      type: String,
    },
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    isGroup: Boolean,
    value: [String, Number, Boolean],
    name: String,
    id: String,
    indeterminate: Boolean,
    type: PropTypes.string.def('checkbox'),
    autoFocus: Boolean,
  },
  model: {
    prop: 'checked',
  },
  inject: {
    checkboxGroupContext: { default: null },
  },
  mounted () {
    this.$nextTick(() => {
      if (this.autoFocus) {
        this.$refs.input.focus()
      }
    })
  },
  data () {
    const { checkboxGroupContext, checked, defaultChecked, value } = this
    let sChecked
    if (checkboxGroupContext) {
      sChecked = checkboxGroupContext.sValue.indexOf(value) !== -1
    } else {
      sChecked = !hasProp(this, 'checked') ? defaultChecked : checked
    }
    return {
      sChecked,
    }
  },
  computed: {
    checkboxClass () {
      const { prefixCls, indeterminate, sChecked, $props, checkboxGroupContext } = this
      let disabled = $props.disabled
      if (checkboxGroupContext) {
        disabled = disabled || checkboxGroupContext.disabled
      }
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-checked`]: sChecked,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-indeterminate`]: indeterminate,
      }
    },
  },
  methods: {
    handleChange (event) {
      const targetChecked = event.target.checked
      this.$emit('input', targetChecked)
      const { checked, checkboxGroupContext } = this
      if ((checked === undefined && !checkboxGroupContext) || (checkboxGroupContext && checkboxGroupContext.sValue === undefined)) {
        this.sChecked = targetChecked
      }
      const target = {
        ...this.$props,
        checked: targetChecked,
      }
      this.$emit('change', {
        target,
        stopPropagation () {
          event.stopPropagation()
        },
        preventDefault () {
          event.preventDefault()
        },
      })
    },
    onMouseEnter (e) {
      this.$emit('mouseenter', e)
    },
    onMouseLeave (e) {
      this.$emit('mouseleave', e)
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
  },
  watch: {
    checked (val) {
      this.sChecked = val
    },
    'checkboxGroupContext.sValue': function (val) {
      this.sChecked = val.indexOf(this.value) !== -1
    },
  },
  render () {
    const { $props: props, checkboxGroupContext,
      checkboxClass, name, $slots, sChecked,
      onFocus,
      onBlur,
      id,
    } = this
    const {
      prefixCls,
    } = props
    let disabled = props.disabled
    let onChange = this.handleChange
    if (checkboxGroupContext) {
      onChange = () => checkboxGroupContext.toggleOption({ value: props.value })
      disabled = props.disabled || checkboxGroupContext.disabled
    }
    const classString = classNames(getClass(this), {
      [`${prefixCls}-wrapper`]: true,
    })
    return (
      <label
        class={classString}
        style={getStyle(this)}
        onMouseenter={this.onMouseEnter}
        onMouseleave={this.onMouseLeave}
      >
        <span class={checkboxClass}>
          <input name={name} type='checkbox' disabled={disabled}
            class={`${prefixCls}-input`} checked={sChecked}
            onChange={onChange} ref='input' id={id}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <span class={`${prefixCls}-inner`} />
        </span>
        {$slots.default ? <span>{$slots.default}</span> : null}
      </label>
    )
  },
}


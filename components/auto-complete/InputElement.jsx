
import PropTypes from '../_util/vue-types'
import { cloneElement } from '../_util/vnode'
function chaining (...fns) {
  return function (...args) { // eslint-disable-line
    // eslint-disable-line
    for (let i = 0; i < fns.length; i++) {
      if (fns[i] && typeof fns[i] === 'function') {
        fns[i].apply(this, args)
      }
    }
  }
}
export default {
  props: {
    value: PropTypes.any,
    disabled: PropTypes.bool,
  },
  methods: {
    focus  () {
      const ele = this.$refs.ele
      ele.focus ? ele.focus() : this.$el.focus()
    },
    blur () {
      const ele = this.$refs.ele
      ele.blur ? ele.blur() : this.$el.blur()
    },

  },

  render () {
    const { $slots = {}, $listeners = {}, $props = {}, $attrs = {}} = this
    const value = $props.value === undefined ? '' : $props.value
    const children = $slots.default[0]
    const { componentOptions = {}} = $slots.default[0]
    const { listeners = {}} = componentOptions
    const newEvent = { ...listeners }

    for (const [eventName, event] of Object.entries($listeners)) {
      newEvent[eventName] = chaining(event, listeners[eventName])
    }

    return cloneElement(children, {
      domProps: {
        value,
      },
      props: $props,
      on: newEvent,
      attrs: { ...$attrs, value },
      ref: 'ele',
    })
  },
}


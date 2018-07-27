import { initDefaultProps } from '../../_util/props-util'
import { cloneElement } from '../../_util/vnode'
import warning from '../../_util/warning'
import BaseMixin from '../../_util/BaseMixin'
import { ITouchProps } from './PropTypes'

export default {
  name: 'TouchFeedback',
  mixins: [BaseMixin],
  props: initDefaultProps(ITouchProps, {
    disabled: false,
  }),
  data () {
    return {
      active: false,
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.disabled && this.active) {
        this.setState({
          active: false,
        })
      }
    })
  },
  methods: {
    triggerEvent (type, isActive, ev) {
      // const eventType = `on${type}`
      // if (this.props[eventType]) {
      //   this.props[eventType](ev)
      // }
      this.$emit(type, ev)
      if (isActive !== this.active) {
        this.setState({
          active: isActive,
        })
      }
    },
    onTouchStart (e) {
      this.triggerEvent('touchstart', true, e)
    },
    onTouchMove (e) {
      this.triggerEvent('touchmove', false, e)
    },
    onTouchEnd (e) {
      this.triggerEvent('touchend', false, e)
    },
    onTouchCancel (e) {
      this.triggerEvent('touchcancel', false, e)
    },
    onMouseDown (e) {
      // todo
      // pc simulate mobile
      // if (this.props.onTouchStart) {
      this.triggerEvent('touchstart', true, e)
      // }
      this.triggerEvent('mousedown', true, e)
    },
    onMouseUp (e) {
      // if (this.props.onTouchEnd) {
      this.triggerEvent('touchend', false, e)
      // }
      this.triggerEvent('mouseup', false, e)
    },
    onMouseLeave (e) {
      this.triggerEvent('mouseleave', false, e)
    },
  },
  render () {
    const { disabled, activeClassName = '', activeStyle = {}} = this.$props

    const child = this.$slots.default
    if (child.length !== 1) {
      warning(false, 'm-feedback组件只能包含一个子元素')
      return null
    }
    let childProps = {
      on: disabled ? {} : {
        touchstart: this.onTouchStart,
        touchmove: this.onTouchMove,
        touchend: this.onTouchEnd,
        touchcancel: this.onTouchCancel,
        mousedown: this.onMouseDown,
        mouseup: this.onMouseUp,
        mouseleave: this.onMouseLeave,
      },
    }

    if (!disabled && this.active) {
      childProps = { ...childProps, ...{
        style: activeStyle,
        class: activeClassName,
      }}
    }

    return cloneElement(child, childProps)
  },
}

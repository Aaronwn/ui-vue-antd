
import PropTypes from '../_util/vue-types'
import Align from '../align'
import PopupInner from './PopupInner'
import LazyRenderBox from './LazyRenderBox'
import { noop } from './utils'
import animate from '../_util/css-animation'

export default {
  props: {
    visible: PropTypes.bool,
    getClassNameFromAlign: PropTypes.func,
    getRootDomNode: PropTypes.func,
    align: PropTypes.any,
    destroyPopupOnHide: PropTypes.bool,
    prefixCls: PropTypes.string,
    getContainer: PropTypes.func,
    transitionName: PropTypes.string,
    animation: PropTypes.any,
    maskAnimation: PropTypes.string,
    maskTransitionName: PropTypes.string,
    mask: PropTypes.bool,
    zIndex: PropTypes.number,
    popupClassName: PropTypes.any,
    popupStyle: PropTypes.object.def({}),
  },
  data () {
    return {
      destroyPopup: false,
    }
  },
  beforeDestroy () {
    this.$el.remove()
  },
  // beforeUpdate () {
  //   this.$nextTick(() => {
  //     const newContainer = this.getContainer()
  //     if (newContainer !== this._container) {
  //       this._container = newContainer
  //       this._container.appendChild(this.$el)
  //       this.$refs.alignInstance.forceAlign()
  //     }
  //   })
  // },
  watch: {
    visible (val) {
      if (val) {
        this.destroyPopup = false
      }
    },
  },
  methods: {
    onAlign (popupDomNode, align) {
      const props = this.$props
      const currentAlignClassName = props.getClassNameFromAlign(align)
      popupDomNode.className = this.getClassName(currentAlignClassName)
      this.$listeners.align && this.$listeners.align(popupDomNode, align)
    },

    getPopupDomNode () {
      return this.$refs.popupInstance ? this.$refs.popupInstance.$el : null
    },

    getTarget () {
      return this.$props.getRootDomNode()
    },

    getMaskTransitionName () {
      const props = this.$props
      let transitionName = props.maskTransitionName
      const animation = props.maskAnimation
      if (!transitionName && animation) {
        transitionName = `${props.prefixCls}-${animation}`
      }
      return transitionName
    },

    getTransitionName () {
      const props = this.$props
      let transitionName = props.transitionName
      const animation = props.animation
      if (!transitionName) {
        if (typeof animation === 'string') {
          transitionName = `${animation}`
        } else if (animation && animation.props && animation.props.name) {
          transitionName = animation.props.name
        }
      }
      return transitionName
    },

    getClassName (currentAlignClassName) {
      return `${this.$props.prefixCls} ${this.$props.popupClassName} ${currentAlignClassName}`
    },
    getPopupElement () {
      const { $props: props, $slots, $listeners, getTransitionName } = this
      const { align, visible, prefixCls, animation, popupStyle } = props
      const { mouseenter, mouseleave } = $listeners
      const className = this.getClassName(props.getClassNameFromAlign(align))
      // const hiddenClassName = `${prefixCls}-hidden`
      const popupInnerProps = {
        props: {
          prefixCls,
          visible,
          // hiddenClassName,
        },
        class: className,
        on: {
          mouseenter: mouseenter || noop,
          mouseleave: mouseleave || noop,
        },
        ref: 'popupInstance',
        style: { ...this.getZIndexStyle(), ...popupStyle },
      }
      let transitionProps = {
        props: Object.assign({
          appear: true,
          css: false,
        }),
      }
      const transitionName = getTransitionName()
      let useTransition = !!transitionName
      const transitionEvent = {
        beforeEnter: (el) => {
          // el.style.display = el.__vOriginalDisplay
          // this.$refs.alignInstance.forceAlign()
        },
        enter: (el, done) => {
          // align updated后执行动画
          this.$nextTick(() => {
            this.$refs.alignInstance.$nextTick(() => {
              animate(el, `${transitionName}-enter`, done)
            })
          })
        },
        leave: (el, done) => {
          animate(el, `${transitionName}-leave`, done)
        },
        afterLeave: (el) => {
          if (this.destroyPopupOnHide) {
            this.destroyPopup = true
          }
        },
      }

      if (typeof animation === 'object') {
        useTransition = true
        const { on = {}, props = {}} = animation
        transitionProps.props = { ...transitionProps.props, ...props }
        transitionProps.on = { ...transitionEvent, ...on, afterLeave: (el) => {
          transitionEvent.afterLeave(el)
          on.afterLeave && on.afterLeave(el)
        } }
      } else {
        transitionProps.on = transitionEvent
      }
      if (!useTransition) {
        transitionProps = {}
      }
      return (<transition
        {...transitionProps}
      >
        <Align
          v-show={visible}
          target={this.getTarget}
          key='popup'
          ref='alignInstance'
          monitorWindowResize
          align={align}
          onAlign={this.onAlign}
          visible={visible}
        >
          <PopupInner
            {...popupInnerProps}
          >
            {$slots.default}
          </PopupInner>
        </Align>
      </transition>)
    },

    getZIndexStyle () {
      const style = {}
      const props = this.$props
      if (props.zIndex !== undefined) {
        style.zIndex = props.zIndex
      }
      return style
    },

    getMaskElement () {
      const props = this.$props
      let maskElement = null
      if (props.mask) {
        const maskTransition = this.getMaskTransitionName()
        maskElement = (
          <LazyRenderBox
            v-show={props.visible}
            style={this.getZIndexStyle()}
            key='mask'
            class={`${props.prefixCls}-mask`}
            visible={props.visible}
          />
        )
        if (maskTransition) {
          maskElement = (
            <transition
              appear
              name={maskTransition}
            >
              {maskElement}
            </transition>
          )
        }
      }
      return maskElement
    },
  },

  render () {
    const { destroyPopup, getMaskElement, getPopupElement, visible } = this
    return (
      <div>
        {getMaskElement()}
        {(visible || !destroyPopup) ? getPopupElement() : null}
      </div>
    )
  },
}


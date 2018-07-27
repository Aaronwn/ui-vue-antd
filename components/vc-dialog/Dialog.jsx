
import KeyCode from '../_util/KeyCode'
import LazyRenderBox from './LazyRenderBox'
import BaseMixin from '../_util/BaseMixin'
import getTransitionProps from '../_util/getTransitionProps'
import getScrollBarSize from '../_util/getScrollBarSize'
import getDialogPropTypes from './IDialogPropTypes'
const IDialogPropTypes = getDialogPropTypes()

let uuid = 0
let openCount = 0

/* eslint react/no-is-mounted:0 */
function noop () {}
function getScroll (w, top) {
  let ret = w[`page${top ? 'Y' : 'X'}Offset`]
  const method = `scroll${top ? 'Top' : 'Left'}`
  if (typeof ret !== 'number') {
    const d = w.document
    ret = d.documentElement[method]
    if (typeof ret !== 'number') {
      ret = d.body[method]
    }
  }
  return ret
}

function setTransformOrigin (node, value) {
  const style = node.style;
  ['Webkit', 'Moz', 'Ms', 'ms'].forEach((prefix) => {
    style[`${prefix}TransformOrigin`] = value
  })
  style[`transformOrigin`] = value
}

function offset (el) {
  const rect = el.getBoundingClientRect()
  const pos = {
    left: rect.left,
    top: rect.top,
  }
  const doc = el.ownerDocument
  const w = doc.defaultView || doc.parentWindow
  pos.left += getScroll(w)
  pos.top += getScroll(w, true)
  return pos
}
const initDefaultProps = (propTypes, defaultProps) => {
  return Object.keys(defaultProps).map(k => propTypes[k].def(defaultProps[k]))
}
export default {
  mixins: [BaseMixin],
  props: {
    ...IDialogPropTypes,
    ...initDefaultProps(IDialogPropTypes, {
      mask: true,
      visible: false,
      keyboard: true,
      closable: true,
      maskClosable: true,
      destroyOnClose: false,
      prefixCls: 'rc-dialog',
    }),
  },
  data () {
    return {
      destroyPopup: false,
    }
  },

  // private inTransition: boolean;
  // private titleId: string;
  // private openTime: number;
  // private lastOutSideFocusNode: HTMLElement | null;
  // private wrap: HTMLElement;
  // private dialog: any;
  // private sentinel: HTMLElement;
  // private bodyIsOverflowing: boolean;
  // private scrollbarWidth: number;

  beforeMount () {
    this.inTransition = false
    this.titleId = `rcDialogTitle${uuid++}`
  },
  mounted () {
    this.$nextTick(() => {
      this.updatedCallback(false)
    })
  },

  watch: {
    visible (val) {
      if (val) {
        this.destroyPopup = false
      }
      this.$nextTick(() => {
        this.updatedCallback(!val)
      })
    },
  },
  beforeDestroy () {
    if (this.visible || this.inTransition) {
      this.removeScrollingEffect()
    }
  },
  methods: {
    updatedCallback (visible) {
      const mousePosition = this.mousePosition
      if (this.visible) {
      // first show
        if (!visible) {
          this.openTime = Date.now()
          this.lastOutSideFocusNode = document.activeElement
          this.addScrollingEffect()
          this.$refs.wrap.focus()
          const dialogNode = this.$refs.dialog.$el
          if (mousePosition) {
            const elOffset = offset(dialogNode)
            setTransformOrigin(dialogNode,
              `${mousePosition.x - elOffset.left}px ${mousePosition.y - elOffset.top}px`)
          } else {
            setTransformOrigin(dialogNode, '')
          }
        }
      } else if (visible) {
        this.inTransition = true
        if (this.mask && this.lastOutSideFocusNode) {
          try {
            this.lastOutSideFocusNode.focus()
          } catch (e) {
            this.lastOutSideFocusNode = null
          }
          this.lastOutSideFocusNode = null
        }
      }
    },
    onAnimateLeave () {
      const { afterClose, destroyOnClose } = this
      // need demo?
      // https://github.com/react-component/dialog/pull/28
      if (this.$refs.wrap) {
        this.$refs.wrap.style.display = 'none'
      }
      if (destroyOnClose) {
        this.destroyPopup = true
      }
      this.inTransition = false
      this.removeScrollingEffect()
      if (afterClose) {
        afterClose()
      }
    },
    onMaskClick (e) {
    // android trigger click on open (fastclick??)
      if (Date.now() - this.openTime < 300) {
        return
      }
      if (e.target === e.currentTarget) {
        this.close(e)
      }
    },
    onKeydown (e) {
      const props = this.$props
      if (props.keyboard && e.keyCode === KeyCode.ESC) {
        this.close(e)
      }
      // keep focus inside dialog
      if (props.visible) {
        if (e.keyCode === KeyCode.TAB) {
          const activeElement = document.activeElement
          const dialogRoot = this.$refs.wrap
          if (e.shiftKey) {
            if (activeElement === dialogRoot) {
              this.$refs.sentinel.focus()
            }
          } else if (activeElement === this.$refs.sentinel) {
            dialogRoot.focus()
          }
        }
      }
    },
    getDialogElement () {
      const { closable, prefixCls, width, height,
        title, footer: tempFooter, bodyStyle, visible, bodyProps } = this
      const dest = {}
      if (width !== undefined) {
        dest.width = typeof width === 'number' ? `${width}px` : width
      }
      if (height !== undefined) {
        dest.height = typeof height === 'number' ? `${height}px` : height
      }

      let footer
      if (tempFooter) {
        footer = (
          <div class={`${prefixCls}-footer`} ref='footer'>
            {tempFooter}
          </div>
        )
      }

      let header
      if (title) {
        header = (
          <div class={`${prefixCls}-header`} ref='header'>
            <div class={`${prefixCls}-title`} id={this.titleId}>
              {title}
            </div>
          </div>
        )
      }

      let closer
      if (closable) {
        closer = (
          <button
            key='close'
            onClick={this.close || noop}
            aria-label='Close'
            class={`${prefixCls}-close`}
          >
            <span class={`${prefixCls}-close-x`} />
          </button>)
      }

      const style = { ...this.dialogStyle, ...dest }
      const cls = {
        [prefixCls]: true,
        ...this.dialogClass,
      }
      const transitionName = this.getTransitionName()
      const dialogElement = (
        <LazyRenderBox
          v-show={visible}
          key='dialog-element'
          role='document'
          ref='dialog'
          style={style}
          class={cls}
        >
          <div class={`${prefixCls}-content`}>
            {closer}
            {header}
            <div
              class={`${prefixCls}-body`}
              style={bodyStyle}
              ref='body'
              {...bodyProps}
            >
              {this.$slots.default}
            </div>
            {footer}
          </div>
          <div tabIndex={0} ref='sentinel' style='width: 0px; height: 0px; overflow: hidden'>
          sentinel
          </div>
        </LazyRenderBox>
      )
      const dialogTransitionProps = getTransitionProps(transitionName, {
        afterLeave: this.onAnimateLeave,
      })
      return (
        <transition
          key='dialog'
          {...dialogTransitionProps}
        >
          {(visible || !this.destroyPopup) ? dialogElement : null}
        </transition>
      )
    },
    getZIndexStyle () {
      const style = {}
      const props = this.$props
      if (props.zIndex !== undefined) {
        style.zIndex = props.zIndex
      }
      return style
    },
    getWrapStyle () {
      return { ...this.getZIndexStyle(), ...this.wrapStyle }
    },
    getMaskStyle () {
      return { ...this.getZIndexStyle(), ...this.maskStyle }
    },
    getMaskElement () {
      const props = this.$props
      let maskElement
      if (props.mask) {
        const maskTransition = this.getMaskTransitionName()
        maskElement = (
          <LazyRenderBox
            v-show={props.visible}
            style={this.getMaskStyle()}
            key='mask'
            class={`${props.prefixCls}-mask`}
            {...props.maskProps}
          />
        )
        if (maskTransition) {
          const maskTransitionProps = getTransitionProps(maskTransition)
          maskElement = (
            <transition
              key='mask'
              {...maskTransitionProps}
            >
              {maskElement}
            </transition>
          )
        }
      }
      return maskElement
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
      if (!transitionName && animation) {
        transitionName = `${props.prefixCls}-${animation}`
      }
      return transitionName
    },
    setScrollbar () {
      if (this.bodyIsOverflowing && this.scrollbarWidth !== undefined) {
        document.body.style.paddingRight = `${this.scrollbarWidth}px`
      }
    },
    addScrollingEffect () {
      openCount++
      if (openCount !== 1) {
        return
      }
      this.checkScrollbar()
      this.setScrollbar()
      document.body.style.overflow = 'hidden'
    // this.adjustDialog();
    },
    removeScrollingEffect () {
      openCount--
      if (openCount !== 0) {
        return
      }
      document.body.style.overflow = ''
      this.resetScrollbar()
    // this.resetAdjustments();
    },
    close (e) {
      this.__emit('close', e)
    },
    checkScrollbar () {
      let fullWindowWidth = window.innerWidth
      if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
        const documentElementRect = document.documentElement.getBoundingClientRect()
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
      }
      this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
      if (this.bodyIsOverflowing) {
        this.scrollbarWidth = getScrollBarSize()
      }
    },
    resetScrollbar () {
      document.body.style.paddingRight = ''
    },
    adjustDialog () {
      if (this.$refs.wrap && this.scrollbarWidth !== undefined) {
        const modalIsOverflowing =
        this.$refs.wrap.scrollHeight > document.documentElement.clientHeight
        this.$refs.wrap.style.paddingLeft =
        `${!this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : ''}px`
        this.$refs.wrap.style.paddingRight =
        `${this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''}px`
      }
    },
    resetAdjustments () {
      if (this.$refs.wrap) {
        this.$refs.wrap.style.paddingLeft = this.$refs.wrap.style.paddingLeft = ''
      }
    },
  },
  render () {
    const { prefixCls, maskClosable, visible, wrapClassName, title, wrapProps } = this
    const style = this.getWrapStyle()
    // clear hide display
    // and only set display after async anim, not here for hide
    if (visible) {
      style.display = null
    }
    return (
      <div>
        {this.getMaskElement()}
        <div
          tabIndex={-1}
          onKeydown={this.onKeydown}
          class={`${prefixCls}-wrap ${wrapClassName || ''}`}
          ref='wrap'
          onClick={maskClosable ? this.onMaskClick : noop}
          role='dialog'
          aria-labelledby={title ? this.titleId : null}
          style={style}
          {...wrapProps}
        >
          {this.getDialogElement()}
        </div>
      </div>
    )
  },
}


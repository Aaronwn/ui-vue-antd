
import PropTypes from '../_util/vue-types'
import Trigger from '../trigger'
import { placements } from './placements'
import { hasProp, getComponentFromProp, getOptionProps } from '../_util/props-util'
function noop () {}
export default {
  props: {
    trigger: PropTypes.any.def('hover'),
    defaultVisible: PropTypes.bool,
    visible: PropTypes.bool,
    placement: PropTypes.string.def('right'),
    transitionName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    animation: PropTypes.any,
    afterVisibleChange: PropTypes.func.def(() => {}),
    overlay: PropTypes.any,
    overlayStyle: PropTypes.object,
    overlayClassName: PropTypes.string,
    prefixCls: PropTypes.string.def('rc-tooltip'),
    mouseEnterDelay: PropTypes.number.def(0),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    getTooltipContainer: PropTypes.func,
    destroyTooltipOnHide: PropTypes.bool.def(false),
    align: PropTypes.object.def({}),
    arrowContent: PropTypes.any.def(null),
    tipId: PropTypes.string,
    builtinPlacements: PropTypes.object,
  },
  methods: {
    getPopupElement (h) {
      const { prefixCls, tipId } = this.$props
      return ([
        <div class={`${prefixCls}-arrow`} key='arrow'>
          {getComponentFromProp(this, 'arrowContent')}
        </div>,
        <div class={`${prefixCls}-inner`} key='content' id={tipId}>
          {getComponentFromProp(this, 'overlay')}
        </div>,
      ])
    },

    getPopupDomNode () {
      return this.$refs.trigger.getPopupDomNode()
    },
  },
  render (h) {
    const {
      overlayClassName, trigger,
      mouseEnterDelay, mouseLeaveDelay,
      overlayStyle, prefixCls,
      afterVisibleChange,
      transitionName, animation,
      placement, align,
      destroyTooltipOnHide,
      defaultVisible, getTooltipContainer,
      ...restProps
    } = getOptionProps(this)
    const extraProps = { ...restProps }
    if (hasProp(this, 'visible')) {
      extraProps.popupVisible = this.$props.visible
    }
    const triggerProps = {
      props: {
        popupClassName: overlayClassName,
        prefixCls: prefixCls,
        action: trigger,
        builtinPlacements: placements,
        popupPlacement: placement,
        popupAlign: align,
        getPopupContainer: getTooltipContainer,
        afterPopupVisibleChange: afterVisibleChange,
        popupTransitionName: transitionName,
        popupAnimation: animation,
        defaultPopupVisible: defaultVisible,
        destroyPopupOnHide: destroyTooltipOnHide,
        mouseLeaveDelay: mouseLeaveDelay,
        popupStyle: overlayStyle,
        mouseEnterDelay: mouseEnterDelay,
        ...extraProps,
      },
      on: {
        popupVisibleChange: this.$listeners.visibleChange || noop,
        popupAlign: this.$listeners.popupAlign || noop,
      },
      ref: 'trigger',
    }
    return (<Trigger {...triggerProps}>
      <template slot='popup'>
        {this.getPopupElement(h)}
      </template>
      {this.$slots.default}
    </Trigger>)
  },
}


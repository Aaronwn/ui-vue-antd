
import classnames from 'classnames'
import Trigger from '../trigger'
import PropTypes from '../_util/vue-types'
import DropdownMenu from './DropdownMenu'
import { isSingleMode } from './util'
import BaseMixin from '../_util/BaseMixin'

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
}

export default {
  name: 'SelectTrigger',
  mixins: [BaseMixin],
  props: {
    // onPopupFocus: PropTypes.func,
    // onPopupScroll: PropTypes.func,
    dropdownMatchSelectWidth: PropTypes.bool,
    defaultActiveFirstOption: PropTypes.bool,
    dropdownAlign: PropTypes.object,
    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    showSearch: PropTypes.bool,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.object,
    dropdownMenuStyle: PropTypes.object,
    multiple: PropTypes.bool,
    inputValue: PropTypes.string,
    filterOption: PropTypes.any,
    options: PropTypes.any,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    value: PropTypes.array,
    // children: PropTypes.any,
    showAction: PropTypes.arrayOf(PropTypes.string),
    combobox: PropTypes.bool,
    animation: PropTypes.string,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func,
  },
  data () {
    return {
      dropdownWidth: null,
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.setDropdownWidth()
    })
  },

  updated () {
    this.$nextTick(() => {
      this.setDropdownWidth()
    })
  },
  methods: {
    setDropdownWidth () {
      const width = this.$el.offsetWidth
      if (width !== this.dropdownWidth) {
        this.setState({ dropdownWidth: width })
      }
    },

    getInnerMenu () {
      return this.$refs.dropdownMenuRef && this.$refs.dropdownMenuRef.$refs.menuRef
    },

    getPopupDOMNode () {
      return this.$refs.triggerRef.getPopupDomNode()
    },

    getDropdownElement (newProps) {
      const {
        value, firstActiveValue, defaultActiveFirstOption,
        dropdownMenuStyle, getDropdownPrefixCls,
      } = this
      const { menuSelect, menuDeselect, popupScroll } = this.$listeners
      const dropdownMenuProps = {
        props: {
          ...newProps.props,
          prefixCls: getDropdownPrefixCls(),
          value, firstActiveValue, defaultActiveFirstOption, dropdownMenuStyle,
        },
        on: {
          ...newProps.on,
          menuSelect,
          menuDeselect,
          popupScroll,
        },
        ref: 'dropdownMenuRef',
      }
      return (
        <DropdownMenu {...dropdownMenuProps} />
      )
    },

    getDropdownTransitionName () {
      const props = this.$props
      let transitionName = props.transitionName
      if (!transitionName && props.animation) {
        transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`
      }
      return transitionName
    },

    getDropdownPrefixCls () {
      return `${this.prefixCls}-dropdown`
    },
  },

  render () {
    const { $props, $slots, $listeners } = this
    const {
      multiple,
      visible,
      inputValue,
      dropdownAlign,
      disabled,
      showSearch,
      dropdownClassName,
      dropdownStyle,
      dropdownMatchSelectWidth,
      options,
      getPopupContainer,
      showAction,
    } = $props
    const { mouseenter, mouseleave, popupFocus, dropdownVisibleChange } = $listeners
    const dropdownPrefixCls = this.getDropdownPrefixCls()
    const popupClassName = {
      [dropdownClassName]: !!dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
    }
    const popupElement = this.getDropdownElement({
      props: {
        menuItems: options,
        multiple,
        inputValue,
        visible,
      }, on: {
        popupFocus,
      },
    })
    let hideAction
    if (disabled) {
      hideAction = []
    } else if (isSingleMode($props) && !showSearch) {
      hideAction = ['click']
    } else {
      hideAction = ['blur']
    }
    const popupStyle = { ...dropdownStyle }
    const widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth'
    if (this.dropdownWidth) {
      popupStyle[widthProp] = `${this.dropdownWidth}px`
    }
    const triggerProps = {
      props: {
        ...$props,
        showAction: disabled ? [] : showAction,
        hideAction,
        ref: 'triggerRef',
        popupPlacement: 'bottomLeft',
        builtinPlacements: BUILT_IN_PLACEMENTS,
        prefixCls: dropdownPrefixCls,
        popupTransitionName: this.getDropdownTransitionName(),
        popupAlign: dropdownAlign,
        popupVisible: visible,
        getPopupContainer,
        popupClassName: classnames(popupClassName),
        popupStyle,
      },
      on: {
        popupVisibleChange: dropdownVisibleChange,
      },
      ref: 'triggerRef',
    }
    if (mouseenter) {
      triggerProps.on.mouseenter = mouseenter
    }
    if (mouseleave) {
      triggerProps.on.mouseleave = mouseleave
    }
    return (
      <Trigger {...triggerProps}>
        {$slots.default}
        <template slot='popup'>
          {popupElement}
        </template>
      </Trigger>
    )
  },
}


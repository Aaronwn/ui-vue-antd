
import MenuMixin from './MenuMixin'
import BaseMixin from '../_util/BaseMixin'
import commonPropsType from './commonPropsType'
export default {
  name: 'SubPopupMenu',
  props: { ...commonPropsType,
  },

  mixins: [MenuMixin, BaseMixin],
  methods: {
    onDeselect (selectInfo) {
      this.__emit('deselect', selectInfo)
    },

    onSelect (selectInfo) {
      this.__emit('select', selectInfo)
    },

    onClick (e) {
      this.__emit('click', e)
    },

    onOpenChange (e) {
      this.__emit('openChange', e)
    },

    onDestroy (key) {
      this.__emit('destroy', key)
    },

    getOpenTransitionName () {
      return this.$props.openTransitionName
    },

    renderMenuItem (c, i, subIndex) {
      if (!c) {
        return null
      }
      const props = this.$props
      const extraProps = {
        openKeys: props.openKeys,
        selectedKeys: props.selectedKeys,
        triggerSubMenuAction: props.triggerSubMenuAction,
        isRootMenu: false,
      }
      return this.renderCommonMenuItem(c, i, subIndex, extraProps)
    },
  },
  render () {
    const props = this.$props

    this.haveOpened = this.haveOpened || props.visible || props.forceSubMenuRender
    if (!this.haveOpened) {
      return null
    }
    const { prefixCls } = this.$props
    return this.renderRoot({ ...this.$props, class: `${prefixCls}-sub` }, this.$slots.default)
  },
}


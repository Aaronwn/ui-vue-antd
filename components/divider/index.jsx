
import PropTypes from '../_util/vue-types'
export default {
  name: 'ADivider',
  props: {
    prefixCls: PropTypes.string.def('ant'),
    type: PropTypes.oneOf(['horizontal', 'vertical']).def('horizontal'),
    dashed: PropTypes.bool,
    orientation: PropTypes.oneOf(['left', 'right']),
  },
  computed: {
    classString () {
      const { prefixCls, type, $slots, dashed, orientation = '' } = this
      const orientationPrefix = (orientation.length > 0) ? '-' + orientation : orientation

      return {
        [`${prefixCls}-divider`]: true, [`${prefixCls}-divider-${type}`]: true,
        [`${prefixCls}-divider-with-text${orientationPrefix}`]: $slots.default,
        [`${prefixCls}-divider-dashed`]: !!dashed,
      }
    },
  },
  render () {
    const { classString, prefixCls, $slots } = this
    return (
      <div class={classString}>
        {$slots.default && <span class={`${prefixCls}-divider-inner-text`}>{$slots.default}</span>}
      </div>
    )
  },
}


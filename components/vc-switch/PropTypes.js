import PropTypes from '../_util/vue-types'

export const switchPropTypes = {
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool.def(false),
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  // onChange: PropTypes.func,
  // onMouseUp: PropTypes.func,
  // onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  checked: PropTypes.bool.def(false),
  defaultChecked: PropTypes.bool.def(false),
  autoFocus: PropTypes.bool.def(false),
}

import PropTypes from '../../_util/vue-types'
import classNames from 'classnames'
import warning from 'warning'
import { initDefaultProps, getOptionProps, getSlots } from '../../_util/props-util'
import { cloneElement } from '../../_util/vnode'
import BaseMixin from '../../_util/BaseMixin'
import {
  traverseTreeNodes, getStrictlyValue,
  getFullKeyList, getPosition, getDragNodesKeys,
  calcExpandedKeys, calcSelectedKeys,
  calcCheckedKeys, calcDropPosition,
  arrAdd, arrDel, posToArr,
} from './util'

/**
 * Thought we still use `cloneElement` to pass `key`,
 * other props can pass with context for future refactor.
 */

const Tree = {
  name: 'Tree',
  mixins: [BaseMixin],
  props: initDefaultProps({
    prefixCls: PropTypes.string,
    showLine: PropTypes.bool,
    showIcon: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    focusable: PropTypes.bool,
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    checkable: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    checkStrictly: PropTypes.bool,
    draggable: PropTypes.bool,
    defaultExpandParent: PropTypes.bool,
    autoExpandParent: PropTypes.bool,
    defaultExpandAll: PropTypes.bool,
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
    checkedKeys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.object,
    ]),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    // onExpand: PropTypes.func,
    // onCheck: PropTypes.func,
    // onSelect: PropTypes.func,
    loadData: PropTypes.func,
    // onMouseEnter: PropTypes.func,
    // onMouseLeave: PropTypes.func,
    // onRightClick: PropTypes.func,
    // onDragStart: PropTypes.func,
    // onDragEnter: PropTypes.func,
    // onDragOver: PropTypes.func,
    // onDragLeave: PropTypes.func,
    // onDragEnd: PropTypes.func,
    // onDrop: PropTypes.func,
    filterTreeNode: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.any,
  }, {
    prefixCls: 'rc-tree',
    showLine: false,
    showIcon: true,
    selectable: true,
    multiple: false,
    checkable: false,
    disabled: false,
    checkStrictly: false,
    draggable: false,
    defaultExpandParent: true,
    autoExpandParent: false,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
  }),

  // static childContextTypes = contextTypes;

  data () {
    const props = getOptionProps(this)
    const {
      defaultExpandAll,
      defaultExpandParent,
      defaultExpandedKeys,
      defaultCheckedKeys,
      defaultSelectedKeys,
      expandedKeys,
    } = props
    const children = this.$slots.default
    // Sync state with props
    const { checkedKeys = [], halfCheckedKeys = [] } =
      calcCheckedKeys(defaultCheckedKeys, props, children) || {}

    const state = {
      sSelectedKeys: calcSelectedKeys(defaultSelectedKeys, props),
      sCheckedKeys: checkedKeys,
      sHalfCheckedKeys: halfCheckedKeys,
    }

    if (defaultExpandAll) {
      state.sExpandedKeys = getFullKeyList(children)
    } else if (defaultExpandParent) {
      state.sExpandedKeys = calcExpandedKeys(expandedKeys || defaultExpandedKeys, props, children)
    } else {
      state.sExpandedKeys = defaultExpandedKeys
    }

    // Cache for check status to optimize
    this.checkedBatch = null
    this.propsToStateMap = {
      expandedKeys: 'sExpandedKeys',
      selectedKeys: 'sSelectedKeys',
      checkedKeys: 'sCheckedKeys',
      halfCheckedKeys: 'sHalfCheckedKeys',
    }
    return {
      ...state,
      ...this.getSyncProps(props),
      dragOverNodeKey: '',
      dropPosition: null,
      dragNodesKeys: [],
    }
  },
  provide () {
    return {
      vcTree: this,
    }
  },

  watch: {
    children (val) {
      const { checkedKeys = [], halfCheckedKeys = [] } = calcCheckedKeys(this.checkedKeys || this.sCheckedKeys, this.$props, val) || {}
      this.sCheckedKeys = checkedKeys
      this.sHalfCheckedKeys = halfCheckedKeys
    },
    autoExpandParent (val) {
      this.sExpandedKeys = val ? calcExpandedKeys(this.expandedKeys, this.$props, this.$slots.default) : this.expandedKeys
    },
    expandedKeys (val) {
      this.sExpandedKeys = this.autoExpandParent ? calcExpandedKeys(val, this.$props, this.$slots.default) : val
    },
    selectedKeys (val) {
      this.sSelectedKeys = calcSelectedKeys(val, this.$props, this.$slots.default)
    },
    checkedKeys (val) {
      const { checkedKeys = [], halfCheckedKeys = [] } = calcCheckedKeys(val, this.$props, this.$slots.default) || {}
      this.sCheckedKeys = checkedKeys
      this.sHalfCheckedKeys = halfCheckedKeys
    },
  },

  // componentWillReceiveProps (nextProps) {
  //   // React 16 will not trigger update if new state is null
  //   this.setState(this.getSyncProps(nextProps, this.props))
  // },

  methods: {
    onNodeDragStart (event, node) {
      const { sExpandedKeys } = this
      const { eventKey } = node
      const children = getSlots(node).default
      this.dragNode = node

      this.setState({
        dragNodesKeys: getDragNodesKeys(children, node),
        sExpandedKeys: arrDel(sExpandedKeys, eventKey),
      })
      this.__emit('dragstart', { event, node })
    },

    /**
     * [Legacy] Select handler is less small than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */
    onNodeDragEnter (event, node) {
      const { sExpandedKeys } = this
      const { pos, eventKey } = node

      const dropPosition = calcDropPosition(event, node)

      // Skip if drag node is self
      if (
        this.dragNode.eventKey === eventKey &&
        dropPosition === 0
      ) {
        this.setState({
          dragOverNodeKey: '',
          dropPosition: null,
        })
        return
      }

      // Ref: https://github.com/react-component/tree/issues/132
      // Add timeout to let onDragLevel fire before onDragEnter,
      // so that we can clean drag props for onDragLeave node.
      // Macro task for this:
      // https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script
      setTimeout(() => {
        // Update drag over node
        this.setState({
          dragOverNodeKey: eventKey,
          dropPosition,
        })

        // Side effect for delay drag
        if (!this.delayedDragEnterLogic) {
          this.delayedDragEnterLogic = {}
        }
        Object.keys(this.delayedDragEnterLogic).forEach((key) => {
          clearTimeout(this.delayedDragEnterLogic[key])
        })
        this.delayedDragEnterLogic[pos] = setTimeout(() => {
          const newExpandedKeys = arrAdd(sExpandedKeys, eventKey)
          this.setState({
            sExpandedKeys: newExpandedKeys,
          })
          this.__emit('dragenter', { event, node, expandedKeys: newExpandedKeys })
        }, 400)
      }, 0)
    },
    onNodeDragOver (event, node) {
      const { eventKey } = node

      // Update drag position
      if (this.dragNode && eventKey === this.dragOverNodeKey) {
        const dropPosition = calcDropPosition(event, node)

        if (dropPosition === this.dropPosition) return

        this.setState({
          dropPosition,
        })
      }
      this.__emit('dragover', { event, node })
    },
    onNodeDragLeave (event, node) {
      this.setState({
        dragOverNodeKey: '',
      })
      this.__emit('dragleave', { event, node })
    },
    onNodeDragEnd (event, node) {
      this.setState({
        dragOverNodeKey: '',
      })
      this.__emit('dragend', { event, node })
    },
    onNodeDrop (event, node) {
      const { dragNodesKeys, dropPosition } = this

      const { eventKey, pos } = node

      this.setState({
        dragOverNodeKey: '',
        dropNodeKey: eventKey,
      })

      if (dragNodesKeys.indexOf(eventKey) !== -1) {
        warning(false, 'Can not drop to dragNode(include it\'s children node)')
        return
      }

      const posArr = posToArr(pos)

      const dropResult = {
        event,
        node,
        dragNode: this.dragNode,
        dragNodesKeys: dragNodesKeys.slice(),
        dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
      }

      if (dropPosition !== 0) {
        dropResult.dropToGap = true
      }
      this.__emit('drop', dropResult)
    },

    onNodeSelect (e, treeNode) {
      const { sSelectedKeys, multiple, $slots: { default: children }} = this
      const { selected, eventKey } = getOptionProps(treeNode)
      const targetSelected = !selected
      let selectedKeys = sSelectedKeys
      // Update selected keys
      if (!targetSelected) {
        selectedKeys = arrDel(selectedKeys, eventKey)
      } else if (!multiple) {
        selectedKeys = [eventKey]
      } else {
        selectedKeys = arrAdd(selectedKeys, eventKey)
      }

      // [Legacy] Not found related usage in doc or upper libs
      // [Legacy] TODO: add optimize prop to skip node process
      const selectedNodes = []
      if (selectedKeys.length) {
        traverseTreeNodes(children, ({ node, key }) => {
          if (selectedKeys.indexOf(key) !== -1) {
            selectedNodes.push(node)
          }
        })
      }

      this.setUncontrolledState({ selectedKeys })

      const eventObj = {
        event: 'select',
        selected: targetSelected,
        node: treeNode,
        selectedNodes,
      }
      this.__emit('select', selectedKeys, eventObj)
    },

    /**
     * This will cache node check status to optimize update process.
     * When Tree get trigger `onCheckConductFinished` will flush all the update.
     */
    onBatchNodeCheck (key, checked, halfChecked, startNode) {
      if (startNode) {
        this.checkedBatch = {
          treeNode: startNode,
          checked,
          list: [],
        }
      }

      // This code should never called
      if (!this.checkedBatch) {
        this.checkedBatch = {
          list: [],
        }
        warning(
          false,
          'Checked batch not init. This should be a bug. Please fire a issue.'
        )
      }

      this.checkedBatch.list.push({ key, checked, halfChecked })
    },

    /**
     * When top `onCheckConductFinished` called, will execute all batch update.
     * And trigger `onCheck` event.
     */
    onCheckConductFinished () {
      const { sCheckedKeys, sHalfCheckedKeys, checkStrictly, $slots: { default: children }} = this

      // Use map to optimize update speed
      const checkedKeySet = {}
      const halfCheckedKeySet = {}

      sCheckedKeys.forEach(key => {
        checkedKeySet[key] = true
      })
      sHalfCheckedKeys.forEach(key => {
        halfCheckedKeySet[key] = true
      })

      // Batch process
      this.checkedBatch.list.forEach(({ key, checked, halfChecked }) => {
        checkedKeySet[key] = checked
        halfCheckedKeySet[key] = halfChecked
      })
      const newCheckedKeys = Object.keys(checkedKeySet).filter(key => checkedKeySet[key])
      const newHalfCheckedKeys = Object.keys(halfCheckedKeySet).filter(key => halfCheckedKeySet[key])

      // Trigger onChecked
      let selectedObj

      const eventObj = {
        event: 'check',
        node: this.checkedBatch.treeNode,
        checked: this.checkedBatch.checked,
      }

      if (checkStrictly) {
        selectedObj = getStrictlyValue(newCheckedKeys, newHalfCheckedKeys)

        // [Legacy] TODO: add optimize prop to skip node process
        eventObj.checkedNodes = []
        traverseTreeNodes(children, ({ node, key }) => {
          if (checkedKeySet[key]) {
            eventObj.checkedNodes.push(node)
          }
        })

        this.setUncontrolledState({ checkedKeys: newCheckedKeys })
      } else {
        selectedObj = newCheckedKeys

        // [Legacy] TODO: add optimize prop to skip node process
        eventObj.checkedNodes = []
        eventObj.checkedNodesPositions = [] // [Legacy] TODO: not in API
        eventObj.halfCheckedKeys = newHalfCheckedKeys // [Legacy] TODO: not in API
        traverseTreeNodes(children, ({ node, pos, key }) => {
          if (checkedKeySet[key]) {
            eventObj.checkedNodes.push(node)
            eventObj.checkedNodesPositions.push({ node, pos })
          }
        })

        this.setUncontrolledState({
          checkedKeys: newCheckedKeys,
          halfCheckedKeys: newHalfCheckedKeys,
        })
      }
      this.__emit('check', selectedObj, eventObj)

      // Clean up
      this.checkedBatch = null
    },

    onNodeExpand (e, treeNode) {
      const { sExpandedKeys, loadData } = this
      let expandedKeys = [...sExpandedKeys]
      const { eventKey, expanded } = getOptionProps(treeNode)

      // Update selected keys
      const index = expandedKeys.indexOf(eventKey)
      const targetExpanded = !expanded

      warning(
        (expanded && index !== -1) || (!expanded && index === -1)
        , 'Expand state not sync with index check')

      if (targetExpanded) {
        expandedKeys = arrAdd(expandedKeys, eventKey)
      } else {
        expandedKeys = arrDel(expandedKeys, eventKey)
      }

      this.setUncontrolledState({ expandedKeys })
      this.__emit('expand', expandedKeys, { node: treeNode, expanded: targetExpanded })

      // Async Load data
      if (targetExpanded && loadData) {
        return loadData(treeNode).then(() => {
          // [Legacy] Refresh logic
          this.setUncontrolledState({ expandedKeys })
        })
      }

      return null
    },

    onNodeMouseEnter  (event, node) {
      this.__emit('mouseenter', { event, node })
    },

    onNodeMouseLeave (event, node) {
      this.__emit('mouseleave', { event, node })
    },

    onNodeContextMenu (event, node) {
      event.preventDefault()
      this.__emit('rightClick', { event, node })
    },

    /**
     * Sync state with props if needed
     */
    getSyncProps (props = {}) {
      const newState = {}
      const children = this.$slots.default
      if (props.selectedKeys !== undefined) {
        newState.sSelectedKeys = calcSelectedKeys(props.selectedKeys, props, children)
      }

      if (props.checkedKeys !== undefined) {
        const { checkedKeys = [], halfCheckedKeys = [] } =
        calcCheckedKeys(props.checkedKeys, props, children) || {}
        newState.sCheckedKeys = checkedKeys
        newState.sHalfCheckedKeys = halfCheckedKeys
      }

      return newState
    },

    /**
     * Only update the value which is not in props
     */
    setUncontrolledState  (state) {
      let needSync = false
      const newState = {}
      const props = getOptionProps(this)
      Object.keys(state).forEach(name => {
        if (name in props) return

        needSync = true
        const key = this.propsToStateMap[name]
        newState[key] = state[name]
      })

      this.setState(needSync ? newState : null)
    },

    isKeyChecked  (key) {
      const { sCheckedKeys = [] } = this
      return sCheckedKeys.indexOf(key) !== -1
    },

    /**
     * [Legacy] Original logic use `key` as tracking clue.
     * We have to use `cloneElement` to pass `key`.
     */
    renderTreeNode  (child, index, level = 0) {
      const {
        sExpandedKeys = [], sSelectedKeys = [], sHalfCheckedKeys = [],
        dragOverNodeKey, dropPosition,
      } = this
      const pos = getPosition(level, index)
      const key = child.key || pos

      return cloneElement(child, {
        props: {
          eventKey: key,
          expanded: sExpandedKeys.indexOf(key) !== -1,
          selected: sSelectedKeys.indexOf(key) !== -1,
          checked: this.isKeyChecked(key),
          halfChecked: sHalfCheckedKeys.indexOf(key) !== -1,
          pos,

          // [Legacy] Drag props
          dragOver: dragOverNodeKey === key && dropPosition === 0,
          dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
          dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1,
        },

      })
    },
  },

  render () {
    const {
      prefixCls, focusable,
      showLine,
      $slots: { default: children = [] },
    } = this
    const domProps = {}

    return (
      <ul
        {...domProps}
        class={classNames(prefixCls, {
          [`${prefixCls}-show-line`]: showLine,
        })}
        role='tree-node'
        unselectable='on'
        tabIndex={focusable ? '0' : null}
        onKeydown={focusable ? this.onKeydown : () => {}}
      >
        {children.map((child, index) => this.renderTreeNode(child, index))}
      </ul>
    )
  },
}

export default Tree

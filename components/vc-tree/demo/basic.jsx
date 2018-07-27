/* eslint no-console:0 */
/* eslint no-alert:0 */
import PropTypes from '../../_util/vue-types'
import Tree, { TreeNode } from '../index'
import '../assets/index.less'
import './basic.less'

export default {
  props: {
    keys: PropTypes.array.def(['0-0-0-0']),
  },
  data () {
    const keys = this.keys
    return {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      switchIt: true,
    }
  },
  methods: {
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys, arguments)
    },
    onSelect (selectedKeys, info) {
      console.log('selected', selectedKeys, info)
      this.selKey = info.node.$options.propsData.eventKey
    },
    onCheck (checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
    },
    onEdit  () {
      setTimeout(() => {
        console.log('current key: ', this.selKey)
      }, 0)
    },
    onDel  (e) {
      if (!window.confirm('sure to delete?')) {
        return
      }
      e.stopPropagation()
    },
    toggleChildren () {
      this.showMore = !this.showMore
    },
  },

  render () {
    const customLabel = (<span class='cus-label'>
      <span>operations: </span>
      <span style={{ color: 'blue' }} onClick={this.onEdit}>Edit</span>&nbsp;
      <label onClick={(e) => e.stopPropagation()}><input type='checkbox' /> checked</label> &nbsp;
      <span style={{ color: 'red' }} onClick={this.onDel}>Delete</span>
    </span>)
    return (<div style={{ margin: '0 20px' }}>
      <h2>simple</h2>
      <Tree
        class='myCls' showLine checkable defaultExpandAll
        defaultExpandedKeys={this.defaultExpandedKeys}
        onExpand={this.onExpand}
        defaultSelectedKeys={this.defaultSelectedKeys}
        defaultCheckedKeys={this.defaultCheckedKeys}
        onSelect={this.onSelect} onCheck={this.onCheck}
      >
        <TreeNode title='parent 1' key='0-0'>
          <TreeNode title={customLabel} key='0-0-0'>
            <TreeNode title='leaf' key='0-0-0-0' />
            <TreeNode title='leaf' key='0-0-0-1' />
          </TreeNode>
          <TreeNode title='parent 1-1' key='0-0-1'>
            <TreeNode title='parent 1-1-0' key='0-0-1-0' disableCheckbox />
            <TreeNode title='parent 1-1-1' key='0-0-1-1' />
          </TreeNode>
          <TreeNode title='parent 1-2' key='0-0-2' disabled>
            <TreeNode title='parent 1-2-0' key='0-0-2-0' disabled />
            <TreeNode title='parent 1-2-1' key='0-0-2-1' />
          </TreeNode>
        </TreeNode>
      </Tree>

      <h2>Check on Click TreeNode</h2>
      <Tree
        class='myCls'
        showLine
        checkable
        selectable={ false }
        defaultExpandAll
        onExpand={this.onExpand}
        defaultSelectedKeys={this.defaultSelectedKeys}
        defaultCheckedKeys={this.defaultCheckedKeys}
        onSelect={this.onSelect}
        onCheck={this.onCheck}
      >
        <TreeNode title='parent 1' key='0-0'>
          <TreeNode title='parent 1-1' key='0-0-1'>
            <TreeNode title='parent 1-1-0' key='0-0-1-0' disableCheckbox />
            <TreeNode title='parent 1-1-1' key='0-0-1-1' />
          </TreeNode>
        </TreeNode>
      </Tree>
    </div>)
  },
}


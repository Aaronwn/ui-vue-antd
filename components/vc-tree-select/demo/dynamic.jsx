/* eslint react/no-multi-comp:0, no-console:0 */

import '../assets/index.less'
import TreeSelect from '../index'
import { getNewTreeData, generateTreeNodes } from './util'

export default {
  data () {
    return {
      treeData: [
        { label: 'pNode 01', value: '0-0', key: '0-0' },
        { label: 'pNode 02', value: '0-1', key: '0-1' },
        { label: 'pNode 03', value: '0-2', key: '0-2', isLeaf: true },
      ],
      // value: '0-0',
      value: { value: '0-0-0-value', label: '0-0-0-label' },
    }
  },

  methods: {
    onChange (value) {
      console.log(value)
      this.value = value
    },

    onLoadData  (treeNode) {
      console.log(treeNode)
      return new Promise((resolve) => {
        setTimeout(() => {
          const treeData = [...this.treeData]
          getNewTreeData(treeData, treeNode.eventKey, generateTreeNodes(treeNode), 2)
          this.treeData = treeData
          resolve()
        }, 500)
      })
    },
  },

  render () {
    return (
      <div style={{ padding: '10px 30px' }}>
        <h2>dynamic render</h2>
        <TreeSelect
          style={{ width: '300px' }}
          treeData={this.treeData}
          labelInValue
          value={this.value}
          onChange={this.onChange}
          loadData={this.onLoadData}
        />
      </div>
    )
  },
}


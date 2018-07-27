<cn>
#### 拖动示例
将节点拖拽到其他节点内部或前后。
</cn>

<us>
#### draggable
Drag treeNode to insert after the other treeNode or insert into the other parent TreeNode.
</us>

```html
<template>
  <a-tree
    class="draggable-tree"
    :defaultExpandedKeys="expandedKeys"
    draggable
    @dragenter="onDragEnter"
    @drop="onDrop"
    :treeNodes="gData"
  />
</template>

<script>
const x = 3
const y = 2
const z = 1
const gData = []

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0'
  const tns = _tns || gData

  const children = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({ title: key, key })
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateData(level, key, tns[index].children)
  })
}
generateData(z)
export default {
  data () {
    return {
      gData,
      expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
    }
  },
  methods: {
    onDragEnter (info) {
      console.log(info)
    // expandedKeys 需要受控时设置
    // this.expandedKeys = info.expandedKeys
    },
    onDrop (info) {
      console.log(info)
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      // const dragNodesKeys = info.dragNodesKeys;
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.gData]
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (info.dropToGap) {
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      } else {
        loop(data, dropKey, (item) => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj)
        })
      }
      this.gData = data
    },
  },
}
</script>

```

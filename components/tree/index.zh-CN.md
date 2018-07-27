
## API

### Tree props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| treeNodes | 节点的配置描述，具体项见下表 | array | -- |
| autoExpandParent | 是否自动展开父节点 | boolean | true |
| checkable | 节点前添加 Checkbox 复选框 | boolean | false |
| checkedKeys(v-model) | （受控）选中复选框的树节点（注意：父子节点有关联，如果传入父节点key，则子节点自动选中；相应当子节点key都传入，父节点也自动选中。当设置`checkable`和`checkStrictly`，它是一个有`checked`和`halfChecked`属性的对象，并且父子节点的选中与否不再关联 | string\[] \| {checked: string\[], halfChecked: string\[]} | \[] |
| checkStrictly | checkable状态下节点选择完全受控（父子节点选中状态不再关联） | boolean | false |
| defaultCheckedKeys | 默认选中复选框的树节点 | string\[] | \[] |
| defaultExpandAll | 默认展开所有树节点 | boolean | false |
| defaultExpandedKeys | 默认展开指定的树节点 | string\[] | \[] |
| defaultExpandParent | 默认展开父节点 | bool | true |
| defaultSelectedKeys | 默认选中的树节点 | string\[] | \[] |
| disabled | 将树禁用 | bool | false |
| draggable | 设置节点可拖拽 | boolean | false |
| expandedKeys(.sync) | （受控）展开指定的树节点 | string\[] | \[] |
| filterTreeNode | 按需筛选树节点（高亮），返回true | function(node) | - |
| loadData | 异步加载数据 | function(node) | - |
| multiple | 支持点选多个节点（节点本身） | boolean | false |
| selectedKeys(.sync) | （受控）设置选中的树节点 | string\[] | - |
| showIcon | 是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式 | boolean | false |
| showLine | 是否展示连接线 | boolean | false |


### 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| check | 点击复选框触发 | function(checkedKeys, e:{checked: bool, checkedNodes, node, event}) | - |
| dragEnd | dragend 触发时调用 | function({event, node}) | - |
| dragEnter | dragenter 触发时调用 | function({event, node, expandedKeys}) | - |
| dragLeave | dragleave 触发时调用 | function({event, node}) | - |
| dragOver | dragover 触发时调用 | function({event, node}) | - |
| dragStart | 开始拖拽时调用 | function({event, node}) | - |
| drop | drop 触发时调用 | function({event, node, dragNode, dragNodesKeys}) | - |
| expand | 展开/收起节点时触发 | function(expandedKeys, {expanded: bool, node}) | - |
| rightClick | 响应右键点击 | function({event, node}) | - |
| select | 点击树节点触发 | function(selectedKeys, e:{selected: bool, selectedNodes, node, event}) | - |

### TreeNode props

结点描述数据对象，是 treeNodes 中的一项，TreeNode 使用相同的 API。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| class | 节点的 class | string | - |
| style | 节点的 style | string\|object | - |
| disableCheckbox | 禁掉 checkbox | boolean | false |
| disabled | 禁掉响应 | boolean | false |
| icon | 自定义图标。可接收组件，props 为当前节点 props | slot\|slot-scope | - |
| isLeaf | 设置为叶子节点(设置了`loadData`时有效) | boolean | false |
| key | 被树的 (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys 属性所用。注意：整个树范围内的所有节点的 key 值不能重复！ | string | 内部计算出的节点位置 |
| selectable | 设置节点是否可被选中 | boolean | true |
| title | 标题 | string\|slot\|slot-scope | '---' |
| slots | 使用treeNodes时，可以通过该属性配置支持slot的属性，如 `slots: { title: 'XXX'}` | object | - |
| scopedSlots | 使用columns时，可以通过该属性配置支持slot-scope的属性，如 `scopedSlots: { title: 'XXX'}` | object | - |
| on | 事件对象，仅在treeNodes使用方式中生效，如`{click: () => {}}` | object | '---' |




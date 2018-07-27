
## API

### Tree props

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| treeNodes | treeNode of tree | array | - |
| autoExpandParent | Whether to automatically expand a parent treeNode | boolean | true |
| checkable | Adds a `Checkbox` before the treeNodes | boolean | false |
| checkedKeys(v-model) | (Controlled) Specifies the keys of the checked treeNodes (PS: When this specifies the key of a treeNode which is also a parent treeNode, all the children treeNodes of will be checked; and vice versa, when it specifies the key of a treeNode which is a child treeNode, its parent treeNode will also be checked. When `checkable` and `checkStrictly` is true, its object has `checked` and `halfChecked` property. Regardless of whether the child or parent treeNode is checked, they won't impact each other. | string\[] \| {checked: string\[], halfChecked: string\[]} | \[] |
| checkStrictly | Check treeNode precisely; parent treeNode and children treeNodes are not associated | boolean | false |
| defaultCheckedKeys | Specifies the keys of the default checked treeNodes | string\[] | \[] |
| defaultExpandAll | Whether to expand all treeNodes by default | boolean | false |
| defaultExpandedKeys | Specify the keys of the default expanded treeNodes | string\[] | \[] |
| defaultExpandParent | auto expand parent treeNodes when init | bool | true |
| defaultSelectedKeys | Specifies the keys of the default selected treeNodes | string\[] | \[] |
| disabled | whether disabled the tree | bool | false |
| draggable | Specifies whether this Tree is draggable (IE > 8) | boolean | false |
| expandedKeys(.sync) | (Controlled) Specifies the keys of the expanded treeNodes | string\[] | \[] |
| filterTreeNode | Defines a function to filter (highlight) treeNodes. When the function returns `true`, the corresponding treeNode will be highlighted | function(node) | - |
| loadData | Load data asynchronously | function(node) | - |
| multiple | Allows selecting multiple treeNodes | boolean | false |
| selectedKeys(.sync) | (Controlled) Specifies the keys of the selected treeNodes | string\[] | - |
| showIcon | Shows the icon before a TreeNode's title. There is no default style; you must set a custom style for it if set to `true` | boolean | false |
| showLine | Shows a connecting line | boolean | false |

### Events
| Events Name | Description | Arguments |
| --- | --- | --- |
| check | Callback function for when the onCheck event occurs | function(checkedKeys, e:{checked: bool, checkedNodes, node, event}) | - |
| dragEnd | Callback function for when the onDragEnd event occurs | function({event, node}) | - |
| dragEnter | Callback function for when the onDragEnter event occurs | function({event, node,  expandedKeys}) | - |
| dragLeave | Callback function for when the onDragLeave event occurs | function({event, node}) | - |
| dragOver | Callback function for when the onDragOver event occurs | function({event, node}) | - |
| dragStart | Callback function for when the onDragStart event occurs | function({event, node}) | - |
| drop | Callback function for when the onDrop event occurs | function({event, node, dragNode, dragNodesKeys}) | - |
| expand | Callback function for when a treeNode is expanded or collapsed | function(expandedKeys, {expanded: bool, node}) | - |
| rightClick | Callback function for when the user right clicks a treeNode | function({event, node}) | - |
| select | Callback function for when the user clicks a treeNode | function(selectedKeys, e:{selected: bool, selectedNodes, node, event}) | - |

### TreeNode props


One of the Tree `treeNode` prop for describing the tree's node, TreeNode has the same API.

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| class | className | string | - |
| style | style | string\|object | - |
| disableCheckbox | Disables the checkbox of the treeNode | boolean | false |
| disabled | Disables the treeNode | boolean | false |
| icon | customize icon. When you pass component, whose render will receive full TreeNode props as component props | slot\|slot-scope | - |
| isLeaf | Determines if this is a leaf node(effective when `loadData` is specified) | boolean | false |
| key | Used with (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys. P.S.: It must be unique in all of treeNodes of the tree! | string | internal calculated position of treeNode |
| selectable | Set whether the treeNode can be selected | boolean | true |
| title | Title | string\|slot\|slot-scope | '---' |
| slots | When using treeNodes, you can use this property to configure the properties that support the slot, such as `slots: { title: 'XXX'}` | object | - |
| scopedSlots | When using treeNodes, you can use this property to configure the properties that support the slot-scope, such as `scopedSlots: { title: 'XXX'}` | object | - |
| on | When using treeNodes, you can use this property to configure the events, such as `on: { click: () => {}}` | object | - |


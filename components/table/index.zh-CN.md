
```jsx
const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '年龄',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address',
}];

<Table dataSource={dataSource} columns={columns} />
```

## API

### Table

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| bordered | 是否展示外边框和列边框 | boolean | false |
| columns | 表格列的配置描述，具体项见下表 | array | - |
| components | 覆盖默认的 table 元素 | object | - |
| dataSource | 数据数组 | any\[] |  |
| defaultExpandAllRows | 初始时，是否展开所有行 | boolean | false |
| defaultExpandedRowKeys | 默认展开的行 | string\[] | - |
| expandedRowKeys | 展开的行，控制属性 | string\[] | - |
| expandedRowRender | 额外的展开行 | Function(record):VNode\|slot-scope| - |
| expandRowByClick | 通过点击行来展开子行 | boolean | `false` |
| footer | 表格尾部 | Function(currentPageData)\|slot-scope |  |
| indentSize | 展示树形数据时，每层缩进的宽度，以 px 为单位 | number | 15 |
| loading | 页面是否加载中 | boolean\|[object](/ant-design/components/spin-cn) | false |
| locale | 默认文案设置，目前包括排序、过滤、空数据文案 | object | filterConfirm: '确定' <br> filterReset: '重置' <br> emptyText: '暂无数据' |
| pagination | 分页器，参考[配置项](#pagination)或 [pagination](/ant-design/components/pagination-cn/)，设为 false 时不展示和进行分页 | object |  |
| rowClassName | 表格行的类名 | Function(record, index):string | - |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | string\|Function(record):string | 'key' |
| rowSelection | 列表项是否可选择，[配置项](#rowSelection) | object | null |
| scroll | 设置横向或纵向滚动，也可用于指定滚动区域的宽和高，建议为 `x` 设置一个数字，如果要设置为 `true`，需要配合样式 `.ant-table td { white-space: nowrap; }` | { x: number \| true, y: number } | - |
| showHeader | 是否显示表头 | boolean | true |
| size | 正常或迷你类型，`default` or `small` | string | default |
| title | 表格标题 | Function(currentPageData)\|slot-scope |  |
| customHeaderRow | 设置头部行属性 | Function(column, index) | - |
| customRow | 设置行属性 | Function(record, index) | - |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| expandedRowsChange | 展开的行变化时触发 | Function(expandedRows) |
| change | 分页、排序、筛选变化时触发 | Function(pagination, filters, sorter) |
| expand | 点击展开图标时触发 | Function(expanded, record) |


#### customRow 用法

适用于 `customRow` `customHeaderRow` `customCell` `customHeaderCell`。
遵循[Vue jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)语法。

```jsx
<Table
  customRow={(record) => {
    return {
      props: {
        xxx... //属性
      },
      on: { // 事件
        click: () => {},       // 点击行
        mouseenter: () => {},  // 鼠标移入行
        xxxx...
      },

    };
  )}
  customHeaderRow={(column) => {
    return {
      on: {
        click: () => {},        // 点击表头行
      }
    };
  )}
/>
```

### Column

列描述数据对象，是 columns 中的一项，Column 使用相同的 API。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| colSpan | 表头列合并,设置为 0 时，不渲染 | number |  |
| dataIndex | 列数据在数据项中对应的 key，支持 `a.b.c` 的嵌套写法 | string | - |
| filterDropdown | 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互 | VNode\|slot | - |
| filterDropdownVisible | 用于控制自定义筛选菜单是否可见 | boolean | - |
| filtered | 标识数据是否经过过滤，筛选图标会高亮 | boolean | false |
| filteredValue | 筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组 | string\[] | - |
| filterIcon | 自定义 fiter 图标。 | VNode\|slot | false |
| filterMultiple | 是否多选 | boolean | true |
| filters | 表头的筛选菜单项 | object\[] | - |
| fixed | 列是否固定，可选 `true`(等效于 left) `'left'` `'right'` | boolean\|string | false |
| key | Vue 需要的 key，如果已经设置了唯一的 `dataIndex`，可以忽略这个属性 | string | - |
| customRender | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并,可参考demo 表格行/列合并 | Function(text, record, index) {}\|slot-scope | - |
| align | 设置列内容的对齐方式 | 'left' \| 'right' \| 'center' | 'left' |
| sorter | 排序函数，本地排序使用一个函数(参考 [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 的 compareFunction)，需要服务端排序可设为 true | Function\|boolean | - |
| sortOrder | 排序的受控属性，外界可用此控制列的排序，可设置为 `'ascend'` `'descend'` `false` | boolean\|string | - |
| title | 列头显示文字 | string\|slot | - |
| width | 列宽度 | string\|number | - |
| customCell | 设置单元格属性 | Function(record) | - |
| customHeaderCell | 设置头部单元格属性 | Function(column) | - |
| onFilter | 本地模式下，确定筛选的运行函数, 使用template或jsx时作为`filter`事件使用 | Function | - |
| onFilterDropdownVisibleChange | 自定义筛选菜单可见变化时调用，使用template或jsx时作为`filterDropdownVisibleChange`事件使用 | function(visible) {} | - |
| slots | 使用columns时，可以通过该属性配置支持slot的属性，如 `slots: { filterIcon: 'XXX'}` | object | - |
| scopedSlots | 使用columns时，可以通过该属性配置支持slot-scope的属性，如 `scopedSlots: { customRender: 'XXX'}` | object | - |

### ColumnGroup

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列头显示文字 | string\|slot | - |
| slots | 使用columns时，可以通过该属性配置支持slot的属性，如 `slots: { title: 'XXX'}` | object | - |

### pagination

分页的配置项。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| position | 指定分页显示的位置 | 'top' \| 'bottom' \| 'both' | 'bottom' |

更多配置项，请查看 [`Pagination`](/ant-design/components/pagination/)。

### rowSelection

选择功能的配置。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fixed | 把选择框列固定在左边 | boolean | - |
| getCheckboxProps | 选择框的默认属性配置 | Function(record) | - |
| hideDefaultSelections | 去掉『全选』『反选』两个默认选项 | boolean | false |
| selectedRowKeys | 指定选中项的 key 数组，需要和 onChange 进行配合 | string\[] | \[] |
| columnWidth | 自定义列表选择框宽度 | string\|number | - |
| selections | 自定义选择项, 设为 `true` 时使用默认选择项 | object\[]\|boolean | true |
| type | 多选/单选，`checkbox` or `radio` | string | `checkbox` |
| onChange | 选中项发生变化的时的回调 | Function(selectedRowKeys, selectedRows) | - |
| onSelect | 用户手动选择/取消选择某列的回调 | Function(record, selected, selectedRows, nativeEvent) | - |
| onSelectAll | 用户手动选择/取消选择所有列的回调 | Function(selected, selectedRows, changeRows) | - |
| onSelectInvert | 用户手动选择反选的回调 | Function(selectedRows) | - |

### selection

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | Vue 需要的 key，建议设置 | string | - |
| text | 选择项显示的文字 | string\|VNode | - |
| onSelect | 选择项点击回调 | Function(changeableRowKeys) | - |


## 注意

在 Table 中，`dataSource` 和 `columns` 里的数据值都需要指定 `key` 值。对于 `dataSource` 默认将每列数据的 `key` 属性作为唯一的标识。

如果你的数据没有这个属性，务必使用 `rowKey` 来指定数据列的主键。若没有指定，控制台会出现缺少key的提示，表格组件也会出现各类奇怪的错误。

```jsx
// 比如你的数据主键是 uid
return <Table rowKey="uid" />;
// 或
return <Table rowKey={record => record.uid} />;
```

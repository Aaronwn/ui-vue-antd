
```jsx
const dataSource = [{
  key: '1',
  name: 'Mike',
  age: 32,
  address: '10 Downing Street'
}, {
  key: '2',
  name: 'John',
  age: 42,
  address: '10 Downing Street'
}];

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}];

<Table dataSource={dataSource} columns={columns} />
```

## API

### Table

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| bordered | Whether to show all table borders | boolean | `false` |
| columns | Columns of table | array | - |
| components | Override default table elements | object | - |
| dataSource | Data record array to be displayed | any\[] | - |
| defaultExpandAllRows | Expand all rows initially | boolean | `false` |
| defaultExpandedRowKeys | Initial expanded row keys | string\[] | - |
| expandedRowKeys | Current expanded row keys | string\[] | - |
| expandedRowRender | Expanded container render for each row | Function(record):VNode\|slot-scope | - |
| expandRowByClick | Whether to expand row by clicking anywhere in the whole row | boolean | `false` |
| footer | Table footer renderer | Function(currentPageData)\|slot-scope |  |
| indentSize | Indent size in pixels of tree data | number | 15 |
| loading | Loading status of table | boolean\|[object](/ant-design/components/spin) | `false` |
| locale | i18n text including filter, sort, empty text, etc | object | filterConfirm: 'Ok' <br> filterReset: 'Reset' <br> emptyText: 'No Data' |
| pagination | Pagination [config](#pagination) or [`Pagination`] (/ant-design/components/pagination/), hide it by setting it to `false` | object |  |
| rowClassName | Row's className | Function(record, index):string | - |
| rowKey | Row's unique key, could be a string or function that returns a string | string\|Function(record):string | `key` |
| rowSelection | Row selection [config](#rowSelection) | object | null |
| scroll | Set horizontal or vertical scrolling, can also be used to specify the width and height of the scroll area. It is recommended to set a number for `x`, if you want to set it to `true`, you need to add style `.ant-table td { white-space: nowrap; }`. | { x: number \| true, y: number } | - |
| showHeader | Whether to show table header | boolean | `true` |
| size | Size of table | `default` \| `middle` \| `small` | `default` |
| title | Table title renderer | Function(currentPageData)\|slot-scope |  |
| customHeaderRow | Set props on per header row | Function(column, index) | - |
| customRow | Set props on per row | Function(record, index) | - |

### Events
| Events Name | Description | Arguments |
| --- | --- | --- |
| change | Callback executed when pagination, filters or sorter is changed | Function(pagination, filters, sorter) |  |
| expand | Callback executed when the row expand icon is clicked | Function(expanded, record) |  |
| expandedRowsChange | Callback executed when the expanded rows change | Function(expandedRows) |  |

#### customRow usage

Same as `customRow` `customHeaderRow` `customCell` `customHeaderCell`.
Follow [Vue jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx) syntax。

```jsx
<Table
  customRow={(record) => {
    return {
      props: {
        xxx...
      },
      on: {
        click: () => {},       // click row
        mouseenter: () => {},  // mouse enter row
        xxxx...
      },
    };
  )}
  customHeaderRow={(column) => {
    return {
      on: {
        click: () => {},        // click header row
      },
    };
  )}
/>
```

### Column

One of the Table `columns` prop for describing the table's columns, Column has the same API.

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| colSpan | Span of this column's title | number |  |
| dataIndex | Display field of the data record, could be set like `a.b.c` | string | - |
| defaultSortOrder | Default order of sorted values: `'ascend'` `'descend'` `null` | string | - |
| filterDropdown | Customized filter overlay | slot | - |
| filterDropdownVisible | Whether `filterDropdown` is visible | boolean | - |
| filtered | Whether the `dataSource` is filtered | boolean | `false` |
| filteredValue | Controlled filtered value, filter icon will highlight | string\[] | - |
| filterIcon | Customized filter icon | slot | `false` |
| filterMultiple | Whether multiple filters can be selected | boolean | `true` |
| filters | Filter menu config | object\[] | - |
| fixed | Set column to be fixed: `true`(same as left) `'left'` `'right'` | boolean\|string | `false` |
| key | Unique key of this column, you can ignore this prop if you've set a unique `dataIndex` | string | - |
| customRender | Renderer of the table cell. The return value should be a VNode, or an object for colSpan/rowSpan config | Function(text, record, index) {}\|slot-scope | - |
| align | specify how content is aligned | 'left' \| 'right' \| 'center' | 'left' |
| sorter | Sort function for local sort, see [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)'s compareFunction. If you need sort buttons only, set to `true` | Function\|boolean | - |
| sortOrder | Order of sorted values: `'ascend'` `'descend'` `false` | boolean\|string | - |
| title | Title of this column | string\|slot | - |
| width | Width of this column | string\|number | - |
| customCell | Set props on per cell | Function(record) | - |
| customHeaderCell | Set props on per header cell | Function(column) | - |
| onFilter | Callback executed when the confirm filter button is clicked, Use as a `filter` event when using template or jsx | Function | - |
| onFilterDropdownVisibleChange | Callback executed when `filterDropdownVisible` is changed, Use as a `filterDropdownVisible` event when using template or jsx | function(visible) {} | - |
| slots | When using columns, you can use this property to configure the properties that support the slot, such as `slots: { filterIcon: 'XXX'}` | object | - |
| scopedSlots | When using columns, you can use this property to configure the properties that support the slot-scope, such as `scopedSlots: { customRender: 'XXX'}` | object | - |


### ColumnGroup

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| title | Title of the column group | string\|slot | - |
| slots | When using columns, you can use this property to configure the properties that support the slot, such as `slots: { title: 'XXX'}` | object | - |


### pagination

Properties for pagination.

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| position | specify the position of `Pagination` | 'top' \| 'bottom' \| 'both' | 'bottom' |

More about pagination, please check [`Pagination`](/ant-design/components/pagination/).

### rowSelection

Properties for row selection.

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| fixed | Fixed selection column on the left | boolean | - |
| getCheckboxProps | Get Checkbox or Radio props | Function(record) | - |
| hideDefaultSelections | Remove the default `Select All` and `Select Invert` selections | boolean | `false` |
| selectedRowKeys | Controlled selected row keys | string\[] | \[] |
| columnWidth | Set the width of the selection column | string\|number | - |
| selections | Custom selection [config](#rowSelection), only displays default selections when set to `true` | object\[]\|boolean | - |
| type | `checkbox` or `radio` | `checkbox` \| `radio` | `checkbox` |
| onChange | Callback executed when selected rows change | Function(selectedRowKeys, selectedRows) | - |
| onSelect | Callback executed when select/deselect one row | Function(record, selected, selectedRows, nativeEvent) | - |
| onSelectAll | Callback executed when select/deselect all rows | Function(selected, selectedRows, changeRows) | - |
| onSelectInvert | Callback executed when row selection is inverted | Function(selectedRows) | - |

### selection

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| key | Unique key of this selection | string | - |
| text | Display text of this selection | string\|VNode | - |
| onSelect | Callback executed when this selection is clicked | Function(changeableRowKeys) | - |


## Note

The values inside `dataSource` and `columns` should follow this in Table, and `dataSource[i].key` would be treated as key value default for `dataSource`.

If `dataSource[i].key` is not provided, then you should specify the primary key of dataSource value via `rowKey`. If not, warnings will show in browser console.

```jsx
// primary key is uid
return <Table rowKey="uid" />;
// or
return <Table rowKey={record => record.uid} />;
```

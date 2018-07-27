<cn>
#### 基本用法
简单的表格，最后一列是各种操作。
</cn>

<us>
#### basic Usage
Simple table with actions.
</us>

```html
<template>
  <a-table :columns="columns" :dataSource="data">
    <a slot="name" slot-scope="text" href="#">{{text}}</a>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
    <span slot="action" slot-scope="text, record">
      <a href="#">Action 一 {{record.name}}</a>
      <a-divider type="vertical" />
      <a href="#">Delete</a>
      <a-divider type="vertical" />
      <a href="#" class="ant-dropdown-link">
        More actions <a-icon type="down" />
      </a>
    </span>
  </a-table>
</template>
<script>
const columns = [{
  dataIndex: 'name',
  key: 'name',
  slots: { title: 'customTitle' },
  scopedSlots: { customRender: 'name' },
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}, {
  title: 'Action',
  key: 'action',
  scopedSlots: { customRender: 'action' },
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

export default {
  data() {
    return {
      data,
      columns,
    }
  }
}
</script>
```

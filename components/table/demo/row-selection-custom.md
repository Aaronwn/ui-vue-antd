<cn>
#### 自定义选择项
通过 `rowSelection.selections` 自定义选择项，默认不显示下拉选项，设为 `true` 时显示默认选择项。
</cn>

<us>
#### Custom selection
Use `rowSelection.selections` custom selections, default no select dropdown, show default selections via setting to `true`.
</us>

```html
<template>
  <a-table :rowSelection="rowSelection" :columns="columns" :dataSource="data" />
</template>
<script>
const columns = [{
  title: 'Name',
  dataIndex: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

export default {
  data() {
    return {
      data,
      columns,
      selectedRowKeys: [], // Check here to configure the default column
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [{
          key: 'all-data',
          text: 'Select All Data',
          onSelect: () => {
            this.selectedRowKeys = [...Array(46).keys()]; // 0...45
          },
        }, {
          key: 'odd',
          text: 'Select Odd Row',
          onSelect: (changableRowKeys) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            this.selectedRowKeys = newSelectedRowKeys;
          },
        }, {
          key: 'even',
          text: 'Select Even Row',
          onSelect: (changableRowKeys) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            this.selectedRowKeys = newSelectedRowKeys;
          },
        }],
        onSelection: this.onSelection,
      }
    }
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys
    },
  },
}
</script>
```

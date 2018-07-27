/* eslint react/no-multi-comp:0, no-console:0 */
import '../assets/index.less'
import TreeSelect from '../index'

const SHOW_PARENT = TreeSelect.SHOW_PARENT

const treeData = [{
  label: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    label: 'Child Node1',
    value: '0-0-0',
    key: '0-0-0',
  }],
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
  children: [{
    label: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0',
  }, {
    label: 'Child Node4',
    value: '0-1-1',
    key: '0-1-1',
  }, {
    label: 'Child Node5',
    value: '0-1-2',
    key: '0-1-2',
  }],
}]

export default {
  data () {
    return {
      value: ['0-0-0'],
      disabled: false,
    }
  },

  methods: {
    onChange  (value) {
      console.log('onChange ', value, arguments)
      this.value = value
    },
    switch (checked) {
      this.disabled = checked
    },
  },

  render () {
    const tProps = {
      props: {
        treeData,
        disabled: this.disabled,
        value: this.value,
        multiple: true,
        allowClear: true,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        searchPlaceholder: 'Please select',
      },
      on: {
        change: this.onChange,
      },
      style: {
        width: '300px',
      },
    }
    return (
      <div>
        <TreeSelect {...tProps} />
        <input type='checkbox' onChange={e => this.switch(e.target.checked)}/> 禁用
      </div>
    )
  },
}


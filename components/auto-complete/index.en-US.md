## API

````html
<a-auto-complete :dataSource="dataSource" />
````

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| allowClear | Show clear button, effective in multiple mode only. | boolean | false |
| autoFocus | get focus when component mounted | boolean | false |
| backfill | backfill selected item the input when using keyboard | boolean | false |
| slot="default" (for customize input element) | customize input element | HTMLInputElement / HTMLTextAreaElement | `<Input />` |
| dataSource | Data source for autocomplete | slot \| [DataSourceItemType](https://github.com/vueComponent/ant-design/blob/724d53b907e577cf5880c1e6742d4c3f924f8f49/components/auto-complete/index.vue#L9)\[] |  |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |
| defaultValue | Initial selected option. | string\|string\[]\|{ key: string, label: string\|vNodes }\|Array&lt;{ key: string, label: string\|vNodes }> | - |
| disabled | Whether disabled select | boolean | false |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns `true`, the option will be included in the filtered set; Otherwise, it will be excluded. | boolean or function(inputValue, option) | true |
| optionLabelProp | Which prop value of option will render as content of select. | string | `children` |
| placeholder | placeholder of input | string | - |
| value(v-model) | selected option | string\|string\[]\|{ key: string, label: string\|vNodes }\|Array&lt;{ key: string, label: string\|vNodes }> | - |

### events
| Events Name | Description | Arguments |
| --- | --- | --- |
| onChange | Called when select an option or input value change, or value of input is changed | function(value) | - |
| onSearch | Called when searching items. | function(value) | - |
| onSelect | Called when a option is selected. param is option's value and option instance. | function(value, option) | - |

## Methods

| Name | Description |
| ---- | ----------- |
| blur() | remove focus |
| focus() | get focus |

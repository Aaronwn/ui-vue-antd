
## API

### Input

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| addonAfter | 带标签的 input，设置后置标签 | string\|slot |  |
| addonBefore | 带标签的 input，设置前置标签 | string\|slot |  |
| defaultValue | 输入框默认内容 | string |  |
| disabled | 是否禁用状态，默认为 false | boolean | false |
| id | 输入框的 id | string |  |
| prefix | 带有前缀图标的 input | string\|slot |  |
| size | 控件大小。注：标准表单内的输入框大小限制为 `large`。可选 `large` `default` `small` | string | `default` |
| suffix | 带有后缀图标的 input | string\|slot |  |
| type | 声明 input 类型，同原生 input 标签的 type 属性，见：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#属性)(请直接使用 `Input.TextArea` 代替 `type="textarea"`)。 | string | `text` |
| value(v-model) | 输入框内容 | string |  |

### Input 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| pressEnter | 按下回车的回调 | function(e) |

> 如果 `Input` 在 `Form.Item` 内，并且 `Form.Item` 设置了 `id` 和 `options` 属性，则 `value` `defaultValue` 和 `id` 属性会被自动设置。


### Input.TextArea

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autosize | 自适应内容高度，可设置为 `true|false` 或对象：`{ minRows: 2, maxRows: 6 }` | boolean\|object | false |
| defaultValue | 输入框默认内容 | string |  |
| value(v-model) | 输入框内容 | string |  |

### Input.TextArea事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| pressEnter | 按下回车的回调 | function(e) |

`Input.TextArea` 的其他属性和浏览器自带的 [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) 一致。

#### Input.Search

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| enterButton | 是否有确认按钮，可设为按钮文字 | boolean\|slot | false |

### Input.Search 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 点击搜索或按下回车键时的回调 | function(value) |

其余属性和 Input 一致。

#### Input.Group

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| compact | 是否用紧凑模式 | boolean | false |
| size | `Input.Group` 中所有的 `Input` 的大小，可选 `large` `default` `small` | string | `default` |

````html
<a-input-group>
  <a-input />
  <a-input />
</a-input-group>
````

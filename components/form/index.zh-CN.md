
````html
<Form.Item {...props}>
  {children}
</Form.Item>
````

## API

### Form

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| form | 经 `Form.create()` 包装过的组件会自带 `this.form` 属性，直接传给 Form 即可。无需手动设置 | object | 无 |
| hideRequiredMark | 隐藏所有表单项的必选标记 | Boolean | false |
| layout | 表单布局 | 'horizontal'\|'vertical'\|'inline' | 'horizontal' |
| autoFormCreate | 自动执行Form.create，建议在template组件下使用，并且不可以和`Form.create()`同时使用 |Function(form)| 无|
| options | 对应Form.create(options)的`options` | Object | {} |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 数据验证成功后回调事件 | Function(e:Event) |

### autoFormCreate

````html
<a-form :autoFormCreate="(form)=>{this.form = form}">
...
</a-form>
````
如果使用`template`语法，可以使用`autoFormCreate`开启自动校验和数据收集功能，但每一个`Form.Item`仅仅对其第一个子组件进行`decorator`。更加复杂的功能建议使用`JSX`。

相关示例如下：

[coordinated-controls](/ant-design/components/form-cn/#components-form-demo-coordinated-controls)

[dynamic-rules](/ant-design/components/form-cn/#components-form-demo-dynamic-rules)

[horizontal-login-form](/ant-design/components/form-cn/#components-form-demo-horizontal-login-form)

### Form.create(options)

使用方式如下：

```jsx
const CustomizedForm = {}

CustomizedForm = Form.create({})(CustomizedForm);
```

如果需要为包装组件实例维护一个ref，可以使用`wrappedComponentRef`。
参考[示例](#components-form-demo-advanced-search)


`options` 的配置项如下。

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| props | 父组件需要映射到表单项上的属性声明(和[vue组件props一致]( https://vuejs.org/v2/api/#props)) | {} |
| mapPropsToFields | 把父组件的属性映射到表单项上（如：把 Redux store 中的值读出），需要对返回值中的表单域数据用 [`Form.createFormField`](#Form.createFormField) 标记 | (props) => Object{ fieldName: FormField { value } } |
| validateMessages | 默认校验信息，可用于把默认错误信息改为中文等，格式与 [newMessages](https://github.com/yiminghe/async-validator/blob/master/src/messages.js) 返回值一致 | Object { [nested.path]&#x3A; String } |
| onFieldsChange | 当 `Form.Item` 子节点的值发生改变时触发，可以把对应的值转存到 Redux store | Function(props, fields) |
| onValuesChange | 任一表单域的值发生改变时的回调 | (props, values) => void |

经过 `Form.create` 包装的组件将会自带 `this.form` 属性，`this.form` 提供的 API 如下：

> 注意：使用 `getFieldsValue` `getFieldValue` `setFieldsValue` 等时，应确保对应的 field 已经用 `getFieldDecorator` 注册过了。

| 方法      | 说明                                     | 类型       |
| ------- | -------------------------------------- | -------- |
| getFieldDecorator | 用于和表单进行双向绑定，详见下方描述 |  |
| getFieldError | 获取某个输入控件的 Error | Function(name) |
| getFieldsError | 获取一组输入控件的 Error ，如不传入参数，则获取全部组件的 Error | Function(\[names: string\[]]) |
| getFieldsValue | 获取一组输入控件的值，如不传入参数，则获取全部组件的值 | Function(\[fieldNames: string\[]]) |
| getFieldValue | 获取一个输入控件的值 | Function(fieldName: string) |
| isFieldsTouched | 判断是否任一输入控件经历过 `getFieldDecorator` 的值收集时机 `options.trigger` | (names?: string\[]) => boolean |
| isFieldTouched | 判断一个输入控件是否经历过 `getFieldDecorator` 的值收集时机 `options.trigger` | (name: string) => boolean |
| isFieldValidating | 判断一个输入控件是否在校验状态 | Function(name) |
| resetFields | 重置一组输入控件的值（为 `initialValue`）与状态，如不传入参数，则重置所有组件 | Function(\[names: string\[]]) |
| setFields | 设置一组输入控件的值与 Error。 | Function({ [fieldName]&#x3A; { value: any, errors: [Error] } }) |
| setFieldsValue | 设置一组输入控件的值 | Function({ [fieldName]&#x3A; value } |
| validateFields | 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件 | Function(\[fieldNames: string\[]], [options: object], callback: Function(errors, values)) |
| validateFieldsAndScroll | 与 `validateFields` 相似，但校验完后，如果校验不通过的菜单域不在可见范围内，则自动滚动进可见范围 | 参考 `validateFields` |

### this.form.validateFields/validateFieldsAndScroll(\[fieldNames: string\[]], [options: object], callback: Function(errors, values))

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options.first | 若为 true，则每一表单域的都会在碰到第一个失败了的校验规则后停止校验 | boolean | false |
| options.firstFields | 指定表单域会在碰到第一个失败了的校验规则后停止校验 | String\[] | \[] |
| options.force | 对已经校验过的表单域，在 validateTrigger 再次被触发时是否再次校验 | boolean | false |
| options.scroll | 定义 validateFieldsAndScroll 的滚动行为，详细配置见 [dom-scroll-into-view config](https://github.com/yiminghe/dom-scroll-into-view#function-parameter) | Object | {} |

### Form.createFormField

用于标记 `mapPropsToFields` 返回的表单域数据，[例子](#components-form-demo-global-state)。

### this.form.getFieldDecorator(id, options)

经过 `getFieldDecorator` 包装的控件，表单控件会自动添加 `value`（或 `valuePropName` 指定的其他属性） `onChange`（或 `trigger` 指定的其他属性），数据同步将被 Form 接管，这会导致以下结果：

1. 你**不再需要也不应该**用 `onChange` 来做同步，但还是可以继续监听 `onChange` 等事件。
2. 你不能用控件的 `value` `defaultValue` 等属性来设置表单域的值，默认值可以用 `getFieldDecorator` 里的 `initialValue`。
3. 你不应该用 `v-model`，可以使用 `this.form.setFieldsValue` 来动态改变表单值。

#### 特别注意

1. `getFieldDecorator` 不能用于装饰纯函数组件。
2. `getFieldDecorator` 调用不能位于纯函数组件中 <https://cn.vuejs.org/v2/api/#functional>。

#### getFieldDecorator(id, options) 参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 必填输入控件唯一标志。支持嵌套式的写法。 | string |  |
| options.getValueFromEvent | 可以把 onChange 的参数（如 event）转化为控件的值 | function(..args) | [reference](https://github.com/react-component/form#option-object) |
| options.initialValue | 子节点的初始值，类型、可选值均由子节点决定(注意：由于内部校验时使用 `===` 判断是否变化，建议使用变量缓存所需设置的值而非直接使用字面量)) |  |  |
| options.normalize | 转换默认的 value 给控件，[一个选择全部的例子](https://codesandbox.io/s/kw4l2vqqmv) | function(value, prevValue, allValues): any | - |
| options.rules | 校验规则，参考下方文档 | object\[] |  |
| options.trigger | 收集子节点的值的时机 | string | 'change' |
| options.validateFirst | 当某一规则校验不通过时，是否停止剩下的规则的校验 | boolean | false |
| options.validateTrigger | 校验子节点值的时机 | string\|string\[] | 'change' |
| options.valuePropName | 子节点的值的属性，如 Switch 的是 'checked' | string | 'value' |

### Form.Item

注意：

- 一个 Form.Item 建议只放一个被 getFieldDecorator 装饰过的 child，当有多个被装饰过的 child 时，`help` `required` `validateStatus` 无法自动生成。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| colon | 配合 label 属性使用，表示是否显示 label 后面的冒号 | boolean | true |
| extra | 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。 | string\|slot |  |
| hasFeedback | 配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用 | boolean | false |
| help | 提示信息，如不设置，则会根据校验规则自动生成 | string\|slot |  |
| label | label 标签的文本 | string\|slot |  |
| labelCol | label 标签布局，同 `<Col>` 组件，设置 `span` `offset` 值，如 `{span: 3, offset: 12}` 或 `sm: {span: 3, offset: 12}` | [object](/ant-design/components/grid-cn/#Col) |  |
| required | 是否必填，如不设置，则会根据校验规则自动生成 | boolean | false |
| validateStatus | 校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating' | string |  |
| wrapperCol | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol | [object](/ant-design/components/grid-cn/#Col) |  |
| fieldDecoratorId | 对应`getFieldDecorator(id, options)`的第一个参数`id`，如需收集数据需要设置该字段 | string | 无 |
| fieldDecoratorOptions | 对应`getFieldDecorator(id, options)`的第二个参数`options` | object | {} |

### 校验规则

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| enum | 枚举类型 | string | - |
| len | 字段长度 | number | - |
| max | 最大长度 | number | - |
| message | 校验文案 | string | - |
| min | 最小长度 | number | - |
| pattern | 正则表达式校验 | RegExp | - |
| required | 是否必选 | boolean | `false` |
| transform | 校验前转换字段值 | function(value) => transformedValue:any | - |
| type | 内建校验类型，[可选项](https://github.com/yiminghe/async-validator#type) | string | 'string' |
| validator | 自定义校验（注意，[callback 必须被调用](https://github.com/ant-design/ant-design/issues/5155)） | function(rule, value, callback) | - |
| whitespace | 必选时，空格是否会被视为错误 | boolean | `false` |

更多高级用法可研究 [async-validator](https://github.com/yiminghe/async-validator)。



## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| afterClose | Modal 完全关闭后的回调 | function | 无 |
| bodyStyle | Modal body 样式 | object | {} |
| cancelText | 取消按钮文字 | string\| slot | 取消 |
| closable | 是否显示右上角的关闭按钮 | boolean | true |
| confirmLoading | 确定按钮 loading | boolean | 无 |
| destroyOnClose | 关闭时销毁 Modal 里的子元素 | boolean | false |
| footer | 底部内容，当不需要默认底部按钮时，可以设为 `:footer="null"` | string\|slot | 确定取消按钮 |
| getContainer | 指定 Modal 挂载的 HTML 节点 | (instance): HTMLElement | () => document.body |
| mask | 是否展示遮罩 | Boolean | true |
| maskClosable | 点击蒙层是否允许关闭 | boolean | true |
| maskStyle | 遮罩样式 | object | {} |
| okText | 确认按钮文字 | string\|slot | 确定 |
| okType | 确认按钮类型 | string | primary |
| style | 可用于设置浮层的样式，调整浮层位置等 | object | - |
| title | 标题 | string\|slot | 无 |
| visible(v-model) | 对话框是否可见 | boolean | 无 |
| width | 宽度 | string\|number | 520 |
| wrapClassName | 对话框外层容器的类名 | string | - |
| zIndex | 设置 Modal 的 `z-index` | Number | 1000 |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| cancel | 点击遮罩层或右上角叉或取消按钮的回调 | function(e) |
| ok | 点击确定回调 | function(e) |

#### 注意

> `<Modal />` 默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 `destroyOnClose`。

### Modal.method()

包括：

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

以上均为一个函数，参数为 object，具体属性如下：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| cancelText | 取消按钮文字 | string | 取消 |
| class | 容器类名 | string | - |
| content | 内容 | string\|vNode | 无 |
| iconType | 图标 Icon 类型 | string | question-circle |
| maskClosable | 点击蒙层是否允许关闭 | Boolean | `false` |
| okText | 确认按钮文字 | string | 确定 |
| okType | 确认按钮类型 | string | primary |
| title | 标题 | string\|vNode | 无 |
| width | 宽度 | string\|number | 416 |
| zIndex | 设置 Modal 的 `z-index` | Number | 1000 |
| onCancel | 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | function | 无 |
| onOk | 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | function | 无 |

以上函数调用后，会返回一个引用，可以通过该引用关闭弹窗。

```jsx
const ref = Modal.info();
ref.destroy();
```

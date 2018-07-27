

## API

### Tag

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| afterClose | 关闭动画完成后的回调 | () => void | - |
| closable | 标签是否可以关闭 | boolean | false |
| color | 标签色 | string | - |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 关闭时的回调 | (e) => void |

### Tag.CheckableTag

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 设置标签的选中状态 | boolean | false |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 点击标签时触发的回调 | (checked) => void |

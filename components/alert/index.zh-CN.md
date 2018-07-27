
## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| afterClose | 关闭动画结束后的回掉 | () => void | - |
| banner | 是否用作顶部公告 | boolean | false |
| closable | 默认不显示关闭按钮 | boolean | 无 |
| closeText | 自定义关闭按钮 | string\|slot | 无 |
| description | 警告提示的辅助性文字介绍 | string\|slot | 无 |
| message | 警告提示内容 | string\|slot | 无 |
| showIcon | 是否显示辅助图标 | boolean | false，`banner` 模式下默认值为 true |
| iconType | 自定义图标类型，`showIcon` 为 `true` 时有效 | string | - |
| type | 指定警告提示的样式，有四种选择 `success`、`info`、`warning`、`error` | string | `info`，`banner` 模式下默认值为 `warning` |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 关闭时触发的回调函数 | (e: MouseEvent) => void |

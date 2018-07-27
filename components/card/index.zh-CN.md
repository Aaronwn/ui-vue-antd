
## API

### Card

| 参数      | 说明 | 类型 | 默认值 |
| ---       | --- | --- | --- |
| actions   | 卡片操作组，位置在卡片底部 |slot | - |
| bodyStyle | 内容区域自定义样式 | object | - |
| bordered  | 是否有边框 | boolean | true |
| cover     | 卡片封面 | slot | - |
| extra     | 卡片右上角的操作区域 | string\|slot | - |
| hoverable | 鼠标移过时可浮起 | boolean | false |
| loading   | 当卡片内容还在加载中时，可以用 loading 展示一个占位 | boolean | false |
| tabList   | 页签标题列表, 可以通过scopedSlots属性自定义tab | Array<{key: string, tab: any, scopedSlots: {tab: 'XXX'}}> | - |
| activeTabKey | 当前激活页签的 key | string | - |
| defaultActiveTabKey | 初始化选中页签的 key，如果没有设置 activeTabKey | string | 第一个页签 |
| title     | 卡片标题 | string\|slot | - |
| type      | 卡片类型，可设置为 `inner` 或 不设置 | string | - |
| onTabChange | 页签切换的回调 | (key) => void | - |

### Card.Grid

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| className | 网格容器类名 | string | - |
| style | 定义网格容器类名的样式 | object | - |

### Card.Meta

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| avatar   | 头像/图标 | slot | - |
| className | 容器类名 | string | - |
| description | 描述内容 | slot | - |
| style | 定义容器类名的样式 | object | - |
| title | 标题内容 | slot | - |

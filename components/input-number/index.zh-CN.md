## API

属性如下

| 成员 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoFocus | 自动获取焦点 | boolean | false |
| defaultValue | 初始值 | number |  |
| disabled | 禁用 | boolean | false |
| formatter | 指定输入框展示值的格式 | function(value: number \| string): string | - |
| max | 最大值 | number | Infinity |
| min | 最小值 | number | -Infinity |
| parser | 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 | function( string): number | - |
| precision | 数值精度 | number | - |
| size | 输入框大小 | string | 无 |
| step | 每次改变步数，可以为小数 | number\|string | 1 |
| value(v-model) | 当前值 | number |  |

### 事件
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 变化回调 | Function(value: number \| string) |  |

## 方法

| 名称 | 描述 |
| --- | --- |
| blur() | 移除焦点 |
| focus() | 获取焦点 |

<cn>
#### 禁用
禁用时间选择。
</cn>

<us>
#### disabled
A disabled state of the `TimePicker`.
</us>

```html
<template>
  <a-time-picker :defaultValue="moment('12:08:23', 'HH:mm:ss')" disabled />
</template>
<script>
import moment from 'moment';
export default {
  methods: {
    moment,
  }
}
</script>
```

<cn>
#### 自定义文字格式
`format` 属性指定格式。
</cn>

<us>
#### Custom text format
You can custom text format by setting `format`.
</us>

```html
<template>
  <div>
    <a-progress type="circle" :percent="75" :format="percent => `${percent} Days`"/>
    <a-progress type="circle" :percent="100" :format="() => 'Done'" />
  </div>
</template>
<style scoped>
  div.ant-progress-circle,
  div.ant-progress-line {
    margin-right: 8px;
    margin-bottom: 8px;
  }
</style>
```

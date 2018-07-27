<cn>
#### 三种大小
我们为 `<Input />` 输入框定义了三种尺寸（大、默认、小），高度分别为 `40px`、`32px` 和 `24px`。
注意： 在表单里面，我们只使用大尺寸的输入框。
</cn>

<us>
#### Three sizes of Input
There are three sizes of an Input box: `large` (40px)、`default` (32px) and `small` (24px).
Note: Inside of forms, only the large size is used.
</us>

```html
<template>
  <div class="components-input-demo-size">
    <a-input size="large" placeholder="large size" />
    <a-input placeholder="default size" />
    <a-input size="small" placeholder="small size" />
  </div>
</template>
<style scoped>
.components-input-demo-size .ant-input {
  width: 200px;
  margin: 0 8px 8px 0;
}
</style>
```



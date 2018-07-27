<cn>
#### 带标签的滑块
使用 `marks` 属性标注分段式滑块，使用 `value` / `defaultValue` 指定滑块位置。当 `included=false` 时，表明不同标记间为并列关系。当 `step=null` 时，Slider 的可选值仅有 `marks` 标出来的部分。
</cn>

<us>
#### Graduated slider
Using `marks` property to mark a graduated slider, use `value` or `defaultValue` to specify the position of thumb.
When `included` is false, means that different thumbs are coordinative.
when `step` is null, users can only slide the thumbs onto marks.
</us>

```html
<template>
  <div id="components-slider-demo-mark">
    <h4>included=true</h4>
    <a-slider :marks="marks" :defaultValue="37" />
    <a-slider range :marks="marks" :defaultValue="[26, 37]" />

    <h4>included=false</h4>
    <a-slider :marks="marks" :included="false" :defaultValue="37" />

    <h4>marks & step</h4>
    <a-slider :marks="marks" :step="10" :defaultValue="37" />

    <h4>step=null</h4>
    <a-slider :marks="marks" :step="null" :defaultValue="37" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      marks: {
        0: '0°C',
        26: '26°C',
        37: '37°C',
        100: {
          style: {
            color: '#f50',
          },
          label: <strong>100°C</strong>,
        },
      },
    }
  },
  methods: {
    onChange(value) {
      console.log('change: ', value);
    },
    onAfterChange(value) {
      console.log('afterChange: ', value);
    }
  },
}
</script>
<style scoped>
#components-slider-demo-mark h4 {
  margin: 0 0 16px;
}
#components-slider-demo-mark .ant-slider-with-marks {
  margin-bottom: 44px;
}
</style>
```



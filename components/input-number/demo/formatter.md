<cn>
#### 格式化展示
通过 `formatter` 格式化数字，以展示具有具体含义的数据，往往需要配合 `parser` 一起使用。
</cn>

<us>
#### Formatter
Display value within it's situation with `formatter`, and we usually use `parser` at the same time.
</us>

```html
<template>
  <div>
    <a-input-number
      :defaultValue="1000"
      :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
      :parser="value => value.replace(/\$\s?|(,*)/g, '')"
      @change="onChange"
    />
    <a-input-number
      :defaultValue="100"
      :min="0"
      :max="100"
      :formatter="value => `${value}%`"
      :parser="value => value.replace('%', '')"
      @change="onChange"
    />
  </div>
</template>
<script>
  export default {
    methods: {
      onChange(value) {
        console.log('changed', value);
      },
    },
  }
</script>
```




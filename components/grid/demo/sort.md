<cn>
#### 栅格排序
列排序。
通过使用 `push` 和 `pull` 类就可以很容易的改变列（column）的顺序。
</cn>

<us>
#### Grid sort
By using `push` and` pull` class you can easily change column order.
</us>

```html
<template>
  <div>
    <a-row>
      <a-col :span="18" :push="6">col-18 col-push-6</a-col>
      <a-col :span="6" :pull="18">col-6 col-pull-18</a-col>
    </a-row>
  </div>
</template>
```



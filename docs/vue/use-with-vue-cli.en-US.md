
# Use in vue-cli

[vue-cli](https://github.com/vuejs/vue-cli) is one of the best Vue application development tools. We are going to use `antd` within it and modify the webpack config for some customized needs.


## Install and Initialization

We need to install `vue-cli` first, you may need install [yarn](https://github.com/yarnpkg/yarn/) too.

```bash
$ npm install -g vue-cli yarn
```

Create a new project named `antd-demo`.

```bash
$ vue init webpack antd-demo
```

The tool will create and initialize environment and dependencies automatically,
please try config your proxy setting or use another npm registry if any network errors happen during it.

Then we go inside `antd-demo` and start it.

```bash
$ cd antd-demo
$ npm run dev
```

Open the browser at http://localhost:8080/. It renders a header saying "Welcome to Your Vue.js App" on the page.

## Import antd

Below is the default directory structure.

```
├── README.md
├── package.json
├── index.html
├── src
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   └── HelloWorld.vue
│   ├── App.vue
│   └── main.js
└── yarn.lock
```

Now we install `vue-antd-ui` from yarn or npm.

```bash
$ yarn add vue-antd-ui
```

Modify `src/main.js`, import Button component from `antd`.

```jsx
import Vue from 'vue'
import Button from 'vue-antd-ui/lib/button'
import 'vue-antd-ui/dist/antd.css'
import App from './App'

Vue.component(Button.name, Button)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
```
Modify `src/App.vue`。

```jsx
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <a-button type="primary">Button></a-button>
    <router-view/>
  </div>
</template>
...
```


Ok, you should now see a blue primary button displayed on the page. Next you can choose any components of `antd` to develop your application. Visit other workflows of `vue-cli` at its [User Guide ](https://github.com/vuejs/vue-cli/blob/master/README.md).


## Advanced Guides

We are successfully running antd components now but in the real world, there are still lots of problems about antd-demo.
For instance, we actually import all styles of components in the project which may be a network performance issue.

Now we need to customize the default webpack config.

### Use babel-plugin-import

[babel-plugin-import](https://github.com/ant-design/babel-plugin-import) is a babel plugin for importing components on demand ([How does it work?](/ant-design/docs/vue/getting-started/#Import-on-Demand)).

```bash
$ yarn add babel-plugin-import --dev
```

Modify `.babelrc`.

```diff
  {
    "presets": [
      ["env", {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }],
      "stage-2"
    ],
-   "plugins": ["transform-vue-jsx", "transform-runtime"]
+   "plugins": [
+     "transform-vue-jsx",
+     "transform-runtime",
+     ["import", { "libraryName": "vue-antd-ui", "libraryDirectory": "es", "style": "css" }]
+   ]
  }
```

Remove the `import 'vue-antd-ui/dist/antd.css';` statement added before because `babel-plugin-import` will import styles and import components like below:

```diff
  // src/main.js
  import Vue from 'vue'
- import Button from 'vue-antd-ui/lib/button';
+ import { Button } from 'vue-antd-ui';
- import 'vue-antd-ui/dist/antd.css'
  import App from './App'

  Vue.component(Button.name, Button)

  Vue.config.productionTip = false

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
  })
```

Then reboot with `npm run dev` and visit the demo page, you should not find any [warning messages](https://zos.alipayobjects.com/rmsportal/vgcHJRVZFmPjAawwVoXK.png) in the console, which prove that the `import on demand` config is working now. You will find more info about it in [this guide](/ant-design/docs/vue/getting-started/#Import-on-Demand).

### Customize Theme

According to the [Customize Theme documentation](/ant-design/docs/vue/customize-theme), to customize the theme, we need to modify `less` variables with tools such as [less-loader](https://github.com/webpack/less-loader).

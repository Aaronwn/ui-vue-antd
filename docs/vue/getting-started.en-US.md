
# Getting Started

Ant Design Vue is dedicated to providing a **good development experience** for programmers. Make sure that you had installed [Node.js](https://nodejs.org/)(> v6.5) correctly.

> Before delving into Ant Design Vue, a good knowledge base of [Vue](https://cn.vuejs.org/) and [JavaScript ES2015](http://babeljs.io/docs/learn-es2015/) is needed.


## Playground

The following CodeSandbox demo is the simplest use case, and it's also a good habit to fork this demo to provide a re-producible demo while reporting a bug.

- [![Vue Antd Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/2wpk21kzvr)

## Import vue-antd-ui

### 1. Installation

[vue-cli](https://github.com/vuejs/vue-cli)

```bash
$ npm install vue-cli -g
```

### 2. Create a New Project

A new project can be created using CLI tools.

```bash
$ vue init webpack antd-demo
```

### 3. Use antd's Components


```bash
$ npm i --save vue-antd-ui
```
**Fully import**
```jsx
import Vue from 'vue'
import Antd from 'vue-antd-ui'
import App from './App'
import 'vue-antd-ui/dist/antd.css'
Vue.config.productionTip = false

Vue.use(Antd)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
```
The above imports Antd entirely. Note that CSS file needs to be imported separately.

**Only import the components you need**
```jsx
import Vue from 'vue'
import { Button, message } from 'vue-antd-ui'
import App from './App'

Vue.config.productionTip = false

Vue.component(Button.name, Button)
Vue.prototype.$message = message

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
```

> All the components in antd are listed in the sidebar.

### 4. Component list

[Component list](https://github.com/vueComponent/ant-design/blob/master/site/components.js)

## Compatibility

Ant Design Vue supports all the modern browsers and IE9+.

You need to provide [es5-shim](https://github.com/es-shims/es5-shim) and [es6-shim](https://github.com/paulmillr/es6-shim) and other polyfills for IE browsers.

If you are using babel, we strongly recommend using [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) and [babel-plugin-transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/) instead of those two shims.

> Please avoid using both the babel and shim methods at the same time.


## Import on Demand

If you see logs like below screenshot, you might be importing all components by writing `import { Button } from 'vue-antd-ui';`. This will affect your app's network performance.

```
You are using a whole package of antd, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.
```

> ![](https://zos.alipayobjects.com/rmsportal/GHIRszVcmjccgZRakJDQ.png)

However, we can import individual components on demand:

```jsx
import Button from 'vue-antd-ui/lib/button';
import 'vue-antd-ui/lib/button/style'; // or vue-antd-ui/lib/button/style/css for css format file
```

We strongly recommend using [babel-plugin-import](https://github.com/ant-design/babel-plugin-import), which can convert the following code to the 'antd/lib/xxx' way:

```jsx
import { Button } from 'vue-antd-ui';
```

And this plugin can load styles too, read [usage](https://github.com/ant-design/babel-plugin-import#usage) for more details.

> FYI, babel-plugin-import's `style` option will importing some global reset styles, don't use it if you don't need those styles. You can import styles manually via `import 'vue-antd-ui/dist/antd.css'` and override the global reset styles.

## Customization

- [Customize Theme](/ant-design/docs/vue/customize-theme)
- [Local Iconfont](https://github.com/ant-design/antd-init/tree/master/examples/local-iconfont)

## Tips

- You can use any `npm` modules.
- Although Vue's official recommended template to write components, JSX is a better choice for complex components.


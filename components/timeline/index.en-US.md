## API

```` html
<Timeline>
  <Timeline.Item>step1 2015-09-01</Timeline.Item>
  <Timeline.Item>step2 2015-09-01</Timeline.Item>
  <Timeline.Item>step3 2015-09-01</Timeline.Item>
  <Timeline.Item>step4 2015-09-01</Timeline.Item>
</Timeline>
````

### Timeline

Timeline

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| pending | Set the last ghost node's existence or its content | boolean\|string\|slot | `false` |
| pendingDot | Set the dot of the last ghost node when pending is true | \|string\|slot | `<Icon type="loading" />` |

### Timeline.Item

Node of timeline

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| color | Set the circle's color to `blue`, `red`, `green` or other custom colors | string | `blue` |
| dot | Customize timeline dot | string\|slot | - |

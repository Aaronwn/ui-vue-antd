## API

### Card

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| actions | The action list, shows at the bottom of the Card. | slot | - |
| bodyStyle | Inline style to apply to the card content | object | - |
| bordered | Toggles rendering of the border around the card | boolean | `true` |
| cover | Card cover | slot | - |
| extra | Content to render in the top-right corner of the card | string\|slot | - |
| hoverable | Lift up when hovering card | boolean | false |
| loading | Shows a loading indicator while the contents of the card are being fetched | boolean | false |
| tabList | List of TabPane's head, Custom tabs can be created with the scopedSlots property | Array<{key: string, tab: any, scopedSlots: {tab: 'XXX'}}> | - |
| activeTabKey | Current TabPane's key | string | - |
| defaultActiveTabKey | Initial active TabPane's key, if `activeTabKey` is not set. | string | - |
| title | Card title | string\|slot | - |
| type | Card style type, can be set to `inner` or not set | string | - |
| onTabChange | Callback when tab is switched | (key) => void | - |

### Card.Grid

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| className | className of container | string | - |
| style | style object of container | object | - |

### Card.Meta

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| avatar | avatar or icon | slot | - |
| className | className of container | string | - |
| description | description content | slot | - |
| style | style object of container | object | - |
| title | title content | slot | - |

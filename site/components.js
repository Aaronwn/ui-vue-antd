import Vue from 'vue'
import {
  Affix,
  Anchor,
  AutoComplete,
  Alert,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Collapse,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  message,
  Menu,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Spin,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  TreeSelect,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  // Mention,
  Upload,
  // version,
} from 'antd'

Vue.component(Affix.name, Affix) // a-affix
Vue.component(Anchor.name, Anchor)
Vue.component(Anchor.Link.name, Anchor.Link)
Vue.component(AutoComplete.name, AutoComplete)
Vue.component(Alert.name, Alert)
Vue.component(Avatar.name, Avatar)
Vue.component(BackTop.name, BackTop)
Vue.component(Badge.name, Badge)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(Breadcrumb.Item.name, Breadcrumb.Item)
Vue.component(Button.name, Button)
Vue.component(Button.Group.name, Button.Group)

Vue.component(Calendar.name, Calendar)
Vue.component(Card.name, Card)
Vue.component(Card.Meta.name, Card.Meta)
Vue.component(Card.Grid.name, Card.Grid)
Vue.component(Collapse.name, Collapse)
Vue.component(Collapse.Panel.name, Collapse.Panel)
Vue.component(Carousel.name, Carousel)
Vue.component(Cascader.name, Cascader)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Checkbox.Group.name, Checkbox.Group)
Vue.component(Col.name, Col)
Vue.component(DatePicker.name, DatePicker)
Vue.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker)
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
Vue.component(DatePicker.WeekPicker.name, DatePicker.WeekPicker)
Vue.component(Divider.name, Divider)
Vue.component(Dropdown.name, Dropdown)
Vue.component(Dropdown.Button.name, Dropdown.Button)
Vue.component(Form.name, Form)
Vue.component(Form.Item.name, Form.Item)
Vue.component(Icon.name, Icon)
Vue.component(Input.name, Input)
Vue.component(Input.Group.name, Input.Group)
Vue.component(Input.Search.name, Input.Search)
Vue.component(Input.TextArea.name, Input.TextArea)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Layout.name, Layout)
Vue.component(Layout.Header.name, Layout.Header)
Vue.component(Layout.Footer.name, Layout.Footer)
Vue.component(Layout.Sider.name, Layout.Sider)
Vue.component(Layout.Content.name, Layout.Content)
Vue.component(List.name, List)
Vue.component(List.Item.name, List.Item)
Vue.component(List.Item.Meta.name, List.Item.Meta)
Vue.component(LocaleProvider.name, LocaleProvider)
Vue.component(Menu.name, Menu)
Vue.component(Menu.Item.name, Menu.Item)
Vue.component(Menu.SubMenu.name, Menu.SubMenu)
Vue.component(Menu.Divider.name, Menu.Divider)
Vue.component(Menu.ItemGroup.name, Menu.ItemGroup)
Vue.component(Modal.name, Modal)
Vue.component(Pagination.name, Pagination)
Vue.component(Popconfirm.name, Popconfirm)
Vue.component(Popover.name, Popover)
Vue.component(Progress.name, Progress)
Vue.component(Radio.name, Radio)
Vue.component(Radio.Group.name, Radio.Group)
Vue.component(Radio.Button.name, Radio.Button)
Vue.component(Rate.name, Rate)
Vue.component(Row.name, Row)
Vue.component(Select.name, Select)
Vue.component(Select.Option.name, Select.Option)
Vue.component(Select.OptGroup.name, Select.OptGroup)
Vue.component(Slider.name, Slider)
Vue.component(Spin.name, Spin)
Vue.component(Steps.name, Steps)
Vue.component(Steps.Step.name, Steps.Step)
Vue.component(Switch.name, Switch)
Vue.component(Table.name, Table)
Vue.component(Table.Column.name, Table.Column)
Vue.component(Table.ColumnGroup.name, Table.ColumnGroup)
Vue.component(Transfer.name, Transfer)
Vue.component(Tree.name, Tree)
Vue.component(Tree.TreeNode.name, Tree.TreeNode)
Vue.component(TreeSelect.name, TreeSelect)
Vue.component(TreeSelect.TreeNode.name, TreeSelect.TreeNode)
Vue.component(Tabs.name, Tabs)
Vue.component(Tabs.TabPane.name, Tabs.TabPane)
Vue.component(Tag.name, Tag)
Vue.component(Tag.CheckableTag.name, Tag.CheckableTag)
Vue.component(TimePicker.name, TimePicker)
Vue.component(Timeline.name, Timeline)
Vue.component(Timeline.Item.name, Timeline.Item)
Vue.component(Tooltip.name, Tooltip)
// Vue.component(Mention.name, Mention)
Vue.component(Upload.name, Upload)
Vue.component(Upload.Dragger.name, Upload.Dragger)

Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$confirm = Modal.confirm

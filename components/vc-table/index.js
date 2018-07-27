// base rc-table 6.1.7 7cd6abab4a2bd55adc7a9207c23feb62c3cd015b
import T from './src/Table'
import Column from './src/Column'
import ColumnGroup from './src/ColumnGroup'
import { getOptionProps, getKey, getClass,
  getStyle, getEvents, getSlotOptions, camelize, getSlots,
} from '../_util/props-util'
const Table = {
  name: 'Table',
  Column,
  ColumnGroup,
  props: T.props,
  methods: {
    normalize (elements = []) {
      const columns = []
      elements.forEach(element => {
        if (!element.tag) {
          return
        }
        const key = getKey(element)
        const style = getStyle(element)
        const cls = getClass(element)
        const props = getOptionProps(element)
        const events = getEvents(element)
        const listeners = {}
        Object.keys(events).forEach(e => {
          const k = `on-${e}`
          listeners[camelize(k)] = events[e]
        })
        const { default: children, title } = getSlots(element)
        const column = { title, ...props, style, class: cls, ...listeners }
        if (key) {
          column.key = key
        }
        if (getSlotOptions(element).isTableColumnGroup) {
          column.children = this.normalize(children)
        } else {
          const customRender = element.data && element.data.scopedSlots && element.data.scopedSlots.default
          column.customRender = column.customRender || customRender
        }
        columns.push(column)
      })
      return columns
    },
  },
  render () {
    const { $listeners, $slots, normalize } = this
    const props = getOptionProps(this)
    const columns = props.columns || normalize($slots.default)
    const tProps = {
      props: {
        ...props,
        columns,
      },
      on: $listeners,
    }
    return (
      <T {...tProps}/>
    )
  },
}

export default Table
export { Column, ColumnGroup }

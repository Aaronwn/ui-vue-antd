import PropTypes from '../_util/vue-types'
import classNames from 'classnames'
import omit from 'omit.js'
import { SpinProps } from '../spin'
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import defaultLocale from '../locale-provider/default'

import Spin from '../spin'
import Pagination from '../pagination'
import { Row } from '../grid'

import Item from './Item'
import { initDefaultProps, getComponentFromProp, filterEmpty } from '../_util/props-util'
import { cloneElement } from '../_util/vnode'

export { ListItemProps, ListItemMetaProps } from './Item'

export const ColumnCount = ['', 1, 2, 3, 4, 6, 8, 12, 24]

export const ColumnType = ['gutter', 'column', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']

export const ListGridType = {
  gutter: PropTypes.number,
  column: PropTypes.oneOf(ColumnCount),
  xs: PropTypes.oneOf(ColumnCount),
  sm: PropTypes.oneOf(ColumnCount),
  md: PropTypes.oneOf(ColumnCount),
  lg: PropTypes.oneOf(ColumnCount),
  xl: PropTypes.oneOf(ColumnCount),
  xxl: PropTypes.oneOf(ColumnCount),
}

export const ListSize = ['small', 'default', 'large']

export const ListProps = () => ({
  bordered: PropTypes.bool,
  dataSource: PropTypes.any,
  extra: PropTypes.any,
  grid: PropTypes.shape(ListGridType).loose,
  itemLayout: PropTypes.string,
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  loadMore: PropTypes.any,
  pagination: PropTypes.any,
  prefixCls: PropTypes.string,
  rowKey: PropTypes.any,
  renderItem: PropTypes.any,
  size: PropTypes.oneOf(ListSize),
  split: PropTypes.bool,
  header: PropTypes.any,
  footer: PropTypes.any,
  locale: PropTypes.object,
})

export default {
  Item,
  name: 'AList',

  props: initDefaultProps(ListProps(), {
    dataSource: [],
    prefixCls: 'ant-list',
    bordered: false,
    split: true,
    loading: false,
    pagination: false,
  }),
  provide () {
    return {
      listContext: this,
    }
  },
  data () {
    this.keys = []
    this.defaultPaginationProps = {
      current: 1,
      pageSize: 10,
      onChange: (page, pageSize) => {
        const { pagination } = this
        this.paginationCurrent = page
        if (pagination && pagination.onChange) {
          pagination.onChange(page, pageSize)
        }
      },
      total: 0,
    }
    return {
      paginationCurrent: 1,
    }
  },
  methods: {
    renderItem2 (item, index) {
      const { dataSource, $scopedSlots, rowKey } = this
      let key
      const renderItem = this.renderItem || $scopedSlots.renderItem
      if (typeof rowKey === 'function') {
        key = rowKey(dataSource[index])
      } else if (typeof rowKey === 'string') {
        key = dataSource[rowKey]
      } else {
        key = dataSource.key
      }

      if (!key) {
        key = `list-item-${index}`
      }

      this.keys[index] = key

      return renderItem(item, index)
    },

    isSomethingAfterLastTtem () {
      const { pagination } = this
      const loadMore = getComponentFromProp(this, 'loadMore')
      const footer = getComponentFromProp(this, 'footer')
      return !!(loadMore || pagination || footer)
    },

    renderEmpty (contextLocale) {
      const locale = { ...contextLocale, ...this.locale }
      return <div class={`${this.prefixCls}-empty-text`}>{locale.emptyText}</div>
    },
  },

  render () {
    const {
      bordered,
      split,
      itemLayout,
      pagination,
      prefixCls,
      grid,
      dataSource,
      size,
      loading,
      $listeners,
      $slots,
      paginationCurrent,
    } = this
    const loadMore = getComponentFromProp(this, 'loadMore')
    const footer = getComponentFromProp(this, 'footer')
    const header = getComponentFromProp(this, 'header')
    const children = filterEmpty($slots.default || [])
    let loadingProp = loading
    if (typeof loadingProp === 'boolean') {
      loadingProp = {
        spinning: loadingProp,
      }
    }
    const isLoading = (loadingProp && loadingProp.spinning)

    // large => lg
    // small => sm
    let sizeCls = ''
    switch (size) {
      case 'large':
        sizeCls = 'lg'
        break
      case 'small':
        sizeCls = 'sm'
        break
      default:
        break
    }
    const classString = classNames(prefixCls, {
      [`${prefixCls}-vertical`]: itemLayout === 'vertical',
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-split`]: split,
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-loading`]: isLoading,
      [`${prefixCls}-grid`]: grid,
      [`${prefixCls}-something-after-last-item`]: this.isSomethingAfterLastTtem(),
    })
    const paginationProps = {
      ...this.defaultPaginationProps,
      total: dataSource.length,
      current: paginationCurrent,
      ...pagination || {},
    }
    const largestPage = Math.ceil(
      paginationProps.total / paginationProps.pageSize,
    )
    if (paginationProps.current > largestPage) {
      paginationProps.current = largestPage
    }
    const { class: cls, style, onShowSizeChange = () => {}, ...restProps } = paginationProps
    const paginationContent = pagination ? (
      <div class={`${prefixCls}-pagination`}>
        <Pagination
          {...{
            props: omit(restProps, ['onChange']),
            class: cls, style,
            on: { change: this.defaultPaginationProps.onChange, showSizeChange: onShowSizeChange },
          }}
        />
      </div>
    ) : null

    let splitDataSource = [...dataSource]
    if (pagination) {
      if (
        dataSource.length >
        (paginationProps.current - 1) * paginationProps.pageSize
      ) {
        splitDataSource = [...dataSource].splice(
          (paginationProps.current - 1) * paginationProps.pageSize,
          paginationProps.pageSize,
        )
      }
    }

    let childrenContent
    childrenContent = isLoading && (<div style={{ minHeight: 53 }} />)
    if (splitDataSource.length > 0) {
      const items = splitDataSource.map((item, index) => this.renderItem2(item, index))
      const childrenList = items.map((child, index) => cloneElement(child, {
        key: this.keys[index],
      }),
      )

      childrenContent = grid ? (
        <Row gutter={grid.gutter}>{childrenList}</Row>
      ) : childrenList
    } else if (!children.length && !isLoading) {
      childrenContent = (
        <LocaleReceiver
          componentName='Table'
          defaultLocale={defaultLocale.Table}
          scopedSlots={
            { default: this.renderEmpty }
          }
        />
      )
    }
    const paginationPosition = paginationProps.position || 'bottom'

    return (
      <div class={classString} {...{ on: $listeners }}>
        {(paginationPosition === 'top' || paginationPosition === 'both') && paginationContent}
        {header && <div class={`${prefixCls}-header`}>{header}</div>}
        <Spin {...{ props: loadingProp }}>
          {childrenContent}
          {children}
        </Spin>
        {footer && <div class={`${prefixCls}-footer`}>{footer}</div>}
        {loadMore || (paginationPosition === 'bottom' || paginationPosition === 'both') && paginationContent}
      </div>
    )
  },
}

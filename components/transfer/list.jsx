import classNames from 'classnames'
// import PureRenderMixin from 'rc-util/lib/PureRenderMixin'
import PropTypes from '../_util/vue-types'
import { isValidElement, initDefaultProps } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'
import getTransitionProps from '../_util/getTransitionProps'
import Checkbox from '../checkbox'
import Search from './search'
import Item from './item'
import triggerEvent from '../_util/triggerEvent'

function noop () {
}

const TransferItem = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  disabled: PropTypes.bool,
}

function isRenderResultPlainObject (result) {
  return result && !isValidElement(result) &&
    Object.prototype.toString.call(result) === '[object Object]'
}

export const TransferListProps = {
  prefixCls: PropTypes.string,
  titleText: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape(TransferItem).loose),
  filter: PropTypes.string,
  filterOption: PropTypes.func,
  checkedKeys: PropTypes.arrayOf(PropTypes.string),
  handleFilter: PropTypes.func,
  handleSelect: PropTypes.func,
  handleSelectAll: PropTypes.func,
  handleClear: PropTypes.func,
  renderItem: PropTypes.func,
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string,
  body: PropTypes.any,
  footer: PropTypes.any,
  lazy: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
}

export default {
  name: 'TransferList',
  mixins: [BaseMixin],
  props: initDefaultProps(TransferListProps, {
    dataSource: [],
    titleText: '',
    showSearch: false,
    renderItem: noop,
    lazy: {},
  }),
  data () {
    this.timer = null
    this.triggerScrollTimer = null
    return {
      mounted: false,
    }
  },
  mounted () {
    this.timer = window.setTimeout(() => {
      this.setState({
        mounted: true,
      })
    }, 0)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    clearTimeout(this.triggerScrollTimer)
  },

  // shouldComponentUpdate (...args: any[]) {
  //   return PureRenderMixin.shouldComponentUpdate.apply(this, args)
  // }
  methods: {
    getCheckStatus (filteredDataSource) {
      const { checkedKeys } = this.$props
      if (checkedKeys.length === 0) {
        return 'none'
      } else if (filteredDataSource.every(item => checkedKeys.indexOf(item.key) >= 0)) {
        return 'all'
      }
      return 'part'
    },
    _handleSelect (selectedItem) {
      const { checkedKeys } = this.$props
      const result = checkedKeys.some((key) => key === selectedItem.key)
      this.handleSelect(selectedItem, !result)
    },
    _handleFilter (e) {
      this.handleSelect(e)
      if (!e.target.value) {
        return
      }
      // Manually trigger scroll event for lazy search bug
      // https://github.com/ant-design/ant-design/issues/5631
      this.triggerScrollTimer = window.setTimeout(() => {
        const listNode = this.$el.querySelectorAll('.ant-transfer-list-content')[0]
        if (listNode) {
          triggerEvent(listNode, 'scroll')
        }
      }, 0)
    },
    _handleClear (e) {
      this.handleClear(e)
    },
    matchFilter (text, item) {
      const { filter, filterOption } = this.$props
      if (filterOption) {
        return filterOption(filter, item)
      }
      return text.indexOf(filter) >= 0
    },
    renderItemHtml (item) {
      const { renderItem = noop } = this.$props
      const renderResult = renderItem(item)
      const isRenderResultPlain = isRenderResultPlainObject(renderResult)
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
      }
    },
    filterNull (arr) {
      return arr.filter((item) => {
        return item !== null
      })
    },
  },

  render () {
    const {
      prefixCls, dataSource, titleText, checkedKeys, lazy,
      body = noop, footer = noop, showSearch, filter,
      searchPlaceholder, notFoundContent, itemUnit, itemsUnit,
    } = this.$props

    // Custom Layout
    const footerDom = footer({ ...this.$props })
    const bodyDom = body({ ...this.$props })

    const listCls = classNames(prefixCls, {
      [`${prefixCls}-with-footer`]: !!footerDom,
    })

    const filteredDataSource = []
    const totalDataSource = []

    const showItems = dataSource.map((item) => {
      const { renderedText, renderedEl } = this.renderItemHtml(item)
      if (filter && filter.trim() && !this.matchFilter(renderedText, item)) {
        return null
      }

      // all show items
      totalDataSource.push(item)
      if (!item.disabled) {
        // response to checkAll items
        filteredDataSource.push(item)
      }

      const checked = checkedKeys.indexOf(item.key) >= 0
      return (
        <Item
          key={item.key}
          item={item}
          lazy={lazy}
          renderedText={renderedText}
          renderedEl={renderedEl}
          checked={checked}
          prefixCls={prefixCls}
          onClick={this._handleSelect}
        />
      )
    })

    const unit = dataSource.length > 1 ? itemsUnit : itemUnit

    const search = showSearch ? (
      <div class={`${prefixCls}-body-search-wrapper`}>
        <Search
          prefixCls={`${prefixCls}-search`}
          onChange={this.handleFilter}
          handleClear={this.handleClear}
          placeholder={searchPlaceholder}
          value={filter}
        />
      </div>
    ) : null
    const transitionName = this.mounted ? `${prefixCls}-content-item-highlight` : ''
    const transitionProps = getTransitionProps(transitionName, {
      leave: noop,
    })
    const listBody = bodyDom || (
      <div
        class={showSearch ? `${prefixCls}-body ${prefixCls}-body-with-search` : `${prefixCls}-body`}
      >
        {search}
        <transition-group
          {...transitionProps}
          tag='div'
          class={`${prefixCls}-content-warp`}
        >
          {showItems && showItems.length && this.filterNull(showItems).length ? (
            <ul
              key='transferList'
              class={`${prefixCls}-content`}
              onScroll={(e) => {
                this.$emit('scroll', e)
              }}
            >
              {showItems}
            </ul>
          ) : null}
        </transition-group>
        <div class={`${prefixCls}-body-not-found`}>
          {notFoundContent}
        </div>
      </div>
    )

    const listFooter = footerDom ? (
      <div class={`${prefixCls}-footer`}>
        {footerDom}
      </div>
    ) : null

    const checkStatus = this.getCheckStatus(filteredDataSource)
    const checkedAll = checkStatus === 'all'
    const checkAllCheckbox = (
      <Checkbox
        ref='checkbox'
        checked={checkedAll}
        indeterminate={checkStatus === 'part'}
        onChange={() => {
          this.handleSelectAll(filteredDataSource, checkedAll)
        }}
      />
    )

    return (
      <div class={listCls}>
        <div class={`${prefixCls}-header`}>
          {checkAllCheckbox}
          <span class={`${prefixCls}-header-selected`}>
            <span>
              {(checkedKeys.length > 0 ? `${checkedKeys.length}/` : '') + totalDataSource.length} {unit}
            </span>
            <span class={`${prefixCls}-header-title`}>
              {titleText}
            </span>
          </span>
        </div>
        {listBody}
        {listFooter}
      </div>
    )
  },
}

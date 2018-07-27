import PropTypes from '../_util/vue-types'
import classNames from 'classnames'
import addEventListener from '../_util/Dom/addEventListener'
import Affix from '../affix'
import getScroll from '../_util/getScroll'
import getRequestAnimationFrame from '../_util/getRequestAnimationFrame'
import { initDefaultProps, getClass, getStyle } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'

function getDefaultContainer () {
  return window
}

function getOffsetTop (element, container) {
  if (!element) {
    return 0
  }

  if (!element.getClientRects().length) {
    return 0
  }

  const rect = element.getBoundingClientRect()

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument.documentElement
      return rect.top - container.clientTop
    }
    return rect.top - container.getBoundingClientRect().top
  }

  return rect.top
}

function easeInOutCubic (t, b, c, d) {
  const cc = c - b
  t /= d / 2
  if (t < 1) {
    return cc / 2 * t * t * t + b
  }
  return cc / 2 * ((t -= 2) * t * t + 2) + b
}

const reqAnimFrame = getRequestAnimationFrame()
const sharpMatcherRegx = /#([^#]+)$/
function scrollTo (href, offsetTop = 0, getContainer, callback = () => { }) {
  const container = getContainer()
  const scrollTop = getScroll(container, true)
  const sharpLinkMatch = sharpMatcherRegx.exec(href)
  if (!sharpLinkMatch) { return }
  const targetElement = document.getElementById(sharpLinkMatch[1])
  if (!targetElement) {
    return
  }
  const eleOffsetTop = getOffsetTop(targetElement, container)
  const targetScrollTop = scrollTop + eleOffsetTop - offsetTop
  const startTime = Date.now()
  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(time, scrollTop, targetScrollTop, 450)
    if (container === window) {
      window.scrollTo(window.pageXOffset, nextScrollTop)
    } else {
      container.scrollTop = nextScrollTop
    }
    if (time < 450) {
      reqAnimFrame(frameFunc)
    } else {
      callback()
    }
  }
  reqAnimFrame(frameFunc)
  history.pushState(null, '', href)
}

export const AnchorProps = {
  prefixCls: PropTypes.string,
  offsetTop: PropTypes.number,
  bounds: PropTypes.number,
  affix: PropTypes.bool,
  showInkInFixed: PropTypes.bool,
  getContainer: PropTypes.func,
}

export default {
  name: 'AAnchor',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(AnchorProps, {
    prefixCls: 'ant-anchor',
    affix: true,
    showInkInFixed: false,
    getContainer: getDefaultContainer,
  }),

  data () {
    this.links = []
    return {
      activeLink: null,
    }
  },
  provide () {
    return {
      antAnchor: {
        registerLink: (link) => {
          if (!this.links.includes(link)) {
            this.links.push(link)
          }
        },
        unregisterLink: (link) => {
          const index = this.links.indexOf(link)
          if (index !== -1) {
            this.links.splice(index, 1)
          }
        },
        $data: this.$data,
        scrollTo: this.handleScrollTo,
      },
    }
  },

  mounted () {
    this.$nextTick(() => {
      const { getContainer } = this
      this.scrollEvent = addEventListener(getContainer(), 'scroll', this.handleScroll)
      this.handleScroll()
    })
  },

  beforeDestroy () {
    if (this.scrollEvent) {
      this.scrollEvent.remove()
    }
  },

  updated () {
    this.$nextTick(() => {
      this.updateInk()
    })
  },
  methods: {
    handleScroll () {
      if (this.animating) {
        return
      }
      const { offsetTop, bounds } = this
      this.setState({
        activeLink: this.getCurrentAnchor(offsetTop, bounds),
      })
    },

    handleScrollTo (link) {
      const { offsetTop, getContainer } = this
      this.animating = true
      this.setState({ activeLink: link })
      scrollTo(link, offsetTop, getContainer, () => {
        this.animating = false
      })
    },

    getCurrentAnchor (offsetTop = 0, bounds = 5) {
      const activeLink = ''
      if (typeof document === 'undefined') {
        return activeLink
      }

      const linkSections = []
      const { getContainer } = this
      const container = getContainer()
      this.links.forEach(link => {
        const sharpLinkMatch = sharpMatcherRegx.exec(link.toString())
        if (!sharpLinkMatch) { return }
        const target = document.getElementById(sharpLinkMatch[1])
        if (target) {
          const top = getOffsetTop(target, container)
          if (top < offsetTop + bounds) {
            linkSections.push({
              link,
              top,
            })
          }
        }
      })

      if (linkSections.length) {
        const maxSection = linkSections.reduce((prev, curr) => curr.top > prev.top ? curr : prev)
        return maxSection.link
      }
      return ''
    },

    updateInk () {
      if (typeof document === 'undefined') {
        return
      }
      const { prefixCls } = this
      const linkNode = this.$el.getElementsByClassName(`${prefixCls}-link-title-active`)[0]
      if (linkNode) {
        this.$refs.linkNode.style.top = `${(linkNode).offsetTop + linkNode.clientHeight / 2 - 4.5}px`
      }
    },
  },

  render () {
    const {
      prefixCls,
      offsetTop,
      affix,
      showInkInFixed,
      activeLink,
      $slots,
    } = this

    const inkClass = classNames(`${prefixCls}-ink-ball`, {
      visible: activeLink,
    })

    const wrapperClass = classNames(getClass(this), `${prefixCls}-wrapper`)

    const anchorClass = classNames(prefixCls, {
      'fixed': !affix && !showInkInFixed,
    })

    const wrapperStyle = {
      maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh',
      // ...getStyle(this, true),
    }

    const anchorContent = (
      <div
        class={wrapperClass}
        style={wrapperStyle}
      >
        <div class={anchorClass}>
          <div class={`${prefixCls}-ink`} >
            <span class={inkClass} ref='linkNode' />
          </div>
          {$slots.default}
        </div>
      </div>
    )

    return !affix ? anchorContent : (
      <Affix offsetTop={offsetTop}>
        {anchorContent}
      </Affix>
    )
  },
}

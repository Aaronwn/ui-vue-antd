import classNames from 'classnames'
import PropTypes from '../../../_util/vue-types'
import addEventListener from '../../../_util/Dom/addEventListener'
import warning from '../../../_util/warning'
import { initDefaultProps } from '../../../_util/props-util'
import Steps from './Steps'
import Marks from './Marks'
import Handle from '../Handle'
import * as utils from '../utils'

function noop () {}

export default function createSlider (Component) {
  // const displayName = `ComponentEnhancer(${Component.displayName})`
  const propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    marks: PropTypes.object,
    included: PropTypes.bool,
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool,
    handle: PropTypes.func,
    dots: PropTypes.bool,
    vertical: PropTypes.bool,
    minimumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
    maximumTrackStyle: PropTypes.object, // just for compatibility, will be deperecate
    handleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    trackStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    railStyle: PropTypes.object,
    dotStyle: PropTypes.object,
    activeDotStyle: PropTypes.object,
    autoFocus: PropTypes.bool,
  }
  return {
    name: 'createSlider',
    mixins: [Component],
    model: {
      prop: 'value',
      event: 'change',
    },
    props: initDefaultProps(propTypes, {
      prefixCls: 'rc-slider',
      min: 0,
      max: 100,
      step: 1,
      marks: {},
      handle (h, { index, ref, className, style, ...restProps }) {
        delete restProps.dragging
        const handleProps = {
          props: {
            ...restProps,
          },
          class: className,
          style,
          key: index,
          ref,
        }
        return <Handle {...handleProps} />
      },
      included: true,
      disabled: false,
      dots: false,
      vertical: false,
      trackStyle: [{}],
      handleStyle: [{}],
      railStyle: {},
      dotStyle: {},
      activeDotStyle: {},
    }),
    data () {
      if (process.env.NODE_ENV !== 'production') {
        const { step, max, min } = this
        warning(
          step && Math.floor(step) === step ? (max - min) % step === 0 : true,
          'Slider[max] - Slider[min] (%s) should be a multiple of Slider[step] (%s)',
          max - min,
          step
        )
      }
      return {}
    },
    beforeDestroy () {
      this.$nextTick(() => {
        // if (super.componentWillUnmount) super.componentWillUnmount()
        this.removeDocumentEvents()
      })
    },
    mounted () {
      this.$nextTick(() => {
        // Snapshot testing cannot handle refs, so be sure to null-check this.
        this.document = this.$refs.sliderRef && this.$refs.sliderRef.ownerDocument
        // this.setHandleRefs()
      })
    },
    computed: {
      handlesRefs () {
        const handlesRefs = []
        for (const [k, v] of Object.entries(this.$refs)) {
          const matchs = k.match(/handleRefs_(\d+$)/)
          if (matchs) {
            handlesRefs[+matchs[1]] = v
          }
        }
        return handlesRefs
      },
    },
    methods: {
      onMouseDown (e) {
        if (e.button !== 0) { return }
        const isVertical = this.vertical
        let position = utils.getMousePosition(isVertical, e)
        if (!utils.isEventFromHandle(e, this.handlesRefs)) {
          this.dragOffset = 0
        } else {
          const handlePosition = utils.getHandleCenterPosition(isVertical, e.target)
          this.dragOffset = position - handlePosition
          position = handlePosition
        }
        this.removeDocumentEvents()
        this.onStart(position)
        this.addDocumentMouseEvents()
      },
      onTouchStart (e) {
        if (utils.isNotTouchEvent(e)) return

        const isVertical = this.vertical
        let position = utils.getTouchPosition(isVertical, e)
        if (!utils.isEventFromHandle(e, this.handlesRefs)) {
          this.dragOffset = 0
        } else {
          const handlePosition = utils.getHandleCenterPosition(isVertical, e.target)
          this.dragOffset = position - handlePosition
          position = handlePosition
        }
        this.onStart(position)
        this.addDocumentTouchEvents()
        utils.pauseEvent(e)
      },
      onFocus (e) {
        const { vertical } = this
        if (utils.isEventFromHandle(e, this.handlesRefs)) {
          const handlePosition = utils.getHandleCenterPosition(vertical, e.target)
          this.dragOffset = 0
          this.onStart(handlePosition)
          utils.pauseEvent(e)
          this.$emit('focus', e)
        }
      },
      onBlur (e) {
        this.onEnd(e)
        this.$emit('blur', e)
      },
      addDocumentTouchEvents () {
        // just work for Chrome iOS Safari and Android Browser
        this.onTouchMoveListener = addEventListener(this.document, 'touchmove', this.onTouchMove)
        this.onTouchUpListener = addEventListener(this.document, 'touchend', this.onEnd)
      },
      addDocumentMouseEvents () {
        this.onMouseMoveListener = addEventListener(this.document, 'mousemove', this.onMouseMove)
        this.onMouseUpListener = addEventListener(this.document, 'mouseup', this.onEnd)
      },
      removeDocumentEvents () {
        /* eslint-disable no-unused-expressions */
        this.onTouchMoveListener && this.onTouchMoveListener.remove()
        this.onTouchUpListener && this.onTouchUpListener.remove()

        this.onMouseMoveListener && this.onMouseMoveListener.remove()
        this.onMouseUpListener && this.onMouseUpListener.remove()
        /* eslint-enable no-unused-expressions */
      },
      onMouseUp () {
        // if (this.$children && this.$children[this.prevMovedHandleIndex]) {
        //   const handleCom = utils.getComponentProps(this.$children[this.prevMovedHandleIndex], 'clickFocus')
        //   console.log('handleCom', handleCom)
        //   if (handleCom) {
        //     // handleCom.clickFocus()
        //   }

        // }
        if (this.handlesRefs[this.prevMovedHandleIndex]) {
          this.handlesRefs[this.prevMovedHandleIndex].clickFocus()
        }
      },
      onMouseMove (e) {
        if (!this.$refs.sliderRef) {
          this.onEnd()
          return
        }
        const position = utils.getMousePosition(this.vertical, e)
        this.onMove(e, position - this.dragOffset)
      },
      onTouchMove (e) {
        if (utils.isNotTouchEvent(e) || !this.$refs.sliderRef) {
          this.onEnd()
          return
        }

        const position = utils.getTouchPosition(this.vertical, e)
        this.onMove(e, position - this.dragOffset)
      },
      onKeyDown (e) {
        if (this.$refs.sliderRef && utils.isEventFromHandle(e, this.handlesRefs)) {
          this.onKeyboard(e)
        }
      },
      focus () {
        if (!this.disabled) {
          this.handlesRefs[0].focus()
        }
      },
      blur () {
        if (!this.disabled) {
          this.handlesRefs[0].blur()
        }
      },
      getSliderStart () {
        const slider = this.$refs.sliderRef
        const rect = slider.getBoundingClientRect()

        return this.vertical ? rect.top : rect.left
      },
      getSliderLength () {
        const slider = this.$refs.sliderRef
        if (!slider) {
          return 0
        }

        const coords = slider.getBoundingClientRect()
        return this.vertical ? coords.height : coords.width
      },
      calcValue (offset) {
        const { vertical, min, max } = this
        const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength())
        const value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min
        return value
      },
      calcValueByPos (position) {
        const pixelOffset = position - this.getSliderStart()
        const nextValue = this.trimAlignValue(this.calcValue(pixelOffset))
        return nextValue
      },
      calcOffset (value) {
        const { min, max } = this
        const ratio = (value - min) / (max - min)
        return ratio * 100
      },
      onClickMarkLabel (e, value) {
        e.stopPropagation()
        this.onChange({ value })
        // this.$emit('change', value)
      },
    },
    render (h) {
      const {
        prefixCls,
        marks,
        dots,
        step,
        included,
        disabled,
        vertical,
        min,
        max,
        maximumTrackStyle,
        railStyle,
        dotStyle,
        activeDotStyle,
      } = this
      const { tracks, handles } = this.renderSlider(h)

      const sliderClassName = classNames(prefixCls, {
        [`${prefixCls}-with-marks`]: Object.keys(marks).length,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-vertical`]: vertical,
      })
      const markProps = {
        props: {
          vertical,
          marks,
          included,
          lowerBound: this.getLowerBound(),
          upperBound: this.getUpperBound(),
          max,
          min,
          className: `${prefixCls}-mark`,
        },
        on: {
          clickLabel: disabled ? noop : this.onClickMarkLabel,
        },
      }
      return (
        <div
          ref='sliderRef'
          class={sliderClassName}
          onTouchstart={disabled ? noop : this.onTouchStart}
          onMousedown={disabled ? noop : this.onMouseDown}
          onMouseup={disabled ? noop : this.onMouseUp}
          onKeydown={disabled ? noop : this.onKeyDown}
          onFocus={disabled ? noop : this.onFocus}
          onBlur={disabled ? noop : this.onBlur}
        >
          <div
            class={`${prefixCls}-rail`}
            style={{
              ...maximumTrackStyle,
              ...railStyle,
            }}
          />
          {tracks}
          <Steps
            prefixCls={prefixCls}
            vertical={vertical}
            marks={marks}
            dots={dots}
            step={step}
            included={included}
            lowerBound={this.getLowerBound()}
            upperBound={this.getUpperBound()}
            max={max}
            min={min}
            dotStyle={dotStyle}
            activeDotStyle={activeDotStyle}
          />
          {handles}
          <Marks
            {...markProps}
          />
          {this.$slots.default}
        </div>
      )
    },
  }
}

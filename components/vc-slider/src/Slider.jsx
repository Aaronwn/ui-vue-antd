import PropTypes from '../../_util/vue-types'
import warning from '../../_util/warning'
import BaseMixin from '../../_util/BaseMixin'
import { hasProp } from '../../_util/props-util'
import Track from './common/Track'
import createSlider from './common/createSlider'
import * as utils from './utils'

const Slider = {
  name: 'Slider',
  mixins: [BaseMixin],
  props: {
    defaultValue: PropTypes.number,
    value: PropTypes.number,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    tabIndex: PropTypes.number,
  },
  data () {
    const defaultValue = this.defaultValue !== undefined
      ? this.defaultValue : this.min
    const value = this.value !== undefined
      ? this.value : defaultValue

    if (process.env.NODE_ENV !== 'production') {
      warning(
        !hasProp(this, 'minimumTrackStyle'),
        'minimumTrackStyle will be deprecate, please use trackStyle instead.'
      )
      warning(
        !hasProp(this, 'maximumTrackStyle'),
        'maximumTrackStyle will be deprecate, please use railStyle instead.'
      )
    }
    return {
      sValue: this.trimAlignValue(value),
      dragging: false,
    }
  },
  mounted () {
    this.$nextTick(() => {
      const { autoFocus, disabled } = this
      if (autoFocus && !disabled) {
        this.focus()
      }
    })
  },
  watch: {
    value: {
      handler (val) {
        const { min, max } = this
        this.setChangeValue(val, min, max)
      },
      deep: true,
    },
    min (val) {
      const { sValue, max } = this
      this.setChangeValue(sValue, val, max)
    },
    max (val) {
      const { sValue, min } = this
      this.setChangeValue(sValue, min, val)
    },
  },
  methods: {
    setChangeValue (value, min, max) {
      const minAmaxProps = {
        min,
        max,
      }
      const newValue = value !== undefined
        ? value : this.sValue
      const nextValue = this.trimAlignValue(newValue, minAmaxProps)
      if (nextValue === this.sValue) return

      this.setState({ sValue: nextValue })
      if (utils.isValueOutOfRange(newValue, minAmaxProps)) {
        this.$emit('change', nextValue)
      }
    },
    onChange (state) {
      const isNotControlled = !hasProp(this, 'value')
      if (isNotControlled) {
        this.setState(state)
      }

      const changedValue = state.sValue
      this.$emit('change', changedValue)
    },
    onStart (position) {
      this.setState({ dragging: true })
      const { sValue } = this
      this.$emit('beforeChange', sValue)

      const value = this.calcValueByPos(position)

      this.startValue = value
      this.startPosition = position
      if (value === sValue) return

      this.prevMovedHandleIndex = 0

      this.onChange({ sValue: value })
    },
    onEnd () {
      this.setState({ dragging: false })
      this.removeDocumentEvents()
      this.$emit('afterChange', this.sValue)
    },
    onMove (e, position) {
      utils.pauseEvent(e)
      const { sValue } = this
      const value = this.calcValueByPos(position)
      if (value === sValue) return

      this.onChange({ sValue: value })
    },
    onKeyboard (e) {
      const valueMutator = utils.getKeyboardValueMutator(e)

      if (valueMutator) {
        utils.pauseEvent(e)
        const { sValue } = this
        const mutatedValue = valueMutator(sValue, this.$props)
        const value = this.trimAlignValue(mutatedValue)
        if (value === sValue) return

        this.onChange({ sValue: value })
      }
    },
    getLowerBound () {
      return this.min
    },
    getUpperBound () {
      return this.sValue
    },
    trimAlignValue (v, nextProps = {}) {
      const mergedProps = { ...this.$props, ...nextProps }
      const val = utils.ensureValueInRange(v, mergedProps)
      return utils.ensureValuePrecision(val, mergedProps)
    },
    getTrack ({ prefixCls, vertical, included, offset, minimumTrackStyle, _trackStyle }) {
      return (
        <Track
          class={`${prefixCls}-track`}
          vertical={vertical}
          included={included}
          offset={0}
          length={offset}
          style={{
            ...minimumTrackStyle,
            ..._trackStyle,
          }}
        />
      )
    },
    renderSlider () {
      const {
        prefixCls,
        vertical,
        included,
        disabled,
        minimumTrackStyle,
        trackStyle,
        handleStyle,
        tabIndex,
        min,
        max,
        handle: handleGenerator,
      } = this
      const { sValue, dragging } = this
      const offset = this.calcOffset(sValue)
      const handle = handleGenerator(this.$createElement, {
        prefixCls,
        vertical,
        offset,
        value: sValue,
        dragging,
        disabled,
        min,
        max,
        index: 0,
        tabIndex,
        style: handleStyle[0] || handleStyle,
        ref: 'handleRefs_0',
        handleFocus: this.onFocus,
        handleBlur: this.onBlur,
      })

      const _trackStyle = trackStyle[0] || trackStyle
      return {
        tracks: this.getTrack({ prefixCls, vertical, included, offset, minimumTrackStyle, _trackStyle }),
        handles: handle,
      }
    },
  },
}

export default createSlider(Slider)

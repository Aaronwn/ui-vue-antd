import classNames from 'classnames'
import { isValidElement } from '../../../_util/props-util'

const Marks = {
  functional: true,
  render (createElement, context) {
    const {
      className,
      vertical,
      marks,
      included,
      upperBound,
      lowerBound,
      max, min,
    } = context.props
    // antd未开发完成
    // const { clickLabel } = context.listeners
    const marksKeys = Object.keys(marks)
    const marksCount = marksKeys.length
    const unit = marksCount > 1 ? 100 / (marksCount - 1) : 100
    const markWidth = unit * 0.9

    const range = max - min
    const elements = marksKeys.map(parseFloat).sort((a, b) => a - b).map(point => {
      const markPoint = marks[point]
      const markPointIsObject = typeof markPoint === 'object' &&
              !isValidElement(markPoint)
      const markLabel = markPointIsObject ? markPoint.label : markPoint
      if (!markLabel && markLabel !== 0) {
        return null
      }

      const isActive = (!included && point === upperBound) ||
              (included && point <= upperBound && point >= lowerBound)
      const markClassName = classNames({
        [`${className}-text`]: true,
        [`${className}-text-active`]: isActive,
      })

      const bottomStyle = {
        marginBottom: '-50%',
        bottom: `${(point - min) / range * 100}%`,
      }

      const leftStyle = {
        width: `${markWidth}%`,
        marginLeft: `${-markWidth / 2}%`,
        left: `${(point - min) / range * 100}%`,
      }

      const style = vertical ? bottomStyle : leftStyle
      const markStyle = markPointIsObject
        ? { ...style, ...markPoint.style } : style
      return (
        <span
          class={markClassName}
          style={markStyle}
          key={point}
          // onMousedown={(e) => clickLabel(e, point)}
          // onTouchstart={(e) => clickLabel(e, point)}
        >
          {markLabel}
        </span>
      )
    })

    return <div class={className}>{elements}</div>
  },
}

export default Marks

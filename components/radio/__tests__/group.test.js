import { mount } from '@vue/test-utils'
import { asyncExpect } from '@/tests/utils'
import Radio from '../Radio'
import RadioGroup from '../Group'

describe('Radio', () => {
  function createRadioGroup (props, listeners = {}) {
    return {
      props: ['value'],
      render () {
        const groupProps = { ...props }
        if (this.value !== undefined) {
          groupProps.value = this.value
        }
        return (
          <RadioGroup
            ref='radioGroup'
            {...{ props: groupProps, on: listeners }}
          >
            <Radio value='A'>A</Radio>
            <Radio value='B'>B</Radio>
            <Radio value='C'>C</Radio>
          </RadioGroup>
        )
      },
    }
  }

  function createRadioGroupByOption () {
    const options = [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
    ]
    return {
      render () {
        return (
          <RadioGroup
            options={options}
          />
        )
      },
    }
  }

  it('responses hover events', () => {
    const onMouseEnter = jest.fn()
    const onMouseLeave = jest.fn()

    const wrapper = mount({
      render () {
        return (
          <RadioGroup
            onMouseenter={onMouseEnter}
            onMouseleave={onMouseLeave}
          >
            <Radio />
          </RadioGroup>
        )
      },
    })

    wrapper.trigger('mouseenter')
    expect(onMouseEnter).toHaveBeenCalled()

    wrapper.trigger('mouseleave')
    expect(onMouseLeave).toHaveBeenCalled()
  })

  it('fire change events when value changes', async () => {
    const onChange = jest.fn()
    const props = {}
    const wrapper = mount(
      createRadioGroup(props, {
        change: onChange,
      }),
      { sync: false }
    )
    let radios = null
    await asyncExpect(() => {
      radios = wrapper.findAll('input')
      // uncontrolled component
      wrapper.vm.$refs.radioGroup.stateValue = 'B'
      // wrapper.setData({ value: 'B' })
      radios.at(0).trigger('change')
      expect(onChange.mock.calls.length).toBe(1)
    })
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot()
    })
    await asyncExpect(() => {
      // controlled component
      wrapper.setProps({ value: 'A' })
      radios.at(1).trigger('change')
      expect(onChange.mock.calls.length).toBe(2)
    })
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  // it('won\'t fire change events when value not changes', async () => {
  //   const onChange = jest.fn()

  //   const wrapper = mount(
  //     createRadioGroup({}, {
  //       change: onChange,
  //     }),
  //     { sync: false }
  //   )
  //   const radios = wrapper.findAll('input')
  //   await asyncExpect(() => {
  //     // uncontrolled component
  //     wrapper.vm.$refs.radioGroup.stateValue = 'B'
  //     radios.at(1).trigger('change')
  //     expect(onChange.mock.calls.length).toBe(0)
  //   })

  //   await asyncExpect(() => {

  //   }, 0)

  //   // // controlled component
  //   // wrapper.setProps({ value: 'A' })
  //   // radios.at(0).trigger('change')
  //   // expect(onChange.mock.calls.length).toBe(0)
  // })

  it('optional should correct render', () => {
    const wrapper = mount(
      createRadioGroupByOption()
    )
    const radios = wrapper.findAll('input')

    expect(radios.length).toBe(3)
  })

  it('all children should have a name property', () => {
    const GROUP_NAME = 'radiogroup'
    const wrapper = mount(
      createRadioGroup({ name: GROUP_NAME })
    )
    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.findAll('input[type="radio"]').wrappers.forEach((el) => {
      expect(el.element.name).toEqual(GROUP_NAME)
    }))
  })
})

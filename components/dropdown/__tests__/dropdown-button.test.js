import { mount } from '@vue/test-utils'
import Dropdown from '..'

describe('DropdownButton', () => {
  it('pass appropriate props to Dropdown', () => {
    const props = {
      align: {
        offset: [10, 20],
      },
      disabled: false,
      trigger: ['hover'],
      visible: true,
    }

    const wrapper = mount(Dropdown.Button, {
      propsData: props,
      listeners: {
        visibleChange: () => {},
      },
    })
    const dropdownProps = wrapper.find({ name: 'ADropdown' }).props()

    Object.keys(props).forEach((key) => {
      expect(dropdownProps[key]).toBe(props[key])
    })
  })

  it('don\'t pass visible to Dropdown if it\'s not exits', () => {
    const wrapper = mount(Dropdown.Button)
    const dropdownProps = wrapper.find({ name: 'ADropdown' }).props()

    expect('visible' in dropdownProps).toBe(false)
  })
})

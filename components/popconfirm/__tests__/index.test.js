import { mount } from '@vue/test-utils'
import { asyncExpect } from '@/tests/utils'
import Popconfirm from '..'
function $$ (className) {
  return document.body.querySelectorAll(className)
}
describe('Popconfirm', () => {
  it('should popup Popconfirm dialog', async () => {
    const onVisibleChange = jest.fn()

    const wrapper = mount(
      {
        render () {
          return <Popconfirm
            title={<span class='popconfirm-test'>Are you sure delete this task?</span>}
            okText='Yes'
            cancelText='No'
            mouseEnterDelay={0}
            mouseLeaveDelay={0}
            onVisibleChange={onVisibleChange}
          >
            <span>Delete</span>
          </Popconfirm>
        },
      }, { sync: false, attachToDocument: true })
    let triggerNode = null
    await asyncExpect(() => {
      triggerNode = wrapper.findAll('span').at(0)
      triggerNode.trigger('click')
    })
    await asyncExpect(() => {
      expect(onVisibleChange).toBeCalledWith(true)
      expect($$('.popconfirm-test').length).toBe(1)
      triggerNode.trigger('click')
    }, 1000)
    await asyncExpect(() => {
      expect(onVisibleChange).toBeCalledWith(false)
    })
  })

  it('should show overlay when trigger is clicked', async () => {
    const popconfirm = mount({
      render () {
        return <Popconfirm ref='popconfirm' title='code'>
          <span>show me your code</span>
        </Popconfirm>
      },
    }, { sync: false })

    await asyncExpect(() => {
      expect(popconfirm.vm.$refs.popconfirm.getPopupDomNode()).toBe(null)

      popconfirm.find('span').trigger('click')
    }, 1000)
    await asyncExpect(() => {
      const popup = popconfirm.vm.$refs.popconfirm.getPopupDomNode()
      expect(popup).not.toBe(null)
      expect(popup.className).toContain('ant-popover-placement-top')
      expect(popup.innerHTML).toMatchSnapshot()
    }, 1000)
  })
})

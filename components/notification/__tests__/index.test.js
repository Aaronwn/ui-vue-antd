import { asyncExpect } from '@/tests/utils'
import notification from '..'

describe('notification', () => {
  beforeEach(() => {
    document.body.outerHTML = ''
  })

  afterEach(() => {
    notification.destroy()
  })

  it('should be able to hide manually', async () => {
    notification.open({
      message: 'Notification Title',
      duration: 0,
      key: '1',
    })
    await asyncExpect(() => {
      notification.open({
        message: 'Notification Title',
        duration: 0,
        key: '2',
      })
    })
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-notification-notice').length).toBe(2)
      notification.close('1')
    }, 0)
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-notification-notice').length).toBe(1)
      notification.close('2')
    }, 0)
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-notification-notice').length).toBe(0)
    }, 0)
  })

  it('should be able to destroy globally', async () => {
    notification.open({
      message: 'Notification Title',
      duration: 0,
    })
    await asyncExpect(() => {
      notification.open({
        message: 'Notification Title',
        duration: 0,
      })
    })
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-notification').length).toBe(1)
      expect(document.querySelectorAll('.ant-notification-notice').length).toBe(2)
      notification.destroy()
    }, 0)
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-notification').length).toBe(0)
      expect(document.querySelectorAll('.ant-notification-notice').length).toBe(0)
    }, 0)
  })

  it('should be able to destroy after config', () => {
    notification.config({
      bottom: 100,
    })
    notification.destroy()
  })

  it('should be able to open with icon', (done) => {
    const openNotificationWithIcon = async (type) => {
      const iconPrefix = '.ant-notification-notice-icon'
      notification[type]({
        message: 'Notification Title',
        duration: 0,
        description: 'This is the content of the notification.',
      })
      await asyncExpect(() => {
        expect(document.querySelectorAll(`${iconPrefix}-${type}`).length).toBe(1)
      }, 0)
    };
    ['success', 'info', 'warning', 'error'].forEach((type) => {
      openNotificationWithIcon(type)
    })
    done()
  })
})

import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Upload from '..'
import { errorRequest, successRequest } from './requests'
import PropsTypes from '../../_util/vue-types'
import { UploadListProps } from '../interface'

UploadListProps.items = PropsTypes.any

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout))
const fileList = [{
  uid: -1,
  name: 'xxx.png',
  status: 'done',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
}, {
  uid: -2,
  name: 'yyy.png',
  status: 'done',
  url: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}]

describe('Upload List', () => {
  // https://github.com/ant-design/ant-design/issues/4653
  it('should use file.thumbUrl for <img /> in priority', (done) => {
    const props = {
      propsData: {
        defaultFileList: fileList,
        listType: 'picture',
        action: '',
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    Vue.nextTick(() => {
      fileList.forEach((file, i) => {
        const linkNode = wrapper.findAll('.ant-upload-list-item-thumbnail').at(i)
        const imgNode = wrapper.findAll('.ant-upload-list-item-thumbnail img').at(i)
        expect(linkNode.attributes().href).toBe(file.url)
        expect(imgNode.attributes().src).toBe(file.thumbUrl)
      })
      done()
    })
  })

  // https://github.com/ant-design/ant-design/issues/7269
  it('should remove correct item when uid is 0', (done) => {
    const list = [{
      uid: 0,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
    }, {
      uid: 1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
    }]
    const props = {
      propsData: {
        defaultFileList: list,
        action: '',
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    setTimeout(async () => {
      expect(wrapper.findAll('.ant-upload-list-item').length).toBe(2)
      wrapper.findAll('.ant-upload-list-item').at(0).find('.anticon-cross').trigger('click')
      await delay(400)
      // wrapper.update();
      expect(wrapper.findAll('.ant-upload-list-item').length).toBe(1)
      done()
    }, 0)
  })

  it('should be uploading when upload a file', (done) => {
    const props = {
      propsData: {
        action: 'http://jsonplaceholder.typicode.com/posts/',
        customRequest: successRequest,
      },
      listeners: {
        change: ({ file }) => {
          if (file.status === 'uploading') {
            expect(wrapper.html()).toMatchSnapshot()
            done()
          }
          if (file.status === 'done') {
            expect(wrapper.html()).toMatchSnapshot()
            done()
          }
        },
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      })
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      })
    }, 0)
  })

  it('handle error', (done) => {
    const props = {
      propsData: {
        action: 'http://jsonplaceholder.typicode.com/posts/',
        customRequest: errorRequest,
      },
      listeners: {
        change: ({ file }) => {
          if (file.status !== 'uploading') {
            expect(wrapper.html()).toMatchSnapshot()
            done()
          }
        },
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      })
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      })
    }, 0)
  })

  it('does concat filelist when beforeUpload returns false', (done) => {
    const handleChange = jest.fn()
    const props = {
      propsData: {
        action: 'http://jsonplaceholder.typicode.com/posts/',
        listType: 'picture',
        defaultFileList: fileList,
        beforeUpload: () => false,
      },
      listeners: {
        change: handleChange,
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)

    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      })
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      })
      Vue.nextTick(() => {
        expect(wrapper.vm.sFileList.length).toBe(fileList.length + 1)
        expect(handleChange.mock.calls[0][0].fileList).toHaveLength(3)
        done()
      })
    }, 0)
  })

  // https://github.com/ant-design/ant-design/issues/7762
  // it('work with form validation', (done) => {
  //   let errors
  //   const TestForm = {
  //     methods: {
  //       handleSubmit () {
  //         const { validateFields } = this.form
  //         validateFields((err) => {
  //           errors = err
  //         })
  //       },
  //     },
  //     render () {
  //       const { getFieldDecorator } = this.form

  //       return (
  //         <Form onSubmit={this.handleSubmit}>
  //           <Form.Item>
  //             {getFieldDecorator('file', {
  //               valuePropname: 'fileList',
  //               getValueFromEvent: e => e.fileList,
  //               rules: [
  //                 {
  //                   required: true,
  //                   validator: (rule, value, callback) => {
  //                     if (!value || value.length === 0) {
  //                       callback('file required')
  //                     } else {
  //                       callback()
  //                     }
  //                   },
  //                 },
  //               ],
  //             })(
  //               <Upload
  //                 beforeUpload={() => false}
  //               >
  //                 <button>upload</button>
  //               </Upload>
  //             )}
  //           </Form.Item>
  //         </Form>
  //       )
  //     },
  //   }

  //   const App = Form.create()(TestForm)
  //   console.dir(App)
  //   const wrapper = mount(() => {
  //     return <App />
  //   })
  //   setTimeout(async () => {
  //     wrapper.find(Form).trigger('submit')
  //     expect(errors.file.errors).toEqual([{ message: 'file required', field: 'file' }])

  //     const mockFile = new File(['foo'], 'foo.png', {
  //       type: 'image/png',
  //     })
  //     wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
  //       target: {
  //         files: [mockFile],
  //       },
  //     })
  //     wrapper.find(Form).trigger('submit')
  //     expect(errors).toBeNull()
  //     done()
  //   }, 0)
  // })

  it('should support onPreview', (done) => {
    const handlePreview = jest.fn()
    const props = {
      propsData: {
        defaultFileList: fileList,
        listType: 'picture-card',
        action: '',
      },
      listeners: {
        preview: handlePreview,
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    setTimeout(async () => {
      wrapper.findAll('.anticon-eye-o').at(0).trigger('click')
      expect(handlePreview).toBeCalledWith(fileList[0])
      wrapper.findAll('.anticon-eye-o').at(1).trigger('click')
      expect(handlePreview).toBeCalledWith(fileList[1])
      done()
    }, 0)
  })

  it('should support onRemove', (done) => {
    const handleRemove = jest.fn()
    const handleChange = jest.fn()
    const props = {
      propsData: {
        defaultFileList: fileList,
        listType: 'picture-card',
        action: '',
      },
      listeners: {
        remove: handleRemove,
        change: handleChange,
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    jest.setTimeout(300000)
    setTimeout(async () => {
      wrapper.findAll('.anticon-delete').at(0).trigger('click')
      expect(handleRemove).toBeCalledWith(fileList[0])
      wrapper.findAll('.anticon-delete').at(1).trigger('click')
      expect(handleRemove).toBeCalledWith(fileList[1])
      await delay(0)
      expect(handleChange.mock.calls.length).toBe(2)
      done()
    }, 0)
  })

  it('should generate thumbUrl from file', (done) => {
    const handlePreview = jest.fn()
    const newFileList = [...fileList]
    const newFile = { ...fileList[0], uid: -3, originFileObj: new File([], 'xxx.png') }
    delete newFile.thumbUrl
    newFileList.push(newFile)
    const props = {
      propsData: {
        defaultFileList: newFileList,
        listType: 'picture-card',
        action: '',
      },
      listeners: {
        preview: handlePreview,
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    setTimeout(async () => {
      const newFile = { ...fileList[2], uid: -4, originFileObj: new File([], 'xxx.png') }
      wrapper.setProps({
        defaultFileList: newFileList.push(newFile),
      })
      await delay(200)
      expect(wrapper.vm.sFileList[2].thumbUrl).not.toBeFalsy()
      done()
    }, 1000)
  })

  it('should non-image format file preview', (done) => {
    const list = [
      {
        name: 'not-image',
        status: 'done',
        uid: -3,
        url: 'https://cdn.xxx.com/aaa.zip',
        thumbUrl: 'data:application/zip;base64,UEsDBAoAAAAAADYZYkwAAAAAAAAAAAAAAAAdAAk',
        originFileObj: new File([], 'aaa.zip'),
      },
      {
        name: 'image',
        status: 'done',
        uid: -4,
        url: 'https://cdn.xxx.com/aaa',
      },
      {
        name: 'not-image',
        status: 'done',
        uid: -5,
        url: 'https://cdn.xxx.com/aaa.xx',
      },
      {
        name: 'not-image',
        status: 'done',
        uid: -6,
        url: 'https://cdn.xxx.com/aaa.png/xx.xx',
      },
      {
        name: 'image',
        status: 'done',
        uid: -7,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png',
      },
      {
        name: 'image',
        status: 'done',
        uid: -8,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png',
        thumbUrl: 'data:image/png;base64,UEsDBAoAAAAAADYZYkwAAAAAAAAAAAAAAAAdAAk',
      },
      {
        name: 'image',
        status: 'done',
        uid: -9,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png?query=123',
      },
      {
        name: 'image',
        status: 'done',
        uid: -10,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png#anchor',
      },
      {
        name: 'image',
        status: 'done',
        uid: -11,
        url: 'https://cdn.xxx.com/xx.xx/aaa.png?query=some.query.with.dot',
      },
    ]
    const props = {
      propsData: {
        defaultFileList: list,
        listType: 'picture',
        action: '',
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    Vue.nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot()
      done()
    })
  })
})

import Upload from '../index'

export default {
  data () {
    return {
      destroyed: false,
    }
  },
  methods: {
    destroy () {
      this.destroyed = true
    },
  },
  render () {
    if (this.destroyed) {
      return null
    }
    const propsObj = {
      action: '/upload.do',
      data: { a: 1, b: 2 },
      headers: {
        Authorization: 'xxxxxxx',
      },
      multiple: true,
      beforeUpload (file) {
        console.log('beforeUpload', file.name)
      },
    }
    const propsEvent = {
      start: (file) => {
        console.log('onStart', file.name)
        // this.refs.inner.abort(file);
      },
      success (file) {
        console.log('onSuccess', file)
      },
      progress (step, file) {
        console.log('onProgress', Math.round(step.percent), file.name)
      },
      error (err) {
        console.log('onError', err)
      },
    }
    const uploaderProps = {
      props: {
        ...propsObj,
      },
      on: {
        ...propsEvent,
      },
      ref: 'inner',
    }
    const uploaderProps1 = {
      props: {
        ...propsObj,
        componentTag: 'div',
      },
      on: {
        ...propsEvent,
      },
    }
    const style = `
        .rc-upload-disabled {
           opacity:0.5;
        `
    return (
      <div
        style={{
          margin: '100px',
        }}
      >
        <h2>固定位置</h2>

        <style>
          {style}
        </style>

        <div>
          <Upload {...uploaderProps}><a>开始上传</a></Upload>
        </div>

        <h2>滚动</h2>

        <div
          style={{
            height: '200px',
            overflow: 'auto',
            border: '1px solid red',
          }}
        >
          <div
            style={{
              height: '500px',
            }}
          >
            <Upload {...uploaderProps1} style={{ display: 'inline-block' }}>
              <a>开始上传2</a></Upload>
          </div>
        </div>

        <button onClick={this.destroy}>destroy</button>
      </div>
    )
  },
}

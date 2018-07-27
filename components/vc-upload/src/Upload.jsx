import PropTypes from '../../_util/vue-types'
import { initDefaultProps } from '../../_util/props-util'
import BaseMixin from '../../_util/BaseMixin'
import AjaxUpload from './AjaxUploader'
import IframeUpload from './IframeUploader'

function empty () {
}

const uploadProps = {
  componentTag: PropTypes.string,
  prefixCls: PropTypes.string,
  action: PropTypes.string,
  name: PropTypes.string,
  multipart: PropTypes.bool,
  // onError: PropTypes.func,
  // onSuccess: PropTypes.func,
  // onProgress: PropTypes.func,
  // onStart: PropTypes.func,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  headers: PropTypes.object,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  beforeUpload: PropTypes.func,
  customRequest: PropTypes.func,
  // onReady: PropTypes.func,
  withCredentials: PropTypes.bool,
  supportServerRender: PropTypes.bool,
}
export default {
  name: 'Upload',
  mixins: [BaseMixin],
  props: initDefaultProps(uploadProps, {
    componentTag: 'span',
    prefixCls: 'rc-upload',
    data: {},
    headers: {},
    name: 'file',
    multipart: false,
    // onReady: empty,
    // onStart: empty,
    // onError: empty,
    // onSuccess: empty,
    supportServerRender: false,
    multiple: false,
    beforeUpload: empty,
    withCredentials: false,
  }),
  data () {
    return {
      Component: null,
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.supportServerRender) {
        /* eslint react/no-did-mount-set-state:0 */
        this.setState({
          Component: this.getComponent(),
        }, () => {
          this.$emit('ready')
        })
      }
    })
  },
  methods: {
    getComponent () {
      return typeof File !== 'undefined' ? AjaxUpload : IframeUpload
    },
    abort (file) {
      this.$refs.uploaderRef.abort(file)
    },
  },

  render () {
    const componentProps = {
      props: {
        ...this.$props,
      },
      on: this.$listeners,
      ref: 'uploaderRef',
    }
    if (this.supportServerRender) {
      const ComponentUploader = this.Component
      if (ComponentUploader) {
        return <ComponentUploader {...componentProps} >{this.$slots.default}</ComponentUploader>
      }
      return null
    }
    const ComponentUploader = this.getComponent()
    return <ComponentUploader {...componentProps} >{this.$slots.default}</ComponentUploader>
  },
}


import classNames from 'classnames'
import uniqBy from 'lodash/uniqBy'
import VcUpload from '../vc-upload'
import BaseMixin from '../_util/BaseMixin'
import { getOptionProps, initDefaultProps, hasProp } from '../_util/props-util'
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import defaultLocale from '../locale-provider/default'
import Dragger from './Dragger'
import UploadList from './UploadList'
import { UploadProps } from './interface'
import { T, fileToObject, genPercentAdd, getFileItem, removeFileItem } from './utils'

export { UploadProps }

export default {
  name: 'AUpload',
  Dragger: Dragger,
  mixins: [BaseMixin],
  props: initDefaultProps(UploadProps, {
    prefixCls: 'ant-upload',
    type: 'select',
    multiple: false,
    action: '',
    data: {},
    accept: '',
    beforeUpload: T,
    showUploadList: true,
    listType: 'text', // or pictrue
    disabled: false,
    supportServerRender: true,
  }),
  // recentUploadStatus: boolean | PromiseLike<any>;
  data () {
    this.progressTimer = null
    return {
      sFileList: this.fileList || this.defaultFileList || [],
      dragState: 'drop',
    }
  },
  beforeDestroy () {
    this.clearProgressTimer()
  },
  watch: {
    fileList (val) {
      this.sFileList = val
    },
  },
  methods: {
    onStart (file) {
      const nextFileList = this.sFileList.concat()
      const targetItem = fileToObject(file)
      targetItem.status = 'uploading'
      nextFileList.push(targetItem)
      this.onChange({
        file: targetItem,
        fileList: nextFileList,
      })
      // fix ie progress
      if (!window.FormData) {
        this.autoUpdateProgress(0, targetItem)
      }
    },
    autoUpdateProgress (_, file) {
      const getPercent = genPercentAdd()
      let curPercent = 0
      this.clearProgressTimer()
      this.progressTimer = setInterval(() => {
        curPercent = getPercent(curPercent)
        this.onProgress({
          percent: curPercent,
        }, file)
      }, 200)
    },
    onSuccess (response, file) {
      this.clearProgressTimer()
      try {
        if (typeof response === 'string') {
          response = JSON.parse(response)
        }
      } catch (e) { /* do nothing */
      }
      const fileList = this.sFileList
      const targetItem = getFileItem(file, fileList)
      // removed
      if (!targetItem) {
        return
      }
      targetItem.status = 'done'
      targetItem.response = response
      this.onChange({
        file: { ...targetItem },
        fileList,
      })
    },
    onProgress (e, file) {
      const fileList = this.sFileList
      const targetItem = getFileItem(file, fileList)
      // removed
      if (!targetItem) {
        return
      }
      targetItem.percent = e.percent
      this.onChange({
        event: e,
        file: { ...targetItem },
        fileList: this.sFileList,
      })
    },
    onError (error, response, file) {
      this.clearProgressTimer()
      const fileList = this.sFileList
      const targetItem = getFileItem(file, fileList)
      // removed
      if (!targetItem) {
        return
      }
      targetItem.error = error
      targetItem.response = response
      targetItem.status = 'error'
      this.onChange({
        file: { ...targetItem },
        fileList,
      })
    },
    handleRemove (file) {
      Promise.resolve(this.$emit('remove', file)).then(ret => {
        // Prevent removing file
        if (ret === false) {
          return
        }

        const removedFileList = removeFileItem(file, this.sFileList)
        if (removedFileList) {
          this.onChange({
            file,
            fileList: removedFileList,
          })
        }
      })
    },
    handleManualRemove (file) {
      this.$refs.uploadRef.abort(file)
      file.status = 'removed' // eslint-disable-line
      this.handleRemove(file)
    },
    onChange (info) {
      if (!hasProp(this, 'fileList')) {
        this.setState({ sFileList: info.fileList })
      }
      this.$emit('change', info)
    },
    onFileDrop (e) {
      this.setState({
        dragState: e.type,
      })
    },
    reBeforeUpload (file, fileList) {
      if (!this.beforeUpload) {
        return true
      }
      const result = this.beforeUpload(file, fileList)
      if (result === false) {
        this.onChange({
          file,
          fileList: uniqBy(fileList.concat(this.sFileList), (item) => item.uid),
        })
        return false
      } else if (result && result.then) {
        return result
      }
      return true
    },
    clearProgressTimer () {
      clearInterval(this.progressTimer)
    },
    renderUploadList (locale) {
      const { showUploadList = {}, listType } = getOptionProps(this)
      const { showRemoveIcon, showPreviewIcon } = showUploadList
      const uploadListProps = {
        props: {
          listType,
          items: this.sFileList,
          showRemoveIcon,
          showPreviewIcon,
          locale: { ...locale, ...this.$props.locale },
        },
        on: {
          remove: this.handleManualRemove,
        },
      }
      if (this.$listeners.preview) {
        uploadListProps.on.preview = this.$listeners.preview
      }
      return (
        <UploadList
          {...uploadListProps}
        />
      )
    },
  },
  render () {
    const {
      prefixCls = '',
      showUploadList,
      listType,
      type,
      disabled,
    } = getOptionProps(this)

    const vcUploadProps = {
      props: {
        ...this.$props,
        beforeUpload: this.reBeforeUpload,
      },
      on: {
        // ...this.$listeners,
        start: this.onStart,
        error: this.onError,
        progress: this.onProgress,
        success: this.onSuccess,
      },
      ref: 'uploadRef',
      class: `${prefixCls}-btn`,
    }

    const uploadList = showUploadList ? (
      <LocaleReceiver
        componentName='Upload'
        defaultLocale={defaultLocale.Upload}
        children={this.renderUploadList}
      >
      </LocaleReceiver>
    ) : null

    const children = this.$slots.default

    if (type === 'drag') {
      const dragCls = classNames(prefixCls, {
        [`${prefixCls}-drag`]: true,
        [`${prefixCls}-drag-uploading`]: this.sFileList.some(file => file.status === 'uploading'),
        [`${prefixCls}-drag-hover`]: this.dragState === 'dragover',
        [`${prefixCls}-disabled`]: disabled,
      })
      return (
        <span>
          <div
            class={dragCls}
            onDrop={this.onFileDrop}
            onDragover={this.onFileDrop}
            onDragleave={this.onFileDrop}
          >
            <VcUpload {...vcUploadProps}>
              <div class={`${prefixCls}-drag-container`}>
                {children}
              </div>
            </VcUpload>
          </div>
          {uploadList}
        </span>
      )
    }

    const uploadButtonCls = classNames(prefixCls, {
      [`${prefixCls}-select`]: true,
      [`${prefixCls}-select-${listType}`]: true,
      [`${prefixCls}-disabled`]: disabled,
    })
    const uploadButton = (
      <div class={uploadButtonCls} style={{ display: children ? '' : 'none' }}>
        <VcUpload {...vcUploadProps} >{children}</VcUpload>
      </div>
    )

    if (listType === 'picture-card') {
      return (
        <span>
          {uploadList}
          {uploadButton}
        </span>
      )
    }
    return (
      <span>
        {uploadButton}
        {uploadList}
      </span>
    )
  },
}

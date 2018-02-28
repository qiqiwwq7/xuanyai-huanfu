<template>
  <div class="note-post">
    <x-header title="发布帖子" :left-options="{showBack: true, backText: ''}" :right-options="{showBtn: true, btnIcon:'gcicon gcicon-publish', btnText: '发布'}" @on-click-right="onPost"></x-header>
    <scroller lock-x scrollbar-y ref="notePostScroller" :height="(clientHeight - 50) +'px'">
      <div class="note-post-box">
        <group :gutter="'0'">
          <x-textarea class="box" v-model="data.content" :max="140" placeholder="请输入内容..." @click.native="onContentInput"></x-textarea>
        </group>
        <div class="group">
          <file-selector ref="fileSelector" :max="fileselector.max" :list="data.noteAttaches" @on-select="onFileSelect" @on-error="onFileError"></file-selector>
        </div>
      </div>
    </scroller>
    <circle-dialog v-model="circledialog.show" :percent="circledialog.percent" :loading="circledialog.loading" :message="circledialog.message" @on-close="circledialog.show = false"></circle-dialog>
  </div>
</template>

<script>
  import Util from '../libs/util'
  import { mapGetters } from 'vuex'
  import { Scroller, Group, XTextarea, XButton } from 'vux'
  import XHeader from 'components/vux/XHeader'
  import FileSelector from 'components/vux/FileSelector'
  import CircleDialog from 'components/vux/CircleDialog'

  export default {
    components: {
      Scroller,
      Group,
      XTextarea,
      XButton,
      XHeader,
      FileSelector,
      CircleDialog
    },
    data () {
      return {
        clientHeight: document.documentElement.clientHeight,
        fileselector : {
          max: 9
        },
        circledialog: {
          show: false,
          loading: '',
          message: '',
          percent: 0,
          count: 0
        },
        stsToken: {
        },
        data: {
          content: '',
          noteAttaches: []
        },
        post: {
          redirect: '/'
        }
      }
    },
    created () {
      let categoryPath = this.currentCategoriesHash['/note/recents/:id']
      if (categoryPath && categoryPath.category) {
        this.post.redirect = categoryPath.category.fullPath
      }
      window.addEventListener('orientationchange', function() {
        this.clientHeight = document.documentElement.clientHeight
      }.bind(this))
    },
    activated () {
      this.circledialog = {
        show: false,
        loading: '',
        message: '',
        percent: 0,
        count: 0
      }
      this.data = {
        content: '',
        noteAttaches: []
      }
    },
    methods: {
      calcPercent () {
        let sum = 0
        for (let attach of this.data.noteAttaches) {
          if (attach.percent) {
            sum += attach.percent
          }
        }
        let result = parseInt((sum / this.data.noteAttaches.length).toFixed(0), 10)
        if (result > this.circledialog.percent) {
          this.circledialog.percent = result
        }
      },
      uploadAttach (attach) {
        let bucket = ''
        let key = ''
        if (attach.tag == 1) {//视频
          attach.videoBucket = this.currentAccessKey.videoBucket
          bucket = attach.videoBucket
          key = attach.videoUrl
        } else if (attach.tag == 0) {//图片
          attach.bucket = this.currentAccessKey.picBucket
          bucket = attach.bucket
          key = attach.attachmentUrl
        }
        if (attach.client == null) {
          attach.client = new OSS.Wrapper({
            region: 'oss-cn-beijing',
            accessKeyId: this.stsToken[bucket].accessKeyId,
            accessKeySecret: this.stsToken[bucket].accessKeySecret,
            stsToken: this.stsToken[bucket].securityToken,
            bucket: bucket
          })
        }
        let scope = this
        attach.percent = 0
        attach.client.multipartUpload(key, attach.file, {
          progress: function* (percent) {
            attach.percent = (percent * 100)
            scope.calcPercent()
          }
        }).then((response) => {
          scope.circledialog.count++
          if (scope.circledialog.count == scope.data.noteAttaches.length) {
            scope.requestNotePost()
          }
        }).catch((response) => {
          this.circledialog.close = true
          this.circledialog.message = response.message
        })
      },
      onPost () {
        if (this.data.content.length == 0) {
          this.$vux.toast.show({
            text: '请输入帖子内容',
            type: 'cancel'
          })
          return false
        }
        this.circledialog.show = true
        this.circledialog.percent = 0
        this.circledialog.loading = '发布进度'
        this.circledialog.message = ''
        this.circledialog.count = 0
        if (this.data.noteAttaches.length == 0) {
          this.requestNotePost()
        } else {
          this.requestSts().then(() => {
            for (let attach of this.data.noteAttaches) {
              this.uploadAttach(attach)
            }
          }).catch((response) => {
            this.circledialog.message = response.data.message
            this.circledialog.close = true
          })
        }
      },
      onFileSelect () {
        this.$nextTick(() => {//dom渲染之后执行
          this.$refs.notePostScroller.reset()
        })
      },
      onFileError (message) {
        this.$vux.toast.show({
          text: message,
          type: 'cancel'
        })
      },
      onContentInput () {
        let scope = this
        this.$input.show({
          inputValue: this.data.content,
          inputMaxLength: 140,
          inputPlaceholder: "请输入内容...",
          onComplete: function (val) {
            scope.data.content = val
          }
        })
      },
      requestSts() {
        return Util.ajax.get('/sts/get/', {
          params: {
            bucket: this.currentAccessKey.videoBucket + ',' + this.currentAccessKey.picBucket
          }
        }).then((response) => {
          if (response.data.success == Util.response.code.Success) {
            this.stsToken = response.data.data
          } else {
            return Promise.reject(response)
          }
        })
      },
      requestNotePost() {
        let noteAttaches = []
        for (let attach of this.data.noteAttaches) {
          noteAttaches.push({
            tag: attach.tag,
            bucket: attach.bucket,
            attachmentUrl: attach.attachmentUrl,
            attachmentOriginSize: attach.attachmentOriginSize,
            attachmentWidth: attach.attachmentWidth,
            attachmentHeight: attach.attachmentHeight,
            videoBucket: attach.videoBucket,
            videoUrl: attach.videoUrl,
            videoOriginSize: attach.videoOriginSize
          })
        }
        return Util.ajax.post('/note/post/', {content: encodeURIComponent(this.data.content), noteAttaches: noteAttaches}).then((response) => {
          if (response.data.success == Util.response.code.Success) {
            this.circledialog.percent = 100
            setTimeout(function(){
              this.$router.push(this.post.redirect)
            }.bind(this), 350)
          } else {
            if (response.data.code == '4010') {
              this.circledialog.message = '您发布的内容包含敏感词'
            } else {
              this.circledialog.message = response.data.message
            }
            this.circledialog.close = true
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'currentAccessKey',
        'currentCategoriesHash'
      ])
    }
  }
</script>

<style>
  .note-post .weui-cells:before, .note-post .weui-cells:after {
    border: 0;
  }
  .note-post .weui-textarea {
    color: #EFF7FF;
    background-color: #141A23;
  }
</style>

<style scoped>
  .box {
    background-color: #141A23;
    border: 1px #1C222D solid;
  }
  .note-post .note-post-box {
    padding: 20px;
  }
  .note-post .note-post-box .group {
    margin-top: 20px;
  }
</style>

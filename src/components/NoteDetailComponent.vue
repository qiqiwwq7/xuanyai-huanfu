<template>
  <div class="note-panel">
    <div v-if="state == 1">
      <scroller lock-x use-pullup ref="noteDetailScroller" :height="(clientHeight - 50) +'px'" @on-pullup-loading="onCommentsPullup()">
        <div>
          <div class="note-card">
            <div class="note-header">
              <div class="header-body">
                <div class="note-avatar">
                  <div class="note-avatar-inner">
                    <img :src="$common.UserExt.getHeadPhotoUrl(noteData.userExt.bucket, noteData.userExt.headPhoto, 80)" draggable="false">
                  </div>
                </div>
                <div class="note-header-title">
                  <div class="note-card-title ellipsis">
                    <span v-if="noteData.userExt.nickName">{{noteData.userExt.nickName | decode}}</span>
                  </div>
                  <div v-if="noteData.note.time" class="note-card-sub-title ellipsis subtitle">{{noteData.note.time | date-number-to-date | date-both-length}}</div>
                </div>
              </div>
              <div class="header-bar" ref="popover">
                <i class="gcicon gcicon-bottom-arrow" aria-hidden="true"></i>
                <div v-show="popover.show" class="popover">
                  <div class="arrow-up"></div>
                  <div v-if="currentUser.userId == noteData.note.userId" class="popover-text" @click="onDelete">删除</div>
                  <div v-else class="popover-text" @click="onReport">举报</div>
                </div>
              </div>
            </div>
            <div class="note-card-text">{{noteData.note.content | decode}}</div>
            <div class="note-media" v-if="noteData.noteAttaches.length > 0">
              <transition-group name="fade" tag="div" class="media-body">
                <div class="media-item" v-for="(attach, index) in noteData.noteAttaches" :key="index" v-show="comment.noteAttachId == attach.id">
                  <template v-if="attach.tag == 1">
                    <img class="play-o" src="../assets/images/play-o.png" @click="onVideoClick(attach)">
                    <img class="previewer-demo-img" draggable="false" v-if="$common.Oss.startWithHttp(attach.attachmentUrl)" :src="$common.Oss.getCdnUrl(attach.bucket, attach.attachmentUrl)" @load="onImgLoad($event)" @click="onImgClick(attach)">
                    <img class="previewer-demo-img" draggable="false" v-else :src="$common.Oss.getVideoSnapshotCdnUrl(attach.videoBucket, attach.videoUrl, 0, 0, 390)" @load="onImgLoad($event)" @click="onImgClick(attach)">
                  </template>
                  <template v-else-if="attach.tag == 0">
                    <img class="previewer-demo-img" draggable="false" :src="$common.Oss.getCdnUrl(attach.bucket, attach.attachmentUrl)" @load="onImgLoad($event)" @click="onImgClick(attach)">
                  </template>
                </div>
              </transition-group>
            </div>
            <div class="note-swiper" v-if="noteData.noteAttaches.length > 1">
              <swiper :list="noteData.noteAttaches" @on-item-click="onSwiperClick"></swiper>
            </div>
          </div>
          <div class="comment-card">
            <div class="comment-count">
              <p class="subtitle">共{{noteData.note.commentCount ? noteData.note.commentCount : 0}}条评论</p>
            </div>
            <div class="table comment-list-panel">
              <div class="table-row" v-for="(comment, index) in commentData.comments" :key="index">
                <div class="table-cell comment-head">
                  <div class="table comment-head-body">
                    <div class="table-row">
                      <div class="table-cell comment-avatar">
                        <div class="table comment-avatar-body">
                            <div class="table-row">
                                <div class="table-cell head-photo">
                                  <img :src="$common.UserExt.getHeadPhotoUrl(commentData.userExts[comment.userId].bucket, commentData.userExts[comment.userId].headPhoto, 80)" alt="">
                                </div>
                                <div class="table-cell head-name">
                                  <p class="name ellipsis">{{commentData.userExts[comment.userId].nickName | decode}}</p>
                                  <p class="time ellipsis subtitle">{{comment.time | date-number-to-date | date-both-length}}</p>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div class="table-row">
                      <div class="table-cell comment-text">{{comment.content | decode}}</div>
                    </div>
                  </div>
                </div>
                <div class="table-cell comment-mood">
                  <i v-if="comment.mood == 1" aria-hidden="true" class="gcicon gcicon-like"></i><i v-if="comment.mood == 0" aria-hidden="true" class="gcicon gcicon-hate"></i><br><i v-if="currentUser.userId != comment.userId" aria-hidden="true" class="gcicon gcicon-comment" @click="onReply(comment.userId)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroller>
      <tabbar>
        <tabbar-item>
          <span slot="label">
            <div class="table comment-post-bar">
              <div class="table-row">
                <div class="table-cell input">
                  <input type="text" v-model="comment.content" placeholder="发布评论" maxlength="35" @click="onCommentInput">
                </div>
                <div class="table-cell icon">
                  <radio v-model="comment.mood" :list="moodData.list" @on-radio-click="onRadioClick"></radio>
                </div>
                <div class="table-cell button">
                  <x-button type="primary" :disabled="commentBar.disabled" @click.native="onPostClick">发布</x-button>
                </div>
              </div>
            </div>
          </span>
        </tabbar-item>
      </tabbar>
      <previewer :list="previewer.list" ref="previewer" :options="previewer.options"></previewer>
    </div>
    <div v-else-if="state == -1" class="message-card">
      <div class="message-body">
        <div>
          <img width="100" src="../assets/images/plane.png">
        </div>
        <div class="message-text">很抱歉，该贴已经离开地球表面</div>
        <div class="message-bar">
          <x-button @click.native="$router.back();" class="message-btn">返回论坛首页</x-button>
        </div>
      </div>
    </div>
    <div v-else-if="state == -2" class="message-card">
      <div class="message-body">
        <div>
          <img width="100" src="../assets/images/none.png">
        </div>
        <div class="message-text">这个帖子已经销毁</div>
        <div class="message-bar">
          <x-button @click.native="$router.back();" class="message-btn">返回论坛首页</x-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Util from '../libs/util'
  import { XButton, Tabbar, TabbarItem } from 'vux'
  import { mapGetters } from 'vuex'
  import Scroller from 'components/vux/ScrollerClick'
  import Swiper from 'components/vux/Swiper'
  import Radio from 'components/vux/Radio'
  import Previewer from 'components/vux/Previewer'

  export default {
    components: {
      XButton,
      Scroller,
      Tabbar,
      TabbarItem,
      Swiper,
      Radio,
      Previewer
    },
    data () {
      return {
        mode: 'default',//default or preview
        state: 0,//1:正常，0:加载中，-1:不存在，-2:已删除
        previewer: {
          clickTime: null,
          list: [],
          index: 0
        },
        popover: {
          show: false
        },
        moodData: {
          list: [{
            icon: 'gcicon gcicon-like',
            value: 1
          },{
            icon: 'gcicon gcicon-hate',
            value: 0
          }]
        },
        noteData: {
          note: {},
          userExt: {},
          noteAttaches: [],
          txOut: true
        },
        commentData: {
          comments: [],
          userExts: {},
          page: {
            pageNextId: 0,
            pageSize: 20,
          }
        },
        commentBar: {
          disabled: false
        },
        comment: {
          content: '',
          mood: null,
          noteId: this.$route.params.noteId,
          noteAttachId: 0
        },
        clientHeight: document.documentElement.clientHeight
      }
    },
    created () {
      window.addEventListener('orientationchange', function() {
        this.clientHeight = document.documentElement.clientHeight
      }.bind(this))

      window.addEventListener('click', function(e) {
        let target = e.tatget || e.srcElement
        if (target == this.$refs.popover || target.parentNode == this.$refs.popover) {
          this.onPopover()
        } else {
          this.popover.show = false
        }
      }.bind(this))
    },
    activated () {
      if (this.$route.fullPath.startsWith('/preview/note')) {
        this.mode = 'preview'
      } else {
        this.mode = 'default'
      }
      this.state = 0
      this.previewer = {
        clickTime: null,
        list: [],
        index: 0
      }
      this.popover = {
        show: false
      }
      this.noteData = {
        note: {},
        userExt: {},
        noteAttaches: [],
        txOut: true
      },
      this.commentData = {
        comments: [],
        userExts: {},
        page: {
          pageNextId: 0,
          pageSize: 20,
        }
      }
      this.comment = {
        content: '',
        mood: null,
        noteId: this.$route.params.noteId,
        noteAttachId: 0
      }
      this.onPulldown()
    },
    methods: {
      onPulldown () {
        if (this.mode == 'default') {
          this.$store.dispatch('setLoading', true)
          this.requestNote(function(){
            this.onCommentsPulldown()
            setTimeout(() => this.$store.dispatch('setLoading', false), 200)
          })
        } else {
          if (this.$route.params.data && this.$route.params.data.length > 0) {
            this.state = 1
            this.noteData = JSON.parse(decodeURIComponent(this.$route.params.data))
            if (this.noteData.noteAttaches != null && this.noteData.noteAttaches.length > 0) {
              for (let i = 0; i < this.noteData.noteAttaches.length; i++) {
                let attach = this.noteData.noteAttaches[i]
                attach.id = i
                if (i == 0) {
                  this.setPreviewerIndex(i)
                  this.setNoteAttachId(attach)
                }
                this.previewer.list.push({
                  src: this.$common.Oss.getCdnUrl(attach.bucket, attach.attachmentUrl),
                  videoSrc: attach.tag == 1 ? this.$common.Oss.getCdnUrl(attach.videoBucket, attach.videoUrl) : '',
                  w: attach.attachmentWidth,
                  h: attach.attachmentHeight
                })
              }
            }
          } else {
            this.state = -1
          }
        }
      },
      onCommentsPulldown () {
        if (this.mode != 'default') {
          return false
        }
        this.commentData.comments = []
        this.commentData.userExts = {}
        this.commentData.page.pageNextId = 0
        this.requestComments(function(response){
          if (response.data.data && response.data.data.comments) {
            this.$nextTick(() => {//dom渲染之后执行
              this.$refs.noteDetailScroller.reset({
                top: 0
              })
              if (response.data.data.comments.length < this.commentData.page.pageSize) {
                this.$refs.noteDetailScroller.disablePullup()
              } else {
                this.$refs.noteDetailScroller.enablePullup()
              }
            })
          }
        })
      },
      onCommentsPullup () {
        if (this.mode != 'default') {
          return false
        }
        this.requestComments(function(response){
          if (response.data.data && response.data.data.comments) {
            this.$nextTick(() => {//dom渲染之后执行
              this.$refs.noteDetailScroller.donePullup()
              if (response.data.data.comments.length == 0) {
                this.$refs.noteDetailScroller.disablePullup()
              }
            })
          }
        })
      },
      requestNote (callback) {
        Util.ajax.get('/note/get/' + this.$route.params.noteId + '/').then((response) => {
          if (response.data.data && response.data.data.note) {
            this.state = 1
            this.noteData.note = response.data.data.note
            this.noteData.userExt = response.data.data.userExt
            let noteAttaches = response.data.data.noteAttaches
            if (noteAttaches != null && noteAttaches.length > 0) {
              for (let i = 0; i < noteAttaches.length; i++) {
                let attach = noteAttaches[i]
                if (i == 0) {
                  this.setPreviewerIndex(i)
                  this.setNoteAttachId(attach)
                }
                this.noteData.noteAttaches.push(attach)
                this.previewer.list.push({
                  src: this.$common.Oss.getCdnUrl(attach.bucket, attach.attachmentUrl),
                  videoSrc: attach.tag == 1 ? this.$common.Oss.getCdnUrl(attach.videoBucket, attach.videoUrl) : '',
                  w: attach.attachmentWidth,
                  h: attach.attachmentHeight
                })
              }
            }
            this.noteData.txOut = response.data.data.txOut
          } else {
            this.state = -1
          }
          if (callback) {
            callback.call(this, response)
          }
        })
      },
      requestComments (callback) {
        Util.ajax.get('/comment/find/' + this.$route.params.noteId + '/0/' + this.commentData.page.pageNextId + '/' + this.commentData.page.pageSize + '/').then((response) => {
          if (response.data.data) {
            let userExts = response.data.data.userExts
            if (userExts != null && userExts.length > 0) {
              for (let userExt of userExts) {
                this.commentData.userExts[userExt.userId] = userExt
              }
            }
            let comments = response.data.data.comments
            if (comments != null && comments.length > 0) {
              for (let comment of comments) {
                this.commentData.comments.push(comment)
                this.commentData.page.pageNextId = comment.commentId
              }
            }
          }
          if (callback) {
            callback.call(this, response)
          }
        })
      },
      requestPostComment (callback) {
        this.commentBar.disabled = true
        Util.ajax.post('/comment/post', this.comment).then(
          (response) => {
            if (callback) {//success
              callback.call(this, response)
              this.commentBar.disabled = false
            }
          },
          (response) => {
            if (callback) {//error
              callback.call(this, response)
              this.commentBar.disabled = false
            }
          }
        )
      },
      requestReport (callback) {
        Util.ajax.post('/report/post/' + this.$route.params.noteId + '/').then(
          (response) => {
            if (callback) {//success
              callback.call(this, response)
            }
          },
          (response) => {
            if (callback) {//error
              callback.call(this, response)
            }
          }
        )
      },
      requestDelete (callback) {
        Util.ajax.post('/note/delete/' + this.$route.params.noteId + '/').then(
          (response) => {
            if (callback) {//success
              callback.call(this, response)
            }
          },
          (response) => {
            if (callback) {//error
              callback.call(this, response)
            }
          }
        )
      },
      setPreviewerIndex (index) {
        this.previewer.index = index
      },
      setNoteAttachId (attach) {
        this.comment.noteAttachId = attach.id
      },
      // transComment (content) {
      //   content = decodeURIComponent(content)
      //   var arrays = content.match(/回复@\S+/g)
      //   if (arrays && arrays.length > 0) {
      //     for (let s of arrays) {
      //       let temp = '<span class="reply">' + s.replace('回复@', '') + '</span>'
      //       content = content.replace(s, '回复@' + temp)
      //     }
      //   }
      //   return content
      // },
      onImgLoad (e) {
        let _img = e.target
        let _parent_div = _img.parentNode
        let _parent_parent_div = _parent_div.parentNode
        let _w = _img.width
        let _h = _img.height
        let _d_w = _parent_parent_div.clientWidth
        let _d_h = _parent_parent_div.clientHeight
        if (_w > _d_w || _h > _d_h) {
          if (_w > _d_w && _h < _d_h) {
            _img.style.width = '100%'
            _parent_div.style.width = '100%'
          } else if (_w < _d_w && _h > _d_h) {
            _img.style.height = '100%'
            _parent_div.style.height = '100%'
          } else {
            //如果图片的宽、高都超出容器布局，则图片的宽度=容器的宽度，图片的高度=图片的高度*图片的宽度的缩小比例
            if (_w > _h) {
              let _s = ((_w - _d_w) / _w).toFixed(2)
              let _r_h = parseInt(_h - _h * _s)
              if (_r_h > _d_h) {
                _s = ((_r_h - _d_h) / _r_h).toFixed(2)
                let _r_w = parseInt(_d_w - _d_w * _s)
                _img.style.width = _r_w + 'px'
                _parent_div.style.width = _r_w + 'px'
                _img.style.height = _d_h + 'px'
                _parent_div.style.height = _d_h + 'px'
              } else {
                _img.style.width = _d_w + 'px'
                _parent_div.style.width = _d_w + 'px'
                _img.style.height = _r_h + 'px'
                _parent_div.style.height = _r_h + 'px'
              }
            } else {
              let _s = ((_h - _d_h) / _h).toFixed(2)
              let _r_w = parseInt(_w - _w * _s)
              if (_r_w > _d_w) {
                _s = ((_r_w - _d_w) / _r_w).toFixed(2)
                let _r_h = parseInt(_d_h - _d_h * _s)
                _img.style.width = _d_w + 'px'
                _parent_div.style.width = _d_w + 'px'
                _img.style.height = _r_h + 'px'
                _parent_div.style.height = _r_h + 'px'
              } else {
                _img.style.width = _r_w + 'px'
                _parent_div.style.width = _r_w + 'px'
                _img.style.height = _d_h + 'px'
                _parent_div.style.height = _d_h + 'px'
              }
            }
          }
        }
        _img.style.visibility = 'visible'
      },
      onImgClick (attach) {
        if (attach.tag == 0) {
          //start****PC上会出现两次点击BUG****
          if (this.previewer.clickTime == null){
              this.previewer.clickTime = new Date().getTime()
          } else {
              var clickTime = new Date().getTime()
              if (clickTime - this.previewer.clickTime < 500) {
                  this.previewer.clickTime = clickTime
                  return false
              } else {
                  this.previewer.clickTime = clickTime
              }
          }
          //end****PC上会出现两次点击BUG****
          this.$refs.previewer.show(this.previewer.index)
        }
      },
      onVideoClick (attach) {
        if (this.noteData.txOut) {
          this.$vux.toast.show({
            text: '哎呦喂，播放视频的魔法突然失效了',
            type: 'cancel'
          })
          return false
        }
        this.$video.show({
          sources: [{
            type: 'video/mp4',
            src: this.$common.Oss.getCdnUrl(attach.videoBucket, attach.videoUrl)
          },{
            type: 'video/ogg',
            src: this.$common.Oss.getCdnUrl(attach.videoBucket, attach.videoUrl)
          },{
            type: 'video/webm',
            src: this.$common.Oss.getCdnUrl(attach.videoBucket, attach.videoUrl)
          }]
        })
      },
      onCommentInput () {
        let scope = this
        this.$input.show({
          inputValue: this.comment.content,
          inputMaxLength: 140,
          inputPlaceholder: "请输入内容...",
          onComplete: function (val) {
            scope.comment.content = val
          }
        })
      },
      onSwiperClick (e, attach, index) {
        this.setNoteAttachId(attach)
        this.setPreviewerIndex(index)
      },
      onRadioClick (selected) {
        this.comment.mood = selected.value;
      },
      onPostClick () {
        if (this.comment.content.length == 0) {
          this.$vux.toast.show({
            text: '请输入评论内容',
            type: 'cancel'
          })
          return false
        }
        if (this.comment.content.length > 35) {
          this.$vux.toast.show({
            text: '评论内容最多35个字符',
            type: 'cancel'
          })
          return false
        }
        if (this.comment.mood != 0 && this.comment.mood != 1) {
          this.$vux.toast.show({
            text: '爱我就赞我一下啊<br>╮(￣▽￣)╭',
            type: 'text'
          })
          return false
        }
        if (this.mode != 'default') {
          return false
        }
        this.requestPostComment(function(response) {
          if (response.data.success == Util.response.code.Success) {
            this.comment.content = ''
            this.comment.mood = null
            this.noteData.note.commentCount++
            this.$vux.toast.show({
              text: '发布成功',
              type: 'success'
            })
            this.onCommentsPulldown()
          } else {
            if (response.data.code == '4010') {
              this.$vux.toast.show({
                text: '您发布的内容包含敏感词',
                type: 'cancel'
              })
            } else {
              this.$vux.toast.show({
                text: response.data.message,
                type: 'cancel'
              })
            }
          }
        })
      },
      onDelete () {
        if (this.mode != 'default') {
          return false
        }
        let scope = this
        this.$vux.confirm.show({
          title: '删除帖子后，评论也会消失哒(*T_T*)',
          confirmText: '果断删除',
          cancelText: '算了',
          onConfirm () {
            scope.requestDelete(function(response) {
              if (response.data.success == Util.response.code.Success) {
                scope.state = -2
              } else {
                this.$vux.toast.show({
                  text: '删除失败',
                  type: 'text'
                })
              }
            })
          }
        })
      },
      onReport () {
        if (this.mode != 'default') {
          return false
        }
        this.requestReport(function(response) {
          if (response.data.success == Util.response.code.Success) {
            this.$vux.toast.show({
              text: '举报成功，小编正在赶来<br>(●ﾟωﾟ●)',
              type: 'text'
            })
          } else {
            if (response.data.code == '6000') {
              this.$vux.toast.show({
                text: '已经举报过了',
                type: 'text'
              })
            } else {
              this.$vux.toast.show({
                text: '举报失败',
                type: 'text'
              })
            }
          }
        })
      },
      onReply (userId) {
        this.comment.content = '回复@' + decodeURIComponent(this.commentData.userExts[userId].nickName) + ' '
      },
      onPopover () {
        this.popover.show = !this.popover.show
      }
    },
    computed: {
      ...mapGetters([
        'currentUser'
      ])
    }
  }
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.note-panel {
  width: 100%;
  height: 100%;
}
.note-card {
  padding: 10px;
  position: relative;
}
.note-card .note-header {
  height: 60px;
  margin-bottom: 10px;
  position: relative;
  border-bottom: 1px #1D2430 solid;
}
.note-header .header-body {
  margin: 0px 60px 0px 0px;
}
.note-header .header-bar {
  width: 60px;
  height: 50px;
  line-height: 50px;
  position: absolute;
  top: 0px;
  right: 0px;
  padding-top: 5px;
  text-align: center;
}
.header-bar > i {
  font-size: 1.6rem;
}
.header-bar .popover {
  position: absolute;
  height: 60px;
  top: 40px;
  left: 0;
  right: 0;
}
.popover .arrow-up {
  width: 0;
  height: 0;
  margin: 0px auto;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #1E2B3F;
}
.popover .popover-text {
  border-radius: 3px;
  padding: 3px 10px;
  background-color: #1E2B3F;
  color: #fff;
}
.note-header .note-avatar {
  position: absolute;
  top: 0px;
  left: 10px;
  height: 50px;
  width: 50px;
  font-size: 20px;
  color: #FFF;
  background-color: #BDBDBD;
  text-align: center;
  border-radius: 50%;
}
.note-avatar .note-avatar-inner {
  display: flex;
  width: 100%;
  height: 100%;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.note-avatar .note-avatar-inner img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  display: block;
}
.note-header .note-header-title {
  margin-left: 80px;
}
.note-header .note-header-title .note-card-title {
  height: 25px;
  line-height: 25px;
  font-size: 1.1rem;
}
.note-header .note-header-title .note-card-sub-title {
  height: 25px;
  line-height: 25px;
  font-size: 0.9rem;
}
.note-card .note-media {
  width: 100%;
  height: 390px;
  background-color: #000000;
  overflow: hidden;
  position: relative;
  margin: 10px auto;
}
.note-card .note-media .media-body {
  display: flex;
  height: 390px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.note-card .note-media .media-body .previewer-demo-img {
  visibility: hidden;
}
.note-card .note-media .media-item {
  width: 100%;
  height: 390px;
}
.note-card .note-media .media-item > img {
  z-index: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  min-width: 100px;
  min-height: 100px;
}
.note-card .note-media .media-item .play-o {
  z-index: 2;
  font-size: 80px;
  color: #FFF;
  position: absolute;
  width: 80px;
  height: 80px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.note-card .note-swiper {
  background-color: #000000;
}
.note-card .note-card-text {
  padding: 10px;
  font-size: 1.1rem;
}
.comment-card {
  padding: 10px;
  position: relative;
}
.comment-card .comment-count {
  padding: 10px 0 0;
  border-top: 20px #141A23 solid;
}
.comment-card .comment-count > p {
  font-size: 1rem;
  padding-bottom: 10px;
  border-bottom: 1px #1D2430 solid;
}

.weui-tabbar {
  background-color: #1E2B3F;
}
.weui-tabbar:before {
  border: 0;
}
.comment-post-bar {
  width: 100%;
}
.comment-post-bar .input {
  padding-left: 10px;
  vertical-align: middle;
}
.comment-post-bar .input > input {
  width: 100%;
  height: 35px;
  font-size: 15px;
  color: #C5CBD8;
  background-color: #1E2B3F;
  border: 1px #60748D solid;
  border-radius: 0px;
  padding: 0px 5px;
  margin: 0px;
  outline: 0;
  box-sizing: border-box;
  text-shadow: none ;
  -webkit-appearance: none ;
  -webkit-user-select: text ;
  outline-color: transparent ;
  box-shadow: none;
}
.comment-post-bar .icon {
  vertical-align: middle;
  width: 100px;
  font-size: 28px;
  text-align: center;
}
.comment-post-bar .button {
  width: 80px;
}
.comment-post-bar .button > button {
  font-size: 16px;
  font-weight: 500;
  height: 50px;
  border: 0px;
  padding: 0px;
  margin: 0px;
  border-radius: 0px;
  color: #1E2B40 !important;
  background-color: #FDD059;
}
.comment-post-bar .button > button:after {
  border: 0;
}
.comment-post-bar .button > button:active {
  background-color: #DCB856;
}
.comment-post-bar .button > button:disabled {
  color: #FD6E84 !important;
}

.fade-enter-active {
  transition: opacity .5s
}
.fade-enter {
  opacity: 0
}
</style>

<template>
  <flexbox class="index-box">
    <flexbox-item :span="4" style="position:relative;flex: 0 0 38%;">
      <div class="content-box">
        <div class="box user-box" :style="currentUser.snsUserExts && currentUser.snsUserExts.length > 0 ? 'height: 35%;' : 'height: 30%;'">
          <div class="user-head" :style="currentUser.snsUserExts && currentUser.snsUserExts.length > 0 ? 'height: 65%;' : 'height: 100%;'">
            <div class="head-photo">
              <img :src="$common.UserExt.getHeadPhotoUrl('', currentUser.snsHeadPhoto, 75)" onerror="this.onerror=null;this.src='http://pic.youka.youmengchuangxiang.com/default-head-photo.jpeg?x-oss-process=image/resize,m_fill,w_75'" draggable="false">
            </div>
            <div class="head-name">
              <div class="table">
                <div class="table-row">
                  <div class="table-cell nick-name ellipsis">{{currentUser.snsNickName | decode}}</div>
                </div>
                <div v-if="currentUser.snsShortName && currentUser.snsShortName != ''" class="table-row">
                  <div class="table-cell level-name ellipsis">{{currentUser.snsShortName | decode}}</div>
                </div>
              </div>
            </div>
          </div>
          <ul v-if="currentUser.snsUserExts && currentUser.snsUserExts.length > 0" class="user-body">
            <template v-for="userExt in currentUser.snsUserExts">
              <li :style="'width:' + extsWidth + '%'">{{userExt.value}}</li>
              <li :style="'width:' + extsWidth + '%'" class="subtitle">{{userExt.name}}</li>
            </template>
          </ul>
        </div>
        <div class="note-box" :style="currentUser.snsUserExts && currentUser.snsUserExts.length > 0 ? 'height: 65%;' : 'height: 70%;'">
          <div class="table">
            <div class="table-row">
              <div class="table-cell">
                <div class="head-row">
                  <div class="head-body">
                    <div class="text"><span>{{officialsData.category.name}}</span></div>
                    <div class="more" @click="onLink(officialsData.category)">更多</div>
                    <div class="arrow" @click="onLink(officialsData.category)"><i class="gcicon gcicon-right-arrow" aria-hidden="true"></i></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell notice-body">
                <div v-if="officialsData && officialsData.notes && officialsData.notes.length > 0" class="box table">
                  <div class="table-row" v-for="(note, index) in officialsData.notes" :key="index">
                    <div class="table-cell ellipsis">
                      <router-link @click.native="" :to="'/note/' + note.noteId + '/'">{{note.content | decode}}</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="notice-box ellipsis">
        <i class="gcicon gcicon-notice" aria-hidden="true"></i>{{currentConfigs ? currentConfigs.offical_content : ''}}
      </div>
    </flexbox-item>
    <flexbox-item>
      <scroller ref="noteListScroller" lock-x scrollbar-y use-pullup @on-pullup-loading="onPullup" :height="(clientHeight - 20) +'px'">
        <div>
          <template v-if="weekhotsData && weekhotsData.notes && weekhotsData.notes.length > 0">
            <div class="head-row">
              <div class="head-body">
                <div class="text"><span>{{weekhotsData.category.name}}</span></div>
                <div class="more" @click="onLink(weekhotsData.category)">更多</div>
                <div class="arrow" @click="onLink(weekhotsData.category)"><i class="gcicon gcicon-right-arrow" aria-hidden="true"></i></div>
              </div>
            </div>
            <div class="note-grid-panel padding-top-10 padding-bottom-10">
              <div class="note-col" v-for="(note, index) in weekhotsData.notes" :key="index">
                <div class="note-media">
                  <div class="flex-box">
                    <div v-if="hasTag(note.hasTag, '1')" class="video">
                      <i class="gcicon gcicon-play" aria-hidden="true"></i>
                    </div>
                    <template v-if="note.tag == 1">
                      <img v-if="$common.Oss.startWithHttp(note.attachmentUrl)" :src="$common.Oss.getImageResizeCdnUrl(note.bucket, note.attachmentUrl, 160, 100, '0E1319')" draggable="false">
                      <img v-else :src="$common.Oss.getVideoSnapshotCdnUrl(note.videoBucket, note.videoUrl, 0, 160, 100)" draggable="false">
                    </template>
                    <template v-else-if="note.tag == 0">
                      <img :src="$common.Oss.getImageResizeCdnUrl(note.bucket, note.attachmentUrl, 160, 100, '0E1319')" draggable="false">
                    </template>
                    <span v-else>{{weekhotsData.category.name}}</span>
                  </div>
                  <router-link @click.native="" :to="'/note/' + note.noteId + '/'" class="flex-link">
                    <div class="note-text ellipsis">
                      <span :style="note.visited ? 'color: #a1a2a3;' : ''">{{note.content | decode}}</span>
                    </div>
                    <div class="avatar-box">
                      <div class="avatar-head">
                        <img :src="$common.UserExt.getHeadPhotoUrl(weekhotsData.userExts[note.userId].bucket, weekhotsData.userExts[note.userId].headPhoto, 50)" draggable="false">
                      </div>
                      <div class="avatar-text">
                        <div class="name ellipsis">{{weekhotsData.userExts[note.userId].nickName | decode}}</div>
                        <div class="time ellipsis subtitle">{{note.time.substring(4, 6)}}-{{note.time.substring(6, 8)}}</div>
                      </div>
                      <div class="avatar-right subtitle">
                        <i class="gcicon gcicon-right-arrow" aria-hidden="true"></i>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </template>
          <div class="head-row">
            <div class="head-body">
              <div class="text"><span>{{recentsData.category.name}}</span></div>
              <div class="more" @click="onLink(recentsData.category)">更多</div>
              <div class="arrow" @click="onLink(recentsData.category)"><i class="gcicon gcicon-right-arrow" aria-hidden="true"></i></div>
            </div>
          </div>
          <div class="padding-top-10">
            <note-list-component :name="recentsData.category.name" mode="1" :bodys="{notes: recentsData.notes, userExts: recentsData.userExts}"></note-list-component>
          </div>
        </div>
      </scroller>
    </flexbox-item>
  </flexbox>
</template>

<script>
  import Util from '../libs/util'
  import { Flexbox, FlexboxItem } from 'vux'
  import { mapGetters } from 'vuex'
  import Scroller from 'components/vux/ScrollerClick'
  import NoteListComponent from 'components/NoteListComponent'

  export default {
    components: {
      Flexbox,
      FlexboxItem,
      Scroller,
      NoteListComponent
    },
    data () {
      return {
        clientHeight: document.documentElement.clientHeight,
        officialsData: {
          category: {
            id: '',
            name: '',
            url: ''
          },
          notes: [],
          userExts: {},
          page: {
            pageSize: 4
          }
        },
        weekhotsData: {
          category: {
            name: '',
            url: ''
          },
          notes: [],
          userExts: {},
          page: {
            pageSize: 2
          }
        },
        recentsData: {
          category: {
            name: '',
            url: ''
          },
          notes: [],
          userExts: {},
          page: {
            pageSize: 10
          }
        }
      }
    },
    created () {
      if (this.currentCategoriesHash) {
        //获取官方公告
        let categoryPath = this.currentCategoriesHash['/note/officials/:id']
        if (categoryPath && categoryPath.category) {
          this.officialsData.category.id = categoryPath.category.id
          this.officialsData.category.name = categoryPath.category.name
          this.officialsData.category.fullPath = categoryPath.category.fullPath

          this.officialsData.notes = []
          this.officialsData.userExts = {}
          this.requestOfficalsData()
        } else {
          //如果没有官方公告则获取最新回复
          categoryPath = this.currentCategoriesHash['/note/replies/:id']
          if (categoryPath && categoryPath.category) {
            this.officialsData.category.id = categoryPath.category.id
            this.officialsData.category.name = categoryPath.category.name
            this.officialsData.category.fullPath = categoryPath.category.fullPath

            this.officialsData.notes = []
            this.officialsData.userExts = {}
            this.requestRepliesData()
          }
        }
        //获取本周热点
        categoryPath = this.currentCategoriesHash['/note/weekhots/:id']
        if (categoryPath && categoryPath.category) {
          this.weekhotsData.category.id = categoryPath.category.id
          this.weekhotsData.category.name = categoryPath.category.name
          this.weekhotsData.category.fullPath = categoryPath.category.fullPath

          this.weekhotsData.notes = []
          this.weekhotsData.userExts = {}
          this.requestWeekhotData(function(response){
            this.$nextTick(() => {//dom渲染之后执行
                this.$refs.noteListScroller.reset({
                top: 0
              })
            })
          })
        }
        //获取最新帖子
        categoryPath = this.currentCategoriesHash['/note/recents/:id']
        if (categoryPath && categoryPath.category) {
          this.recentsData.category.id = categoryPath.category.id
          this.recentsData.category.name = categoryPath.category.name
          this.recentsData.category.fullPath = categoryPath.category.fullPath

          this.recentsData.notes = []
          this.recentsData.userExts = {}
          this.requestRecentsData(function(response){
            this.$nextTick(() => {//dom渲染之后执行
                this.$refs.noteListScroller.reset({
                top: 0
              })
            })
          })
        }
      }
      window.addEventListener('orientationchange', function() {
        this.clientHeight = document.documentElement.clientHeight
      }.bind(this))
    },
    activated () {
      this.$nextTick(() => {//dom渲染之后执行
        this.$refs.noteListScroller.reset()
      })
    },
    methods: {
      onError (e) {
        e.target.src = this.$common.UserExt.getHeadPhotoUrl('', '', 75)
      },
      onLink (category) {
        this.$router.push(category.fullPath)
      },
      onPullup () {
        this.onLink(this.recentsData.category)
        this.$refs.noteListScroller.donePullup()
      },
      requestOfficalsData(callback) {
        if (this.officialsData.category.id && this.officialsData.category.id.length > 0) {
          Util.ajax.get('/note/find_official_notes/' + this.officialsData.category.id + '/0/' + this.officialsData.page.pageSize + '/').then((response) => {
            let userExts = response.data.data.topUserExts
            if (userExts != null && userExts.length > 0) {
              for (let userExt of userExts) {
                this.officialsData.userExts[userExt.userId] = userExt
              }
            }
            let notes = response.data.data.topNotes
            if (notes != null && notes.length > 0) {
              for (let note of notes) {
                note.visited = false
                this.officialsData.notes.push(note)
              }
            }
            let noteLength = 4 - this.officialsData.notes.length
            if (noteLength > 0) {
              userExts = response.data.data.userExts
              if (userExts != null && userExts.length > 0) {
                for (let userExt of userExts) {
                  this.officialsData.userExts[userExt.userId] = userExt
                }
              }
              notes = response.data.data.notes
              if (notes != null && notes.length > 0) {
                if (noteLength > notes.length) {
                  noteLength = notes.length
                }
                for (let i=0; i<noteLength; i++) {
                  let note = notes[i]
                  note.visited = false
                  this.officialsData.notes.push(note)
                }
              }
            }
            if (callback) {
              callback.call(this, response)
            }
          })
        }
      },
      requestRepliesData(callback) {
        if (this.officialsData.category.id && this.officialsData.category.id.length > 0) {
          Util.ajax.get('/note/find_replies/' + this.officialsData.category.id + '/1/' + this.officialsData.page.pageSize + '/').then((response) => {
            let userExts = response.data.data.userExts
            if (userExts != null && userExts.length > 0) {
              for (let userExt of userExts) {
                this.officialsData.userExts[userExt.userId] = userExt
              }
            }
            let notes = response.data.data.notes
            if (notes != null && notes.length > 0) {
              for (let note of notes) {
                note.visited = false
                this.officialsData.notes.push(note)
              }
            }
            if (callback) {
              callback.call(this, response)
            }
          })
        }
      },
      requestRecentsData(callback) {
        Util.ajax.get('/note/find_recents/' + this.recentsData.category.id + '/0/' + this.recentsData.page.pageSize + '/').then((response) => {
          let notes = response.data.data.notes
          let userExts = response.data.data.userExts
          if (userExts != null && userExts.length > 0) {
            for (let userExt of userExts) {
              this.recentsData.userExts[userExt.userId] = userExt
            }
          }
          if (notes != null && notes.length > 0) {
            for (let note of notes) {
              note.visited = false
              this.recentsData.notes.push(note)
              this.recentsData.page.pageNextId = note.noteId
            }
          }
          if (callback) {
            callback.call(this, response)
          }
        })
      },
      requestWeekhotData(callback) {
        Util.ajax.get('/note/find_index_weekhots/' + this.weekhotsData.category.id + '/1/' + this.weekhotsData.page.pageSize + '/').then((response) => {
          let notes = response.data.data.notes
          let userExts = response.data.data.userExts
          if (userExts != null && userExts.length > 0) {
            for (let userExt of userExts) {
              this.weekhotsData.userExts[userExt.userId] = userExt
            }
          }
          if (notes != null && notes.length > 1) {//少于两条不显示
            for (let note of notes) {
              note.visited = false
              this.weekhotsData.notes.push(note)
            }
          }
          this.weekhotsData.page.pageNo++
          if (callback) {
            callback.call(this, response)
          }
        })
      },
      hasTag (hasTag, tag) {
        return hasTag.split(',').indexOf(tag) > -1
      }
    },
    computed: {
      extsWidth: function () {
        return (100 / this.currentUser.snsUserExts.length).toFixed(6)
      },
      ...mapGetters([
        'currentUser',
        'currentConfigs',
        'currentCategoriesHash'
      ])
    }
  }
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }
  .box {
    background-color: #141A23;
    border: 1px #1C222D solid;
    overflow: hidden;
  }
  .head-row {
    width: 100%;
    display: table;
  }
  .head-row .head-body {
    display: table-row;
  }
  .head-row .head-body .text {
    width: 50%;
    display: table-cell;
    color: #85888D;
    font-size: 1.1rem;
    line-height: 1.0rem;
    vertical-align: middle;
  }
  .head-row .head-body .text > span {
    display: inline-block;
    border-left: 4px #EAC56B solid;
    padding-left: 10px;
  }
  .head-row .head-body .more {
    width: 50%;
    display: table-cell;
    color: #85888D;
    font-size: 0.9rem;
    line-height: 1.0rem;
    text-align: right;
    vertical-align: middle;
    cursor: pointer;
  }
  .head-row .head-body .arrow {
    width: 20px;
    color: #687991;
    cursor: pointer;
  }
  .head-row .head-body .arrow > i {
    font-size: 1.2rem;
    position: relative;
    top: 2px;
  }

  .index-box {
    height: 100%;
    padding: 10px;
    transform-origin: 0px 0px;
    transform: translate(0px, 0px) scale(1) translateZ(0px);
  }
  .index-box .content-box {
    width: 100%;
    height: 100%;
    padding-bottom: 35px;
  }
  .content-box .user-box {
    height: 40%;
    padding: 10px;
  }
  .content-box .note-box {
    height: 60%;
    padding: 10px 0 0;
    transform-origin: 0px 0px;
    transform: translate(0px, 0px) scale(1) translateZ(0px);
  }

  .user-box .user-head {
    display: flex;
  }
  .user-head .head-photo {
    height: 100%;
    overflow: hidden;
  }
  .user-head .head-photo > img {
    height: 100%;
    vertical-align: middle;
  }
  .user-head .head-name {
    width: 100%;
    height: 100%;
    padding-left: 10px;
    flex: 1;
  }
  .head-name .table {
    width: 100%;
    height: 100%;
  }
  .head-name .nick-name {
    color: #E6ECF5;
    font-size: 1.1rem;
    vertical-align: middle;
  }
  .head-name .level-name {
    color: #A18749;
    vertical-align: middle;
  }
  .user-box .user-body {
    width: 100%;
    height: 35%;
    font-size: 0.8rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-top: 5px;
  }
  .user-body li {
    height: 50%;
    list-style-type: none;
    border-right: 1px #3D3E45 solid;
  }
  .user-body li:nth-last-child(1) {
    border-right: 0;
  }
  .user-body li:nth-last-child(2) {
    border-right: 0;
  }

  .notice-box {
    width: 100%;
    height: 30px;
    position: absolute;
    left: 0px;
    bottom: 0px;
    color: #777777;
    font-size: 1.1rem;
    line-height: 30px;
    padding-top: 5px;
  }
  .notice-box > i {
    position: relative;
    top: 4px;
    margin-right: 10px;
    color: #EAC56B;
    font-size: 22px;
  }
  .note-box .table {
    width: 100%;
    height: 100%;
  }
  .note-box .notice-body {
    width: 100%;
    height: 100%;
    padding: 10px 0 0;
  }
  .note-box .notice-body .table {
    width: 100%;
    height: 100%;
  }
  .note-box .notice-body .table-cell {
    height: 25%;
    padding: 0 10px;
    vertical-align: middle;
    border-bottom: 1px #1D2D3E solid;
  }
  .note-box .notice-body .table-row:last-child .table-cell {
    border-bottom: 0;
  }

  .note-list-panel {
    background-color: #141A23;
    border: 1px #1C222D solid;
  }
  .padding-top-10 {
    padding-top: 10px;
  }
  .padding-bottom-10 {
    padding-bottom: 10px;
  }
</style>

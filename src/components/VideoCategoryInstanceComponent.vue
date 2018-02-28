<template>
  <scroller lock-x scrollbar-y use-pullup use-pulldown ref="videoListScroller" :height="(clientHeight - 50) +'px'" @on-pulldown-loading="onPulldown" @on-pullup-loading="onPullup">
    <video-list-component :tops="topData.noteVideos" :bodys="bodyData.noteVideos" @on-play="onPlay"></video-list-component>
  </scroller>
</template>

<script>
  import Util from '../libs/util'
  import Scroller from 'components/vux/ScrollerClick'
  import VideoListComponent from 'components/VideoListComponent'

  export default {
    components: {
      Scroller,
      VideoListComponent
    },
    props: {
      category: Object
    },
    data () {
      return {
        clientHeight: document.documentElement.clientHeight,
        topData: {
          noteVideos: []
        },
        bodyData: {
          loaded: false,
          noteVideos: [],
          txOut: true,
          page: {
            pageNo: 1,
            pageSize: 12
          }
        }
      }
    },
    created () {
      if (!this.loaded && this.$route.params.id == this.category.id) {
        this.onPulldown()
        this.loaded = true
      }
      window.addEventListener('orientationchange', function() {
        this.clientHeight = document.documentElement.clientHeight
      }.bind(this))
    },
    activated () {
      this.$nextTick(() => {//dom渲染之后执行
        this.$refs.videoListScroller.reset()
      })
    },
    methods: {
      onPulldown () {
        this.topData.noteVideos = []
        this.bodyData.noteVideos = []
        this.bodyData.txOut = true
        this.bodyData.page.pageNo = 1
        this.requestData(function(response){
           this.$nextTick(() => {//dom渲染之后执行
             this.$refs.videoListScroller.donePulldown()
             this.$refs.videoListScroller.reset({
               top: 0
             })
             if (response.data.data.noteVideos.length < this.bodyData.page.pageSize) {
               this.$refs.videoListScroller.disablePullup()
             } else {
               this.$refs.videoListScroller.enablePullup()
             }
           })
        })
      },
      onPullup () {
        this.requestData(function(response){
          this.$nextTick(() => {//dom渲染之后执行
            this.$refs.videoListScroller.donePullup()
            if (response.data.data.noteVideos.length == 0) {
              this.$refs.videoListScroller.disablePullup()
            }
          })
        })
      },
      onPlay (item) {
        if (this.bodyData.txOut) {
          this.$vux.toast.show({
            text: '哎呦喂，播放视频的魔法突然失效了',
            type: 'cancel'
          })
          return false
        }
        this.$video.show({
          sources: [{
            type: 'video/mp4',
            src: this.$common.Oss.getCdnUrl(item.videoBucket, item.videoUrl)
          },{
            type: 'video/ogg',
            src: this.$common.Oss.getCdnUrl(item.videoBucket, item.videoUrl)
          },{
            type: 'video/webm',
            src: this.$common.Oss.getCdnUrl(item.videoBucket, item.videoUrl)
          }]
        })
      },
      requestData(callback) {
        if (this.category.id) {
          Util.ajax.get('/note/find_videos_by_category_id/' + this.category.id + '/' + this.bodyData.page.pageNo + '/' + this.bodyData.page.pageSize + '/', {params: {top: this.bodyData.page.pageNo == '1' ? '1' : ''}}).then((response) => {
            let topVideos = response.data.data.topVideos
            if (topVideos && topVideos.length > 0) {
              for (let noteVideo of topVideos) {
                noteVideo.visited = false
                this.topData.noteVideos.push(noteVideo)
              }
            }
            let noteVideos = response.data.data.noteVideos
            if (noteVideos && noteVideos.length > 0) {
              for (let noteVideo of noteVideos) {
                noteVideo.visited = false
                this.bodyData.noteVideos.push(noteVideo)
              }
            }
            this.bodyData.txOut = response.data.data.txOut
            this.bodyData.page.pageNo++
            if (callback) {
              callback.call(this, response)
            }
          })
        }
      }
    },
    watch: {
      '$route' (to, from) {
        if (!this.loaded && this.$route.params.id == this.category.id) {
          this.onPulldown()
          this.loaded = true
        }
      }
    }
  }
</script>

<template>
  <div class="video-list-panel">
    <div class="video-media" v-for="(item, index) in tops" :key="index">
      <div class="video-media-box tops">
        <div class="flex-box">
          <img class="play-o" src="../assets/images/play-o.png" @click="onPlay(item)">
          <img v-if="$common.Oss.startWithHttp(item.attachmentUrl)" :src="$common.Oss.getCdnUrl(item.bucket, item.attachmentUrl)" width="auto" height="100%">
          <img v-else :src="$common.Oss.getVideoSnapshotCdnUrl(item.videoBucket, item.videoUrl, 0, 0, 100)" width="auto" height="100%">
        </div>
        <router-link @click.native="onLink(item)" :to="'/note/' + item.noteId + '/'">
          <div class="avatar-box">
            <div class="avatar-text">
              <span class="note-label label-top">置顶</span>
              <span :style="item.visited ? 'color: #a1a2a3;' : ''">{{item.content | decode}}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="video-media" v-for="(item, index) in bodys" :key="index + tops.length">
      <div class="video-media-box bodys">
        <div class="flex-box">
          <img class="play-o" src="../assets/images/play-o.png" @click="onPlay(item)">
          <img v-if="$common.Oss.startWithHttp(item.attachmentUrl)" :src="$common.Oss.getCdnUrl(item.bucket, item.attachmentUrl)" width="auto" height="100%">
          <img v-else :src="$common.Oss.getVideoSnapshotCdnUrl(item.videoBucket, item.videoUrl, 0, 0, 100)" width="auto" height="100%">
        </div>
        <router-link @click.native="onLink(item)" :to="'/note/' + item.noteId + '/'">
          <div class="avatar-box">
            <div class="avatar-text">
              <span :style="item.visited ? 'color: #a1a2a3;' : ''">{{item.content | decode}}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      tops: Array,
      bodys: Array
    },
    methods: {
      onLink (item) {
        item.visited = true
      },
      onPlay (item) {
        this.$emit('on-play', item)
      }
    }
  }
</script>

<template>
  <div class="note-list-panel">
    <div v-if="tops && tops.notes && tops.notes.length > 0" class="tops">
      <div class="note-item" v-for="(note, index) in tops.notes" :key="index">
        <router-link class="post" @click.native="onLink(note)" :to="'/note/' + note.noteId + '/'">
          <div class="note-item-body">
            <div class="note-item-preview">
              <div v-if="hasTag(note.hasTag, '1')" class="video">
                <i class="gcicon gcicon-play" aria-hidden="true"></i>
              </div>
              <template v-if="note.tag == 1">
                <img v-if="$common.Oss.startWithHttp(note.attachmentUrl)" :src="$common.Oss.getImageResizeCdnUrl(note.bucket, note.attachmentUrl, 70, 40, '0E1319')" draggable="false">
                <img v-else :src="$common.Oss.getVideoSnapshotCdnUrl(note.videoBucket, note.videoUrl, 0, 70, 40)" draggable="false">
              </template>
              <template v-else-if="note.tag == 0">
                <img v-if="note.attachmentUrl.length > 0" :src="$common.Oss.getImageResizeCdnUrl(note.bucket, note.attachmentUrl, 70, 40, '0E1319')" draggable="false">
              </template>
              <span v-else>{{name}}</span>
            </div>
            <div class="note-text ellipsis">
              <span class="note-label label-top">置顶</span>
              <span :style="note.visited ? 'color: #a1a2a3;' : ''">{{note.content | decode}}</span>
              <i class="gcicon gcicon-picture" aria-hidden="true" v-if="hasTag(note.hasTag, '0')"></i>
              <i class="gcicon gcicon-video" aria-hidden="true" v-if="hasTag(note.hasTag, '1')"></i>
            </div>
            <div class="note-state">
              <div class="subtitle note-avatar-text ellipsis">
                <span class="user">{{tops.userExts[note.userId].nickName | decode}}</span>
                <span class="time">{{note.time | date-number-to-date | date-both-length}}</span>
              </div>
              <div class="subtitle note-bar ellipsis">
                <i class="gcicon gcicon-comment" aria-hidden="true"></i>
                <span class="comments">{{note.commentCount}}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="bodys && bodys.notes && bodys.notes.length > 0" class="bodys">
      <div class="note-item" v-for="(note, index) in bodys.notes" :key="index">
        <router-link class="post" @click.native="onLink(note)" :to="'/note/' + note.noteId + '/'">
          <div class="note-item-body">
            <div class="note-item-preview">
              <div v-if="hasTag(note.hasTag, '1')" class="video">
                <i class="gcicon gcicon-play" aria-hidden="true"></i>
              </div>
              <template v-if="note.tag == 1">
                <img v-if="$common.Oss.startWithHttp(note.attachmentUrl)" :src="$common.Oss.getImageResizeCdnUrl(note.bucket, note.attachmentUrl, 70, 40, '0E1319')" draggable="false">
                <img v-else :src="$common.Oss.getVideoSnapshotCdnUrl(note.videoBucket, note.videoUrl, 0, 70, 40)" draggable="false">
              </template>
              <template v-else-if="note.tag == 0">
                <img v-if="note.attachmentUrl.length > 0" :src="$common.Oss.getImageResizeCdnUrl(note.bucket, note.attachmentUrl, 70, 40, '0E1319')" draggable="false">
              </template>
              <span v-else>{{name}}</span>
            </div>
            <div class="note-text ellipsis">
              <span :style="note.visited ? 'color: #a1a2a3;' : ''">{{note.content | decode}}</span>
              <i class="gcicon gcicon-picture" aria-hidden="true" v-if="hasTag(note.hasTag, '0')"></i>
              <i class="gcicon gcicon-video" aria-hidden="true" v-if="hasTag(note.hasTag, '1')"></i>
            </div>
            <div v-if="mode == 1" class="note-state">
              <div class="subtitle note-avatar-text ellipsis">
                <span class="user">{{bodys.userExts[note.userId].nickName | decode}}</span>
              </div>
              <div class="subtitle note-bar ellipsis">
                <span class="time">{{note.time | date-number-to-date | date-both-length}}</span>
              </div>
            </div>
            <div v-else class="note-state">
              <div class="subtitle note-avatar-text ellipsis">
                <span class="user">{{bodys.userExts[note.userId].nickName | decode}}</span>
                <span class="time">{{note.time | date-number-to-date | date-both-length}}</span>
              </div>
              <div class="subtitle note-bar ellipsis">
                <i class="gcicon gcicon-comment" aria-hidden="true"></i>
                <span class="comments">{{note.commentCount}}</span>
              </div>
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
      name: String,
      tops: Object,
      bodys: Object,
      mode: String
    },
    methods: {
      hasTag (hasTag, tag) {
        return hasTag.split(",").indexOf(tag) > -1
      },
      onLink (note) {
        note.visited = true
      }
    }
  }
</script>

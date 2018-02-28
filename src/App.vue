<template>
  <div id="app" class="height-auto">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <flexbox :gutter="0" :align="'flex-start'" class="height-auto">
      <flexbox-item id="app-center-box">
        <transition :name="'fade'">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </flexbox-item>
      <flexbox-item v-if="categories && categories.length > 1" id="app-left-box" style="flex: 0 0 50px;" :order="-1">
        <nav-component :categories="categories"></nav-component>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import { Flexbox, FlexboxItem, Loading, TransferDomDirective as TransferDom } from 'vux'
  import { mapGetters } from 'vuex'
  import NavComponent from 'components/NavComponent.vue'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Flexbox,
      FlexboxItem,
      Loading,
      NavComponent
    },
    data () {
      return {
        categories: []
      }
    },
    created () {
      if (this.currentCategories && this.currentCategories.length > 0) {
        for (let category of this.currentCategories) {
          if (category.type == '1' && category.level == '1') {
            //一级菜单
            this.categories.push(category)
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'currentCategories'
      ])
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';

  html, body {
    color: #C5CBD8;
    overflow: hidden;
  }
  a {
    color: #C5CBD8;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  @media all and (orientation: portrait) {
  }
  @media all and (orientation: landscape) {
  }
  .subtitle {
    color: #687991;
  }
  .ellipsis {
    white-space: nowrap;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .clearfix {
    clear: both;
  }

  .message-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .message-card .message-body {
    margin: 0px auto;
    text-align: center;
  }
  .message-body .message-text {
    margin-top: 10px;
  }
  .message-body .message-bar {
    margin-top: 10px;
  }
  .message-body .message-btn {
    width: 150px;
    padding: 5px;
    font-size: 15px;
    background-color: #FDD059;
    color: #1E2B40;
  }

  .note-list-panel {
    margin: auto;
  }
  .note-list-panel .note-item .post .note-item-body {
    padding: 0px 0px 0px 80px;
    position: relative;
  }
  .note-list-panel .note-item .post .note-item-preview {
    width: 70px;
    height: 45px;
    line-height: 45px;
    color: #5A6F86;
    text-align: center;
    position: absolute;
    top: 0px;
    left: 0px;
    border: 1px #1E2431 solid;
    box-sizing: border-box;
    background-color: #141A23;
  }
  .note-list-panel .note-item .post .note-item-preview .video {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(20, 26, 38, .5);
  }
  .note-list-panel .note-item .post .note-item-preview .video > i {
    position: absolute;
    margin: auto;
    font-size: 20px;
    color: #fff;
    width: 20px;
    height: 20px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .note-list-panel .note-item .post .note-item-preview > img {
    width: 100%;
    height: 100%;
  }
  .note-list-panel .note-item > a {
    padding: 10px;
    display: block;
    border-bottom: 1px #1D2430 solid;
  }
  .note-list-panel .note-item:last-child > a {
    border-bottom: 0;
  }
  .note-list-panel .tops .note-item .note-text {
    width: 100%;
    height: 25px;
    line-height: 25px;
    color: #EAC56B;
  }
  .note-list-panel .bodys .note-item .note-text {
    width: auto;
    height: 25px;
    line-height: 25px;
  }
  .note-list-panel .note-item .gcicon {
    font-size: 18px;
    position: relative;
    top: 3px;
    display: inline-block;
  }
  .note-list-panel .note-item .gcicon-picture {
    color: #00BFF8;
  }
  .note-list-panel .note-item .gcicon-video {
    color: #FE743D;
  }
  .note-list-panel .note-item .note-state {
    display: flex;
    height: 20px;
    line-height: 20px;
  }
  .note-list-panel .note-item .note-avatar {
    height: 40px;
    width: 40px;
    margin-right: 20px;
    text-align: center;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .note-list-panel .note-item .note-avatar img {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: block;
  }
  .note-list-panel .note-item .note-avatar-text {
    width: 50%;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  .note-list-panel .note-item .note-avatar-text .time {
    margin-left: 20px;
  }
  .note-list-panel .note-item .note-bar {
    width: 50%;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    text-align: right;
  }
  .note-list-panel .note-item .note-bar .gcicon {
    margin-left: 10px;
    font-size: 16px;
  }
  .note-list-panel .note-label {
    display: inline;
    padding: 1px 2px 2px;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
  }
  .note-list-panel .note-label.label-top {
    font-size: 12px;
    color: #fff;
    background-color: #F43330;
  }

  .note-grid-panel {
    display: flex;
    flex-wrap: wrap;
  }
  .note-grid-panel .note-col:last-child {
    width: 50%;
    padding-left: 5px;
    padding-right: 0px;
  }
  .note-grid-panel .note-col:first-child {
    width: 50%;
    padding-left: 0px;
    padding-right: 5px;
  }
  .note-grid-panel .note-media {
    height: 100%;
    padding: 10px;
    background-color: #141A23;
    border: 1px #1C222D solid;
    margin: 0px;
    box-sizing: border-box;
  }
  .note-grid-panel .note-media .video {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(20, 26, 38, .5);
  }
  .note-grid-panel .note-media .video > i {
    position: absolute;
    margin: auto;
    font-size: 30px;
    color: #fff;
    width: 30px;
    height: 30px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .note-grid-panel .note-media .flex-box {
    display: flex;
    width: 100%;
    height: 100px;
    // flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #0e1319;
    position: relative;
  }
  .note-grid-panel .note-media .flex-box > span {
    color: #5A6F86;
    font-size: 1.2rem;
  }
  .note-grid-panel .note-media .flex-box > i {
    color: #FFF;
    font-size: 2.5rem;
    z-index: 1;
    position: absolute;
    width: 35px;
    height: 35px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .note-grid-panel .note-media .flex-link {
    display: block;
  }
  .note-grid-panel .note-media .note-text {
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  .note-grid-panel .note-media .avatar-box {
    width: 100%;
    height: 38px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .note-grid-panel .note-media .avatar-box .avatar-head {
    width: 38px;
    height: 38px;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .note-grid-panel .note-media .avatar-box .avatar-head > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .note-grid-panel .note-media .avatar-box .avatar-text {
    width: 100%;
    padding: 0 22px 0 52px;
    display: block;
  }
  .note-grid-panel .note-media .avatar-box .avatar-text .name {
    font-size: 0.8rem;
    line-height: 0,8rem;
  }
  .note-grid-panel .note-media .avatar-box .avatar-text .time {
    font-size: 0.8rem;
    line-height: 0,8rem;
  }
  .note-grid-panel .note-media .avatar-box .avatar-right {
    height: 38px;
    text-align: right;
    line-height: 38px;
    position: absolute;
    top: 0;
    right: 0px;
  }
  .note-grid-panel .note-media .avatar-box .avatar-right > i {
    position: relative;
    top: 3px;
    font-size: 1.2rem;
  }

  .video-list-panel {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    box-sizing: border-box;
  }
  .video-list-panel .video-media {
    width: 50%;
    padding: 5px;
    box-sizing: border-box;
  }
  .video-list-panel .video-media-box {
    margin: 0px;
    border: 1px #1D2D3E solid;
    background-color: #141A23;
  }
  .video-list-panel .video-media-box .flex-box {
    display: flex;
    width: 100%;
    height: 100px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #0E1319;
    position: relative;
  }
  .video-list-panel .video-media-box .flex-box .play-o {
    color: #fff;
    font-size: 50px;
    z-index: 1;
    position: absolute;
    width: 50px;
    height: 50px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .video-list-panel .video-media-box .avatar-box {
    width: 100%;
    display: flex;
    padding: 5px 10px 5px 10px;
    box-sizing: border-box;
  }
  .video-list-panel .video-media-box .avatar-box .avatar-text {
    width: 100%;
    height: 40px;
    line-height: 40px;
    white-space: nowrap;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  .video-list-panel .video-media-box.tops .avatar-box .avatar-text {
    color: #EAC56B;
  }
  .video-list-panel .video-media-box.bodys .avatar-box .avatar-text {
    color: inherit;
  }
  .video-list-panel .note-label {
    display: inline;
    padding: 1px 2px 2px;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
  }
  .video-list-panel .note-label.label-top {
    font-size: 12px;
    color: #fff;
    background-color: #F43330;
  }

  .comment-list-panel .comment-head {
    width: 100%;
    vertical-align: top;
    border-bottom: 1px #1D2430 solid;
  }
  .comment-list-panel .comment-head-body {
    width: 100%;
  }
  .comment-list-panel .comment-head-body .comment-text {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
  }
  .comment-list-panel .comment-mood {
    vertical-align: middle;
    text-align: center;
    width: 60px;
    border-bottom: 1px #1D2430 solid;
  }
  .comment-list-panel .comment-mood .gcicon-like {
    font-size: 26px;
    color: #FDD059;
  }
  .comment-list-panel .comment-mood .gcicon-hate {
    font-size: 26px;
    color: #5D6E84;
  }
  .comment-list-panel .comment-mood .gcicon-comment {
    font-size: 26px;
    color: #FDD059;
  }
  .comment-list-panel .comment-avatar {
    width: 100%;
    vertical-align: top;
    padding-top: 10px;
    padding-left: 10px;
  }
  .comment-list-panel .comment-avatar-body {
    width: 100%;
  }
  .comment-list-panel .comment-avatar-body .head-photo {
    width: 50px;
    line-height: 0;
  }
  .comment-list-panel .comment-avatar-body .head-photo > img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
  .comment-list-panel .comment-avatar-body .head-name {
    width: 100%;
    padding-left: 20px;
    vertical-align: top;
    height: 25px;
    line-height: 25px;
  }

  .nav-category {
    position: relative;
    overflow: hidden;
  }
  .nav-category .scroller {
    background-color: #1E2B3F;
  }
  .nav-category .scroller.m-r-80 {
    margin-right: 80px;
  }
  .nav-category .label {
    float: left;
    height: 50px;
    white-space: nowrap;
  }
  .nav-category .label > a {
    display: inline-block;
    font-size: 1.1rem;
    padding: 0px 20px;
    height: 50px;
    line-height: 50px;
  }
  .nav-category .label > a.active {
    color: #EAC56B;
    background-color: #2E3D52;
    border-bottom: 2px #EAC56B solid;
    box-sizing: border-box;
  }
  .nav-category .post {
    width: 80px;
    height: 100%;
    padding-right: 35px;
    position: absolute;
    top: 0px;
    right: 0px;
    text-align: center;
    box-sizing: border-box;
    text-decoration: none !important;
    color: #1E2B40 !important;
    font-size: 1.1rem;
    font-weight: 400;
    background-color: #FDD059;
    cursor: pointer;
    user-select: none;
  }
  .nav-category .post:active {
    background-color: #DCB856;
  }
  .nav-category .post > div {
    position: absolute;
    top: 13px;
    right: 10px;
    z-index: 0;
  }
  .nav-category .post > i {
    font-size: 25px;
    line-height: 50px;
  }

  .vux-flexbox .vux-flexbox-item {
    height: 100%;
    position: relative;
  }
  .vux-loading .weui-toast {
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background: rgba(39, 61, 98, .9);
  }
  .vux-toast .weui-toast {
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background: rgba(39, 61, 98, .9);
  }
  .vux-toast .weui-toast .weui-toast__content {
    font-size: 1.1rem;
  }
  .vux-x-dialog .weui-dialog {
    background: rgba(39, 61, 98, 1);
    color: #E6ECF5;
  }
  .vux-x-dialog .weui-dialog .weui-dialog__ft {
    line-height: 45px;
    font-size: 1.1rem;
  }
  .vux-x-dialog .weui-dialog .weui-dialog__title {
    font-weight: 400;
    font-size: 1.1rem;
  }
  .vux-x-dialog .weui-dialog .weui-dialog__btn {
    font-weight: 400;
  }
  .vux-x-dialog .weui-dialog .weui-dialog__btn:active {
    background-color: #FDD059;
    color: #1E2B40;
  }
  .vux-x-dialog .weui-dialog .weui-dialog__btn_default {
    color: #E6ECF5;
  }
  .vux-x-dialog .weui-dialog .weui-dialog__btn_primary {
    color: #E6ECF5;
  }

  .fade-enter-active {
    transition: opacity .5s
  }
  .fade-enter {
    opacity: 0
  }

  .table {
    display: table;
    table-layout: fixed;
  }
  .table .table-row {
    display: table-row;
  }
  .table .table-row .table-cell {
    display: table-cell;
  }

  .height-auto {
    height: 100%;
  }
  .ellipsis {
    white-space: nowrap;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: #586B85;
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    color: #586B85;
  }
</style>

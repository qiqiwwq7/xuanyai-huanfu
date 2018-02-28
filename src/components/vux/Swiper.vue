<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div v-for="(item, index) in list" :key="index" :class="slideIndex == index ? 'swiper-slide slide-selected' : 'swiper-slide'" @click="onItemClick($event, item, index)">
        <div v-if="item.tag == 1" class="video">
          <i class="gcicon gcicon-play" aria-hidden="true"></i>
        </div>
        <div class="flex-box">
          <template v-if="item.tag == 1">
            <img v-if="$common.Oss.startWithHttp(item.attachmentUrl)" :src="$common.Oss.getImageResizeCdnUrl(item.bucket, item.attachmentUrl, 0, 100, '0E1319')" :width="getCssWidth(item)" :height="getCssHeight(item)">
            <img v-else :src="$common.Oss.getVideoSnapshotCdnUrl(item.videoBucket, item.videoUrl, 0, 0, 100)" draggable="false">
          </template>
          <template v-else>
            <img :src="$common.Oss.getImageResizeCdnUrl(item.bucket, item.attachmentUrl, 0, 100, '0E1319')" :width="getCssWidth(item)" :height="getCssHeight(item)">
          </template>
        </div>
      </div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination"></div>
    <!-- Add Arrows -->
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.min.css'
  import 'swiper/dist/js/swiper.min.js'

  export default {
    props: {
      list: Array
    },
    data () {
      return {
        swiper: undefined,
        slideIndex: 0,
        scale: 200
      }
    },
    created () {
      this.$nextTick(() => {//dom渲染之后执行
        this.swiper = new Swiper('.swiper-container', {
          slidesPerView: 5,
          paginationClickable: true,
          centeredSlides: true,
          followFinger: false,
          onlyExternal: true
        })
      })
    },
    destroyed () {
      this.swiper.destroy()
    },
    methods: {
      getCssWidth (item) {
        let w = parseInt(item.attachmentWidth)
        let h = parseInt(item.attachmentHeight)
        if (w > 0 && h > 0) {
          if (w > h) {
            return '100%'
          } else {
            return 'auto'
          }
        }
        return '100%'
      },
      getCssHeight (item) {
        let w = parseInt(item.attachmentWidth)
        let h = parseInt(item.attachmentHeight)
        if (w > 0 && h > 0) {
          if (h > w) {
            return '100%'
          } else {
            return 'auto'
          }
        }
        return '100%'
      },
      onItemClick (e, item, index) {
        this.swiper.slideTo(index)
        this.slideIndex = index
        this.$emit('on-item-click', e, item, index)
      }
    }
  }
</script>

<style scoped>
.swiper-container {
  width: 100%;
  height: auto;
}
.swiper-wrapper {
  height: 100px;
  align-items: center;
}
.swiper-slide {
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 5px;
  background-color: #000;
  text-align: center;
  line-height: 0px;
}
.swiper-slide.slide-selected {
  border: 5px #FDD059 solid;
}
.swiper-slide .flex-box {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.swiper-slide .video {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(20, 26, 38, .5);
}
.swiper-slide .video > i {
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
.swiper-button-prev {
  display: none;
}
.swiper-button-next {
  display: none;
}
</style>

<template>
  <div class="selector-box">
    <div class="selector-box-item" v-for="(item, index) in list" :key="index">
      <div class="selector-box-item-box">
        <div v-if="item.tag == 1" class="layout video">
          <i class="gcicon gcicon-play" aria-hidden="true"></i>
          <img class="selector-box-item-close" src="../../assets/images/icon-close.png" @click="onCancel(index)">
          <div class="selector-box-item-text">
            <div class="text"><span>{{getSize(item.tag == 1 ? item.videoOriginSize : item.attachmentOriginSize)}}</span></div>
          </div>
        </div>
        <div v-else class="layout">
          <img class="selector-image" v-if="item.tag == 0" :src="getObjectURL(item.file)" @load="onImgLoad($event, item)">
          <img class="selector-box-item-close" src="../../assets/images/icon-close.png" @click="onCancel(index)">
          <div class="selector-box-item-text">
            <div class="text"><span>{{getSize(item.tag == 1 ? item.videoOriginSize : item.attachmentOriginSize)}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="selector-box-item" v-if="list.length < max">
      <div class="selector-box-item-box">
        <div class="layout add">
          <input-file class="input-file" @on-file-change="onFileChange"></input-file>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SparkMD5 from 'spark-md5/spark-md5.min'
  import InputFile from 'components/vux/InputFile'

  export default {
    components: {
      InputFile
    },
    props: {
      max: Number,
      list: Array
    },
    data () {
      return {
        compress_size: 512000,//byte
        pic_max_size: 10 * 1024 * 1024,//byte
        video_max_size: 100 * 1024 * 1024,//byte
        video_max_duration: 300 * 1000,//second
        file_chunk_size: 2097152,//read in chunks of 2MB
        file_blob_slice: File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
        loading: {
          index: 0,
          count: 0
        }
      }
    },
    watch: {
      'loading.index' (val) {
        if (val == this.loading.count) {
          this.loading.index = 0
          this.loading.count = 0
        }
      },
      'loading.count' (val) {
        if (val > 0) {
          this.$store.dispatch('setLoading', true)
        } else {
          this.$store.dispatch('setLoading', false)
        }
      }
    },
    methods: {
      getMd5 (arrayBuffer) {
        return new SparkMD5.ArrayBuffer().append(arrayBuffer).end()
      },
      getObjectURL (file) {
         return window.URL.createObjectURL(file)
      },
      getSuffix (name, mime_type) {
        if (name.lastIndexOf(".") > -1) {
          return name.substring(name.lastIndexOf(".")).toLowerCase()
        } else {
          return mime_type.replace(/image\/|video\//g, '')
        }
      },
      getUnit (unit) {
        if (unit == 1) {
          return 'KB'
        } else if (unit == 2) {
          return 'MB'
        } else if (unit == 3) {
          return 'GB'
        }
      },
      getSize (fileSize, unit) {
        if (!unit) {
          unit = 1
        }
        let val = fileSize / 1024
        if (val >= 1024) {
          unit++
          return this.getSize(val, unit)
        }
        return val.toFixed(2) + this.getUnit(unit)
      },
      loadNext (fileReader, file, currentChunk) {
        let start = currentChunk * this.file_chunk_size
        let end = start + this.file_chunk_size >= file.size ? file.size : start + this.file_chunk_size
        fileReader.readAsArrayBuffer(this.file_blob_slice.call(file, start, end))
      },
      read (file) {
        if (file.type == 'video/mp4') {
          this.readToMp4(file)
        } else if (file.type == 'video/quicktime') {
          this.readToMov(file)
        } else {
          this.readToCVS(file)
        }
      },
      readToMov (file) {
        if (file.size > this.video_max_size) {
          this.loading.index++
          this.$emit('on-error', '视频大小不能超过100MB')
          return false
        }
        let scope = this
        let fileReader = new FileReader(), chunks = Math.ceil(file.size / this.file_chunk_size), currentChunk = 0
        let spark = new SparkMD5.ArrayBuffer()
        fileReader.onload = function(e) {
          spark.append(e.target.result)
          currentChunk++
          if (currentChunk < chunks) {
            scope.loadNext(fileReader, file, currentChunk)
          } else {
            let md5 = spark.end()
            if (scope.list.length < scope.max) {
              scope.list.push({
                tag: 1,
                videoUrl: md5 + scope.getSuffix(file.name, file.type),
                videoOriginSize: file.size,
                videoDuration: 0,
                file: file
              })
              scope.loading.index++
              scope.$emit('on-select')
            }
          }
        }
        scope.loadNext(fileReader, file, currentChunk)
      },
      readToMp4 (file) {
        if (file.size > this.video_max_size) {
          this.loading.index++
          this.$emit('on-error', '视频大小不能超过100MB')
          return false
        }
        let scope = this
        let fileReader = new FileReader(), chunks = Math.ceil(file.size / this.file_chunk_size), currentChunk = 0
        let spark = new SparkMD5.ArrayBuffer()
        const Mp4boxModule = require('mp4box')
        let mp4box = new Mp4boxModule.MP4Box()
        fileReader.onload = function(e) {
          spark.append(e.target.result)
          let buffer = e.target.result
          buffer.fileStart = currentChunk * scope.file_chunk_size
          mp4box.appendBuffer(buffer)
          currentChunk++
          if (currentChunk < chunks) {
            scope.loadNext(fileReader, file, currentChunk)
          } else {
            let md5 = spark.end()
            let info = mp4box.getInfo()
            if (!info.hasMoov) {
              mp4box.flush()
              scope.loading.index++
              scope.$emit('on-error', '加载视频文件失败')
              return false
            }
            if (info.duration > scope.video_max_duration) {
              mp4box.flush()
              scope.loading.index++
              scope.$emit('on-error', '视频时长不能超过5分钟')
              return false
            }
            if (scope.list.length < scope.max) {
              scope.list.push({
                tag: 1,
                videoUrl: md5 + scope.getSuffix(file.name, file.type),
                videoOriginSize: file.size,
                videoDuration: info.duration,
                file: file
              })
              scope.loading.index++
              scope.$emit('on-select')
            }
            mp4box.flush()
          }
        }
        scope.loadNext(fileReader, file, currentChunk)
      },
      readToCVS (file) {
        if (file.size > this.pic_max_size) {
          this.loading.index++
          this.$emit('on-error', '图片大小不能超过10MB')
          return false
        }
        let scope = this
        let fileReader = new FileReader(), chunks = Math.ceil(file.size / this.file_chunk_size), currentChunk = 0
        let spark = new SparkMD5.ArrayBuffer()
        fileReader.onload = function(e) {
          spark.append(e.target.result)
          currentChunk++
          if (currentChunk < chunks) {
            scope.loadNext(fileReader, file, currentChunk)
          } else {
            let md5 = spark.end()
            if (scope.list.length < scope.max) {
              scope.list.push({
                tag: 0,
                attachmentUrl: md5 + scope.getSuffix(file.name, file.type),
                attachmentOriginSize: file.size,
                attachmentWidth: 0,
                attachmentHeight: 0,
                file: file
              })
              scope.loading.index++
              scope.$emit('on-select')
            }
          }
        }
        scope.loadNext(fileReader, file, currentChunk)
      },
      onFileChange (files) {
        let count = this.max - this.list.length
        if (count > files.length) {
          this.loading.count = files.length
        } else {
          this.loading.count = count
        }
        if (this.list.length + files.length > this.max) {
          this.$emit('on-error', '最多选择9张图片')
        }
        if (files.length > 1) {
          for (let i = 0; i < files.length; i++) {
            this.read(files[i])
          }
        } else {
          this.read(files[0])
        }
      },
      onClick () {
        this.$emit('on-item-click')
      },
      onCancel (index) {
        this.list.splice(index, 1)
      },
      onImgLoad (dom, item) {
        let _img = dom.target
        let _parent_div = _img.parentNode
        let _w = _img.width
        let _h = _img.height
        item.attachmentWidth = _w
        item.attachmentHeight = _h
        let _d_w = _parent_div.clientWidth
        let _d_h = _parent_div.clientHeight
        if (_w > _d_w || _h > _d_h) {
          if (_w > _d_w && _h < _d_h) {
            _img.style.width = _d_w + 'px'
          } else if (_w < _d_w && _h > _d_h) {
            _img.style.height = _d_h + 'px'
          } else {
            //如果图片的宽、高都超出容器布局，则图片的宽度=容器的宽度，图片的高度=图片的高度*图片的宽度的缩小比例
            if (_w > _h) {
              let _s = ((_w - _d_w) / _w).toFixed(2)
              let _r_h = parseInt(_h - _h * _s)
              if (_r_h > _d_h) {
                _s = ((_r_h - _d_h) / _r_h).toFixed(2)
                let _r_w = parseInt(_d_w - _d_w * _s)
                _img.style.width = _r_w + 'px'
                _img.style.height = _d_h + 'px'
              } else {
                _img.style.width = _d_w + 'px'
                _img.style.height = _r_h + 'px'
              }
            } else {
              let _s = ((_h - _d_h) / _h).toFixed(2)
              let _r_w = parseInt(_w - _w * _s)
              if (_r_w > _d_w) {
                _s = ((_r_w - _d_w) / _r_w).toFixed(2)
                let _r_h = parseInt(_d_h - _d_h * _s)
                _img.style.width = _d_w + 'px'
                _img.style.height = _r_h + 'px'
              } else {
                _img.style.width = _r_w + 'px'
                _img.style.height = _d_h + 'px'
              }
            }
          }
        }
        _img.style.visibility = 'visible'
      }
    }
  }
</script>

<style scoped>
  .selector-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  @media all and (orientation : landscape) {
    /*横屏*/
    .selector-box .selector-box-item {
      width: 25%;
      height: auto;
      position: relative;
      padding-bottom: 25%;
    }
  }
  @media all and (orientation : portrait){
    /*竖屏*/
    .selector-box .selector-box-item {
      width: 50%;
      height: auto;
      position: relative;
      padding-bottom: 50%;
    }
  }
  .selector-box .selector-box-item .selector-box-item-box {
    width: 100%;
    height: 100%;
    padding: 15px;
    position: absolute;
    box-sizing: border-box;
  }
  .selector-box-item-box .selector-image {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    position: absolute;
    visibility: hidden;
  }
  .selector-box-item-box .layout {
    width: 100%;
    height: 100%;
    border: 2px #212634 dashed;
    box-sizing: border-box;
  }
  .selector-box-item-box .layout.add {
    background: #0E1319 url(../../assets/images/plus.png) no-repeat center center;
    background-position: center center;
  }
  .selector-box-item-box .layout.video .gcicon {
    font-size: 30px;
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: auto;
    color: #fff;
  }
  .selector-box .selector-box-item .selector-box-item-text {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 50px;
    padding: 15px;
    box-sizing: border-box;
  }
  .selector-box .selector-box-item .selector-box-item-text .text {
    background: rgba(0,0,0,.7);
    font-size: 13px;
    color: #C5CBD8;
  }
  .selector-box .selector-box-item .selector-box-item-close {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 35px;
    color: #202634;
  }
</style>

<template>
  <div class="nav-category">
    <scroller lock-y :class="rightBtn && showRightBtn ? 'scroller m-r-80' : 'scroller'">
      <div class="label">
        <a href="javascript:void(0)" v-for="(category, index) in categories" :key="index" :class="getActiveClass(category)" @click="onItemClick(category)">{{category.name}}</a>
      </div>
      <div class="clearfix"></div>
    </scroller>
    <div v-if="rightBtn" v-show="showRightBtn" class="post" @click="onPost()">
      <i :class="rightBtn.icon" aria-hidden="true"></i>
      <div>{{rightBtn.text}}</div>
    </div>
  </div>
</template>

<script>
  import {Tab, TabItem, Scroller} from 'vux'
  import InputFile from 'components/vux/InputFile'

  export default {
    components: {
      Tab,
      TabItem,
      Scroller,
      InputFile
    },
    props: {
      rightBtn: Object
    },
    data () {
      return {
        showRightBtn: false,
        categories: []
      }
    },
    created () {
      if (this.$store.getters.currentCategories != null) {
        for (let currentCategory of this.$store.getters.currentCategories) {
          if (this.isSelected(currentCategory.fullPath) && currentCategory.children && currentCategory.children.length > 0) {
            for (let child of currentCategory.children) {
              this.categories.push(child)
            }
            break
          }
        }
      }
      if (this.rightBtnRegex.test(this.$route.fullPath)) {
        this.showRightBtn = true
      }
    },
    methods: {
      isSelected(fullPath) {
        return this.$route.path.startsWith(fullPath)
      },
      getActiveClass (category) {
        return this.isSelected(category.fullPath) ? 'active' : ''
      },
      onItemClick (category) {
        this.$router.push(category.fullPath)
      },
      onPost () {
        this.$router.push('/note/post')
      }
    },
    computed: {
      rightBtnRegex () {
        return new RegExp('(\\w)+(/(recents|weekhots|replies|category)/)(\\d)+$')
      }
    },
    watch: {
      '$route' (to, from) {
        if (this.rightBtnRegex.test(this.$route.fullPath)) {
          this.showRightBtn = true
        } else {
          this.showRightBtn = false
        }
      }
    }
  }
</script>

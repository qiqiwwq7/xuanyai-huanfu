<template>
  <div class="outer">
    <div class="center">
      <button-tab class="category-tab">
        <button-tab-item v-for="(category, index) in categories" :key="index" :style="'height:' + height + '%'" class="category-tab-item" :selected="isSelected(category.fullPath)" @click.native="onSelect(category, this)">
          <div class="category">
            <img :src="getIcon(category)">
            <p>{{category.name}}</p>
          </div>
        </button-tab-item>
      </button-tab>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { ButtonTab, ButtonTabItem } from 'vux'

  export default {
    components: {
      ButtonTab,
      ButtonTabItem
    },
    props: {
      categories: Array
    },
    methods: {
      isSelected(fullPath) {
        return this.$route.path.startsWith(fullPath)
      },
      onSelect (category) {
        if (this.currentCategoriesHash) {
          let categoryPath = this.currentCategoriesHash[category.fullUrl]
          if (categoryPath && categoryPath.last) {
            this.$router.push(categoryPath.last)
            return
          }
        }
        this.$router.push(category.fullPath)
      },
      getIcon (category) {
        let active = this.isSelected(category.fullPath) ? '-active' : ''
        return require('../assets/images' + category.fullUrl + active + '.png')
      }
    },
    computed: {
      ...mapGetters([
        'currentCategoriesHash'
      ]),
      height: function () {
        return (100 / this.categories.length).toFixed(6)
      }
    }
  }
</script>

<style scoped>
.outer {
  height: 100%;
  box-sizing: border-box;
}
.outer .center {
  height: 100%;
}
.category-tab {
  display: block;
  width: 100%;
  height: 100%;
}
.category-tab-item {
  position: relative;
  border-radius: 0;
  border: 0;
  color: #C5CBD8;
  font-size: 1.1rem;
  font-weight: 300;
  background-color: #1A2635;
  box-sizing: border-box;
}
.category-tab-item.vux-button-tab-item-first:after, .category-tab-item.vux-button-tab-item-middle:after, .category-tab-item.vux-button-tab-item-last:after {
  border-radius: 0;
  border: 0;
}
.category-tab-item:first-child, .category-tab-item:last-child {
  border-radius: 0;
  border: 0;
  background-clip: border-box;
}
.category-tab-item.vux-button-group-current {
  border-radius: 0;
  border: 0;
  color: #EAC56B;
  background: url(../assets/images/nav-active.png) no-repeat;
  background-size: 100% 100%;
}
.category-tab-item .category {
  padding: 10px;
  position: absolute;
  height: 70px;
  margin: auto;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.category > img {
  width: 100%;
}
.category > i {
  font-size: 35px;
}
</style>

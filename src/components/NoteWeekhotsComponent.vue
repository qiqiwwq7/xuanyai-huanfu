<template>
  <scroller lock-x scrollbar-y use-pullup use-pulldown ref="noteListScroller" :height="(clientHeight - 50) +'px'" @on-pulldown-loading="onPulldown" @on-pullup-loading="onPullup">
    <note-list-component :name="category.name" :tops="{notes: topData.notes, userExts: topData.userExts}" :bodys="{notes: bodyData.notes, userExts: bodyData.userExts}"></note-list-component>
  </scroller>
</template>

<script>
  import Util from '../libs/util'
  import { mapGetters } from 'vuex'
  import Scroller from 'components/vux/ScrollerClick'
  import NoteListComponent from 'components/NoteListComponent'

  export default {
    components: {
      Scroller,
      NoteListComponent
    },
    data () {
      return {
        clientHeight: document.documentElement.clientHeight,
        category: {
          id: '',
          name: ''
        },
        topData: {
          notes: [],
          userExts: {}
        },
        bodyData: {
          notes: [],
          userExts: {},
          page: {
            pageNo: 1,
            pageSize: 20
          }
        }
      }
    },
    created () {
      if (this.currentCategoriesHash) {
        let categoryPath = this.currentCategoriesHash['/note/weekhots/:id']
        if (categoryPath.category) {
          this.category = {
            id: categoryPath.category.id,
            name: categoryPath.category.name
          }
        }
      }
      this.onPulldown()
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
      onPulldown () {
        this.topData.notes = []
        this.topData.userExts = {}
        this.bodyData.notes = []
        this.bodyData.userExts = {}
        this.bodyData.page.pageNo = 1
        this.requestData(function(response){
          this.$nextTick(() => {//dom渲染之后执行
            this.$refs.noteListScroller.donePulldown()
            this.$refs.noteListScroller.reset({
              top: 0
            })
            if (response.data.data.notes.length < this.bodyData.page.pageSize) {
              this.$refs.noteListScroller.disablePullup()
            } else {
              this.$refs.noteListScroller.enablePullup()
            }
          })
        })
      },
      onPullup () {
        this.requestData(function(response){
          this.$nextTick(() => {//dom渲染之后执行
            this.$refs.noteListScroller.donePullup()
            if (response.data.data.notes.length == 0) {
              this.$refs.noteListScroller.disablePullup()
            }
          })
        })
      },
      requestData(callback) {
        Util.ajax.get('/note/find_weekhots/' + this.category.id + '/' + this.bodyData.page.pageNo + '/' + this.bodyData.page.pageSize + '/', {params: {top: this.bodyData.page.pageNo == '1' ? '1' : ''}}).then((response) => {
          let userExts = response.data.data.topUserExts
          if (userExts != null && userExts.length > 0) {
            for (let userExt of userExts) {
              this.topData.userExts[userExt.userId] = userExt
            }
          }
          let notes = response.data.data.topNotes
          if (notes != null && notes.length > 0) {
            for (let note of notes) {
              note.visited = false
              this.topData.notes.push(note)
            }
          }
          userExts = response.data.data.userExts
          if (userExts != null && userExts.length > 0) {
            for (let userExt of userExts) {
              this.bodyData.userExts[userExt.userId] = userExt
            }
          }
          notes = response.data.data.notes
          if (notes != null && notes.length > 0) {
            for (let note of notes) {
              note.visited = false
              this.bodyData.notes.push(note)
            }
          }
          this.bodyData.page.pageNo++
          if (callback) {
            callback.call(this, response)
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'currentCategoriesHash'
      ])
    }
  }
</script>

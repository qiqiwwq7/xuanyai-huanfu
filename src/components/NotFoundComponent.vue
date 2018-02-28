<template>
  <div class="message-card">
    <div class="message-body">
      <div>
        <img width="100" src="../assets/images/none.png">
      </div>
      <div class="message-text">404，找不到页面</div>
      <div class="message-bar">
        <router-link to="/">
          <x-button class="message-btn">返回首页</x-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { XButton } from 'vux'

  export default {
    components: {
      XButton
    }
  }
</script>

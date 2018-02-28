<template>
  <div class="message-card">
    <div class="message-body">
      <div>
        <img width="100" src="../assets/images/none.png">
      </div>
      <div class="message-text" v-if="$route.query.code && errorCodeEnum[$route.query.code]">{{errorCodeEnum[$route.query.code]}}({{$route.query.code}})</div>
      <div class="message-text" v-else>很抱歉，出错了</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        errorCodeEnum: {
          '8100': 'AccessKeyId不存在',
          '8101': 'AccessKeyId不能为空',
          '8102': 'AccessKeyId格式不正确',
          '5200': '第三方用户不存在',
          '5201': '第三方用户ID不能为空',
          '5202': '第三方用户昵称不能为空',
          '5203': '第三方用户扩展信息格式不正确，正确格式例如:UrlEndoe([{"name":"等级","value":"Lv3"},{"name":"金币","value":"5500"},{"name":"胜率","value":"50%"}])',
          '4021': 'Timestamp不能为空',
          '4022': 'Timestamp格式不正确',
          '4023': 'Nonce不能为空',
          '4024': 'Nonce格式不正确',
          '4003': 'Nonce已使用过',
          '4025': 'Signature不能为空',
          '4026': 'Signature格式不正确',
          '4027': 'Signature签名不匹配',
          '4205': '账号已被限制登录',
          '4209': '账号异常'
        }
      }
    }
  }
</script>

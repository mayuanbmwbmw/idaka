<template>
    <section class="error_container">
       <div class="error_conter">
           <p class="error_p">页面走丢了，请刷新页面或使用Chrome、360等浏览器或升级最新版本浏览器

               {{ time }}s后将自动返回首页</p>
       </div>
    </section>
</template>
<script>
let timeout = 3
let interval = ''
export default {
  data () {
    return {
      time: 3
    }
  },
  head() {
    return {
      title: '页面找不到了'
    }
  },
  props: ['error'],
  mounted () {
    const that = this
    interval = setInterval(function () {
      if (timeout > 0) {
        that.time = -- timeout
      } else {
        timeout = 3
        clearInterval(interval)
        that.$router.replace('/')
      }
    }, 1000)
  },
  destroyed () {
    clearInterval(interval)
  }
}
</script>
<style lang="scss">
.error_container{
  background: #fff;
}
.error_conter{
  width:100%;
  height:1334px;
  background: #fff;
}
.error{
    width: 514px;
    height:806px;
    margin-top: 193px;
    margin-left: 126px;
}
.error_p{
    font-size: 26px;
    color: #b4b4b4;
    margin-left: 251px;
    margin-top: 45px;
}
</style>
<template>
  <section>
    <div class="footer">
      <p class="footer_copyright">
        版权所有 © 天津卓朗科技发展有限公司 2018 TROILA.Inc. 保留一切权利。津ICP备10200312号-16
      </p>
    </div>
  </section>
</template>
<script>

// 插件
import axios from '~/plugins/axios'

// 组件
import navbar_logo from '~/static/img/home/navbar_logo.png'

// 文件

export default {
  components: {
  },
  data() {
    return {
      navbar_logo
    }
  },
  
  async asyncData ({ }) {
    try {
      return {
      }
    } catch (e) {
      // console.log('error', e)
    }
    
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.footer{
  height: 80px;
  line-height: 80px;
  text-align: center;
  .footer_copyright{
    color: #A6A8AA;
    font-size: 12px;
    background-color: #f1f4f8;
  }
}
</style>
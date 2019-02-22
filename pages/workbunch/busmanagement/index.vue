<template>
  <section class="busmanagement">
    <navbar></navbar>
      <div class="check_main">
        <div class="breadcrumb">
          <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
          <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
          <no-ssr>
            <Breadcrumb separator=">">
              <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
              <BreadcrumbItem to="">企业管理</BreadcrumbItem>
            </Breadcrumb>
          </no-ssr>
        </div>
        <div class="check_table">
          <div class="business_box">
            <div class="business_info">
              <img :src="elogoInfo" alt="" class="info_headimg">
              <div class="info_describe">
                <p class="info_title">{{ enterpriseInfo && enterpriseInfo.ename }}</p>
                <p class="info_contact">
                  <span>联系方式：</span>
                  <span>{{ enterpriseInfo && enterpriseInfo.ephone }}</span>
                </p>
              </div>
            </div>
            <div class="business_operate">
              <p class="business_modify" @click="onModifyBusiness">修改企业资料</p>
              <p class="business_cancel" v-if="(AUTHORITY & permissions) === AUTHORITY" @click="onCancelBusiness">注销</p>
            </div>
          </div>
        </div>
      </div>
      <no-ssr>
        <Modal class="cancel_modal" v-model="modal" width="360" :mask="showmask" :closable="closable">
          <!-- <p slot="header"></p> -->
          <div class="modal_question">
            <p class="question_info">确认要注销此企业么？</p>
          </div>
          <div class="modal_footer" slot="footer">
            <span class="modal_allow" @click="onConfirm">确认</span>
            <span class="modal_refuse" @click="onCancel">取消</span>
          </div>
        </Modal>
      </no-ssr>
      <no-ssr>
        <Modal class="modifys_modal" v-model="modify_modal" width="360" :mask="showmask">
          <p class="modal_title" slot="header">修改企业资料</p>
          <div class="modal_container">
            <div class="modal_img" v-if="avatageStatus">
              <img @click="onChangeAvatar(item.img, item.key)" v-for="(item, index) in enterpriseList" :key="index" class="modal_imgList" :src="item.img">
            </div>
            <div class="modal_logo">
              <span class="logo_name">企业LOGO：</span>
              <div class="logo_border" @click="changeAvatageStatus(avatageStatus)">
                <img :src="elogo" alt="" class="logo_icon">
              </div>
              <div class="logo_size">
                <p class="size">尺寸：96x96像素</p>
                <p class="size">格式：jpg/png</p>
                <div class="logo_changeimg">
                  <!-- <el-upload
                    class="avatar-uploader"
                    action=""
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <span class="logo_title">浏览...</span>
                  </el-upload> -->
                </div>
              </div>
            </div>
            <div class="logo_form">
              <span class="logo_name">企业名称：</span>
              <input v-model="ename" type="text" class="logo_compony">
            </div>
            <div class="logo_form">
              <span class="logo_name">企业电话：</span>
              <input maxlength="11" v-model="ephone" type="text" class="logo_compony">
            </div>
          </div>
          <div class="modal_footer" slot="footer">
            <span class="modal_allow" @click="onModifyCompony">确认</span>
            <span class="modal_refuse" @click="onCancelCompony">取消</span>
          </div>
        </Modal>
      </no-ssr>
    <trfooter></trfooter>
  </section>
</template>
<script>
// 插件
import axios from "~/plugins/axios";

// 组件
import navbar from "~/components/common/navbar";
import trfooter from "~/components/common/trfooter";

// 文件
import { enterpriseList } from "~/utils/avatar"
import avatar from "~/static/img/user/avatar.png";
import { AUTHORITY, ADMIN } from '~/utils/authority'

export default {
  middleware: 'check-login',
  components: {
    navbar,
    trfooter
  },
  head() {
    return {
      title: "卓朗科技_企业管理"
    };
  },
  data() {
    return {
      total: 10,
      modal: false,
      showmask: true,
      closable: false,
      modify_modal: false,
      elogo: '',
      elogoInfo: '',
      enterpriseInfo: null,
      ename: '',
      ephone: '',
      enterpriseList,
      enterprise_logo: '',
      avatar,
      avatageStatus:false,
      AUTHORITY
    };
  },
  // 获取 企业管理-信息
  async asyncData({ store }) {
    let userInfo = store.state.login.userInfo
    let permissions = userInfo ? userInfo.permissions : 0
    try {
      let enterprise = await axios.get('/pcapi/get_enterprise_info', {
        params: {
          user_id: userInfo.uid,
          enterprise_id: userInfo.enterprise_id,
        }
      })
      let enterpriseInfo = enterprise.data
      const { data, code } = enterpriseInfo
      const elogo = enterpriseList.filter((item) => item.key === data.elogo)
      if (code === 0) {
        return {
          enterpriseInfo: data,
          elogo: elogo[0].img || avatar,
          elogoInfo: elogo[0].img,
          ename: data.ename,
          ephone: data.ephone,
          permissions
        };
      }
    } catch (e) {
      // console.log('error', e)
    }
  },
  mounted() {
  },
  methods: {
    // 点击修改企业信息
    onModifyBusiness() {
      this.modify_modal = true;
    },
    onCancelBusiness() {
      this.modal = true;
    },
    async onConfirm() {
      this.modal = false;
      this.$message({
        message: "您已注销此企业",
        type: "success"
      });
      // const{ enterprise_id } = this
      let enterprise = await axios.get('/pcapi/delete_enterprise', {
        params: {
          // token,,
          // enterprise_id
        }
      })
    },
    onCancel() {
      this.modal = false;
    },
		async onModifyCompony() {
      let userInfo = this.$store.state.login.userInfo
      let user_id = userInfo ? userInfo.uid : null
      let enterprise_id = userInfo ? userInfo.enterprise_id : null
      const { elogo, ename, ephone, enterprise_logo } = this
      let re = /^\d{3,4}-?\d{7,8}$/;
      if (ename === '') {
        this.$message({
          message: "请填写企业名称",
          type: "error"
        });
        return
      }
      if (ephone === '' || !re.test(ephone)) {
        this.$message({
          message: "请正确填写企业电话",
          type: "error"
        });
        return
      }
      let enterprise = await axios.get('/pcapi/change_enterprise_info', {
        params: {
          user_id,
          enterprise_id,
          enterprise_logo,
          enterprise_name: ename,
          enterprise_phone: ephone
        }
      })
      const { data } = enterprise
      if (data.code === 0) {
        this.modify_modal = false;
        this.$message({
          message: "您已修改企业资料",
          type: "success",
          duration: 500,
          close: () => {
            location.reload()
          }
        });
      }
		},
		onCancelCompony() {
			this.modify_modal = false;
    },
    // 点击头像
    changeAvatageStatus(avatageStatus) {
      this.avatageStatus = !avatageStatus
    },
    // 上传公司logo
    handleAvatarSuccess(res, file) {
      console.info(file)
      this.elogo = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!(isJPG || isPNG)) {
      //   this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    // 选择头像
    onChangeAvatar(avatarImg, enterpriseLogo) {
      this.elogo = avatarImg
      this.enterprise_logo = enterpriseLogo
    }
  }
};
</script>
<style lang="scss">
// Modal
.cancel_modal {
  .ivu-modal {
    top: 290px !important;
    .ivu-modal-content {
      width: 364px;
      height: 212px;
    }
    .ivu-modal-header {
      border: none;
    }
    .ivu-modal-body {
      padding-top: 80px;
    }
    .ivu-modal-footer {
      border: none;
      padding-top: 52px;
    }
    .modal_question {
      .question_info {
        font-size: 18px;
        line-height: 18px;
        color: #333333;
        text-align: center;
        .question_name {
          color: #0c7ff5;
          font-size: 18px;
        }
      }
    }
    .modal_footer {
      .modal_allow {
        width: 90px;
        height: 28px;
        background-color: #0c7ff5;
        border-radius: 14px;
        font-size: 13px;
        color: #ffffff;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .modal_refuse {
        width: 90px;
        height: 28px;
        background-color: #ffffff;
        border-radius: 14px;
        border: solid 1px #0c7ff5;
        font-size: 13px;
        color: #0c7ff5;
        margin-left: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}
.modifys_modal {
  .ivu-modal {
    top: 290px !important;
    .ivu-modal-content {
      width: 584px;
      // height: 390px;
    }
    .ivu-modal-header {
      border: none;
    }
    .ivu-modal-body {
      padding-top: 52px;
      padding-bottom: 0px;
    }
    .ivu-modal-footer {
      border: none;
      padding-top: 49px;
    }
    .modal_title {
      color: #333333;
      font-size: 18px;
      position: relative;
      top: 10px;
      left: 20px;
    }
    .modal_container {
      display: flex;
      flex-direction: column;
      padding-left: 104px;
      .modal_img{
        margin-bottom: 20px;
        .modal_imgList{
          width: 58px;
          height: 58px;
          margin-right: 20px;
          cursor: pointer;
          &:last-child{
            margin: 0;
          }
        }
      }
      .modal_logo {
        display: flex;
        align-items: flex-end;
        .logo_name {
          color: #999999;
          font-size: 13px;
          width: 77px;
          display: flex;
          justify-content: flex-end;
          margin-right: 5px;
        }
        .logo_border {
          width: 80px;
          height: 80px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          border: solid 1px #a3b8cc;
          cursor: pointer;
          .logo_icon {
            width: 58px;
            height: 58px;
            flex-direction: column;
            align-items: flex-start;
          }
        }
        .logo_size {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          .size {
            color: #999999;
            font-size: 13px;
            line-height: 13px;
            margin-bottom: 8px;
          }
          .logo_changeimg {
            position: relative;
            width: 80px;
						height: 26px;
						cursor: pointer;
            // background-color: #0c7ff5;
            border-radius: 4px;
            // border: solid 1px #0c7ff5;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            .logo_title {
              font-size: 13px;
              color: white;
              position: relative;
						cursor: pointer;
            }
            .file {
              position: absolute;
              opacity: 0;
              top: 0;
              left: 0;
              width: 80px;
              height: 26px;
            }
          }
        }
      }
      .logo_form {
        display: flex;
        align-items: center;
        margin-top: 20px;
        .logo_name {
          color: #999999;
          font-size: 13px;
          width: 77px;
          display: flex;
          justify-content: flex-end;
          margin-right: 5px;
        }
        .logo_compony {
          width: 220px;
          height: 34px;
          color: #333333;
          font-size: 13px;
          text-indent: 6px;
          border-radius: 2px;
          border: solid 1px #a3b8cc;
          background-color: #ffffff;
        }
      }
    }
    .modal_footer {
      .modal_allow {
        width: 90px;
        height: 28px;
        background-color: #0c7ff5;
        border-radius: 14px;
        font-size: 13px;
        color: #ffffff;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .modal_refuse {
        width: 90px;
        height: 28px;
        background-color: #ffffff;
        border-radius: 14px;
        border: solid 1px #0c7ff5;
        font-size: 13px;
        color: #0c7ff5;
        margin-left: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}
.busmanagement {
  margin-top: 84px;
  background-color: #f1f4f8;
  .check_main {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 50px;
    .breadcrumb {
      margin: 0px 0 10px;
      .breadcrumb_item {
        color: #999999;
        font-size: 12px;
      }
    }
    .check_table {
      padding: 34px 0;
      height: 845px;
      overflow: hidden;
      box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
      border-radius: 10px;
      .business_box {
        width: 519px;
        height: 264px;
        background-color: #ffffff;
        box-shadow: 0px 2px 10px 0px rgba(0, 24, 148, 0.3);
        border-radius: 10px;
        margin-top: 70px;
        margin-left: 70px;
        .business_info {
          display: flex;
          .info_headimg {
            width: 80px;
            height: 77px;
            border-radius: 50%;
            background-color: #eeeeee;
            margin: 54px 37px 0 48px;
          }
          .info_describe {
            display: flex;
            flex-direction: column;
            margin-top: 66px;
            .info_title {
              font-size: 24px;
              line-height: 24px;
              color: #333333;
              margin-bottom: 13px;
            }
            .info_contact {
              font-size: 16px;
              line-height: 16px;
              &:first-child {
                color: #999999;
              }
              &:last-child {
                color: #333333;
              }
            }
          }
        }
        .business_operate {
          float: right;
          margin-top: 75px;
          margin-right: 30px;
          .business_modify {
            width: 120px;
            height: 28px;
            background-color: #0c7ff5;
            border-radius: 14px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 13px;
            cursor: pointer;
          }
          .business_cancel {
            width: 90px;
            height: 28px;
            border-radius: 14px;
            border: solid 1px #0c7ff5;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            color: #0c7ff5;
            font-size: 13px;
            margin-left: 20px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
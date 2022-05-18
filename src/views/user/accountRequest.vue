<template>
  <!-- 用户配置 -->
  <!-- user config  -->
  <v-container fluid>
    <!-- 用户表格 -->
    <!-- users table  -->
    <v-card style="min-height: 86vh" class="pa-2">
      <v-data-table :headers="getHeaders()" v-model="selected" :items="desserts" item-key="name" :footer-props="{
      itemsPerPageOptions: [5,10,15,20]
    }" class="elevation-1" show-select>
        <!-- 上方插槽 -->
        <!-- slot top -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{
            $vuetify.lang.t('$vuetify.userconfig.title')
          }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="showQRCode" class="mr-2">
              {{$vuetify.lang.t('$vuetify.accountRequest.registrationCode')}}
            </v-btn>
            <v-btn color="primary" @click="agreeUser(selected)" class="mr-2">
              {{$vuetify.lang.t('$vuetify.accountRequest.markAllAgree')}}
            </v-btn>
            <v-btn color="red" @click="deleteUser(selected)">
              {{$vuetify.lang.t('$vuetify.accountRequest.markAllRefuse')}}
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:[`item.operation`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-1" v-on="on" @click="agreeUser(item)">
                mdi-check
              </v-icon>
            </template>
            <span>{{$vuetify.lang.t('$vuetify.accountRequest.agree')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" v-on="on" @click="deleteUser(item)">
                mdi-close
              </v-icon>
            </template>
            <span>{{$vuetify.lang.t('$vuetify.accountRequest.refuse')}}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <!-- 查看注册码 -->
    <!-- view registration code  -->
    <v-dialog v-model="QRCodeialog" max-width="330px" style="z-index:99999">
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.accountRequest.registrationCode')}}</span>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col align-self="center">
              <div id="qrcode"></div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-icon @click="downloadCodeImg">mdi-download</v-icon>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- tips -->
    <v-snackbar v-model="snackbar" top :color='color'>
      {{msg}}
    </v-snackbar>

  </v-container>
</template>
<script>
import axiosTool from '@/api/axios.js';
import QRCode from "qrcodejs2"
export default {
  data () {
    return {
      // tips
      snackbar: false,
      // 二维码显示
      // show QRcode
      QRCodeialog: false,
      qrCode: '',
      color: '',
      selected: [],
      link: '',
      msg: '',
      //表格数据
      // table data
      desserts: []
    }
  },
  mounted () {
    this.getApplyUser()
    this.link = document.location.origin + document.location.pathname + '#/registered'
  },
  methods: {
    // 获取申请用户
    // get account applicants
    getApplyUser () {
      this.desserts = []
      let param = {
        application: true
      }
      axiosTool.get('listUser', param).then(res => {
        if (res == null) {
          res = []
        }
        for (let item of res) {
          this.desserts.push({
            name: item.username,
            email: item.email
          })
        }
        this.messages = res.length
        console.log(this.messages)
        this.$emit('updateMessages')
      })
    },

    showQRCode () {
      this.QRCodeialog = true
      this.$nextTick(function () {
        this.qrcode();
      })
    },
    qrcode () {
      console.log(this.qrCode)
      if (this.qrCode != '') {
        return
      }

      this.qrCode = new QRCode('qrcode', {
        width: 280,
        height: 280,        // 高度 height
        text: this.link,   // 二维码内容 QR code content
      })
    },
    downloadCodeImg () {
      console.log('下载图片')
      let myCanvas = document.getElementById('qrcode').getElementsByTagName('canvas')
      let a = document.createElement("a")
      a.download = this.$vuetify.lang.t('$vuetify.accountRequest.registrationCode')
      // 设置图片地址
      // set img url
      a.href = myCanvas[0].toDataURL('image/png');
      a.click();
    },
    // 同意用户
    // pass application
    agreeUser (item) {
      console.log(item instanceof Array)
      let param = []

      if (item instanceof Array) {
        if (item.length == 0) {
          return
        }
        for (let v of item) {
          param.push(v.name)
        }
      } else {
        param.push(item.name)
      }
      this.agree(param)
    },
    // agree application api
    agree (param) {
      console.log(param)
      axiosTool.post('passApplication', param).then(res => {
        console.log(res)
        if (res == 'ok') {
          this.tips(this.$vuetify.lang.t('$vuetify.accountRequest.agreeSuccess'), 'success')
          this.getApplyUser()
        } else {
          this.tips(this.$vuetify.lang.t('$vuetify.accountRequest.agreeFiled'), 'error')
        }

      })
    },
    // 获取表格头部 用于双语显示
    // get table header to bilingual display
    getHeaders () {
      return [
        {
          text: this.$vuetify.lang.t('$vuetify.userconfig.username'),
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: this.$vuetify.lang.t('$vuetify.userconfig.mail'), value: 'email' },
        { text: this.$vuetify.lang.t('$vuetify.userconfig.operation'), value: 'operation' },
      ]
    },
    // 确认拒绝用户申请
    // confirm refuse account application
    deleteUser (item) {
      this.$dialog.confirm({
        text: this.$vuetify.lang.t('$vuetify.accountRequest.confirmRefuseUserApply'),
        title: this.$vuetify.lang.t('$vuetify.accountRequest.refuseUserApply'),
        cancel: this.$vuetify.lang.t('$vuetify.userconfig.cancel'),
        actions: [
          {
            text: this.$vuetify.lang.t('$vuetify.userconfig.cancel'),
            color: 'blue',
            key: 'false',
          },
          {
            text: this.$vuetify.lang.t('$vuetify.userconfig.save'),
            color: 'blue',
            key: true,
          },
        ],
      }).then((type) => {
        if (type) {
          let param = []

          if (item instanceof Array) {
            if (item.length == 0) {
              return
            }
            for (let v of item) {
              param.push(v.name)
            }
          } else {
            param.push(item.name)
          }
          this.delete(param)
        }
      })
    },
    // 删除用户申请
    // delete account application
    delete (param) {
      axiosTool.post('delUser', param).then(res => {
        console.log(res)
        if (res == 'ok') {
          this.tips(this.$vuetify.lang.t('$vuetify.accountRequest.refuseSuccess'), 'success')
          this.getApplyUser()
        } else {
          this.tips(this.$vuetify.lang.t('$vuetify.accountRequest.refuseFiled'), 'error')
        }

      })
    },

    tips (msg, color) {
      this.msg = msg
      this.color = color
      this.snackbar = true
    },
  },
};
</script>
<style scoped>
.height {
  min-height: 86vh;
}
</style>

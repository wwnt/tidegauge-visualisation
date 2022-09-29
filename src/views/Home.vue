<template>
  <!-- 导航栏 -->
  <!--navigation  -->
  <v-app>
    <!-- 通知信息 -->
    <!-- tips -->
    <div style="z-index:99999;position:absolute;right:0.5%">
      <v-snackbar v-for="(snackbar, index) in snackbars" v-bind:key="index" v-model="snackbar.show" timeout="5000"
        class="" :right="true" :top="true" :color="snackbar.color" style="display:contents">
        {{ snackbar.text }}
        <v-btn @click="hideSnackbar(index)" icon dark>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
    </div>

    <v-app-bar app color="primary" dark dense class="header-row">
      <div class="title">{{ $vuetify.lang.t("$vuetify.systemName") }}</div>
      <!-- 导航 -->
      <!-- navigation -->
      <template v-slot:extension>
        <v-tabs v-model="active">
          <v-tab @click="toPage('/stationList')">{{
            $vuetify.lang.t("$vuetify.menu.stationList")
          }}</v-tab>
          <v-tab @click="toPage('/stationDetail/new')">{{
            $vuetify.lang.t("$vuetify.menu.stationDetail")
          }}</v-tab>
          <v-tab @click="toPage('/history')">{{
            $vuetify.lang.t("$vuetify.menu.historyData")
          }}</v-tab>
          <v-tab @click="toPage('/video')">{{
            $vuetify.lang.t("$vuetify.menu.vedioQuery")
          }}</v-tab>
          <v-tab @click="toPage('/user/manageUser')" v-if="role!='OU'">
            <v-badge color="red" dot :value="messages">
              {{$vuetify.lang.t("$vuetify.menu.userManagement")}}
            </v-badge>
          </v-tab>
          <v-tab @click="toPage('/otherConfig/sensor')" v-if="role!='OU'">{{
            $vuetify.lang.t("$vuetify.menu.otherConfig")
          }}</v-tab>

        </v-tabs>
      </template>

      <v-spacer></v-spacer>
      <!-- 大屏展示 -->
      <!-- big screen display -->
      <v-btn icon style="color: #fff" @click="toPage('/showData')" v-if="role!='OU'">
        <v-icon>mdi-overscan</v-icon>
      </v-btn>

      <!-- 双语 -->
      <!-- language -->
      <v-menu open-on-hover bottom offset-y style="z-index: 1000">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon style="color: #fff" v-bind="attrs" v-on="on">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list v-for="(value,key,i) in langs" :key="i">
          <v-list-item @click="changeLocale(key)">{{value}}</v-list-item>
        </v-list>
      </v-menu>

      <!-- 消息中心 -->
      <!-- item status logs -->
      <v-btn icon style="color: #fff" @click="showMsg = !showMsg" v-if="role!='OU'">
        <v-icon>mdi-email</v-icon>
      </v-btn>

      <!-- 用户 user-->
      <v-menu offset-y style="z-index:9999">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon style="color: #fff" v-bind="attrs" v-on="on">
            <!-- <v-icon>mdi-logout-variant</v-icon> -->
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="pt-1 pb-0">
            <h6>{{  $vuetify.lang.t("$vuetify.account.account")}}: {{username}}</h6>
          </v-card-title>
          <v-card-actions>
            <v-btn @click="showAccountForm">
              {{$vuetify.lang.t("$vuetify.account.editAccount")}}
            </v-btn>
            <v-btn @click="logoutDialog">
              {{$vuetify.lang.t("$vuetify.account.logout")}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn icon style="color: #fff" @click="about">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- tips -->
    <v-snackbar v-model="msgSnackbar" :color="color" :right="true" :top="true" timeout="3000" class="pt-1">
      {{msg}}
    </v-snackbar>

    <!-- 消息中心展示 -->
    <!-- display logs -->
    <v-navigation-drawer v-model="showMsg" right :absolute="!$vuetify.breakpoint.mdAndDown"
      :temporary="!$vuetify.breakpoint.mdAndDown" app :width="'800px'" style="z-index:9999">
      <v-card elevation="0">
        <v-card-title>
          {{$vuetify.lang.t('$vuetify.home.messageCenter')}}
          <v-row>
            <v-col>
              <v-btn icon @click="showMsg=!showMsg" style="float:right">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>

          <v-data-table :v-if="role != 0" :headers="getHeader()" v-model="selected" :items="tableData"
            :options.sync="options" :server-items-length="totalDesserts" :loading="loading" class="elevation-1"
            @pagination="pagination">
            <template v-slot:[`item.data-table-select`]="{item,isSelected, select}">
              <v-checkbox v-if="!item.status" :value="isSelected" @change="select($event)"></v-checkbox>
              <v-checkbox v-else disabled v-model="item.status"></v-checkbox>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-chip :color="item.color" dark>
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <!-- 修改用户信息 -->
    <!--  edit user info -->
    <v-dialog v-model="dialog" max-width="600px" style="z-index:99999">
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t("$vuetify.account.editAccount")}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.userconfig.mail')"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.userconfig.mailRequire'), v => /.+@.+\..+/.test(v) || $vuetify.lang.t('$vuetify.userconfig.mailValid'),]"
                    v-model="form.email" required>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.userconfig.password')" v-model="form.password"
                    type="password">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">{{
            $vuetify.lang.t('$vuetify.userconfig.cancel')
          }}</v-btn>
          <v-btn color="blue darken-1" text @click="update()">{{
            $vuetify.lang.t('$vuetify.userconfig.save')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 关于 -->
    <!-- about -->
    <v-dialog v-model="aboutDialog" max-width="600px" style="z-index:99999">
      <v-card>
        <v-card-title>
          <span class="headline">{{  $vuetify.lang.t('$vuetify.home.aboutUs')}}</span>
        </v-card-title>
        <v-card-text>
          <h2>Powered by</h2>
          <v-img :src="wuzhou"></v-img>
          <!-- <h2>Icons made by Freepik</h2> -->
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- router page -->
    <v-main>
      <router-view :role="role" v-on:getPath="getPath" :allItems="allItems" @updateMessages="updateMessages"
        @tips="tips" :wsConn="wsConn">
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import axiosTool from '../api/axios.js';
import commonCfg from '../config/common'
import qs from 'qs'

let vm = null

export default {
  name: "Home",
  components: {
    //HelloWorld
  },
  data () {
    return {
      allItems: [],
      // 导航栏高亮
      // highlight navigation bar
      active: 0,
      // 修改用户信息窗口
      // edit user info dialog
      dialog: false,
      // 关于窗口
      // about dialog
      aboutDialog: false,
      // 用户权限
      // user role
      role: '',
      showReadData: false,
      // 加载日志loading
      // get logs loading
      loading: false,
      // tips
      msgSnackbar: false,
      color: '',
      msg: '',
      wsConn: '',

      // 五洲log
      // log
      wuzhou: '',

      // 通知信息tips
      // tips
      snackbar: '',
      snackbars: [],

      username: localStorage.username,
      // 消息总数
      // logs total
      totalDesserts: 0,
      // 消息中心表格数据
      // logs data
      tableData: [],
      // 表格设置
      // table setting
      options: {},
      // 选中消息
      // choose logs 
      selected: [],
      // headers: [
      //   {
      //     text: this.$vuetify.lang.t('$vuetify.message.itemName'),
      //     sortable: false,
      //     value: 'itemName',
      //   },
      //   {
      //     text: this.$vuetify.lang.t('$vuetify.message.status'),
      //     sortable: false,
      //     value: 'status',
      //   },
      //   {
      //     text: this.$vuetify.lang.t('$vuetify.message.time'),
      //     align: 'start',
      //     sortable: false,
      //     value: 'time',
      //   },

      //   // { text: this.$vuetify.lang.t('$vuetify.message.info'), sortable: false, value: 'info' },
      // ],
      // 控制消息中心显示
      // control display logs 
      showMsg: false,
      // 不为0表示存在未处理的申请
      // not 0 means have unprocessed applycation
      messages: 0,
      form: {
        email: '',
        password: '',
        username: '',
        live_camera: true
      },
      connected: false, // websocket 连接状态 Connection Status
      statusUrl: commonCfg.statusWs + localStorage.token,
      langs: commonCfg.langs
    };
  },
  async created () {
    vm = this
    // this.userInfo()
    await this.listItems()
    this.wuzhou = require("@/assets/wuzhou.png")
  },
  mounted () {
    console.log(this.$root.role)
    this.role = this.$root.role;
    if (this.role != 0) {
      this.setWSConn()
      this.getTotalNumber()
    }
    console.log(this.allItems)
  },

  methods: {
    getHeader () {
      return [
        {
          text: this.$vuetify.lang.t('$vuetify.message.itemName'),
          sortable: false,
          value: 'itemName',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.message.status'),
          sortable: false,
          value: 'status',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.message.time'),
          align: 'start',
          sortable: false,
          value: 'time',
        },
      ]
    },
    getApplyUser () {

      let param = {
        application: true
      }
      axiosTool.get('listUser', param).then(res => {
        if (res == null) {
          res = []
        }
        this.messages = res.length
      })
    },
    // 0：普通用户 1：管理员 2：超级管理员
    // 0:ordinary user 1:admin 2:superAdmin
    userInfo () {
      axiosTool.get('userInfo',).then(res => {
        console.log(res)
        localStorage.email = res.email
        localStorage.username = res.username
        localStorage.role = res.role
        this.form.live_camera = res.live_camera
        let role;

        if (res.role == 2) {
          role = 'SA';//"SuperAdmin";
        }
        else if (res.role == 1) {
          role = 'GA';//"GroupAdmin"; 
        } else {
          role = 'OU';//"OrdinaryUser"                                  
        }
        this.role = role;
        if (res.role != 0) {
          this.setWSConn()
          this.getTotalNumber()
        }
      }).catch(error => {
        console.log(error)
        localStorage.email = ''
        localStorage.username = ''
        localStorage.role = ''
      })
    },
    //获取所有数据类型
    // get all item data
    async listItems () {
      this.allItems = await axiosTool.get('listItem')
      console.log(this.allItems)
    },

    logoutDialog () {
      axios.post(commonCfg.logout, qs.stringify({refresh_token: localStorage.refresh_token})).then(res => {
        if(res.status == 204) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          this.$router.push("/login");
        }
      }).catch(error => {
        console.log(error)
      })
      
    },
    //跳转到指定页面
    // router to page
    toPage (param) {
      //异常处理避免显示错误
      // exception handling to avoid display errors
      if (vm.$route.path != param) vm.$router.push(param)
    },
    //监听从子组件传递的路由参数
    //Listen for route parameters passed from child components 
    getPath (pathParam) {
      if (pathParam === '/stationDetail') vm.active = 1// 激活tab index  activation tab index
    },

    getStatus (status) {
      let str = ""
      let color = ""
      if (status == 'Disconnected') {
        str = "断开连接"
        color = "red"
      } else if (status == "Abnormal") {
        str = "连接异常"
        color = "red"
      } else {
        str = "已连接"
        color = "green"
      }
      return {
        status: str,
        color: color
      }
    },
    //设置websocket连接
    // set websocket conn
    setWSConn () {
      window.wsConn = new WebSocket(this.statusUrl);
      this.wsConn = window.wsConn
      console.log(this.wsConn)
      // wsConn = window.wsConn;
      //console.log(wsConn);
      // wsConn.onopen = this.handleWSOpen;
      // wsConn.onclose = this.handleWSClose;
      // wsConn.onerror = this.handleWSError;
      this.wsConn.onmessage = this.handleWSMessage;
    },
    handleWSMessage (evt) {
      let msg = JSON.parse(evt.data)
      console.log(msg)
      this.connected = true
      if (msg.type == 'UpdateStationStatus') {
        if (msg.body.status == 'Normal') {
          this.tips(msg.body.identifier + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.online"), "green")
        } else {
          this.tips(msg.body.identifier + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.offline"), "red")
        }
      } else {
        if (msg.body.status == 'Normal') {
          this.tips(msg.body.identifier + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.online"), "green")
        } else {
          this.tips(msg.body.identifier + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.offline"), "red")
        }
      }

    },

    describeFormatter: function (row) {
      var sernor = this.allItems.filter(v => v.station_id == row.station_id && v.name == row.item)
      let s = row.identifier + " " + sernor[0].device_name + ":" + this.$vuetify.lang.t('$vuetify.historyData.dataType.' + row.item) +
        this.$vuetify.lang.t('$vuetify.message.thresholdExceeded') + row.cmp + '，' + this.$vuetify.lang.t('$vuetify.message.nowValue') + row.value
      return s
    },
    showSnackbar (color, text) {
      this.snackbars.push({
        show: true,
        color: color,
        text: text,
      })
    },
    hideSnackbar (index) {
      this.snackbars[index].show = false
    },
    // 显示已读数据
    // show readed data
    showReadMsg () {
      this.showReadData = !this.showReadData
      // this.getTotalNumber()
      // this.getAlertHistory()
    },
    // 获取总数量
    // get logs total
    getTotalNumber () {
      var param = {}
      if (this.showReadData) {
        param.all = ''
      }

    },
    // 更新用户数据
    // update user info
    update () {
      let param = this.form
      axiosTool.post('editUser', param).then((res) => {
        console.log(res)
        if (res == 'ok') {
          localStorage.email = this.form.email
          this.tips(this.$vuetify.lang.t('$vuetify.userconfig.editSuccess'), 'success')
          this.dialog = false
        } else {
          this.tips(this.$vuetify.lang.t('$vuetify.userconfig.editFailed'), 'error')
          this.dialog = false
        }

      })
    },
    // 显示用户信息
    // display user info
    showAccountForm () {
      this.form.email = localStorage.email
      this.form.username = localStorage.username
      this.dialog = true
    },
    // 获取已读数据
    // get readed logs
    handleReadSelect (val) {
      var array = []
      if (val == null) {
        array = [-1]
      } else {
        val.forEach(v => {
          array.push(v.id)
        })
      }
    },
    // 获取历史状态记录
    // Get historical status records
    getPsmslDataList (num, size) {
      let param = {
        page_num: num,
        page_size: size
      }
      axiosTool.get('itemStatusLogs', param).then((res) => {
        console.log(res)
        this.totalDesserts = res.total
        this.tableData = res.data.map(v => {
          let statusAndColor = this.getStatus(v.status)
          return {
            itemName: v.item_name,
            status: statusAndColor.status,
            color: statusAndColor.color,
            time: this.formateTime(v.changed_at)
          }
        })


      })
    },
    pagination (item) {
      console.log(item.page)
      console.log(item.itemsPerPage)
      this.getPsmslDataList(item.page, item.itemsPerPage)
    },
    // 修改语言
    // change language
    changeLocale (type) {
      console.log(this.$vuetify)
      localStorage.lang = type
      this.$vuetify.lang.current = type;
    },
    tips (msg, color) {
      this.msg = msg
      this.color = color
      this.msgSnackbar = true
    },
    formateTime (time) {
      console.log(time)
      var date = new Date(time);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    updateMessages () {
      this.getApplyUser()
    },
    // 关于
    // about
    about () {
      this.aboutDialog = true
    }
  },
};
</script>
<style >
.v-tabs-slider {
  display: none;
}
.v-tab.v-tab {
  color: #c3bc7f;
}
.title {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
</style>

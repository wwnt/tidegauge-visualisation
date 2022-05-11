<template>
  <v-container fluid>
    <v-row>
      <v-col md="3" lg="2">
        <v-card class="height">
          <!-- 查询表单 -->
          <!--query form -->
          <v-form class="pa-2" v-model="valid" ref="form">
            <v-select :items="stationList" v-model="historyOptionsForm.stationId"
              :rules="[v => !!v || $vuetify.lang.t('$vuetify.historyData.stationNameRequire')]"
              :label="$vuetify.lang.t('$vuetify.historyData.form.stationName')" @change="stationChange"></v-select>
            <v-select :items="cameraItems" v-model="historyOptionsForm.cameraId"
              :rules="[v => !!v || $vuetify.lang.t('$vuetify.historyData.cameraNameRequire')]"
              :label="$vuetify.lang.t('$vuetify.historyData.form.cameraName')" @change="cameraChange"></v-select>
            <v-select :items="typeItem" v-model="historyOptionsForm.type"
              :label="$vuetify.lang.t('$vuetify.historyData.form.selectType')"></v-select>
          </v-form>
          <v-btn depressed color="primary" style="margin-left: 10px" @click="show" :loading="loading">
            {{$vuetify.lang.t('$vuetify.historyData.btn.query')}}</v-btn>
        </v-card>
      </v-col>

      <v-col md="9" lg="10">
        <v-card class="height">
          <v-row class="ma-0">
            <v-col :cols="3" v-for="(item,i) in images" :key="i">
              <v-card>
                <!-- 显示查询结果 -->
                <!-- display query data -->
                <v-img :src="item.src" class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px">
                  <v-card-title v-text="item.title"></v-card-title>
                </v-img>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <iframe id="my_iframe" style="display:none;"></iframe>
                    <v-icon @click="downloadCodeImg(item.src,item.title)">mdi-download</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon @click="dialog = true">mdi-eye</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- 查看图片详情 -->
    <!-- Zoom in img -->
    <v-dialog v-model="dialog" width="720" height="1280">
      <v-card>
        <v-carousel>
          <v-carousel-item v-for="(item,i) in images" :show-arrows="false" :key="i">
            <v-img max-height="1280" max-width="720" :src="item.src"></v-img>
          </v-carousel-item>
        </v-carousel>
      </v-card>

    </v-dialog>
    <v-snackbar v-model="snackbar" top :color="color">
      {{title}}
    </v-snackbar>
  </v-container>
</template>
<script>
import axiosTool from '../api/axios.js';
import Vue from 'vue';
let vm
// var image = require('../assets/i/favicon.png')
export default {
  data () {
    return {
      // 站点列表
      // station list
      stationList: [],
      images: [],
      // 查询类型
      // query type
      typeItem: [
        {
          text: this.$vuetify.lang.t('$vuetify.video.realTime'),
          value: 1,
          disabled: false
        }, {
          text: this.$vuetify.lang.t('$vuetify.video.show9images'),
          value: 2,
          disabled: false
        }
      ],
      // 摄像头列表
      // camera list
      cameraItems: [],
      // 站点摄像头
      // 
      cameraMap: new Map,
      valid: '',
      dialog: false,
      snackbar: false,
      live_camera: false,//实时快照权限
      title: '',
      color: '',
      permissionDatas: new Map,
      // 查询表单
      historyOptionsForm: {
        stationId: '',
        cameraId: '',
        type: 1,
        start: '',
        end: '',
      },
      role: parseInt(localStorage.role),
      // 查询按钮loading
      loading: false,
    };
  },
  async mounted () {
    console.log(this.role)
    // 如果是普通用户 就获取用户权限
    // if it is ordinary user ,get user permission
    if (this.role === 0) {
      this.permissionDatas = await this.getPermissions(localStorage.username);
      this.permissionDatas = new Map(Object.entries(this.permissionDatas));
    }
    console.log(this.permissionDatas)
    vm = this
    this.listStations()

    this.live_camera = JSON.parse(localStorage.live_camera);
    console.log(this.live_camera)

    console.log(this.typeItem)
  },
  methods: {
    // 获取站点列表
    // get station list
    listStations () {
      axiosTool.get('listStation').then((res) => {
        console.log(this.permissionDatas)
        if (this.role != 0 || this.live_camera) {
          for (var station of res) {
            this.stationList.push({
              text: station.name,
              value: station.id,
            });
            this.cameraMap.set(station.id, station.cameras)
          }
        } else {
          if (this.permissionDatas.size != 0) {
            vm.permissionDatas.forEach(function (value, key) {
              console.log(key, value);
              let stationData = res.filter(v => v.id == key)
              if (stationData != null) {
                vm.stationList.push({
                  text: stationData[0].name,
                  value: key,
                });
                vm.cameraMap.set(key, value)
              }
            })

          }
        }

        // if (this.live_camera){

        // }
        console.log(this.cameraMap)
      });
    },
    // 获取当前用户摄像头权限
    // get camera permission
    async getPermissions (name) {
      var param = {
        username: name
      }
      let res = await axiosTool.get('listCameraStatusPermission', param)
      return res
    },
    show () {

      if (this.$refs.form.validate()) {
        this.loading = true
        let param = {
          station_id: this.historyOptionsForm.stationId,
          name: this.historyOptionsForm.cameraId
        }
        this.images = []
        // 根据类型获取数据
        if (this.historyOptionsForm.type == 1) {
          // 实时快照
          // real time img
          axiosTool.getImg('cameraSnapshot', param).then((res) => {
            console.log(res)
            if (res.byteLength == 0) {
              vm.tips(this.$vuetify.lang.t('$vuetify.video.connect_error'), "red")
            } else {
              let baseImg = arrayBufferToBase64(res)
              let start = new Date();
              let year = start.getFullYear()
              let month = (start.getMonth() + 1) > 9 ? (start.getMonth() + 1).toString() : '0' + (start.getMonth() + 1)
              let day = start.getDate() > 9 ? start.getDate().toString() : '0' + start.getDate()
              let hour = start.getHours() > 9 ? start.getHours().toString() : '0' + start.getHours()
              let minutes = start.getMinutes() > 9 ? start.getMinutes().toString() : '0' + start.getMinutes()
              let seconds = start.getSeconds() > 9 ? start.getSeconds().toString() : '0' + start.getSeconds()
              Vue.set(vm.images, 0, {
                src: `data:image/png;base64,${baseImg}`,
                title: year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
              })
            }
            this.loading = false
          }).catch(e => {
            console.log(e)
            this.loading = false
          });
        } else {
          // 获取最后9张照片
          // get the last 9 photos
          axiosTool.get('cameraLatestSnapshot', param).then((res) => {
            console.log(res)
            if (!res || res.length == 0) {
              this.tips(this.$vuetify.lang.t('$vuetify.video.connect_error'), "red")
            } else {
              for (var i = 0; i <= res.length - 1; i++) {
                let start = new Date(res[i].millisecond);
                let year = start.getFullYear()
                let month = (start.getMonth() + 1) > 9 ? (start.getMonth() + 1).toString() : '0' + (start.getMonth() + 1)
                let day = start.getDate() > 9 ? start.getDate().toString() : '0' + start.getDate()
                let hour = start.getHours() > 9 ? start.getHours().toString() : '0' + start.getHours()
                let minutes = start.getMinutes() > 9 ? start.getMinutes().toString() : '0' + start.getMinutes()
                let seconds = start.getSeconds() > 9 ? start.getSeconds().toString() : '0' + start.getSeconds()
                Vue.set(this.images, i, {
                  src: `data:image/png;base64,${res[i].img}`,
                  title: year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
                })
              }
            }
            this.loading = false
          }).catch(e => {
            console.log(e)
            this.loading = false
          });
        }
      }

    },
    tips (title, color) {
      this.color = color
      this.title = title
      this.snackbar = true
    },
    // 根据选择的站点显示摄像头
    // display camera whit selected station
    stationChange (station) {
      this.cameraItems = []
      let cameras = this.cameraMap.get(station)
      if (cameras != null) {
        this.cameraItems = cameras
      }

    },
    // 根据摄像头权限判断是否禁用查询方式
    cameraChange (camera) {
      if (this.role == 0) {
        if (!this.live_camera) {
          this.typeItem[0].disabled = true
          this.historyOptionsForm.type = 2
        } else {
          this.typeItem[0].disabled = false
        }
        console.log(this.permissionDatas.size)
        if (this.permissionDatas.size == 0) {
          this.typeItem[1].disabled = true
          this.historyOptionsForm.type = 1
        } else {
          let is_permission = this.permissionDatas.get(this.historyOptionsForm.stationId).filter(v => v == camera)
          if (is_permission.length == 0) {
            this.typeItem[1].disabled = true
            this.historyOptionsForm.type = 1
          } else {
            this.typeItem[1].disabled = false
          }
        }
        this.typeItem.__ob__.dep.notify()
        console.log(this.typeItem[1])
      }
    },
    downloadCodeImg (src, time) {
      // console.log('下载图片')
      const a = document.createElement('a')
      a.href = src
      a.setAttribute('download', 'img-' + time)
      a.click()

    },

  }
}
// byte转base64
function arrayBufferToBase64 (buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);

}
</script>
<style scoped>
.height {
  min-height: 86vh;
}
</style>

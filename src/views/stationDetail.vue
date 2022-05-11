<!-- 站点详情展示页面 -->
 <!-- station details page -->
<template>
  <v-container fluid class="pa-0">
    <!-- 新建按钮 -->
    <!-- vreate button -->
    <div style="position: absolute; top: 1.5%; left: 4%; z-index: 1">
      <v-btn color="primary" @click="
            createStation();
            newBtnAble = true;
          " :disabled="role === 0 || newBtnAble">{{ $vuetify.lang.t("$vuetify.stationDetail.btn.new") }}</v-btn>
    </div>
    <!-- 地图div -->
    <!-- map div -->
    <div id="map-container-dl" style="min-height: 91vh"></div>
    <!-- 站点数据展示板 -->
    <!-- display station data  -->
    <div class="pa-3" style="position: absolute; top: 1%; right: 1%">
      <v-card class="px-3 py-4 overflow-y-auto" style="max-width: 40vw; max-height: 83vh">
        <!-- 站点信息表单 -->
        <!-- station information form -->
        <v-form ref="form">
          <v-row>
            <v-col cols="12">
              <v-text-field dense :label="
                  $vuetify.lang.t('$vuetify.stationDetail.form.stationName')
                " v-model="form.name" :rules="
                  rule(
                    $vuetify.lang.t('$vuetify.stationDetail.form.stationName')
                  )
                " :readonly="role === 0">
                <template v-slot:prepend>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-space-station</v-icon>
                    </template>
                    {{
                      $vuetify.lang.t("$vuetify.stationDetail.form.stationName")
                    }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field dense :label="$vuetify.lang.t('$vuetify.stationDetail.form.latlng')" v-model="form.latlng"
                :rules="
                  rule($vuetify.lang.t('$vuetify.stationDetail.form.latlng'))
                " :readonly="editIndex !== -1">
                <template v-slot:prepend>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-location-enter</v-icon>
                    </template>
                    {{ $vuetify.lang.t("$vuetify.stationDetail.form.latlng") }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field dense :label="$vuetify.lang.t('$vuetify.stationDetail.form.location')"
                v-model="form.location" :rules="
                  rule($vuetify.lang.t('$vuetify.stationDetail.form.location'))
                " :readonly="role === 0">
                <template v-slot:prepend>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-map-marker</v-icon>
                    </template>
                    {{
                      $vuetify.lang.t("$vuetify.stationDetail.form.location")
                    }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field dense :label="$vuetify.lang.t('$vuetify.stationDetail.form.partner')" v-model="form.partner"
                :rules="
                  emailRule(
                    $vuetify.lang.t('$vuetify.stationDetail.form.partner')
                  )
                " :readonly="role === 0">
                <template v-slot:prepend>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-home-analytics</v-icon>
                    </template>
                    {{ $vuetify.lang.t("$vuetify.stationDetail.form.partner") }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field dense :label="$vuetify.lang.t('$vuetify.stationDetail.form.contact')" v-model="form.contact"
                :rules="
                  rule($vuetify.lang.t('$vuetify.stationDetail.form.contact'))
                " :readonly="role === 0">
                <template v-slot:prepend>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-card-account-phone</v-icon>
                    </template>
                    {{ $vuetify.lang.t("$vuetify.stationDetail.form.contact") }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field dense :label="$vuetify.lang.t('$vuetify.stationDetail.ip')" prepend-icon="mdi-wan"
                v-model="ip" v-show="editIndex !== -1" readonly>
                <template v-slot:prepend>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-wan</v-icon>
                    </template>
                    {{ $vuetify.lang.t("$vuetify.stationDetail.ip") }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="">
            <v-col cols="12">
              <v-text-field :label="$vuetify.lang.t('$vuetify.stationDetail.form.deviceId')" dense v-model="identifier"
                :rules="
                  rule($vuetify.lang.t('$vuetify.stationDetail.form.deviceId'))
                " :readonly="editIndex !== -1">
                <template v-slot:prepend>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-devices</v-icon>
                    </template>
                    {{
                      $vuetify.lang.t("$vuetify.stationDetail.form.deviceId")
                    }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <!-- 操作按钮 -->
        <!-- operation button -->
        <v-card-actions class="d-flex justify-end">
          <v-btn color small @click="cancel" v-if="editIndex === -1">
            {{ $vuetify.lang.t("$vuetify.stationDetail.btn.cancel") }}</v-btn>
          <v-btn color="primary" small @click="submit" :disabled="role === 0">
            {{ $vuetify.lang.t("$vuetify.stationDetail.btn.submit") }}</v-btn>
        </v-card-actions>
        <!-- 站点数据图表 -->
        <!-- data chart -->
        <div v-show="editIndex !== -1" :key="componentKey">
          <v-divider class="mb-4 mt-1" light></v-divider>
          <v-combobox style="width: 20vw" class="mx-auto" :items="itemNameList" hide-selected
            :menu-props="showMenuProps" @click="showMenuProps = {}" dense chips clearable :label="
              $vuetify.lang.t(
                '$vuetify.stationDetail.showItemData.comboboxLabel'
              )
            " multiple solo v-model="selectedItemNames">
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip small class="my-1" v-bind="attrs" :input-value="selected" close @click="select"
                @click:close="removeSelectedItemName(item)">
                <strong>{{ item }}</strong>
              </v-chip>
            </template>
          </v-combobox>
          <!-- 数据类型及所属传感器名称 -->
          <!--  -->
          <!-- <div v-for="item in role === 0 ? permissionItems : sensorItems" :key="item.name"> -->
          <div v-for="item in  sensorItems" :key="item.name">
            <!-- 在选择列表里才进行图表展示 -->
            <v-row v-show="
                selectedItemNames.filter((name) => name == item.name).length > 0
              " style="width:20vw">
              <v-col cols="12">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-chip v-on="on" dark :color="
                        item.color">{{ item.name }}
                    </v-chip>
                  </template>
                  {{ item.text }}
                </v-tooltip>
                <span color="white" class="ml-4 font-weight-bold">{{
                  item.device_name
                }}</span>
              </v-col>
              <!-- 图表div -->
              <!-- chart div -->
              <v-col cols="12">
                <div :id="item.name" name="1234" style="width:24vw"></div>
                <!-- <div v-show="
                    JSON.stringify(showMap) == '{}' || !item.name in showMap
                  " class="font-weight-bold text-body-1 pa-3">
                  {{
                    $vuetify.lang.t(
                      "$vuetify.stationDetail.showItemData.noData"
                    )
                  }}
                </div> -->
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card>
    </div>
    <!-- 通知工具 -->
    <!-- tips -->
    <v-snackbar v-model="showSnackbar" :color="color" :timeout="3000" :top="true">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>
<script>
import L from "leaflet"; //leaflet地图obj
import Plotly from "plotly.js-dist"; //plotly obj
import axios from "axios"; //基于Promise的HTTP客户端
import qs from "qs"; //处理提交的表单数据 
import commonCfg from "../config/common";
import mapCfg from "../config/map";
let webSocket = commonCfg.webSocket
let commonUrl = commonCfg.commonUrl;
let version = commonCfg.urlVersion;
let vm;
let wsConn = null;
let leafMap, //地图Object map
  newMarker, //正在新建的marker creating station marker
  markers = []; //已经创建过的所有marker列表 markers list
let markerMap = new Map // 用于修改marker状态 edit marker status
//plotly配置参数
// ploytly config
let plotConfig = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: ["select2d", "toggleSpikelines", "lasso2d"],
  locale: "zh-CN",
};
//普通icon
// online icon
let icon = L.icon({
  iconUrl: require("../../public/tidegauge.png"),
  iconSize: [25, 27],
});
//新建的icon
// create station icon
let newIcon = L.icon({
  iconUrl: require("../../public/tidegauge-new.png"),
  iconSize: [25, 27],
});
//离线的icon
// offline icon
let offlineIcon = L.icon({
  iconUrl: require("../../public/tidegauge-offline.png"),
  iconSize: [25, 27],
});
let statusWsConn;

export default {
  data () {
    return {
      // tips
      showSnackbar: false, //是否显示通知  
      color: "error", //通知的颜色 
      text: "", //通知的内容 

      form: {
        latlng: "", //经纬度
        name: "", //站名
        location: "", //位置
        partner: "", //伙伴 
        contact: "", //联系方式 
        id: -1, //站id
      },
      showStationId: '', //当前显示站点ID
      ip: "", //ip地址
      paramId: "", //路径参数 传递的是站id url param (station id)
      editIndex: 1, // 新建/修改站的标志 -1代表新建 其它代表编辑 -1:create other:edit
      componentKey: 0, //组件key
      param: '', // websocker param
      stationList: [], //所有站点数据列表 
      identifier: "", //设备id /device id
      station_id: '', // 站台Id /station id
      sensorItems: [], //设备下数据列表 sensor list in device
      newBtnAble: false, //是否可以点击新建按钮 control click create button
      showMap: {}, //保存当前站点中设备数据的最新值 save new data with choosed station 
      itemNameList: [], //数据名称列表 
      selectedItemNames: [], //已选择的数据名称列表 
      showMenuProps: {}, // 控制下拉菜单的显示和隐藏 Control the display and hide of the drop-down menu
      permissionDatas: {}, //权限数据列表 
      permissionItems: [], // 普通用户权限下的数据列表  ordinary user item data permission
      role: parseInt(localStorage.role), //当前登录用户的权限 login user role
    };
  },
  props: ["wsConn"],
  //页面销毁时调用
  destroyed: function () {
    //关闭链接 不然会报No DOM element with id '×××' exists on the page
    wsConn.onclose = undefined;
    wsConn.close(1000); //参数1000 代表正常关闭  1000 is close
  },
  created () {
    vm = this;
    vm.paramId = vm.$route.params.id; //new 代表没有传递站参数 new means no station id in url param
    if (vm.paramId === "new") {
      vm.resetForm();
      //vm.$refs.form.resetValidation();
      vm.editIndex = -1;
    }
  },
  async mounted () {
    vm.initMap();
    if (this.role != 0) {
      setTimeout(function () {
        vm.getStatus()
      }, 2000);
    }
    vm.setWSConn();
    await vm.getAllStations();
    vm.showMarkers();
    // vm.getPermissions();

  },
  methods: {
    //初始化地图

    initMap () {
      leafMap = L.map("map-container-dl", {
        center: mapCfg.center,
        zoom: mapCfg.zoom,
        attributionControl: false,
      });
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          //  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          //attributionControl: false,
          maxZoom: mapCfg.maxZoom,
          id: mapCfg.style,
          tileSize: mapCfg.tileSize,
          zoomOffset: -1,
          accessToken: mapCfg.mapBoxAccessToken,
        }
      ).addTo(leafMap);
    },
    //初始化plotly图表
    initChart (unit, id, xData, yData) {
      console.log(id)
      console.log(unit)
      var layout = {
        title: id,
        showlegend: false,
        yaxis: {
          title: {
            text: unit,
          },
          fixedrange: true,
        },
      };
      //console.log(id)
      return Plotly.newPlot(
        id,
        [
          {
            name: id,
            type: "waterfall",
            orientation: "v",
            x: xData,
            textposition: "outside",
            y: yData,
            connector: {
              line: {
                color: "rgb(63, 63, 63)",
              },
            },
            increasing: { marker: { color: "blue" } },
            decreasing: { marker: { color: "orange" } },
          },
        ],
        layout,
        plotConfig
      );
    },
    //获得所有站点数据
    async getAllStations () {
      let res = await axios.get(`${commonUrl}listStation${version}`);
      try {
        vm.stationList = res.data;
        if (!vm.stationList) vm.stationList = [];

      } catch (error) {
        console.log(error);
        vm.stationList = [];
      }
    },
    //编辑站点数据
    async editStation (obj) {
      let res = await axios.post(`${commonUrl}editStation${version}`, obj);
      try {
        return res.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    //获得数据列表
    async getAllItems () {
      if (!vm.station_id) {
        vm.sensorItems = [];
        return;
      }
      let param =
        vm.station_id === ""
          ? {}
          : {
            params: {
              station_id: vm.station_id,
            },
          };
      let res = await axios.get(`${commonUrl}listItem${version}`, param);
      try {
        if (!res.data) {
          vm.sensorItems = [];
          return;
        }
        vm.sensorItems = res.data.filter(v => v.available).map(v => {
          if (v.status == 'Normal') {
            v.color = 'blue'
            v.text = vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.online")
          } else if (v.status == 'Abnormal') {
            v.color = 'orange'
            v.text = vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.noData")
          } else {
            v.color = 'red'
            v.text = vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.offline")
          }
          return v
        });
        // console.log(vm.sensorItems)
      } catch (error) {
        console.log(error);
        vm.sensorItems = [];
      }
    },

    //规则判断 为空时提示错误信息
    rule (type) {
      return [
        (v) =>
          !!v ||
          type + vm.$vuetify.lang.t("$vuetify.stationDetail.formValidate"),
      ];
    },
    //邮箱验证规则
    // email verification rules
    emailRule (type) {
      return [
        (v) =>
          !!v ||
          type + vm.$vuetify.lang.t("$vuetify.stationDetail.formValidate"), //不为空 // not null
        (v) =>
          /.+@.+\..+/.test(v) ||
          vm.$vuetify.lang.t("$vuetify.userconfig.mailValid"), //格式验证 format verification
      ];
    },
    //根据站点位置在地图上显示marker
    // show marker in map by station latlng
    showMarkers () {
      for (let spot of vm.stationList) {
        console.log(spot)
        let perIcon = icon;
        if (spot.status == 'Disconnected') {
          perIcon = offlineIcon
        }
        //不是新建marker
        // not new marker
        if (vm.paramId !== "new") {
          //遍历找到当前选中的marker
          // 
          if (spot.id === vm.paramId) {
            vm.editIndex = 1; //表示正在编辑marker而非新建 1 means edit marker not create
            vm.showFormDetail(spot); //显示form表单详情 show form info
            vm.ip = spot.ip_addr; //显示ip
            //vm.componentKey += 1; //改变组件id 可以销毁旧组件并创建一个新组件
            vm.showMap = {};
            // wsConn.onclose = undefined;
            // wsConn.close(1000); //参数1000 代表正常关闭 1000 close
            vm.sendItemsToWS(spot.id);
          }
        }
        let latlngs = spot.location.position.split(",");
        //给marker绑定popup
        let marker = L.marker([latlngs[0], latlngs[1]], {
          icon: perIcon,
        }).addTo(leafMap);

        let delBtnName = vm.$vuetify.lang.t("$vuetify.stationDetail.btn.del");
        let popupContentPre = `<button style="color:blue" id="${spot.id}">`;
        let popupContentAppand = "</button>";
        marker.bindPopup(
          `${popupContentPre}${delBtnName}${popupContentAppand}`,
          { offset: [2, -6] }
        );
        markerMap.set(spot.id, marker)
        //点击marker时触发
        // click marker 
        marker.on("click", function () {
          console.log(vm.showStationId == spot.id)
          //给每个marker的id绑定一个删除事件
          // addeventlistener with marker to delete
          document
            .getElementById(spot.id + "")
            .addEventListener("click", function () {
              vm.del(spot.id, marker);
            });
          if (vm.showStationId == spot.id) {
            return;
          }
          vm.showStationId = spot.id
          vm.editIndex = 1; //表示正在编辑marker而非新建 1 means edit marker not create
          vm.showFormDetail(spot); //显示form表单详情
          vm.ip = spot.ip_addr; //显示ip show ip
          //语言切换后 改变 删除/delete 按钮名字的中英文
          // 
          if (
            vm.$vuetify.lang.t("$vuetify.stationDetail.btn.del") !== delBtnName
          ) {
            delBtnName = vm.$vuetify.lang.t("$vuetify.stationDetail.btn.del");
            marker._popup.setContent(
              `${popupContentPre}${delBtnName}${popupContentAppand}`
            );
          }
          //打开popup窗口
          // open popup
          if (vm.role === 0) marker.closePopup(); //普通用户的话就关闭popup  close popup when is ordinary user 
          console.log(spot.id)
          wsConn.send(null)
          vm.componentKey += 1; //改变组件id 可以销毁旧组件并创建一个新组件

          vm.showMap = {};
          vm.sendItemsToWS(spot.id);
        });
        //所有marker放进数组
        markers.push(marker);
      }
    },
    //新建一个站
    createStation () {
      vm.editIndex = -1; //新建站的标志
      vm.showStationId = -1
      vm.form.id = -1; //新建站没有站id 设为-1
      vm.resetForm(); //清空form表单
      vm.$refs.form.resetValidation(); //清空验证 clear validation
      if (newMarker) {
        //之前有新建marker，就删除，避免产生多个
        // remove old created marker
        leafMap.removeLayer(newMarker);
        newMarker = null;
      }
      //绑定地图点击事件
      // add click event to map
      leafMap.on("click", function (ev) {
        vm.form.latlng = `${ev.latlng.lat},${ev.latlng.lng}`; //设置坐标 set latlng
        //新建marker
        // create marker 
        newMarker = L.marker([ev.latlng.lat, ev.latlng.lng], {
          icon: newIcon,
          draggable: true, //可拖拽 
        }).addTo(leafMap);
        //绑定marker移动事件
        // add move event to marker
        newMarker.on("move", function (ev) {
          vm.resetForm(); //清空form表单 clear form
          vm.$refs.form.resetValidation(); //清空验证 clear validation
          vm.form.latlng = `${ev.latlng.lat},${ev.latlng.lng}`;
          vm.editIndex = -1;
          vm.form.id = -1;
          vm.showStationId = -1
        });
        //绑定marker移动点击事件
        // add click event to marker
        newMarker.on("click", function (ev) {
          vm.resetForm();
          vm.$refs.form.resetValidation();
          vm.form.latlng = `${ev.latlng.lat},${ev.latlng.lng}`;
          vm.editIndex = -1;
          vm.form.id = -1;
          vm.showStationId = -1
        });
        //关闭地图点击事件
        // close click event on map
        leafMap.off("click");
      });
    },
    //取消创建站
    // cancel create station
    cancel () {
      vm.resetForm();
      vm.$refs.form.resetValidation();
      if (newMarker) {
        leafMap.removeLayer(newMarker);
        newMarker = null;
      }
      vm.newBtnAble = false; //可以点击新建按钮 create button abled
    },
    //删除站
    async del (id, marker) {
      vm.$dialog
        .confirm({
          text: vm.$vuetify.lang.t("$vuetify.stationDetail.delConfirm.text"),
          title: vm.$vuetify.lang.t("$vuetify.stationDetail.delConfirm.title"),
          cancel: "取消",
          actions: [
            {
              text: vm.$vuetify.lang.t(
                "$vuetify.stationDetail.delConfirm.actions.cancelText"
              ),
              color: "blue",
              key: "false",
            },
            {
              text: vm.$vuetify.lang.t(
                "$vuetify.stationDetail.delConfirm.actions.confirmText"
              ),
              color: "blue",
              key: true,
            },
          ],
        })
        .then(async (type1) => {
          if (!type1) return;
          console.log(id)
          console.log(this.sensorItems)
          let hasData = false
          for (var seneor of this.sensorItems) {
            if (seneor.available) {
              hasData = true
              break;
            }
          }
          // 如果有数据再次确认
          // reconfirm if station has data
          if (hasData) {
            vm.$dialog
              .confirm({
                text: vm.$vuetify.lang.t("$vuetify.stationDetail.delConfirm.text1"),
                title: vm.$vuetify.lang.t("$vuetify.stationDetail.delConfirm.title1"),
                cancel: "取消",
                actions: [
                  {
                    text: vm.$vuetify.lang.t(
                      "$vuetify.stationDetail.delConfirm.actions.cancelText"
                    ),
                    color: "blue",
                    key: "false",
                  },
                  {
                    text: vm.$vuetify.lang.t(
                      "$vuetify.stationDetail.delConfirm.actions.confirmText"
                    ),
                    color: "blue",
                    key: true,
                  },
                ],
              }).then(async (type) => {
                if (!type) return;
                await vm.deleteStation(id, marker)
              });
          } else {
            await vm.deleteStation(id, marker)
          }

        })

    },
    // 删除站点
    async deleteStation (id, marker) {
      if (vm.sensorItems.length > 0) {
        vm.tips(
          vm.$vuetify.lang.t(
            "$vuetify.stationDetail.tips.notAllowedDelete"
          ),
          "error"
        );
        marker.closePopup(); //关闭popup
        return;
      }
      let res = await axios.post(
        `${commonUrl}delStation${version}`,
        qs.stringify({ id: id })
      );
      if (!res || res.data != "ok") {
        vm.tips(
          vm.$vuetify.lang.t("$vuetify.stationDetail.tips.delFail"),
          "error"
        );
        return;
      }
      vm.tips(
        vm.$vuetify.lang.t("$vuetify.stationDetail.tips.delSuccess"),
        "success"
      );
      vm.editIndex = -1; //删除成功后 重新将标志设为新建标志
      let markerObj = markers.filter((m) => m == marker);
      let markerIndex = markers.indexOf(markerObj[0]);
      markers.splice(markerIndex, 1); //数组删除marker对象
      marker.closePopup(); //关闭popup
      leafMap.removeLayer(marker); //地图删除layer
      vm.resetForm(); //重置form
      vm.$refs.form.resetValidation(); //清空验证
    },
    //提交表单
    async submit () {
      var isEmpty = vm.$refs.form.validate();
      if (!isEmpty) {
        return;
      }
      let newData = vm.form; //JSON.parse(JSON.stringify(vm.form)); //JSON.parse，会帮我们开辟一个新的地址空间
      let obj = {
        name: newData.name,
        location: { name: newData.location, position: newData.latlng },
        partner: { name: newData.partner, contact: newData.contact },
        identifier: vm.identifier,
      };
      if (vm.editIndex === -1) {
        //新建站
        // create station
        let newRes = await vm.editStation(obj);
        if (!newRes || newRes != "ok") {
          vm.tips(
            vm.$vuetify.lang.t("$vuetify.stationDetail.tips.newFail"),
            "error"
          );
          return;
        }
        //新建成功
        // create successful
        await vm.getAllStations(); // 获取站列表 get station list
        leafMap.removeLayer(newMarker); // 移除当前新建marker remove created station
        newMarker = null;
        for (let marker of markers) {
          //移除所有marker
          // remove all marker
          leafMap.removeLayer(marker);
        }
        markers = [];
        vm.showMarkers(); //重新显示所有marker show all marker
        vm.newBtnAble = false; //可以点击新建按钮 
      } else {
        //编辑站
        // edit station 
        obj.id = newData.id;
        let newRes = await vm.editStation(obj);
        if (!newRes || newRes != "ok") {
          vm.tips(
            vm.$vuetify.lang.t("$vuetify.stationDetail.tips.editFail"),
            "error"
          );
          return;
        }
        vm.editIndex = -1;
        vm.showStationId = ''
        wsConn.send(null)
        vm.componentKey += 1;
        //编辑成功
        // edit successful
        await vm.getAllStations(); // 获取站列表 get station list
        for (let marker of markers) {
          //移除所有marker
          marker.closePopup();
          leafMap.removeLayer(marker);
        }
        markers = [];
        vm.showMarkers(); //重新显示所有marker
      }
      vm.tips(
        vm.$vuetify.lang.t("$vuetify.stationDetail.tips.saveSuccess"),
        "success"
      );
      vm.resetForm();
      vm.$refs.form.resetValidation();
      vm.editIndex = -1;
    },
    //表单显示
    // show from
    showFormDetail (newData) {
      vm.form.id = newData.id;
      vm.form.name = newData.name;
      vm.form.latlng = newData.location.position;
      vm.form.location = newData.location.name;
      vm.form.partner = newData.partner == null ? "null" : newData.partner.name;
      vm.form.contact = newData.partner == null ? "null" : newData.partner.contact;
      vm.identifier = newData.identifier;
      vm.station_id = newData.id;
    },
    //清空表单
    // clear form
    resetForm () {
      for (let key in vm.form) {
        vm.form[key] = "";
      }
      vm.ip = "";
      vm.identifier = "";
    },
    //通知提示工具
    tips (text, color) {
      vm.text = text;
      vm.showSnackbar = true;
      vm.color = color;
    },
    //从选中的数据名称列表里删除传入的数据名
    // delete the incoming data name from the selected data name list
    removeSelectedItemName (item) {
      vm.selectedItemNames.splice(vm.selectedItemNames.indexOf(item), 1);
      vm.selectedItemNames = [...vm.selectedItemNames];
      vm.showMenuProps = { value: false }; //隐藏下拉菜单 
    },
    //获取相邻两个数据的差值
    // get the difference between two adjacent data
    yDataDiff (data) {
      let yDiff = [];
      if (data.length <= 0) {
        return yDiff;
      }
      for (let i = 1; i < data.length; i++) {
        yDiff.push(data[i] - data[i - 1]);
      }
      return yDiff;
    },
    //得到当前登录用户的权限数据列表
    // get login user's data permission list
    async getPermissions () {
      let res = await axios.get(
        `${commonUrl}listPermission${version}`
      );
      console.log(res);
      try {
        if (res.data) vm.permissionDatas = res.data;
      } catch (error) {
        console.log(error);
        vm.permissionDatas = {};
      }
    },
    //给websocket发送数据列表以获得相应数据
    async sendItemsToWS (stationId) {
      console.log(stationId)
      vm.itemNameList = [];
      vm.selectedItemNames = [];
      await vm.getAllItems();
      //当前登录用户为普通用户
      // if login user is ordinary user
      if (vm.role == 0) {
        let items = []
        await vm.getPermissions();
        // vm.permissionItems = vm.permissionDatas
        for (let key in vm.permissionDatas) {
          for (let item_name of vm.permissionDatas[key]) {
            let item = vm.sensorItems.filter(v => v.name == item_name)[0]
            items.push(item)
          }
          if (stationId === key) {
            vm.itemNameList = vm.permissionDatas[key];
            break;
          }
        }
        vm.$set(vm, 'sensorItems', items);

      } else {
        //当前登录用户为管理员
        // if login user is admin

        for (var item of vm.sensorItems) {
          vm.itemNameList.push(item.name);
        }

      }
      if (vm.itemNameList.length <= 0) {
        vm.param = ''
        //  wsConn.send(null);//发送null 意思是取消订阅
        return;
      }
      //初始化图表
      // init chart


      for (let name of vm.itemNameList) {
        //console.log( name)
        vm.initChart(vm.getUnitByItemName(name), name, [], []);
      }
      //send message to ws
      console.log(vm.itemNameList)
      console.log(stationId)
      let param = {};
      param[stationId] = vm.itemNameList

      console.log(param)
      vm.param = param
      wsConn.send(JSON.stringify(param));
    },
    async getStatus () {
      statusWsConn = this.wsConn;
      console.log(window.wsConn)
      if (statusWsConn == null) {
        await sleep(100)
        this.getStatus()
      }
      statusWsConn.onmessage = this.handleStatusWSMessage;
    },

    // 获取设备状态
    // get device status
    handleStatusWSMessage (evt) {
      let data = JSON.parse(evt.data);

      console.log(data)
      if (data.type == 'UpdateItemStatus') {
        for (let i = 0; i < vm.sensorItems.length; i++) {
          if (vm.sensorItems[i].name != data.body.item_name) {
            continue
          }
          if (data.body.status == 'Normal') {
            vm.sensorItems[i].color = 'blue'
            vm.sensorItems[i].text = vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.online")
            vm.$emit("tips", data.body.item_name + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.online"), "green")
          } else if (data.body.status == 'Abnormal') {
            vm.sensorItems[i].color = 'yellow lighten-1'
            vm.sensorItems[i].text = vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.noData")
            vm.$emit("tips", data.body.item_name + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.noData"), "red")
          } else {
            vm.sensorItems[i].color = 'red lighten-2'
            vm.sensorItems[i].text = vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.offline")
            vm.$emit("tips", data.body.item_name + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.offline"), "red")
          }
          vm.$set(vm.sensorItems, i, vm.sensorItems[i])
        }
      } else {
        let markerIcon
        if (data.body.status == 'Normal') {
          markerIcon = icon
          vm.$emit("tips", data.body.identifier + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.online"), "green")
        } else {
          markerIcon = offlineIcon
          vm.$emit("tips", data.body.identifier + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.offline"), "red")
          // for (let i = 0; i < vm.sensorItems.length; i++) {
          //   if (vm.sensorItems[i].station_id != data.body.station_id) {
          //     continue
          //   }
          //   if (data.body.status == 'Disconnected') {
          //     vm.sensorItems[i].color = 'red'
          //     vm.sensorItems[i].text = vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.offline")
          //     vm.$set(vm.sensorItems, i, vm.sensorItems[i])

          //   }
          // }
        }
        markerMap.get(data.body.station_id).setIcon(markerIcon)

      }
    },
    //设置websocket连接
    setWSConn () {
      // window.wsConn = new WebSocket(webSocket);
      wsConn = new WebSocket(webSocket);
      wsConn.onopen = this.handleWSOpen;
      wsConn.onclose = this.handleWSClose;
      wsConn.onerror = this.handleWSError;
      wsConn.onmessage = this.handleWSMessage;
    },
    //websocket链接成功
    handleWSOpen () {
      console.log("connection success...");
      if (this.param != '') {
        wsConn.send(JSON.stringify(this.param));
      }
    },
    //websocket链接失败
    // closeEvent:
    // code: 4001, reason: "Unauthorized"
    // code: 4002, reason: "Internal Server Error"
    handleWSClose (evt) {
      console.log(evt);
      if (evt.code === 1000) return;
      if (evt.code === 4001) {
        vm.tips(
          vm.$vuetify.lang.t("$vuetify.stationDetail.tips.authFail"),
          "error"
        );
        // localStorage.removeItem('token');
        // localStorage.removeItem("role");
        // setTimeout(function () {
        //   vm.$router.push('/login');
        // }, 1000);
      } else if (evt.code === 4002) {
        //服务器内部错误
        setTimeout(vm.setWSConn, 3000);
      } else {
        setTimeout(vm.setWSConn, 2000);
      }
    },
    //关闭websocket链接
    handleWSError (evt) {
      console.log(evt);
      wsConn.close();
    },
    //数据处理
    // handle data 
    handleWSMessage (evt) {
      let data = JSON.parse(evt.data);

      var param = data.item_name;
      if (param in vm.showMap) {
        Plotly.extendTraces(
          param,
          {
            x: [[new Date(data.timestamp)]],
            y: [[data.value - vm.showMap[param]]],
          },
          [0],
          30
        );
        vm.$set(vm.showMap, param, data.value)
        // vm.showMap[param] = data.value;
      } else {
        vm.$set(vm.showMap, param, data.value)
        // vm.showMap[param] = data.value;
      }
    },
    //根据数据类型获得单位
    // get unit by data typr
    // getUnitByItemName (name) {
    //   let unit;
    //   switch (name) {
    //     case "AirTemperature":
    //       unit = "℃";
    //       break;
    //     case "AirHumidity":
    //       unit = "%";
    //       break;
    //     case "WindSpeed":
    //       unit = "m/s";
    //       break;
    //     case "WindDirection":
    //       unit = "°";
    //       break;
    //     case "AirPressure":
    //       unit = "100pa";
    //       break;
    //     case "Precipitation":
    //       unit = "ml";
    //       break;
    //     case "WaterTemperature":
    //       unit = "℃";
    //       break;
    //     case "WaterSalinity":
    //       unit = "/";
    //       break;
    //     case "WaterHeight":
    //       unit = "m";
    //       break;
    //     case "Visibility":
    //       unit = "km";
    //       break;
    //     default:
    //       unit = "/";
    //   }
    //   return unit;
    // },
    getUnitByItemName (itemName) {
      itemName = itemName.toLowerCase()
      if (itemName.indexOf('air') != -1 && itemName.indexOf('humidity') != -1) return '%'
      if (itemName.indexOf('temperature') != -1) return '℃'
      if (itemName.indexOf('wind') != -1 && itemName.indexOf('direction') != -1) return '°'
      if (itemName.indexOf('wind') != -1 && itemName.indexOf('speed') != -1) return 'm/s'
      if (itemName.indexOf('air') != -1 && itemName.indexOf('pressure') != -1) return '100pa'
      if (itemName.indexOf('precipitation') != -1) return 'ml'
      if (itemName.indexOf('water') != -1 && itemName.indexOf('salinity') != -1) return '/'
      if (itemName.indexOf('water') != -1 && (itemName.indexOf('height') != -1) || itemName.indexOf('level') != -1) return 'm'
      if (itemName.indexOf('visibility') != -1) return 'km'
      return ''
    },
  },
};
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
</script>
<style scoped>
/* 可以在选择器中使用/deep/或>>>来创建应用于子组件内部元素的样式规则 */
::v-deep .col {
  padding-top: 0px;
  padding-bottom: 0px;
}

::v-deep .leaflet-pane {
  z-index: 0;
}

::v-deep .leaflet-top {
  z-index: 0;
}
</style>
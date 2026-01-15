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
      <v-card class="px-3 py-4 overflow-y-auto" :max-width="$vuetify.breakpoint.xsOnly ? '95vw' : '40vw'" style="max-height: 83vh">
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
                " :readonly="role === 0">
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
          <v-combobox :style="{'width': $vuetify.breakpoint.smAndDown ? '95vw' : ($vuetify.breakpoint.mdOnly ? '50vw' : '20vw')}" class="mx-auto" :items="itemNameList" hide-selected
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
           <v-radio-group row v-model="chartType" class="mx-auto mt-0" :style="{'width': $vuetify.breakpoint.smAndDown ? '95vw' : ($vuetify.breakpoint.mdOnly ? '50vw' : '20vw')}" @change="changeChartType">
            <v-radio :label="$vuetify.lang.t('$vuetify.historyData.form.line')" value="line"></v-radio>
            <v-radio :label="$vuetify.lang.t('$vuetify.historyData.form.waterfall')" value="waterfull"></v-radio>
          </v-radio-group>
          <!-- 数据类型及所属传感器名称 -->
          <!--  Data type and sensor name -->
          <!-- <div v-for="item in role === 0 ? permissionItems : sensorItems" :key="item.name"> -->
          <div v-for="item in  sensorItems" :key="item.name">
            <!-- 在选择列表里才进行图表展示 -->
            <!-- Only display the chart in the selection list -->
            <v-row v-show="
                selectedItemNames.filter((name) => name == item.name).length > 0
              " :style="{'width': $vuetify.breakpoint.smAndDown ? '95vw' : ($vuetify.breakpoint.mdOnly ? '40vw' : '20vw')}">
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
                <div :id="item.name" name="1234" :style="{'width': $vuetify.breakpoint.smAndDown ? '95vw' : ($vuetify.breakpoint.mdOnly ? '50vw' : '20vw')}"></div>
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
import L from "leaflet"; //leaflet地图obj leaflet map obj
import Plotly from "plotly.js-dist"; //plotly obj
import axios from "axios"; //基于Promise的HTTP客户端 Promise-based HTTP client
import qs from "qs"; //处理提交的表单数据 Handling submitted form data
import commonCfg from "../config/common";
import mapCfg from "../config/map";


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
let currentStationId;
export default {
  data () {
    return {
      // tips
      showSnackbar: false, //是否显示通知 whether to show notifications
      color: "error", //通知的颜色 notification color
      text: "", //通知的内容 Content of the notice

      form: {
        latlng: "", //经纬度 latitude and longitude
        name: "", //站名 station name
        location: "", //位置 location 
        partner: "", //伙伴 partner
        contact: "", //联系方式 Contact information
        id: -1, //站id station id
      },
      showStationId: '', //当前显示站点ID Currently showing station ID
      ip: "", //ip地址 ip address
      paramId: "", //路径参数 path parameter 传递的是站id url param (station id)
      editIndex: 1, // 新建/修改站的标志 New/modified station flag -1代表新建 其它代表编辑 -1:create other:edit
      componentKey: 0, //组件key component key
      param: '', // websocker param
      stationList: [], //所有站点数据列表 List of all station data
      identifier: "", //设备id /device id
      station_id: '', // 站台Id /station id
      sensorItems: [], //设备下数据列表 sensor list in device
      newBtnAble: false, //是否可以点击新建按钮 control click create button
      showMap: {}, //保存当前站点中设备数据的最新值 save new data with choosed station 
      itemNameList: [], //数据名称列表 List of data names
      selectedItemNames: [], //已选择的数据名称列表 List of selected data names
      showMenuProps: {}, // 控制下拉菜单的显示和隐藏 Control the display and hide of the drop-down menu
      permissionDatas: {}, //权限数据列表 Permission data list
      permissionItems: [], // 普通用户权限下的数据列表  ordinary user item data permission
      role: parseInt(localStorage.role), //当前登录用户的权限 login user role
      dataWsUrl: commonCfg.dataWs + localStorage.token,
      chartType: 'line',
    };
  },
  props: ["wsConn"],
  //页面销毁时调用 Called when the page is destroyed
  destroyed: function () {
    //关闭链接 不然会报No DOM element with id '×××' exists on the page
    //Close the link or it will be reported No DOM element with id '×××' exists on the page
    wsConn.onclose = undefined;
    wsConn.close(1000); //参数1000 代表正常关闭 Parameter 1000 means normal shutdown
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
    //Initialize the map
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
    changeChartType() {
      this.componentKey += 1
      this.getItemNameList(currentStationId)
    },
    // 获取图表配置
    // get settings of chart
    normalLayout (name, unit) {
      let layout = {
        title: name,
        yaxis: {
          title: {
            text: unit,
          },
          fixedrange: true,
        },
      };
      return layout;
    },
    // 折线数据配置
    // polyline chart setting
    normalData (id) {
      let data = {
        name: id,
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines+markers',
        //turboThreshold: 0,
      };
      return [data];
    },
    // 图表初始化
    // init chart
    initLineChart (unit, id) {
      Plotly.react(
        id,
        this.normalData(id),
        this.normalLayout(id, unit),
        plotConfig
      );
    },
    //初始化plotly图表
    //Initialize plotly chart
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
      return Plotly.react(
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
    //获得所有站点数据 Get all station data
    async getAllStations () {
      let res = await axios.get(commonCfg.listStation);
      try {
        vm.stationList = res.data;
        if (!vm.stationList) vm.stationList = [];

      } catch (error) {
        console.log(error);
        vm.stationList = [];
      }
    },
    //编辑站点数据 edit station data
    async editStation (obj) {
      let res = await axios.post(commonCfg.editStation, obj);
      try {
        return res.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    //获得数据列表 get data list
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
      let res = await axios.get(commonCfg.listItem, param);
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

    //规则判断 为空时提示错误信息 When the rule is judged to be empty, it will prompt an error message
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
            vm.ip = spot.ip_addr; //显示ip show ip
            //vm.componentKey += 1; //改变组件id 可以销毁旧组件并创建一个新组件 Change the component id to destroy the old component and create a new one
            vm.showMap = {};
            // wsConn.onclose = undefined;
            // wsConn.close(1000); //参数1000 代表正常关闭 Parameter 1000 means normal shutdown
            vm.sendItemsToWS(spot.id);
          }
        }
        let latlngs = spot.location.position.split(",");
        //给marker绑定popup Bind popup to marker
        let marker = L.marker([latlngs[0], latlngs[1]], {
          icon: perIcon,
        }).addTo(leafMap);

        let delBtnName,popupContentPre,popupContentAppand;
        if (vm.role !== 0) {// 普通用户不能删除，管理员才能删除 Administrators have permission to delete
          delBtnName = vm.$vuetify.lang.t("$vuetify.stationDetail.btn.del");
          popupContentPre = `<button style="color:blue" id="${spot.id}">`;
          popupContentAppand = "</button>";
          marker.bindPopup(
            `${popupContentPre}${delBtnName}${popupContentAppand}`,
            { offset: [2, -6] }
          );
        }
        
        markerMap.set(spot.id, marker)
        //点击marker时触发
        // click marker 
        marker.on("click", function () {
          console.log(vm.showStationId == spot.id)
          //给每个marker的id绑定一个删除事件
          // addeventlistener with marker to delete
          if (vm.role !== 0) {// 普通用户不能删除，管理员才能删除 Administrators have permission to delete
            document
              .getElementById(spot.id + "")
              .addEventListener("click", function () {
                vm.del(spot.id, marker);
            });
          }
          if (vm.showStationId == spot.id) {
            return;
          }
          vm.showStationId = spot.id
          vm.editIndex = 1; //表示正在编辑marker而非新建 1 means edit marker not create
          vm.showFormDetail(spot); //显示form表单详情 show form detail
          vm.ip = spot.ip_addr; //显示ip show ip
          //语言切换后 改变 删除 按钮名字的中英文
          //After the language switch, change the delete button name in Chinese and English
          if(vm.role !== 0) {// 普通用户不能删除，管理员才能删除 Administrators have permission to delete
            if (
              vm.$vuetify.lang.t("$vuetify.stationDetail.btn.del") !== delBtnName
            ) {
              delBtnName = vm.$vuetify.lang.t("$vuetify.stationDetail.btn.del");
              marker._popup.setContent(
                `${popupContentPre}${delBtnName}${popupContentAppand}`
              );
            }
          }
          
          //打开popup窗口
          // open popup
          //if (vm.role === 0) marker.closePopup(); //普通用户的话就关闭popup  close popup when is ordinary user 
          console.log(spot.id)
          wsConn.send(null)
          vm.selectedItemNames = []
          vm.componentKey += 1; //改变组件id 可以销毁旧组件并创建一个新组件 Change the component id to destroy the old component and create a new one

          vm.showMap = {};
          vm.sendItemsToWS(spot.id);
        });
        //所有marker放进数组 All markers are put into an array
        markers.push(marker);
      }
    },
    //新建一个站 create a new station
    createStation () {
      vm.editIndex = -1; //新建站的标志 new station sign
      vm.showStationId = -1
      vm.form.id = -1; //新建站没有站id 设为-1 The new station has no station id set to -1
      vm.resetForm(); //清空form表单 clear form
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
          draggable: true, //可拖拽 draggable
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
    //删除站 delete station
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
    // 删除站点 delete station
    async deleteStation (id, marker) {
      if (vm.sensorItems.length > 0) {
        vm.tips(
          vm.$vuetify.lang.t(
            "$vuetify.stationDetail.tips.notAllowedDelete"
          ),
          "error"
        );
        marker.closePopup(); //关闭popup close popup
        return;
      }
      let res = await axios.post(
        commonCfg.delStation,
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
      vm.editIndex = -1; //删除成功后 重新将标志设为新建标志 After the deletion is successful, reset the flag to the new flag
      let markerObj = markers.filter((m) => m == marker);
      let markerIndex = markers.indexOf(markerObj[0]);
      markers.splice(markerIndex, 1); //数组删除marker对象 Array delete marker object
      marker.closePopup(); //关闭popup close popup
      leafMap.removeLayer(marker); //地图删除layer delete layer
      vm.resetForm(); //重置form reset form 
      vm.$refs.form.resetValidation(); //清空验证 reset validation
    },
    //提交表单 submit form
    async submit () {
      var isEmpty = vm.$refs.form.validate();
      if (!isEmpty) {
        return;
      }
      let newData = vm.form; //JSON.parse(JSON.stringify(vm.form)); //JSON.parse，会帮我们开辟一个新的地址空间 help us open up a new address space
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
        vm.newBtnAble = false; //可以点击新建按钮 Click the New button
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
          //移除所有marker remove all markers
          marker.closePopup();
          leafMap.removeLayer(marker);
        }
        markers = [];
        vm.showMarkers(); //重新显示所有marker Redisplay all markers
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
    //通知提示工具 notification tool
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
      vm.showMenuProps = { value: false }; //隐藏下拉菜单 Hide dropdown menu
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
        commonCfg.listPermission
      );
      console.log(res);
      try {
        if (res.data) vm.permissionDatas = res.data;
      } catch (error) {
        console.log(error);
        vm.permissionDatas = {};
      }
    },
    async getItemNameList(stationId) {
      vm.itemNameList = [];
      //vm.selectedItemNames = [];
      await vm.getAllItems();
      //当前登录用户为普通用户
      // if login user is ordinary user
      if (vm.role == 0) {
        let items = []
        await vm.getPermissions();
        // vm.permissionItems = vm.permissionDatas
        for (let key in vm.permissionDatas) {
          for (let item_name of vm.permissionDatas[key]) {
            let item = vm.sensorItems.filter(v => v.name == item_name)
            if(item.length > 0) {
              items.push(item[0])
            }     
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
        //  wsConn.send(null);//发送null 意思是取消订阅 means unsubscribe
        return;
      }
      //初始化图表
      // init chart
      for (let name of vm.itemNameList) {
        if(this.chartType == 'line') {
          vm.initLineChart(vm.getUnitByItemName(name), name)
        }else {
          vm.initChart(vm.getUnitByItemName(name), name, [], []);
        }  
      }

    },
    //给websocket发送数据列表以获得相应数据 Send a list of data to websocket to get the corresponding data
    async sendItemsToWS (stationId) {
      currentStationId = stationId
      await this.getItemNameList(stationId);

      if(vm.itemNameList.length <= 0) return
      //send message to ws
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
        let index = vm.sensorItems.findIndex(sensor => sensor.station_id == data.body.station_id && sensor.name == data.body.item_name)
        if(index < 0) return
        vm.sensorItems[index].status == data.body.status
        if (data.body.status == 'Normal') {
          vm.sensorItems[index].color = 'blue'
          vm.sensorItems[index].text = vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.normal")
        } else { // Abnormal
          vm.sensorItems[index].color = 'yellow lighten-1'
          vm.sensorItems[index].text = vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.abnormal") 
        }  
        vm.$set(vm.sensorItems, index, vm.sensorItems[index])
      } else {
        let markerIcon
        if (data.body.status == 'Normal') {
          markerIcon = icon
        } else {
          markerIcon = offlineIcon      
        }
        markerMap.get(data.body.station_id).setIcon(markerIcon)
      }
    },
    //设置websocket连接 Set up websocket connection
    setWSConn () {
      // window.wsConn = new WebSocket(webSocket);
      wsConn = new WebSocket(this.dataWsUrl);
      wsConn.onopen = this.handleWSOpen;
      wsConn.onclose = this.handleWSClose;
      wsConn.onerror = this.handleWSError;
      wsConn.onmessage = this.handleWSMessage;
    },
    //websocket链接成功 websocket connection successful
    handleWSOpen () {
      console.log("connection success...");
      if (this.param != '') {
        wsConn.send(JSON.stringify(this.param));
      }
    },
    //websocket链接失败 websocket connection failed
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
        //服务器内部错误 Internal server error
        setTimeout(vm.setWSConn, 3000);
      } else {
        setTimeout(vm.setWSConn, 2000);
      }
    },
    //关闭websocket链接 close websocket connection
    handleWSError (evt) {
      console.log(evt);
      wsConn.close();
    },
    //数据处理
    // handle data 
    handleWSMessage (evt) {
      let data = JSON.parse(evt.data);
      var param = data.item_name;
      if(this.chartType == 'line') {
        Plotly.extendTraces(
          param,
          {
            x: [[new Date(data.msec)]],
            y: [[data.val]],
          },
          [0],
          30
        );
      }else{
        if (param in vm.showMap) {
          Plotly.extendTraces(
            param,
            {
              x: [[new Date(data.msec)]],
              y: [[data.val - vm.showMap[param]]],
            },
            [0],
            30
          );
          vm.$set(vm.showMap, param, data.val)
          // vm.showMap[param] = data.value;
        } else {
          vm.$set(vm.showMap, param, data.val)
          // vm.showMap[param] = data.value;
        }
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
/* You can use /deep/ or >>> in selectors to create style rules that apply to elements inside child components */
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
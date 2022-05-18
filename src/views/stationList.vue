<!-- 站点显示页面，用于显示所有站的位置 -->
<!-- station display page, which shows the location of all stations -->
<template>
  <v-container fluid class="pa-0">
    <!-- <v-card> -->
    <!-- 地图div map div -->
    <div id="map-container" style="min-height: 91vh"></div>
    <!-- 搜索框 search bar-->
    <v-text-field solo dense style="position: absolute; top: 2%; right: 1%"
      :placeholder="$vuetify.lang.t('$vuetify.stationList.searchPlaceholder')" @keyup.enter="search"
      v-model="searchByName" append-icon="mdi-arrow-right-circle" @click:append="search">
    </v-text-field>
    <!-- </v-card> -->
    <div hidden>
      <v-card :id="documentId" ref="content" @click="detail(documentId)">
        <v-card-title>
          {{stationName}}
        </v-card-title>
        <v-card-subtitle>
          {{stationLocationName}}:{{email}}
        </v-card-subtitle>
        <v-card-text>
          <div>
            <v-chip v-for="item of sensorItems" v-bind:key="item.name" class="ma-0 white--text" :color="item.color"
              x-small>
              {{item.name}}
            </v-chip>
          </div>

        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>
<script>
import L from "leaflet";//leaflet地图obj leaflet map obj
import axios from "axios";//基于Promise的HTTP客户端 Promise-based HTTP client
import commonCfg from '../config/common'
import mapCfg from '../config/map'

let commonUrl = commonCfg.commonUrl
let version = commonCfg.urlVersion
let vm;// vue实例 vue instance
let wsConn
let leafMap; // 地图实例 map instance
let icon = L.icon({
  iconUrl: require("../../public/tidegauge.png"),
  iconSize: [25, 27],
  //iconAnchor: [22, 94],
});
let offlineIcon = L.icon({
  iconUrl: require("../../public/tidegauge-offline.png"),
  iconSize: [25, 27],
  //iconAnchor: [22, 94],
});
let markerMap = new Map;// 存放地图marker put map marker
let popupList = [];//popup列表 popup list
export default {
  data () {
    return {
      stationList: [], // 站列表 station list
      searchByName: "",  
      stationName: '',  
      stationLocationName: '', 
      email: '', // popup email
      documentId: 0,
      sensorItems: [], // 传感器数据 sensor list
    };
  },
  props: ['role'],
  created () {
    vm = this;
  },
  mounted () {
    vm.initMap();
    vm.showMarkers();
    setTimeout(function () {
      if (vm.role != 'OU') {
        vm.setWSConn();

      }
    }, 2000);

  },
  methods: {
    //初始化地图
    //Initialize the map
    initMap () {
      leafMap = L.map("map-container", { attributionControl: false }).setView(
        mapCfg.center,
        mapCfg.zoom
      );
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          //attribution:
          //  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          //attributionControl: false, //If true , an AttributionControl will be added to the map.
          maxZoom: mapCfg.maxZoom, //The maximum zoom level of the map (0-24).
          id: mapCfg.style, //	The ID of the style.
          tileSize: mapCfg.tileSize,
          zoomOffset: -1,
          accessToken: mapCfg.mapBoxAccessToken,
        }
      ).addTo(leafMap);
    },
    //显示所有站点位置marker及内容简介
    // display all station locaiton and info
    async showMarkers () {
      await vm.getAllStations();
      for (let spot of vm.stationList) {
        let latlngs = spot.location.position.split(",");
        // 在地图上显示所有站点marker
        // show station marker on map
        let markerIcon = offlineIcon
        if (spot.status == 'Normal') {
          markerIcon = icon
        }
        let marker = L.marker([latlngs[0], latlngs[1]], { icon: markerIcon }).addTo(
          leafMap
        );
        let item = spot.partner == null ? null : spot.partner.name
        //点击marker时打开popup
        // marker add click event to open popup
        markerMap.set(spot.id, marker)
        marker.on("click", async function () {
          let popup = await vm.setPopupContent(item, spot, latlngs)
          popupList.push({ id: spot.id, name: spot.name, popup: popup });
          popup.openOn(leafMap);

        });
      }
    },
    async setPopupContent (item, spot, latlngs) {
      vm.stationName = spot.name
      vm.stationLocationName = spot.location.name

      vm.email = item
      await vm.getAllItems(spot.id);
      vm.documentId = spot.id
      for (let i = 0; i < vm.sensorItems.length; i++) {
        if (vm.sensorItems[i].status == 'Normal') {
          vm.sensorItems[i].color = 'primary'

        } else if (vm.sensorItems[i].status == 'Abnormal') {
          vm.sensorItems[i].color = 'orange'
        } else {
          vm.sensorItems[i].color = 'red'
        }
        vm.$set(vm.sensorItems, i, vm.sensorItems[i])
      }
      let content = vm.$refs.content.$el

      let popup = L.popup({ offset: [2, -5] })
        .setLatLng([latlngs[0], latlngs[1]])
        .setContent(content);
      return popup
    },
    //设置websocket连接 Set up websocket connection
    async setWSConn () {
      wsConn = window.wsConn;
      console.log(wsConn)
      if (wsConn == null) {
        await sleep(100);
        this.setWSConn()
      }
      wsConn.onopen = this.handleWSOpen;
      wsConn.onclose = this.handleWSClose;
      wsConn.onerror = this.handleWSError;
      wsConn.onmessage = this.handleWSMessage;

    },
    //websocket链接失败 websocket connection failed
    // closeEvent:
    // code: 4001, reason: "Unauthorized"
    // code: 4002, reason: "Internal Server Error"
    handleWSClose (evt) {
      console.log(evt)
      if (evt.code === 1000) return;
      if (evt.code === 4001) {
        vm.$emit("tips", this.$vuetify.lang.t('$vuetify.message.authFailed'), 'red')
        //vm.tips(this.$vuetify.lang.t('$vuetify.message.authFailed'), "error");
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setTimeout(function () {
          vm.$router.push('/login');
        }, 1000);
      } else if (evt.code === 4002) {
        //服务器内部错误 Internal server error
        setTimeout(vm.setWSConn, 3000);
      } else {
        setTimeout(vm.setWSConn, 2000);
      }
    },
    handleWSError () {
      wsConn.close()
    },
    handleWSMessage (evt) {
      let msg = JSON.parse(evt.data)
      console.log(msg)
      // 站点状态改变
      // change station status
      if (msg.type == 'UpdateStationStatus') {
        let markerIcon
        if (msg.body.status == 'Normal') {
          markerIcon = icon
          vm.$emit("tips", msg.body.identifier + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.online"), "green")
        } else {
          markerIcon = offlineIcon
          vm.$emit("tips", msg.body.identifier + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.offline"), "red")
        }
        markerMap.get(msg.body.station_id).setIcon(markerIcon)
        // 修改数组中数据 用于更新dom
        // update data in array to update dom
        for (let i = 0; i < vm.sensorItems.length; i++) {
          if (vm.sensorItems[i].station_id == msg.body.station_id) {
            vm.sensorItems[i].status = msg.body.status
            if (msg.body.status == 'Disconnected') {
              vm.sensorItems[i].color = 'red'
              vm.$set(this.sensorItems, i, vm.sensorItems[i])
            }
          }
        }
      }
      // item状态改变 
      // item change status
      else {
        // 修改数组中数据 用于更新dom
        // update data in array to update dom
        for (let i = 0; i < vm.sensorItems.length; i++) {
          if (vm.sensorItems[i].name == msg.body.item_name) {
            vm.sensorItems[i].status = msg.body.status
            if (msg.body.status == 'Normal') {
              vm.sensorItems[i].color = 'primary'
              vm.$emit("tips", msg.body.item_name + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.online"), "green")
            } else if (msg.body.status == 'Abnormal') {
              vm.sensorItems[i].color = 'orange'
              vm.$emit("tips", msg.body.item_name + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.noData"), "red")
            } else {
              vm.$emit("tips", msg.body.item_name + vm.$vuetify.lang.t("$vuetify.stationDetail.showItemData.offline"), "red")
              vm.sensorItems[i].color = 'red'
            }
            vm.$set(this.sensorItems, i, vm.sensorItems[i])
          }
        }
      }

    },
    //websocket链接成功 websocket connection successful
    handleWSOpen () {
      console.log("connection success...");
    },
    //获得站列表
    // get station list
    async getAllStations () {
      let res = await axios.get(`${commonUrl}listStation${version}`);
      try {
        if (!res.data) {
          vm.stationList = [];
          return;
        }
        vm.stationList = res.data;
      } catch (error) {
        console.log(error);
        vm.stationList = [];
      }
    },
    //获得设备下数据类型列表
    // get item data in station
    async getAllItems (station_id) {
      console.log(station_id)
      let param = {
        params: {
          station_id: station_id,
        },
      };
      let res = await axios.get(`${commonUrl}listItem${version}`, param);
      //console.log(res);
      vm.sensorItems = [];
      try {
        if (!res.data) {
          return;
        }
        vm.sensorItems = res.data;
      } catch (error) {
        console.log(error);
        vm.sensorItems = [];
      }
    },
    //按站名进行搜索
    // search by name
    async search () {
      if (!vm.searchByName) return;
      let station = vm.stationList.filter(v => v.name == vm.searchByName)
      if (station.length <= 0) return;
      let latlngs = station[0].location.position.split(",");
      let item = station[0].partner == null ? null : station[0].partner.name
      let popup = await this.setPopupContent(item, station[0], latlngs)
      // let popupFilterRes = popupList.filter((p) => p.name == vm.searchByName);
      // if (popupFilterRes.length <= 0) return;
      //有多个站名重复的站，遍历数组也只会显示最后一个站的数据
      // there are multiple stations with duplicate station names ,Traversing the array will only display the data of the last station
      // let popupObj = popupFilterRes[popupFilterRes.length - 1];
      popup.openOn(leafMap); //打开popup
      leafMap.panTo(popup.getLatLng()); //将该点的坐标设为地图中心 Set the coordinates of the point as the center of the map
      //绑定点击事件
      // add click event
      // document
      //   .getElementById(popupObj.id)
      //   .addEventListener("click", function () {
      //     vm.detail(popupObj.id);
      //   });
    },
    //跳转到站点详情页面
    // to stationDetail page
    detail (id) {
      vm.$emit('getPath', '/stationDetail')//第一个参数是在父组件on监听的方法 The first parameter is the method to listen on in the parent component on
      vm.$router.push("/stationDetail/" + id);
    },

  },
};
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
</script>
<style scoped>
/* .inline-status-color {
  color: blue;
} */

::v-deep .leaflet-pane {
  z-index: 0;
}

::v-deep .leaflet-top {
  z-index: 0;
}
</style>
 
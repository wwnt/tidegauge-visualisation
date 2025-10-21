<template>
  <!-- 地图站点显示 -->
  <!-- station in map -->
  <div>
    <!--地图div -->
    <!-- map -->
    <div id="map-container" style="min-height: 90vh;"></div>

    <!-- gloss station marker popup 内容 content -->
    <div hidden>
      <v-card v-for="station of glossData" :key="station.name" :ref="station.name" class="poup">
        <v-card-title class="white--text">
          {{station.name}}
        </v-card-title>
        <v-card-subtitle>
          <div class="white--text">country: {{station.country}}</div>
        </v-card-subtitle>
        <v-card-text>
          <div class="white--text"><span v-if="station.latestBodc">latestBodc: </span>{{station.latestBodc}}</div>
          <div class="white--text"><span v-if="station.latestSonel">latestSonel: </span>{{station.latestSonel}}</div>
          <div class="white--text"><span v-if="station.latestPsmsl">latestPsmsl: </span>{{station.latestPsmsl}}</div>
          <div class="white--text"><span v-if="station.latestJasl">latestJasl: </span>{{station.latestJasl}}</div>
          <div class="white--text"><span v-if="station.latestPsmslRlr">latestPsmslRlr:
            </span>{{station.latestPsmslRlr}}</div>
          <div class="white--text"><span v-if="station.latestUhslcFast">latestUhslcFast:
            </span>{{station.latestUhslcFast}}</div>
          <div class="white--text"><span v-if="station.latestVliz">latestVliz: </span>{{station.latestVliz}}</div>
          <div v-if="station['IOC code']">
            <a target="_blank" :href="'http://www.ioc-sealevelmonitoring.org/station.php?code='+station['IOC code']">
              ioc-sealevelmonitoring
            </a>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- ioc站点 marker popup内容 -->
    <!-- ioc station  marker popup-->
    <div hidden>
      <v-card ref="iocStationId" class="poup">
        <v-card-title class="white--text font-weight-bold">
          {{iocStationInfo.name}}
        </v-card-title>
        <v-card-subtitle>
          <!-- <div class="white--text">{{showStation.stationEmail}}</div> -->
          <v-row dense>
            <v-col cols="6">
              <!-- 当前值 单位 -->
              <!-- now value unit -->
              <h4 class="white--text">
                {{iocStationInfo.currentValue}}
                <span style="font-size: small;">M</span>
              </h4>
            </v-col>
            <v-col cols="4" style="text-align: center">
              <!-- 变化值 -->
              <!-- change value -->
              <h4 class="white--text">{{iocStationInfo.change}}</h4>
            </v-col>
            <v-col cols="2" style="text-align: end">
              <!-- 表示变化的图标 -->
              <!-- icon indicating change -->
              <v-icon v-if="iocStationInfo.icon=='mdi-arrow-up'" style="color: #06fd50;">
                {{iocStationInfo.icon}}
              </v-icon>
              <v-icon v-else-if="iocStationInfo.icon=='mdi-equal'" style="color:rgb(6, 253, 253)">
                {{iocStationInfo.icon}}
              </v-icon>
              <v-icon v-else style="color:#fd0606;">
                {{iocStationInfo.icon}}
              </v-icon>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <!-- 历史纪录值变化趋势 -->
              <!-- historical record value change chart -->
              <v-sparkline class="sparkline-bg-color poup" :value="iocStationInfo.data" :gradient="gradient"
                key="IOC Sea Height" :smooth="radius || false" :padding="padding" :line-width="width"
                :stroke-linecap="lineCap" :gradient-direction="gradientDirection" :fill="fill" :type="type"
                :auto-line-width="autoLineWidth" auto-draw></v-sparkline>
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </div>

    <!-- sonel站点 marker popup内容 -->
    <!-- sonel stations marker popup content -->
    <div hidden>
      <v-card v-for="station of sonelList" :key="station.sta_id" :ref="station.sta_id" class="poup">
         <v-card-title class="white--text font-weight-bold">
          {{station.sta_name}}
        </v-card-title>
        <v-card-subtitle>
          <div class="white--text">country: {{station.sta_pays}}</div>
        </v-card-subtitle>
      </v-card> 
    </div>

    <!-- psmsl站点 marker popup内容 -->
    <!-- psmsl stations marker popup content -->
    <div hidden>
      <v-card v-for="station of psmslList" :key="station.id" :ref="station.id" class="poup">
         <v-card-title class="white--text font-weight-bold">
          {{station['Station Name']}}
        </v-card-title>
        <v-card-subtitle>
          <div class="white--text">country: {{station.Country}}</div>
        </v-card-subtitle>
        <v-card-text>
          <div class="white--text">Data: {{station.Date}}</div>
          <div class="white--text">Coastline: {{station.Coastline}}</div>
          <div>
            <a target="_blank" :href="'https://www.psmsl.org/data/obtaining/stations/'+station.id+'.php'">
              PSMSL({{station.id}})
            </a>
          </div>
        </v-card-text>
      </v-card> 
    </div>

    <!-- 站点图例 -->
    <!--station legend  -->
    <div class='legend pr-5' width="50px" v-if="glossDataSourceType || iocDataSourceType || sonelDataSourceType" id="stationLegend">
      <!-- gloss站点 图例 -->
      <!-- gloss station legend -->
      <div v-if="glossDataSourceType">
        <h4>GLOSS Status</h4>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-img class="ml-1 mb-2 mt-2" src="../../../public/tidegauge-new.png" width="22px" height="22px" v-on="on"
              @click.stop.prevent></v-img>
          </template>
          {{ $vuetify.lang.t("$vuetify.showData.glossDataTooltip.dateUpdatedFaster") }}
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-img class="ml-1 mb-1" src="../../../public/tidegauge-this.png" width="22px" height="22px" v-on="on"
              @click.stop.prevent></v-img>
          </template>
          {{ $vuetify.lang.t("$vuetify.showData.glossDataTooltip.dateUpdatedSlower") }}
        </v-tooltip>
      </div>
      <!-- IOC站点图例 -->
      <!-- ioc station legend -->
      <div v-if="iocDataSourceType">
        <h4>IOC Sea Height</h4>
        <div style="padding-left:12px" v-for="(legend,key,index) in iocLegends" :key="index">
          <v-row>
            <v-col style="padding:0">
              <v-img :src="legend.src" width="20px" height="33px">
              </v-img>
            </v-col>
            <v-col style="padding:0">
              <div style="">{{ legend.value }}</div>
            </v-col>
          </v-row>
        </div>
      </div>
       <!-- Sonel站点图例 -->
      <!-- sonel station legend -->
      <div v-if="sonelDataSourceType">
        <h4>SONEL Status</h4>
        <div v-for="(i,index) in 5" :key="index">
          <v-row dense>
            <v-col class="">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-img :src="getSonelMarkerIcon(i)['iconUrl']" width="22px" v-on="on"></v-img>
                </template>
                {{getSonelMarkerIcon(i)['content']}}
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

    <!-- 数据源 站点类型 -->
    <!-- data sources station type -->
    <div style="position:absolute;bottom:80px;right:13px" id="dataSources">
      <v-card max-width="200px">
        <v-card-text class="pa-2">
          <v-checkbox v-model="glossDataSourceType" label="GLOSS" dense class="mt-0" @change="changeGlossType">
          </v-checkbox>
          <v-checkbox v-model="iocDataSourceType" label="IOC" dense class="mt-0" @change="changeIocType"></v-checkbox>
          <v-checkbox v-model="sonelDataSourceType" label="SONEL" dense class="mt-0" @change="changeSonelType"></v-checkbox>
          <v-checkbox v-model="psmslDataSourceType" label="PSMSL" dense class="mt-0" @change="changePsmslType"></v-checkbox>
        </v-card-text>
      </v-card>
    </div>

    <!--自己的站点 marker popup 内容 -->
    <!-- Contents of your own station marker popup -->
    <div hidden>
      <v-card v-for="station of stationList" :key="station.id" :ref="station.id" class="poup">
        <v-card-title class="white--text">
          {{station.name}}
        </v-card-title>
        <v-card-subtitle>
          <div class="white--text">{{station.location.name}}</div>
          <div class="white--text">{{station.partner ? station.partner.name : ''}}</div>
        </v-card-subtitle>
      </v-card>
    </div>
    <!-- carousel 暂停/开始播放按钮 -->
    <!-- carousel pause/start playback button -->
    <div class="carousel-play-btn-position" id="showCustomStations">
      <v-btn icon @click="showCarousel = !showCarousel;showCustomStation()">
        <v-icon style="color:white" size="40">
          {{ showCarousel ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}</v-icon>
      </v-btn>
    </div>
    <!-- 自己站的数据 carousel显示 -->
    <!-- own station data carousel display -->
    <div class="data-carousel-position" v-if="showCarousel">
      <!-- 传感器的历史纪录值 -->
      <!-- sensor's historical record value -->
      <v-carousel height="70vh" :cycle="carouselCycle" hide-delimiter-background hide-delimiters show-arrows-on-hover>
        <v-carousel-item v-for="(item,i)  in carouselItem" :key="i" class="mb-1">
          <v-card v-for="(v,i) in item" :key="i" style="min-height:10vh;width:300px;margin-bottom:5px"
            class="card-color">
            <!-- item名 -->
            <!-- item name -->
            <v-card-subtitle style="padding-bottom:0;font-size:1.3em" class="white--text font-weight-bold">
              {{v.stationName }}: {{ v.itemName }}
            </v-card-subtitle>
            <v-card-text>
              <v-row dense>
                <v-col cols="6">
                  <!-- 当前item值 单位 -->
                  <!-- display item value unit -->
                  <h4 class="white--text">
                    {{v.value}}
                    <span style="font-size: small;">{{v.unit}}</span>
                  </h4>
                </v-col>
                <v-col cols="4" style="text-align: center">
                  <!-- 变化值 -->
                  <!-- change value -->
                  <h4 class="white--text">{{v.change}}</h4>
                </v-col>
                <v-col cols="2" style="text-align: end">
                  <!-- 表示变化的图标 -->
                  <!-- icon indicating change -->
                  <v-icon v-if="v.icon=='mdi-arrow-up'" style="color: #06fd50;">
                    {{v.icon}}
                  </v-icon>
                  <v-icon v-else-if="v.icon=='mdi-equal'" style="color:rgb(6, 253, 253)">
                    {{v.icon}}
                  </v-icon>
                  <v-icon v-else style="color:#fd0606;">
                    {{v.icon}}
                  </v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <!-- 值变化趋势图 -->
                  <!--value change chart -->
                  <v-sparkline class="sparkline-bg-color poup" :value="v.data" :gradient="gradient" :key="v.itemName"
                    :smooth="radius || false" :padding="padding" :line-width="width" :stroke-linecap="lineCap"
                    :gradient-direction="gradientDirection" :fill="fill" :type="type" :auto-line-width="autoLineWidth"
                    auto-draw></v-sparkline>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </div>
    <!-- 选择站点进行播放 设置对话框 -->
    <!-- select site to play setting dialog -->
    <div style="position:absolute;top:15px;right:15px" id="showStationDatas">
      <v-btn @click="showSelectStationDialog = !showSelectStationDialog" small>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="showSelectStationDialog" max-width="500px" :attach="true" class="v-application">
      <v-card>
        <!-- 站数据设置 -->
        <!-- station data setting -->
        <v-card-title>{{ $vuetify.lang.t("$vuetify.showData.settingDialog.realTimeDataSetting") }}</v-card-title>
        <!-- gloss数据 -->
        <!-- gloss data -->
        <v-card-text class="pb-0">
          <v-row dense no-gutters class="">
            <v-col cols="1" class="" style="line-height:38px">
              <v-avatar color="grey darken-3" size="14"><span class="white--text">1</span></v-avatar>
            </v-col>
            <v-col cols="7">
              <v-card-subtitle style="line-height:10px;font-weight:bold">
                {{$vuetify.lang.t('$vuetify.showData.settingDialog.glossStation')}}</v-card-subtitle>
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-autocomplete v-model="glossItems" item-text="name" :items="glossData" outlined clearable dense chips
                small-chips :label="$vuetify.lang.t('$vuetify.showData.settingDialog.selectStation')" multiple
                :disabled="!glossDataSourceType">
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.name }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ glossItems.length - 1 }} others)
                  </span>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- ioc数据 -->
        <!-- ioc data -->
        <v-card-text>
          <v-row dense no-gutters class="">
            <v-col cols="1" class="" style="line-height:38px">
              <v-avatar color="grey darken-3" size="14"><span class="white--text">2</span></v-avatar>
            </v-col>
            <v-col cols="7">
              <v-card-subtitle style="line-height:10px;font-weight:bold">
                {{$vuetify.lang.t('$vuetify.showData.settingDialog.showStation')}}</v-card-subtitle>
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-autocomplete v-model="iocStationitems" item-text="name" :items="iocStationList" outlined clearable
                dense chips small-chips :label="$vuetify.lang.t('$vuetify.showData.settingDialog.selectStation')"
                multiple :disabled="!iocDataSourceType">
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.name }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ iocStationitems.length - 1 }} others)
                  </span>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <!-- 操作按钮 -->
        <!-- operation button -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="" text :disabled="cancelPlaySettingAble"
              @click="showSelectStationDialog = false;cancelPlaySetting()">
              {{ $vuetify.lang.t("$vuetify.showData.settingDialog.cancelBtn") }}
            </v-btn> -->
          <v-btn color="primary" text @click="showSelectStationDialog = false;saveSelectStations()">
            {{ $vuetify.lang.t("$vuetify.showData.settingDialog.saveBtn") }}
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
      
      <!--站的数据情况展示 -->
      <!-- station data display -->
      <div class="station-data-info">
        <p>{{stationsInfo}}</p>
      </div>
  </div>
</template>

<script>
import L from "leaflet";//leaflet地图obj leaflet map 
import mapCfg from '../../config/map'
import axios from "axios";//基于Promise的HTTP客户端 Promise-based HTTP client
import commonCfg from '../../config/common'
let vm;

let leafMap; // 地图实例 leaflet map 
let customStationMap = {}//保存自己站的数据map Save your own station data map
let carouselItemSize = 3;//每组carousel内item的数量 The number of items in each group of carousel 
let glossStationMap = {}, glossIndex = 0 //保存gloss站数据的map Save the map of the gloss station data  
let iocStationMap = {}, iocIndex = 0//保存ioc站数据的map Save the map of ioc station data 
let loopPlayStationInterval = null//播放站点定时 Play station display timing 
let playCarouselInterval = null//播放carousel定时 Play carousel timing 
let sonelStationMap = {}//保存sonel站的map Save the map of the sonel station 
let psmslStationMap = {}//保存psmsl站的map Save the map of the psmsl station 
export default {
  data () {
    return {
      // 站列表 station list
      stationList: [],
      // 传感器数据 sensor items
      sensorItems: [],
      // 控制轮播展示
      // control carousel display
      showCarousel: false,
      //是否循环显示
      // control to display in a loop
      carouselCycle: true,
      // 轮播数组
      // carousel array
      carouselItem: [],
      glossData: [],//gloss数据 gloss data
      glossItems: [],//选择播放的gloss数据 select the gloss data to be played 
      //ioc图例
      // ioc lenged
      iocLegends: {
        p6: { src: require("../../../public/p6.png"), value: '>10' },
        p4: { src: require("../../../public/p4.png"), value: '5~10' },
        p2: { src: require("../../../public/p2.png"), value: '2~5' },
        p1: { src: require("../../../public/p1.png"), value: '0.5~2' },
        pm0: { src: require("../../../public/pm0.png"), value: '-0.5~0.5' },
        m1: { src: require("../../../public/m1.png"), value: '-2~-0.5' },
        m2: { src: require("../../../public/m2.png"), value: '-5~-2' },
        m4: { src: require("../../../public/m4.png"), value: '-10~-5' },
        m6: { src: require("../../../public/m6.png"), value: '<-10' }
      },
      // ioc站点数据 ioc station datas
      iocStationList: [],
      // 表单中选择的ioc站点
      // selected ioc station
      iocStationitems: [],
      //ioc站点信息
      // ioc station information
      iocStationInfo: {
        name: '',//ioc站点名 ioc station name
        currentValue: '',//当前值 current value
        icon: '',//表示变化的图标 change icon
        data: [],//历史数据 history data
        change: '',//变化值 change value
      },
      // 迷你图表属性
      // mini chart properties
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradient: ['#f72047', '#ffd200', '#1feaea'],
      gradientDirection: 'top',
      fill: false,
      type: 'trend',
      autoLineWidth: false,

      glossDataSourceType: true,//gloss数据源类型  gloss data source type 
      iocDataSourceType: false,//ioc数据源类型 ioc data source type 
      showSelectStationDialog: false,//显示选择站点数据的对话框 show the dialog box for selecting site data
      sonelList:[],//sonel数据
      sonelDataSourceType:false,//sonel数据源类型 sonel data source type 
      psmslList:[],//psmsl数据
      psmslDataSourceType:false,//psmsl数据源类型 psmsl data source type 
    }
  },
  created () {
    vm = this;
  },
  async mounted () {
    this.$nextTick(() => {
      vm.initMap();
    })

    vm.loadGlossStation()//显示gloss站 //show gloss stations
    vm.loadIOC()//显示ioc站 //show ioc stations
    vm.loadSonelStation()//显示sonel站 //show sonel stations
    vm.loadPsmslStation()//显示psmlsl站 show psmsl stations
    //显示自己的站 Show own station 
    await vm.showMarkers();
    vm.setCarouselItem()
    playCarouselInterval = setInterval(() => {
      vm.setCarouselItem()
    }, 18000)

    //设置接收父组件的方法 Set the method to receive the parent component
    this.$on('clearPlayInterval', () => {
      vm.clearPlayInterval()
    })
    //触发父组件方法 传递html元素 Trigger the parent component method 
    this.$emit('getMapStationPageElements', {
      'stationDatasElement': document.querySelector('#showStationDatas'),
      'stationLegendElement': document.querySelector('#stationLegend'),
      'playCustomStationElement': document.querySelector('#showCustomStations'),
      'dataSourcesElement': document.querySelector('#dataSources')
    })
  },
  computed:{
    stationsInfo(){
      let info = vm.$vuetify.lang.t('$vuetify.showData.stationsInfo.introduction')
      return info
    }
    
  },
  methods:{
    //初始化地图 Initialize the map 
    initMap () {
      leafMap = L.map("map-container", { attributionControl: false, zoomControl: false }).setView(
        [39.273, -31.075],
        4,
      );
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          //  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          //attributionControl: false, //If true , an AttributionControl will be added to the map.
          maxZoom: mapCfg.maxZoom, //The maximum zoom level of the map (0-24).
          id: mapCfg.bigScreenStyle, //	The ID of the style.
          tileSize: mapCfg.tileSize,
          zoomOffset: -1,
          accessToken: mapCfg.mapBoxAccessToken,
        }
      ).addTo(leafMap);
      //修改zoom缩放控件的位置
      // modify the position of the zoom control
      L.control
        .zoom({
          position: "bottomright"
        })
        .addTo(leafMap);
    },
    //选中/取消 gloss站展示
    // check/cancel gloss station display
    changeGlossType (val) {
      if (val) { //true 代表显示 true means display
        for (let glossName in glossStationMap) {
          leafMap.addLayer(glossStationMap[glossName])
        }
      } else { // false 代表隐藏 false means hide
        for (let glossName in glossStationMap) {
          leafMap.removeLayer(glossStationMap[glossName])
        }
      }
    },
    //保存选取的要播放的站
    // save the selected station to be played
    saveSelectStations () {
      if (loopPlayStationInterval) {
        clearInterval(loopPlayStationInterval)
        loopPlayStationInterval = null
      }
      glossIndex = 0
      iocIndex = 0
      this.loopStationData()
      loopPlayStationInterval = setInterval(() => {
        vm.loopStationData()
      }, 5000)
    },
    // 自动展示站点数据
    // automatic display of station data
    async loopStationData () {
      //先gloss站播放
      // play gloss data
      if (this.glossItems.length > 0 && glossIndex < this.glossItems.length) {
        let glossMarker = glossStationMap[this.glossItems[glossIndex]]
        glossMarker.fire('click')//模拟鼠标点击 simulate mouse click
        leafMap.setView(glossMarker.getLatLng(), leafMap.getZoom(), { "animate": true, })
        glossIndex++;
      } else {
        //ioc站播放
        //  play ioc data
        if (this.iocStationitems.length == 0) {
          glossIndex = 0
          return
        }
        let data = await this.getIOCDataHistory(this.iocStationInfo['name'])
        this.iocStationInfo['name'] = this.iocStationitems[iocIndex][0]
        let change = 0
        if (data.length > 0) {
          this.iocStationInfo['currentValue'] = data[data.length - 1].toFixed(3)
          change = data[data.length - 1] - data[data.length - 2]
        } else {
          this.iocStationInfo['currentValue'] = 'NULL'
        }
        let icon;
        if (change < 0) {
          icon = 'mdi-arrow-down'
          change = 0 - change
        } else if (change > 0) {
          icon = 'mdi-arrow-up'
        } else {
          icon = 'mdi-equal'
          change = 0
        }
        this.iocStationInfo['icon'] = icon
        this.iocStationInfo['data'] = data
        this.iocStationInfo['change'] = change.toFixed(3)

        let content = this.$refs.iocStationId.$el
        let marker = iocStationMap[this.iocStationInfo['name']]
        marker.bindPopup(content, {
          minWidth: 202,
          offset: [0, -3],
        }).openPopup();

        leafMap.setView(marker.getLatLng(), leafMap.getZoom(), {
          "animate": true,
        })
        if (iocIndex < this.iocStationitems.length - 1) {
          iocIndex++
        } else {
          iocIndex = 0
          glossIndex = 0
        }

      }
    },
    //获得gloss数据
    // get gloss data
    async getGlossDataList () {
      let res = await axios.get(commonCfg.getGlossDataList)
      try {
        if (!res.data) {
          vm.glossData = [];
        }
        vm.glossData = res.data;
        let latestData = vm.glossData.filter(gloss => gloss['@_id'] == 0)[0]
        for (let gloss of vm.glossData) {
          if (dateCompare(gloss.latestJasl, latestData.latestJasl)
            || dateCompare(gloss.latestPsmsl, latestData.latestPsmsl)
            || dateCompare(gloss.latestPsmslRlr, latestData.latestPsmslRlr)
            || dateCompare(gloss.latestSonel, latestData.latestSonel)
            || dateCompare(gloss.latestUhslcFast, latestData.latestUhslcFast)
            || dateCompare(gloss.latestVliz, latestData.latestVliz)) { //和数据源更新日期比较 大于等于这个日期的证明是数据更新较好的站  compared with the update date of the data source. The proof that is greater than or equal to this date is the station with better data update
            gloss['dateUpdated'] = 'faster'
          } else {
            gloss['dataUpdated'] = 'slower'
          }
        }
      } catch (error) {
        console.log(error);
        vm.glossData = [];
      }
    },
    //加载显示gloss站
    //load gloss station
    async loadGlossStation () {
      await this.getGlossDataList()
      for (let data of this.glossData) {
        if (!data.latitude || !data.longitude) continue
        let iconUrl = data['dateUpdated'] == 'faster' ? require("../../../public/tidegauge-new.png") : require("../../../public/tidegauge-this.png")
        let marker = L.marker([data.latitude, data.longitude], {
          icon: L.icon({ iconUrl: iconUrl, iconSize: [25, 25] }),
        }).addTo(leafMap);
        let dom = vm.$refs[data.name][0].$el
        //在地图上显示所有站点marker.
        // display all arker in map
        let popup = L.popup({
          minWidth: 210,
          offset: [0, 0]
        })
          .setLatLng([data.latitude, data.longitude])
          .setContent(dom)
        //点击marker时打开popup
        // open popup when click marker
        marker.on("click", function () {
          popup.openOn(leafMap);
        });
        glossStationMap[data.name] = marker
      }
    },
    //选中/取消 ioc站展示
    //check/cancel ioc station display
    changeIocType (val) {
      if (val) {
        for (let iocName in iocStationMap) {
          leafMap.addLayer(iocStationMap[iocName])
        }
      } else {
        for (let iocName in iocStationMap) {
          leafMap.removeLayer(iocStationMap[iocName])
        }
      }
    },
    // 根据站点的值获取ICON
    // Get icon according to the value
    getIcon (value) {
      let icon
      if (value > -0.5 && value < 0.5) {
        icon = this.iocLegends.pm0.src
      } else if (value >= 0.5 && value < 2) {
        icon = this.iocLegends.p1.src
      } else if (value >= 2 && value < 5) {
        icon = this.iocLegends.p2.src
      } else if (value >= 5 && value < 10) {
        icon = this.iocLegends.p4.src
      } else if (value >= 10) {
        icon = this.iocLegends.p6.src
      } else if (value >= -2 && value < -0.5) {
        icon = this.iocLegends.m1.src
      } else if (value >= -5 && value < -2) {
        icon = this.iocLegends.m2.src
      } else if (value >= -10 && value < -5) {
        icon = this.iocLegends.m4.src
      } else {
        icon = this.iocLegends.m6.src
      }
      return icon
    },
    // 加载站点数据
    // load ioc station data
    loadIOC () {
      axios.get(commonCfg.seaHeightData).then(res => {
        this.iocStationList = res.data.map(v => {
          return {
            name: v.name,
            value: [v.name, ...v.value]
          }
        })
        for (let v of res.data) {
          let icon = this.getIcon(v.value[2])
          let marker = L.marker([v.value[1], v.value[0]], {
            icon: L.icon({ iconUrl: icon, iconSize: [30, 30] }),
          }).addTo(leafMap);
          // 在地图上显示所有站点marker.
          // display all marker in map
          iocStationMap[v.name] = marker
        }
        this.changeIocType(false);
      });

    },
    async getIOCDataHistory (IOC_ID) {
      try {
        let res = await axios.get(`${commonCfg.IOCHistory}?id=` + IOC_ID, { timeout: 3000 })
        if (!res.data) {
          return []
        }
        let data = res.data.map(function (v) {
          return parseFloat(v[1])
        })
        return data
      }catch(err){
         console.log('getIOCDataHistory timeout')
         return []
      }
      
    },
    //显示/隐藏 自己站的marker
    // show/hide The marker of  own station
    showCustomStation () {
      if (this.showCarousel) {
        for (let stationId in customStationMap) {
          leafMap.addLayer(customStationMap[stationId])
        }
      } else {
        for (let stationId in customStationMap) {
          leafMap.removeLayer(customStationMap[stationId])
        }
      }
    },
    //获得站列表
    // get station list
    async getAllStations () {
      let res = await axios.get(commonCfg.listStation);
      try {
        if (!res.data) {
          vm.stationList = [];
          return;
        }
      } catch (error) {
        console.log(error);
        vm.stationList = [];
      }
      vm.stationList = res.data
      await vm.getAllItems(res.data);
    },
    //获得数据列表
    // get item list
    async getAllItems () {
      let param = {}
      let res = await axios.get(commonCfg.listItem, param);
      try {
        if (!res.data) {
          vm.sensorItems = [];
          return;
        }
        vm.sensorItems = res.data;
      } catch (error) {
        vm.sensorItems = [];
      }
    },
    //显示所有自己的站点位置marker及内容简介
    // display all station location markers and information
    async showMarkers () {
      await vm.getAllStations();
      for (let spot of vm.stationList) {
        let latlngs = spot.location.position.split(",");
        let marker = L.marker([latlngs[0], latlngs[1]], {
          icon: L.icon({ iconUrl: require("../../../public/tidegauge-screen.png"), iconSize: [30, 30] }),
        }).addTo(leafMap);

        customStationMap[spot.id] = marker
        let dom = vm.$refs[spot.id][0].$el
        //在地图上显示所有站点marker.
        // display all marker in map
        let popup = L.popup({
          minWidth: 202,
          offset: [0, -3]
        })
          .setLatLng([latlngs[0], latlngs[1]])
          .setContent(dom)
        //点击marker时打开popup
        // open popup when click marker
        marker.on("click", function () {
          popup.openOn(leafMap);
        });
        vm.showCustomStation()
      }
    },
    async getHistoryData (id, itemName, start, end) {
      let param = {}
      param.station_id = id;
      param.start = start + '';
      param.end = end + '';
      param.item_name = itemName;
      let res = await axios.get(commonCfg.dataHistory, {
        params: param
      });
      if (res.data == null || !res.data) {
        return []
      }
      let data = res.data.map(function (v) {
        return v.d
      })
      return data
    },
    // 设置轮播数据
    // set carousel data
    async setCarouselItem () {
      this.carouselItem = []
      let itemList = []
      let end = Math.floor(new Date().getTime())
      let start = end - 60 * 10 * 1000
      for (let i = 0; i < this.sensorItems.length; i++) {
        let station = this.stationList.filter(v => v.id == this.sensorItems[i].station_id)[0]
        let data = await this.getHistoryData(this.sensorItems[i].station_id, this.sensorItems[i].name, start, end)
        let latestData
        let icon = 'mdi-equal'
        let change = 0
        if (data.length == 0) {
          latestData = "NULL"
        } else {
          latestData = data[data.length - 1]
          change - data[data.length - 2]
        }
        if (change < 0) {
          icon = 'mdi-arrow-down'
          change = 0 - change
        } else if (change > 0) {
          icon = 'mdi-arrow-up'
        } else {
          icon = 'mdi-equal'
          change = 0
        }
        itemList.push({
          stationName: station.name,
          itemName: this.sensorItems[i].name,
          value: latestData,
          icon: icon,
          data: [data[0] - 0.001, ...data],
          itemDataArr: [0],
          latestData: latestData,
          change: change,
          unit: this.getUnitByItemName(this.sensorItems[i].name),
        })
        if (itemList.length == carouselItemSize) {
          this.carouselItem.push(itemList)
          itemList = []
        }
        if (i == this.sensorItems.length - 1 && itemList.length > 0) {
          this.carouselItem.push(itemList)
        }
      }
    },
    // 单位设置
    // set unit
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
    //获得sonel列表
    //get sonel list
    async getSonelList(){
      let res = await axios.get(commonCfg.getSonelDataList);
      //console.log(res.data)
      try {
        if (!res.data) {
          vm.sonelList = [];
          return;
        }
        vm.sonelList = res.data;
      } catch (error) {
        vm.sonelList = [];
      }
    },
    //获得sonel图标和表达的含义
    //get sonel icon and meaning
    getSonelMarkerIcon(flag){
      let iconUrl = '',content = ''
      switch(flag){
        case 1://The station works properly : data are available
          iconUrl = require('../../../public/marker-blue.png')
          content = vm.$vuetify.lang.t("$vuetify.showData.sonelLegends.workBest")
          break;
        case 2://Problem(s) detected but data are available
          iconUrl = require('../../../public/marker-yellow.png')
          content = vm.$vuetify.lang.t("$vuetify.showData.sonelLegends.workBetter")
          break;
        case 3://The station doesn't work
          iconUrl = require('../../../public/marker-purple.png')
          content = vm.$vuetify.lang.t("$vuetify.showData.sonelLegends.workBad")
          break;
        case 4://The station no longer exists
          iconUrl = require('../../../public/marker-red.png')
          content = vm.$vuetify.lang.t("$vuetify.showData.sonelLegends.noExits")
          break;
        case 5://The station is not from France
          iconUrl = require('../../../public/marker-green.png')
          content = vm.$vuetify.lang.t("$vuetify.showData.sonelLegends.fromCountry")
          break;
        default:
          iconUrl = iconUrl = require('../../../public/marker-red.png')
          content = ''
      } 
      return { iconUrl: iconUrl, content: content }
    },
    //显示sonel markers
    //show sonel markers
    async loadSonelStation(){
      await this.getSonelList()
      for (let data of this.sonelList) {
        if (!data.sta_lat || !data.sta_lon) continue       
        let marker = L.marker([data.sta_lat, data.sta_lon], {
          icon: L.icon({ iconUrl: this.getSonelMarkerIcon(data.sta_etat)['iconUrl'], iconSize: [22, 24]}),
        }).addTo(leafMap);
        let dom = vm.$refs[data.sta_id][0].$el
        //在地图上显示所有站点marker.
        // display all marker in map
        let popup = L.popup({
          minWidth: 210,
          offset: [0, 0]
        })
          .setLatLng([data.sta_lat, data.sta_lon])
          .setContent(dom)
        //点击marker时打开popup
        // open popup when click marker
        marker.on("click", function () {
          popup.openOn(leafMap);
        });
        sonelStationMap[data.sta_id] = marker
      }
      this.changeSonelType(false)
    },
    //选中/取消 sonel站展示
    //check/cancel sonel station display
    changeSonelType (val) {
      if (val) {
        for (let sonelId in sonelStationMap) {
          leafMap.addLayer(sonelStationMap[sonelId])
        }
      } else {
        for (let sonelId in sonelStationMap) {
          leafMap.removeLayer(sonelStationMap[sonelId])
        }
      }
    },
    //获得psmsl列表
    //get psmsl list
    async getPsmslList(){
      let res = await axios.get(commonCfg.getPsmslDataList);
      //console.log(res.data)
      try {
        if (!res.data) {
          vm.psmslList = [];
          return;
        }
        vm.psmslList = res.data;
      } catch (error) {
        vm.psmslList = [];
      }
    },
    //显示psmsl markers
    //show psmsl markers
    async loadPsmslStation(){
      await this.getPsmslList()
      for(let data of this.psmslList){
        if (!data.Lat || !data.Lon) continue       
        let marker = L.marker([data.Lat, data.Lon], {
          icon: L.icon({ iconUrl: require('../../../public/marker-blue.png'), iconSize: [22, 24]}),
        }).addTo(leafMap);
        let dom = vm.$refs[data.id][0].$el
        //在地图上显示所有站点marker.
        // display all markers in map
        let popup = L.popup({
          minWidth: 210,
          offset: [0, 0]
        })
          .setLatLng([data.Lat, data.Lon])
          .setContent(dom)
        //点击marker时打开popup
        // open popup when click marker
        marker.on("click", function () {
          popup.openOn(leafMap);
        });
        psmslStationMap[data.id] = marker
      }
      this.changePsmslType(false)
    },
     //选中/取消 psmsl站展示
    //check/cancel psmsl station display
    changePsmslType (val) {
      if (val) {
        for (let psmslId in psmslStationMap) {
          leafMap.addLayer(psmslStationMap[psmslId])
        }
      } else {
        for (let psmslId in psmslStationMap) {
          leafMap.removeLayer(psmslStationMap[psmslId])
        }
      }
    },
    //销毁播放定时
    // destroy timer
    clearPlayInterval () {
      if (loopPlayStationInterval != null) {
        clearInterval(loopPlayStationInterval)
        loopPlayStationInterval = null
      }
      if (playCarouselInterval) {
        clearInterval(playCarouselInterval)
        playCarouselInterval = null
      }
    }
  },

}
function dateCompare (date1, date2) {
  if (!date1 || !date2) return false
  var d1 = Date.parse(date1);
  var d2 = Date.parse(date2);
  if (d1 >= d2) {
    return true
  }
  return false
}
</script>

<style scoped>
::v-deep .leaflet-pane {
  z-index: 0;
}

::v-deep .leaflet-popup-content {
  margin: 4px;
}

.legend {
  background-color: #fff;
  border-radius: 3px;
  bottom: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  padding: 10px;
  position: absolute;
  left: 10px;
  z-index: 1;
}

.data-carousel-position {
  position: absolute;
  top: 10px;
  right: 10px;
}

.carousel-play-btn-position {
  position: absolute;
  bottom: 8%;
  left: 50%;
}

.card-color {
  background-color: #000337 !important;
  border: solid 1px #4cbaff;
  box-shadow: inset 0px 0px 500px 0px rgba(131, 218, 255, 0.3) !important;
}

.sparkline-bg-color {
  background-color: transparent !important;
}

/* .poup {
  background-color: #000337 !important;
  box-shadow: inset 0px 0px 500px 0px rgba(133, 218, 255, 0.3) !important;
} */
.station-data-info {
 overflow: hidden;
 white-space: nowrap;
 position: absolute;
 top: 10px;
 left: 120px;
 width: calc(100% - 220px);
 /* border: 3px solid rgb(226, 31, 63);
 border-radius: 5px; */
}

.station-data-info p {
 font-size: 1.4em;
 font-weight: bolder;
 color: #e91e63;
 -moz-transform:translateX(100%);
 -webkit-transform:translateX(100%);	
 transform:translateX(100%);
 /* Apply animation to this element */	
 -moz-animation: station-data-info 60s linear infinite;
 -webkit-animation: station-data-info 60s linear infinite;
 animation: station-data-info 60s linear infinite;
}
/* Move it (define the animation) */
@-moz-keyframes station-data-info {
 0%   { -moz-transform: translateX(100%); }
 100% { -moz-transform: translateX(-100%); }
}
@-webkit-keyframes station-data-info {
 0%   { -webkit-transform: translateX(100%); }
 100% { -webkit-transform: translateX(-100%); }
}
@keyframes station-data-info {
 0%   { 
 -moz-transform: translateX(100%); /* Firefox bug fix */
 -webkit-transform: translateX(100%); /* Firefox bug fix */
 transform: translateX(100%); 		
 }
 100% { 
 -moz-transform: translateX(-100%); /* Firefox bug fix */
 -webkit-transform: translateX(-100%); /* Firefox bug fix */
 transform: translateX(-100%); 
 }
}
</style>
<template>
  <v-app>
    <v-container fluid style="background-color:#000337">
      <!-- 导航 -->
      <!-- navigation -->
      <v-app-bar app dark class="header-bar">
        <v-row>
          <v-col cols="8">
            <div style="display:flex;align-items:center">
              <img :src="logoUrl" height="100" style="position:absolute;top:2px;left:1px" />
              <span class="big-screen-title">{{ $vuetify.lang.t("$vuetify.systemName") }}</span>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2" style="display:flex;align-items:center;justify-content:flex-end">
            <div>
              <h1 style="color:white">{{ currentHour }}<span class="blink-colon">:</span>{{ currentMinute }} </h1>
              <div>{{day}}</div>
            </div>
            <v-btn rounded dark id="back" @click="toPage('/stationList')" class="poup"
              style="margin-left:10px;margin-top:10px; float:right">
              <v-icon color="#07f0f8">mdi-arrow-left</v-icon>
              {{ $vuetify.lang.t("$vuetify.showData.signOutBtn") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-app-bar>

      <!-- 主页 -->
      <!-- main page -->
      <v-main>
        <!-- layer操作 -->
        <!-- layer operation -->
        <div class="operation-panel-position" id="layerController">
          <v-btn @click="showLayerPanel = !showLayerPanel">
            <v-icon>mdi-layers-triple</v-icon>
            <v-icon right dark>{{ showLayerPanel ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
          <v-card max-width="170px" v-if="showLayerPanel" style="margin-top:5px">
            <v-card-subtitle>
              <v-row dense no-gutters>
                <!-- 标题 -->
                <!-- title -->
                <v-col cols="9" style="display:inline-block;line-height:30px">
                  <span style="font-weight:bolder">{{ $vuetify.lang.t("$vuetify.showData.overlayer.title") }}</span>
                </v-col>
                <v-col cols="3">
                  <v-btn @click="showPlaySettingDialog = true;" text fab x-small id="setting">
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-subtitle>
            <v-card-text>
              <!-- layer数组 -->
              <!-- layer array -->
              <div v-for="(layer,index) in overlayerGroups" :key="index" style="margin-bottom:3px">
                <v-row dense class="" :class="{ 'layer-row-selected':layer.activeClass }">
                  <v-col cols="2">
                    <v-icon size="20" class="icon">{{ layer.icon }}</v-icon>
                  </v-col>
                  <v-col cols="10" class="px-2">
                    <span class="operation-overlayer-text">{{ layer.text }}</span>
                  </v-col>

                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <v-card style="border: solid 1px #4cbaff;min-height: 90vh;width:100%">
          <router-view name="mapStations" ref="map-stations"
            v-show="overlayerGroups.filter(item => item.icon == 'mdi-chart-line')[0].activeClass"
            v-on:getMapStationPageElements="getMapStationPageElements"></router-view>
          <router-view name="globeSeaHeight" ref="globe-sea-height"
            v-show="overlayerGroups.filter(item => item.icon == 'mdi-earth')[0].activeClass"></router-view>
          <router-view name="mapSeaHeight" ref="map-sea-height"
            v-show="overlayerGroups.filter(item => item.icon == 'mdi-waveform')[0].activeClass"></router-view>
        </v-card>
      </v-main>

      <!-- 设置对话框 -->
      <!-- setting dialog -->
      <v-dialog v-model="showPlaySettingDialog" max-width="500px" :attach="true" class="v-application">
        <v-card>
          <!-- 播放设置 -->
          <!-- Play settings -->
          <v-card-title class="pb-0">{{ $vuetify.lang.t("$vuetify.showData.settingDialog.title") }}</v-card-title>
          <v-card-text class="pb-0">
            <draggable v-model="overlayerGroups" @start="drag=true" @end="layerDraggleEnd">
              <v-row v-for="(layer,index) in overlayerGroups" :key="index" no-gutters class="layer-row-hover d-flex align-center my-4 px-1" style="background-color:#402b2b0f">
                <v-col cols="1" class="">
                  <v-avatar color="grey darken-3" size="16"><span class="white--text">{{layer.order}}</span></v-avatar>
                </v-col>
                <v-col cols="4" class="py-2" style="font-size:15px">
                  <span><strong>{{layer.text}}</strong></span>
                </v-col>
                <v-col cols="3" class="d-flex align-center">
                  <v-text-field type="number" dense v-model="layer.autoPlayTime" :disabled="!layer.switch"
                    :rules="rule($vuetify.lang.t('$vuetify.showData.settingDialog.secondsValue'))">
                  </v-text-field>{{ $vuetify.lang.t("$vuetify.showData.settingDialog.unit") }}
                </v-col>                
                <v-col cols="1" offset="1" class="">
                  <v-switch v-model="layer.switch"></v-switch>
                </v-col>
              </v-row>
            </draggable>
          </v-card-text>
          <v-divider></v-divider>
          <!-- 操作按钮 -->
          <!-- operation button -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn color="" text :disabled="cancelPlaySettingAble"
              @click="showPlaySettingDialog = false;cancelPlaySetting()">
              {{ $vuetify.lang.t("$vuetify.showData.settingDialog.cancelBtn") }}
            </v-btn> -->
            <v-btn color="primary" text
              @click="showPlaySettingDialog = false;savePlaySetting()"> <!-- cancelPlaySettingAble = false; -->
              {{ $vuetify.lang.t("$vuetify.showData.settingDialog.saveBtn") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
    <!-- loading -->
    <!-- <div style="position:absolute;top:50%;right:50%">
      <v-progress-circular v-if="showLoading" indeterminate color="primary darken-2" :size="100" :width="7"></v-progress-circular>
    </div> -->
    <!-- 通知工具 -->
    <!-- tips -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000" :top="true" class="v-application">
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>
<script>
import draggable from 'vuedraggable'
import commonCfg from '../../config/common'
let vm;
let getCurrentTimeInterval = null//获得当前时间的定时 Get the timing of the current time 
let layerPlayInterval = null//layer循环播放定时器 Loop timer 
let layerPlayIntervalIndex = 0//layer循环播放定时器下标 Loop timer index
let ableOverlayerIndexs = [] //参与播放的overlayer下标数组 去掉禁用的 Array of overlay subscripts participating in playback Remove disabled ones
export default {
  data () {
    return {
      currentHour: '',
      currentMinute: '',
      day: '',
      //是否显示layer
      //Whether to show layer 
      showLayerPanel: false,
      //layer数组
      // layer array
      overlayerGroups: [
        { icon: 'mdi-chart-line', text: '', activeClass: true, autoPlayTime: 40, order: 1, switch: true },
        { icon: 'mdi-earth', text: '', activeClass: false, autoPlayTime: 30, order: 2, switch: true },
        { icon: 'mdi-waveform', text: '', activeClass: false, autoPlayTime: 30, order: 3, switch: true },
      ],
      showPlaySettingDialog: false,//显示播放设置对话框 display the playback settings dialog
      //cancelPlaySettingAble: false,//是否禁用播放设置的取消按钮 whether to disable the cancel button of the playback setting
      //通知
      //tips 
      showSnackbar: false,
      snackbarColor: "error",
      snackbarText: "",
      //showLoading: true,//显示loading
      logoUrl: commonCfg.largeScreen.logoUrl

    }
  },
  components: {
    draggable,
  },
  created () {
    vm = this;
    this.getCurrentTime();
    this.constructOverlayerTexts();
  },
  mounted () {
    getCurrentTimeInterval = setInterval(() => {
      vm.getCurrentTime()
    }, 1000)

    //显示导航 导航指引结束后哦再播放页面 If the navigation is displayed, play the page after the navigation guide is over 
    //if (localStorage.getItem('isShowNavigation') == 'show'){
    //  vm.overlayerGroups[layerPlayIntervalIndex].activeClass = true
    //}else{
      //不显示导航 直接播放页面 Play the page without displaying the navigation 
    //  vm.startPlaySetting();
    //}
    
    //this.showLoading = false;
  },
  computed: {
    //自动播放时长数组
    // auto-play array
    layerAutoPlayTimes () {
      return this.overlayerGroups.map(layer => layer.autoPlayTime)
    },
  },
  methods: {
    //提示工具
    // tips 
    tips (text, color) {
      vm.showSnackbar = true; //是否显示 whether to display
      vm.snackbarText = text; //文本 text
      vm.snackbarColor = color; //颜色 color
    },
    //获得当前时间
    // get current time
    getCurrentTime () {
      var cd = new Date()
      vm.currentHour = zeroPadding(cd.getHours(), 2);
      vm.currentMinute = zeroPadding(cd.getMinutes(), 2);
      vm.day = zeroPadding(cd.getDate(), 2) + '/' + zeroPadding(cd.getMonth() + 1, 2) + "/" + zeroPadding(cd.getFullYear(), 4)
    },
    //overlayer文本名称构造
    //overlay text name construction
    constructOverlayerTexts () {
      let overlayerTexts = ['data', 'threedHeight', 'mapSeaHeight'];
      for (let i = 0; i < overlayerTexts.length; i++) {
        this.overlayerGroups[i].text = vm.$vuetify.lang.t("$vuetify.showData.overlayer." + overlayerTexts[i])
      }
    },
    //layer拖动结束事件
    //layer drag end event
    layerDraggleEnd () {
      //this.cancelPlaySettingAble = true;//禁用取消按钮 disable cancel button
      this.stopPlayInterval()
    },
    //规则 rule
    rule (type) {
      return [
        (v) => !!v || type + vm.$vuetify.lang.t("$vuetify.showData.settingDialog.formValidate"),
        (v) => v > 0 || type + vm.$vuetify.lang.t("$vuetify.showData.settingDialog.positiveNumber")
      ];
    },
    //按照默认配循环播放
    //loop playback according to the default configuration
    startPlaySetting (ableOverlayerIndexs) {
      //console.log(this.overlayerGroups)
      if(ableOverlayerIndexs.length == 1){//只有一个播放页 only one play page
        vm.overlayerGroups[ableOverlayerIndexs[0]].activeClass = true
        return
      }
      //首个layer
      // first layer
      vm.overlayerGroups[ableOverlayerIndexs[layerPlayIntervalIndex]].activeClass = true
      //设置layer循环播放
      // setting layer loop
      layerPlayInterval = setTimeout(loopPlay, Number(vm.overlayerGroups[ableOverlayerIndexs[layerPlayIntervalIndex]].autoPlayTime) * 1000);
      // eslint-disable-next-line no-unused-vars
      function loopPlay () {
        //当前要隐藏的layer是地图海平面高度 停止播放并删除定时 不然会造成地球播放卡顿
        //The layer to be hidden currently is the sea level height of the map. Stop playing and delete the timing, otherwise it will cause the earth to play stuck.
        if (vm.overlayerGroups[ableOverlayerIndexs[layerPlayIntervalIndex]].icon == 'mdi-waveform') {
          //触发mapSeaHeight组件定义的 stopPlayMapSeaHeight 方法
          //Trigger the stopPlayMapSeaHeight method defined by the mapSeaHeight component
          vm.$refs['map-sea-height'].$emit('stopPlayMapSeaHeight')
        }
        //循环隐藏/播放
        // Loop hide/play
        if (layerPlayIntervalIndex == ableOverlayerIndexs.length - 1) {
          vm.overlayerGroups[ableOverlayerIndexs[0]].activeClass = true;
          vm.overlayerGroups[ableOverlayerIndexs[layerPlayIntervalIndex]].activeClass = false;
          layerPlayIntervalIndex = 0
        } else {
          vm.overlayerGroups[ableOverlayerIndexs[layerPlayIntervalIndex + 1]].activeClass = true;
          vm.overlayerGroups[ableOverlayerIndexs[layerPlayIntervalIndex]].activeClass = false;
          layerPlayIntervalIndex += 1
        }
        //当前要播放的layer是地图海平面高度
        //the current layer to be played is the sea level of the map
        if (vm.overlayerGroups[ableOverlayerIndexs[layerPlayIntervalIndex]].icon == 'mdi-waveform') {
          //触发mapSeaHeight组件定义的 startPlayMapSeaHeight 方法
          //Trigger the startPlayMapSeaHeight method defined by the mapSeaHeight component
          vm.$refs['map-sea-height'].$emit('startPlayMapSeaHeight')
        }
        layerPlayInterval = setTimeout(loopPlay, Number(vm.overlayerGroups[ableOverlayerIndexs[layerPlayIntervalIndex]].autoPlayTime) * 1000)
      }
    },
    //跳转到指定页面
    //Jump to the specified page
    toPage (param) {
      //异常处理避免显示错误
      //Exception handling to avoid displaying errors
      if (vm.$route.path != param) vm.$router.push(param)
    },
    //显示页面导航
    //Show page navigation
    showNavigation (eleObj) {
      this.$intro().setOptions({
        steps: [
          {
            intro: '1.' + vm.$vuetify.lang.t("$vuetify.showData.screenGuide.first"),//'欢迎使用大屏展示系统' welcome to use the large screen display system
            //title:'<input type="checkbox" id="myCheck">不再显示'
          },
          {
            element: document.querySelector('#layerController'),
            intro: '2.' + vm.$vuetify.lang.t("$vuetify.showData.screenGuide.second"),//'设置展示模型顺序与时长' set the display model order and duration
            position: 'right'
          },
          {
            element: eleObj.stationDatasElement,
            intro: '3.' + vm.$vuetify.lang.t("$vuetify.showData.screenGuide.selectStationDatas"),//'选择要播放的站' choose the station you want to play
            position: 'left'
          },
          {
            element: eleObj.stationLegendElement,
            intro: '4.' + vm.$vuetify.lang.t("$vuetify.showData.screenGuide.stationLegend"),//'显示站点图例' show site legend
            position: 'right'
          },
          {
            element: eleObj.playCustomStationElement,
            intro: '5.' + vm.$vuetify.lang.t("$vuetify.showData.screenGuide.playCustomStation"),//'显示我们自己站的数据' show the data of our own station
            position: 'top'
          },
          {
            element: eleObj.dataSourcesElement,
            intro: '6.' + vm.$vuetify.lang.t("$vuetify.showData.screenGuide.third"),//'选择展示站点类型' choose display site type
            position: 'left'
          }, {
            element: document.querySelector('#back'),
            intro: '7.' + vm.$vuetify.lang.t("$vuetify.showData.screenGuide.forth"),//'退出大屏展示' exit the big screen display
            position: 'left'
          },

        ],
        nextLabel: vm.$vuetify.lang.t("$vuetify.showData.screenGuide.nextBtn"),
        prevLabel: vm.$vuetify.lang.t("$vuetify.showData.screenGuide.upBtn"),
        doneLabel: vm.$vuetify.lang.t("$vuetify.showData.screenGuide.finishBtn"),
      }).onexit(function () {
        //引导结束再开始播放 Start playback after booting ends
        //console.log('end')
      }).onbeforeexit(function () {
        //退出页面导航前确认 Confirm before exiting page navigation
        return vm.$dialog.confirm({
          text: vm.$vuetify.lang.t('$vuetify.showData.screenGuide.isShowNavigationText'),
          title: vm.$vuetify.lang.t('$vuetify.showData.screenGuide.isShowNavigationTitle'),
          cancel: vm.$vuetify.lang.t('$vuetify.showData.screenGuide.cancelBtn'),
          actions: [
            {
              text: vm.$vuetify.lang.t('$vuetify.showData.screenGuide.cancelBtn'),
              color: 'blue',
              key: 'false',
            },
            {
              text: vm.$vuetify.lang.t('$vuetify.showData.screenGuide.confirmBtn'),
              color: 'blue',
              key: true,
            }],
        }).then((type) => {
          console.log(type)
          if (type) {//显示导航 show navigation
            localStorage.setItem('isShowNavigation', 'show')
          } else {//不再显示导航 Never show navigation
            localStorage.setItem('isShowNavigation', 'notShow')
          }
          //开始播放 Start playing
          //vm.startPlaySetting();
        })
      }).start();
    },
    //获得mapStations页面的html元素 Get the html element of the mapStations page
    getMapStationPageElements (element) {
      //console.log(localStorage.getItem('isShowNavigation'))
      if (localStorage.getItem('isShowNavigation') != 'notShow') {
        this.showNavigation(element)
      }
    },
    stopPlayInterval () {
      //清除定时 clear timing
      if(layerPlayInterval){
        clearInterval(layerPlayInterval);
        layerPlayInterval = null;
      }
    },
    //取消设置
    // cancel setting 
    // cancelPlaySetting () {
    //   //从当前开始从头播放
    //   // play from the beginning
    //   //this.startPlaySetting();
    // },
    //改变播放配置后重新调用
    //recall after changing the playback configuration
    savePlaySetting () {
      if(ableOverlayerIndexs.length > 0){
        let index = ableOverlayerIndexs.findIndex(index => this.overlayerGroups[index].icon == 'mdi-waveform')
        //之前参与播放的layer里面有地图海平面高度 则停止播放并删除定时 不然会造成地球播放卡顿
        //If there is a map sea level in the layer that participated in the playback before, stop the playback and delete the timing, otherwise it will cause the earth playback to freeze.
        if(index != -1){ 
          //触发mapSeaHeight组件定义的 stopPlayMapSeaHeight 方法
          //Trigger the stopPlayMapSeaHeight method defined by the mapSeaHeight component
          vm.$refs['map-sea-height'].$emit('stopPlayMapSeaHeight')
        }
        ableOverlayerIndexs = [] //参与播放的overlayer下标数组 Array of overlay subscripts participating in playback
      }
      for(let i = 0;i < this.overlayerGroups.length;i++) {
        if(this.overlayerGroups[i].switch) {
          ableOverlayerIndexs.push(i)
        }
      }
      if(ableOverlayerIndexs.length <= 0){ //没有要播放的overlayer 报错 no overlay to play report an error
        this.tips(vm.$vuetify.lang.t("$vuetify.showData.settingDialog.saveError"), 'error')
        this.showPlaySettingDialog = true;
        return
      }
      let index = ableOverlayerIndexs.findIndex(index => this.overlayerGroups[index].autoPlayTime == '' || this.overlayerGroups[index].autoPlayTime <= 0)
      if(index != -1){ // 时间设置的不合法 Invalid time setting
        this.tips(vm.$vuetify.lang.t("$vuetify.showData.settingDialog.saveError"), 'error')
        this.showPlaySettingDialog = true;
        return
      }
      //this.changeLayerActiveStatus();

      layerPlayIntervalIndex = 0;
      //之前显示的overlay设置为不显示 每次只有一个layer在播放，所以只有一个activeClass是true
      //The previously displayed overlay is set to not be displayed. Only one layer is playing at a time, so only one activeClass is true
      let activeIndex = this.overlayerGroups.findIndex(item => item.activeClass == true)
      this.overlayerGroups[activeIndex].activeClass = false

      this.stopPlayInterval();//之前设置过播放的定时进行清除 Clear the previously set playback timing
      //将参与播放的下标映射到原来的overlayer数组上 Map the subscripts involved in playback to the original overlay array
      this.startPlaySetting(ableOverlayerIndexs);
    },
    //改变layer的激活状态，第一个设为true,其他为false
    //change the activation state of the layer, the first one is set to true, the others are set to false
    // changeLayerActiveStatus () {
    //   for (let i = 0; i < this.overlayerGroups.length; i++) {
    //     if (i == 0) {
    //       this.overlayerGroups[i].activeClass = true;
    //       continue;
    //     }
    //     this.overlayerGroups[i].activeClass = false;
    //   }
    // },
    //跳转到指定页面
    // Jump to page 
    // toPage (param) {
    //   //异常处理避免显示错误
    //   // exception handling
    //   if (vm.$route.path != param) vm.$router.push(param)
    // },
  },
  destroyed () {
    //清除获得时间的定时器
    // clear get time timer
    if (getCurrentTimeInterval) {
      clearInterval(getCurrentTimeInterval)
      getCurrentTimeInterval = null
    }
    //清除layer定制播放定时
    // clear layer timer
    if (layerPlayInterval) {
      clearInterval(layerPlayInterval);
      layerPlayInterval = null;
    }
    //播放页面的下标设为0
    //The subscript of the play page is set to 0    
    layerPlayIntervalIndex = 0
  },
  beforeDestroy(){
    //console.log(vm.$refs['map-stations'],vm.$refs['globe-sea-height'],vm.$refs['map-sea-height'])
    //销毁子组件使用的定时
    // destroy the timer of sub-component use
    vm.$refs['map-stations'].$emit('clearPlayInterval')
    vm.$refs['globe-sea-height'].$emit('clearGetSeaHeightInterval')
    vm.$refs['map-sea-height'].$emit('clearPlaySeaHeightInterval')
  },
  watch: {
    //监听播放时长数组
    //array of monitor playback duration Once changed, use the cancel button nearby
    layerAutoPlayTimes: function () {
      //console.log(newVal)
      //if (!this.cancelPlaySettingAble) this.cancelPlaySettingAble = true //一旦改变就禁用取消按钮 Disable cancel button once changed
      vm.stopPlayInterval()
    }
  }
}
function zeroPadding (num, digit) {
  var zero = ''
  for (var i = 0; i < digit; i++) {
    zero += '0'
  }
  return (zero + num).slice(-digit)
}
</script>
<style scope>
.big-screen-title {
  font-size: 1.8em;
  color: #07f0f8;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  vertical-align: middle;
  margin-left: 90px;
}

.blink-colon {
  animation: 1s ease-in-out infinite opacity-colon;
}
@keyframes opacity-colon {
  25%,
  75% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
}

.poup {
  background-color: #000337 !important;
  box-shadow: inset 0px 0px 500px 0px rgba(133, 218, 255, 0.3) !important;
}

.operation-panel-position {
  position: absolute;
  top: 35px;
  left: 10px;
  z-index: 1000;
}

.layer-row-selected {
  font-weight: bolder;
}

.layer-row-selected .icon {
  color: black;
}

.operation-overlayer-text {
  vertical-align: middle;
  color: rgb(12 12 12);
}

.layer-row-hover:hover {
  /* font-weight: 900; */
  cursor: move;
}

.layer-row-hover:hover .v-card__subtitle {
  font-weight: 900 !important;
}
/* 页面导航样式 */
.introjs-tooltip {
  border-radius: 0.4em;
}

.introjs-tooltip .introjs-tooltip-header {
  padding-right: 0px;
  padding-top: 0px;
}

.introjs-tooltip .introjs-tooltiptext {
  text-align: center;
  font-weight: bold;
  font-size: 1.2em;
}

.introjs-tooltipbuttons .introjs-button {
  border-radius: 0.4em;
}

</style>
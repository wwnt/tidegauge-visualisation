<template>
  <div>
    <!-- 3d海洋高度 -->
    <!-- 3d sea height -->
    <div id="map-sea-height" :style="'height: 90vh;width:'+clientWidth+'px'"></div>
    <!-- 海洋高度按时间播放 -->
    <!-- sea altitude play by time -->
    <div style="position:absolute;left:38%;bottom:10%;">
      <v-progress-linear :active="mapHeightloadingProcess" :indeterminate="mapHeightloadingProcess" absolute
        style="width:500px" color="indigo darken-2"></v-progress-linear>
      <div v-if="!mapHeightloadingProcess" class="v-application d-flex">
        <span class="mr-3 font-weight-bold">{{ timePlaySliderOptions.min }}</span>
        <vue-slider ref="mapHeightPlayslider" v-model="timePlaySliderValue" v-bind="timePlaySliderOptions"
          @drag-end="timePlaySliderDragEnd" :processStyle="{'background-color':'#23bd3d'}"
          :dotStyle="{'border':'2px solid #23bd3d'}"
          :tooltipStyle="{'border-color':'#424242','background-color': '#424242'}"></vue-slider>
        <span class="ml-3 font-weight-bold">{{ timePlaySliderOptions.max }}</span>
        <v-btn class="ml-2 success" x-small @click="isPlayMapHeight = !isPlayMapHeight;playOrStopMapHeight()">
          {{ isPlayMapHeight ? $vuetify.lang.t("$vuetify.showData.mapSeaHeight.pauseBtn") : $vuetify.lang.t("$vuetify.showData.mapSeaHeight.playBtn") }}
        </v-btn>
      </div>
    </div>
    <!-- 海洋高度相关介绍 -->
    <!-- introduction to sea heights -->
    <div style="position:absolute;left:14px;bottom:14%;" v-if="!mapHeightloadingProcess">
      <v-tooltip right max-width="230">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" large>
            <v-icon>mdi-alert-circle</v-icon>
          </v-btn>
        </template>
        <span>{{ $vuetify.lang.t("$vuetify.showData.mapSeaHeight.information") }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import axios from "axios";//基于Promise的HTTP客户端 Promise-based HTTP client
import commonCfg from '../../config/common'
import * as echarts from 'echarts';
import 'echarts-gl';
import 'echarts/map/js/world'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

let vm;
let mapHeightStartYear = 1993, mapHeightEndYear = 2020//海洋高度播放起始年份 sea altitude playback start and end year
let seaHeightChart//海洋高度图表  Ocean Height Chart
let mapSeaHeightData = {}//所有年份的海洋高度数据 sea altitude data for all years
let mapHeightPlayInterval = null//海洋高度播放定时器 sea altitude play timer

export default {

  data () {
    return {
      clientWidth: 0,
      timePlaySliderValue: mapHeightEndYear,//海洋高度时间播放slider绑定值 sea altitude time play slider binding value
      timePlaySliderOptions: {//海洋高度时间播放slider配置  Sea level time playback slider configuration 
        width: '400px',//宽度 width
        min: mapHeightStartYear,//最小值 minimum
        max: mapHeightEndYear,//最大值 maximum
        interval: 1,//间隔 interval
        height: 8,//高度 height
        dotSize: 16,//
        useKeyboard: false,//禁用键盘控制 disable keyboard control
        tooltip: 'always',
        disabled: false
      },
      isPlayMapHeight: false,//是否播放海洋高度  control play the sea height
      mapHeightloadingProcess: true,//是否显示进度条 control display progress bar
    }
  },
  components: {
    VueSlider
  },
  created () {
    vm = this
  },
  async mounted () {
    this.clientWidth = document.documentElement.clientWidth
    //获取所有的海洋高度数据 预先存起来
    // Get all the sea height data and save it 
    for (let i = mapHeightStartYear; i <= mapHeightEndYear; i++) {
      mapSeaHeightData[i] = await this.getMapSeaHeightData(i)
    }
    //console.log(mapSeaHeightData)
    this.mapHeightloadingProcess = false//隐藏进度条 hide progress bar

    this.$nextTick(() => {
      vm.displayMapSeaHeight()//显示3dbar在立体map上  display 3dbar on map
    })

    //设置接收父组件的方法
    //set the method to receive the parent component
    this.$on('stopPlayMapSeaHeight', () => {
      vm.isPlayMapHeight = false
      vm.playOrStopMapHeight()//停止播放海平面高度 stop play sea level
    })
    this.$on('startPlayMapSeaHeight', () => {
      vm.isPlayMapHeight = true
      vm.playOrStopMapHeight()//开始播放海平面高度 start play sea level
    })
    this.$on('clearPlaySeaHeightInterval', () => {
      vm.clearPlaySeaHeightInterval()
    })
  },
  methods: {
    //show map height in 3D map
    displayMapSeaHeight () {
      //var ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
      let chartDom = document.getElementById('map-sea-height');
      seaHeightChart = echarts.init(chartDom);
      let seaHeightOption = {
        //backgroundColor: 'red',//背景色，默认无背景。 background color, no background by default
        geo3D: {
          map: 'world',//地图类型 map type
          shading: 'lambert',//表现光照带来的明暗 express the light and shade brought by the light

          light: {
            main: {//场景主光源的设置  setting of the main light source of the scene
              intensity: 5,//主光源的强度 the intensity of the main light source
            },
            ambient: {//全局的环境光设置 global ambient light settings
              intensity: 0//环境光的强度 ambient light intensity
            },
            //environment: '#000',
            ambientCubemap: {//使用纹理作为环境光的光源 use texture as a source of ambient light
              texture: require('../../../public/pisa.jpg'),//环境光贴图的url the url of the environment map
              exposure: 1,//解析 hdr 时使用的曝光值 exposure value used when parsing hdr
              diffuseIntensity: 0.5,//漫反射的强度 intensity of diffuse reflection
              specularIntensity: 9//高光反射的强度。the intensity of the specular reflection
            }
          },
          viewControl: {//用于鼠标的旋转，缩放等视角控制 used for mouse rotation, zooming and other viewing angle control
            distance: 100,//默认视角距离主体的距离 the distance of the default viewing angle from the subject
            panMouseButton: 'left',//平移操作使用的鼠标按键 鼠标左键（默认） mouse button used for pan operation Left mouse button (default)
            rotateMouseButton: 'left',//旋转操作使用的鼠标按键 鼠标右键 mouse button used for rotation operation Right mouse button
            //alpha: 1,
            //beta:1
          },
          groundPlane: {//地面可以让整个组件有个“摆放”的地方，从而使整个场景看起来更真实，更有模型感 the ground can allow the entire component to have a "placement" place, so that the entire scene looks more real and model-like
            show: true,//是否显示地面  show the ground
            color: '#FFDCB9'//地面颜色 ground color
          },
          postEffect: {//后处理特效的相关配置 related configuration of post-processing special effects
            enable: true,//是否开启后处理特效 turn on post-processing effects
            bloom: {//高光特效 Highlight effects
              enable: false,//是否开启光晕特效  turn on the halo effect
              bloomIntensity: 0.5//光晕的强度，默认为 0.1 the intensity of the halo, the default is 0.1
            },
            SSAO: {//屏幕空间的环境光遮蔽效果 ambient light shading effect in screen space
              radius: 1,//环境光遮蔽的采样半径 sampling radius of ambient occlusion
              intensity: 1,//环境光遮蔽的强度。值越大颜色越深 the intensity of ambient light occlusion. The larger the value, the darker the color
              enable: true//是否开启环境光遮蔽  turn on ambient light occlusion
            },
            depthOfField: {//景深效果 在对焦的区域相对清晰，离对焦的区域越远则会逐渐模糊 depth of field effect The focus area is relatively clear, and the further away from the focus area it will gradually blur
              enable: false,//是否开启景深   open the depth of field
              focalRange: 10,//完全聚焦的区域范围 fully focused area
              blurRadius: 10,//焦外的模糊半径 blur radius out of focus
              fstop: 1//镜头的F值，值越小景深越浅 the F value of the lens, the smaller the value, the shallower the depth of field
            }
          },
          temporalSuperSampling: {//分帧超采样 framed supersampling
            enable: true
          },
          itemStyle: {//三维图形的视觉属性，包括颜色，透明度，描边等 visual attributes of 3D graphics, including color, transparency, stroke, etc.
            color: 'grey',//图形的颜色 the color of the graph
            borderWidth: 0.4,//图形描边的宽度 the width of the graphic stroke
            borderColor: '#000'//图形描边的颜色 the color of the graphic stroke
          },
          regionHeight: 0.1//三维地图每个区域的高度。这个高度是模型的高度 the height of each area of the 3D map. This height is the height of the model
        },
        visualMap: {//视觉映射组件 visual mapping component
          type: 'piecewise',//自定义分段式视觉映射组件 custom segmented visual mapping component
          pieces: [
            { lt: 0, label: '<0', color: 'red' },
            //{ gte: 0, lt:1, label: '>=0', color: '#1ea6aa' },
            { gte: 0, lt: 1, label: '>=0', color: '#82b1ff' },
            { gte: 1, lt: 2, label: '>=1', color: '#2196f3' },
            { gte: 2, lt: 3, label: '>=2', color: '#1976d2' },
            { gte: 3, label: '>=3', color: '#0e0aea' },

          ],
        },
        series: [{
          type: 'bar3D',
          legend: {
            show: true
          },
          coordinateSystem: 'geo3D',//该系列使用的坐标系 三维地理坐标系 the coordinate system used in the series Three-dimensional geographic coordinate system
          //shading: 'lambert', 
          data: [],
          barSize: 0.25,//柱子粗细 column thickness
          bevelSize: 0.4,//柱子的倒角尺寸 chamfer size of pillar
          bevelSmoothness: 4,//柱子倒角的光滑/圆润度 smoothness/roundness of column chamfer
          shading: 'realistic',//真实感渲染，配合 light.ambientCubemap 和 postEffect 使用可以让展示的画面效果和质感有质的提升  realistic rendering, combined with light.ambient Cubemap and post Effect, can improve the displayed picture effect and texture
          realisticMaterial: {//真实感材质相关的配置项 realistic material related configuration items
            roughness: 0.3,//表示材质的粗糙度，0为完全光滑，1完全粗糙 indicates the roughness of the material, 0 is completely smooth, 1 is completely rough
            metalness: 1//用于表示材质是金属还是非金属，0为非金属，1为金属 used to indicate whether the material is metal or non-metal, 0 is non-metal, 1 is metal
          },
          emphasis: {//柱子高亮状态的标签和样式配置。 the label and style configuration of the column highlight state
            label: {
              show: true,
              formatter: '{b}',//标签内容格式器 formate of label
              distance: 0,//标签距离图形的距离 the distance of the label from the graphic
              textStyle: {//标签的字体样式 label text style
                fontWeight: 'bolder',
                fontSize: 25,
              }
            }
          }
        }]
      };
      seaHeightChart.setOption(seaHeightOption)
      //echarts随窗口大小变化而变化
      //echarts changes with the size of the window
      window.addEventListener('resize',() => {
        chartDom.style.width = window.innerWidth+'px'
        seaHeightChart.resize();
      })

      vm.setMapSeaHeightOption()

    },
    //海洋高度数据渲染
    // sea height data rendering
    async setMapSeaHeightOption () {
      let data = mapSeaHeightData[vm.timePlaySliderValue]
      data = data.map(function (item) {
        return {
          name: item.seaLevel.toFixed(2),
          value: [item.lon, item.lat, item.seaLevel]
        }
      })
      seaHeightChart.setOption({
        series: [{
          data: data
        }]
      })
    },
    //获得海洋高度数据
    // get sea height data
    async getMapSeaHeightData (time) {
      let timeYear = `${time}_01_01`
      let res = await axios.get(commonCfg.getSeaLevelList, { params: { tableName: timeYear } })
      try {
        if (!res.data) {
          return [];
        }
        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    //播放/停止 海洋高度的显示
    // play/stop the display of sea height
    playOrStopMapHeight () {
      if (this.isPlayMapHeight) {//播放 play
        if (vm.timePlaySliderValue == mapHeightEndYear) {
          vm.timePlaySliderValue = mapHeightStartYear
        }
        //调用年份的数据进行渲染
        //call the data of the year for rendering
        vm.setMapSeaHeightOption()

        mapHeightPlayInterval = setInterval(() => {
          //console.log(vm.timePlaySliderValue)
          vm.timePlaySliderValue += vm.timePlaySliderOptions.interval
          if (vm.timePlaySliderValue > mapHeightEndYear) {
            vm.timePlaySliderValue = mapHeightStartYear
          }
          //调用年份的数据进行渲染
          //call the data of the year for rendering
          vm.setMapSeaHeightOption()

        }, 2000)
      } else {//停止 stop
        //console.log('地图海平面停止播放')
        clearInterval(mapHeightPlayInterval)
        mapHeightPlayInterval = null
      }
    },
    //拖动事件 结束事件 drag event  end event
    timePlaySliderDragEnd () {
      vm.setMapSeaHeightOption()
    },
    //销毁播放海洋高度的定时
    //destroy the timer of playing the sea altitude
    clearPlaySeaHeightInterval () {
      if (mapHeightPlayInterval) {
        clearInterval(mapHeightPlayInterval);
        mapHeightPlayInterval = null;
        seaHeightChart.dispose()
      }
    }
  },
}
</script>

<style>
</style>
<template>
  <div>
    <!-- 3d地球 -->
    <!-- 3D earth -->
    <div id="globe" :style="'height: 90vh;width:'+clientWidth+'px'"></div>
    <!-- 暂停/开始播放按钮 -->
    <!-- pause/play button -->
    <div class="carousel-play-btn-position">
      <v-btn icon @click="pauseGlobePlay">
        <v-icon style="color:white" size="40">
          {{ earthSpin ? 'mdi-play-circle-outline' : 'mdi-pause-circle-outline' }}</v-icon>
      </v-btn>
      <v-btn icon @click="showGlobeLabel" style="padding-left:10px">
        <v-icon style="color:white" size="40">
          {{ showLabel ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from "axios";//基于Promise的HTTP客户端 Promise-based HTTP client
import commonCfg from '../../config/common'

import * as echarts from 'echarts';
import 'echarts-gl';
let vm;
let globeChart;//3d地球chart 3d earth chart
let getEarthSeaHeightInterval = null//获得3d地球海平面高度的定时  get the timing of 3d earth sea level height
export default {
  data () {
    return {
      clientWidth: 0,
      // 地球自转
      //earth rotation
      earthSpin: true,
      // 显示站点名称
      // display station name
      showLabel: false,
      color: [
        'red',
        'green'
      ],
    }
  },
  created () {
    vm = this
  },
  mounted () {
    this.clientWidth = document.documentElement.clientWidth
    this.$nextTick(() => {
      vm.showGlobe()
    })
    getEarthSeaHeightInterval = setInterval(vm.showGlobleSeaHeightData, 60000);

    //设置接收父组件的方法
    // set the method to receive the parent component 
    this.$on('clearGetSeaHeightInterval', () => {
      vm.clearGetSeaHeightInterval()
    })
  },
  methods: {
    // 获取海洋高度数据
    // get sea height data
    async getSeaHeight () {
      let v = await axios.get(commonCfg.seaHeightData)
      var data = v.data.map(function (dataItem) {
        let color
        if (dataItem.value[2] < 0) {
          color = vm.color[0]
        } else {
          color = vm.color[1]
        }
        return {
          name: dataItem.name,
          value: [dataItem.value[0], dataItem.value[1], Math.abs(dataItem.value[2])],
          itemStyle: {
            color: color,
            opacity: 1,
          },
        };
      });
      return data
    },
    // 显示3D地球
    // display 3d earth
    async showGlobe () {
      var chartDom = document.getElementById('globe');
      globeChart = echarts.init(chartDom);
      var option;
      let data = await this.getSeaHeight()
      option = {
        visualMap: {
          show: false,
          min: 0,
          max: 60,
          inRange: {
            symbolSize: [1.0, 10.0]
          }
        },
        // 地球setting
        // earth setting 
        globe: {
          baseTexture: require("../../../public/world.topo.bathy.200401.jpg"),
          heightTexture: require("../../../public/world.topo.bathy.200401.jpg"),
          shading: 'color', // 地球光线控制  Earth light control
          environment: require("../../../public/starfield.jpg"),
          light: {
            main: {
              intensity: 2
            }
          },
          viewControl: {
            autoRotate: this.earthSpin // 控制地球自转 earth rotation
          }
        },
        series: [
          {
            type: 'bar3D',
            coordinateSystem: 'globe',
            data: data,
            barSize: 0.6,
            minHeight: 0.2,
            label: {
              fontSize: 12,
              show: this.showLabel, // 显示bar label show bar label
              position: 'right',
              formatter: '{b}', // 显示格式 label formate 
              textStyle: {
                color: 'orange'
              }
            },
            silent: true,
          }
        ]
      };
      globeChart.setOption(option);
      //echarts随窗口大小变化而变化
      //echarts changes with the size of the window
      window.addEventListener('resize', () => { 
        chartDom.style.width = window.innerWidth + 'px'
        globeChart.resize();
      })
    },
    //暂停/播放 地球旋转
    // pause/play Earth rotation
    pauseGlobePlay () {
      this.earthSpin = !this.earthSpin
      globeChart.setOption({
        globe: {
          viewControl: {
            autoRotate: this.earthSpin
          }
        }
      });
    },
    //显示/隐藏 地球海洋高度label
    // show/hide the height of earth sea level label
    showGlobeLabel () {
      this.showLabel = !this.showLabel
      globeChart.setOption({
        series: [
          {
            label: {
              show: this.showLabel,
            }
          }
        ]
      });
    },
    //设置地球海平面高度数据
    //Set the height of the earth's sea level data
    async showGlobleSeaHeightData () {
      let data = await this.getSeaHeight()
      globeChart.setOption({
        series: [
          {
            type: 'bar3D',
            coordinateSystem: 'globe',
            data: data,
            barSize: 0.6,
            minHeight: 0.2,
            label: {
              fontSize: 12,
              show: this.showLabel,
              position: 'right',
              formatter: '{b}',
              textStyle: {
                color: 'orange'
              }
            },
            silent: true,
          }
        ]
      })
    },
    //销毁获得海平面高度的定时
    // Destroy the timing for obtaining sea level altitude
    clearGetSeaHeightInterval () {
      if (getEarthSeaHeightInterval) {
        clearInterval(getEarthSeaHeightInterval)
        getEarthSeaHeightInterval = null
        globeChart.dispose()
      }
    }
  },
  // destroyed(){
  //    //清除获得3d地球海平面的高度的定时
        //Clear timing to get altitude of 3d earth sea level
  //   if (getEarthSeaHeightInterval) {
  //     clearInterval(getEarthSeaHeightInterval)
  //     getEarthSeaHeightInterval = null
  //     globeChart.dispose()
  //   }
  // }
}
</script>

<style scope>
.carousel-play-btn-position {
  position: absolute;
  bottom: 8%;
  left: 50%;
}
</style>
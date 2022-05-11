<template>
  <!-- 历史查询 -->
  <!-- show history data -->
  <v-container fluid>
    <v-row>

      <v-col md="3" lg="2">
        <v-card class="height">
          <!-- 表单 -->
          <!-- form  -->
          <v-form class="pa-2" ref="form">
            <v-select :items="items" id="station" return-object v-model="historyOptionsForm.station"
              :label="$vuetify.lang.t('$vuetify.historyData.form.stationName')"
              :rules="[v => !!v || $vuetify.lang.t('$vuetify.historyData.stationNameRequire')]" @change="change">
            </v-select>

            <v-select :items="types" id="type" :label="$vuetify.lang.t('$vuetify.historyData.form.dataType')"
              v-model="historyOptionsForm.itemName"
              :rules="[v => !!v || $vuetify.lang.t('$vuetify.historyData.typeRequire')]">
            </v-select>

            <dateTimePicker :label="$vuetify.lang.t('$vuetify.historyData.form.startTime')"
              v-model="historyOptionsForm.start" :errorMsg="$vuetify.lang.t('$vuetify.datetimePicker.start_error')">
            </dateTimePicker>

            <dateTimePicker :label="$vuetify.lang.t('$vuetify.historyData.form.endTime')"
              v-model="historyOptionsForm.end" :errorMsg="$vuetify.lang.t('$vuetify.datetimePicker.end_error')">
            </dateTimePicker>

            <v-radio-group row v-model="type">
              <v-radio :label="$vuetify.lang.t('$vuetify.historyData.form.line')" value="line"></v-radio>
              <v-radio :label="$vuetify.lang.t('$vuetify.historyData.form.waterfall')" value="waterfull"></v-radio>
            </v-radio-group>

          </v-form>

          <v-btn depressed color="primary" style="margin-left: 10px" id="show" @click="show">
            {{$vuetify.lang.t('$vuetify.historyData.btn.query')}}</v-btn>
          <v-btn depressed color="primary" style="margin-left: 10px" @click="exportCsv">
            {{$vuetify.lang.t('$vuetify.historyData.btn.export')}}</v-btn>

        </v-card>
      </v-col>
      <!-- 图表 -->
      <!-- history data chart -->
      <v-col md="9" lg="10">
        <v-card class="height" :loading="loading">
          <v-row class="main-row">
            <v-col class="main">
              <div id="GNSSChart"></div>
              <div id="waterfall_e"></div>
              <div id="waterfall_n"></div>
              <div id="waterfall_u"></div>
              <div id="wenshiduChart"></div>
              <div id="inclinationChart"></div>
              <div id="hydrostaticChart"></div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- 提示 -->
    <!-- tips -->
    <v-snackbar v-model="snackbar" top :color='color' :timeout="3000">
      {{msg}}
    </v-snackbar>
  </v-container>
</template>
<script>

import dateTimePicker from '../components/DatetimePicker';
//plotly obj
import Plotly from "plotly.js-dist";
import axiosTool from '../api/axios.js';
// plotly 配置
let plotConfig = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: ['select2d', 'toggleSpikelines', 'lasso2d'],
  locale: 'zh-CN',
};

var allStation = []
var permission = []

export default {
  data () {
    return {
      // 站点数据
      // station data
      items: [],
      // 数据类型
      // data type 
      types: [],

      // 查询数据时loading
      // loading of find history
      loading: false,
      type: 'line',
      // tips显示
      // display tips
      snackbar: false,
      msg: '',
      color: 'red',
      // 表单数据
      // form data
      historyOptionsForm: {
        start: '',
        end: '',
        itemName: '',
        station: '',
      },
      // 下载数据
      // download data
      csvData: []
    };
  },
  props: ['role'],
  components: {
    dateTimePicker,
  },
  mounted () {
    console.log(this.$root.role)
    this.listStations();
  },
  methods: {
    // 单位设置
    // unit setting
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
    // 获取站点数据
    // get station data
    listStations () {
      axiosTool.get('listStation').then(async (res) => {
        console.log(res)
        if (res == null) {
          return
        }
        allStation = res

        // data =null  is admin
        if (this.$root.role != 'OU') {
          for (var station of res) {
            this.items.push({
              text: station.name,
              value: station.id,
              id: station.id
            });
          }
          console.log(this.items)
          return
        }
        let data = await axiosTool.get('listPermission')
        // data为空表示为管理员
        console.log(data)
        permission = data
        for (var stationId in data) {
          let el = allStation.filter(v => v.id == stationId)[0]
          if (el == null) {
            continue
          }
          console.log(el)
          this.items.push({
            text: el.name,
            value: el.id,
            id: el.id
          });
        }
        console.log(this.items)
      });
    },
    // 显示数据
    // show history data
    show () {
      if (this.$refs.form.validate()) {
        if (new Date(this.historyOptionsForm.start).getTime() > new Date(this.historyOptionsForm.end).getTime()) {
          this.tips(this.$vuetify.lang.t('$vuetify.historyData.timeError'), 'red')
          return
        }
        this.loading = true;
        let start = new Date(this.historyOptionsForm.start).getTime();
        let end = new Date(this.historyOptionsForm.end).getTime();
        let param = {
          station_id: this.historyOptionsForm.station.value,
          start: start + '',
          end: end + '',
          item_name: this.historyOptionsForm.itemName,
        };
        this.loading = true;
        axiosTool.get('dataHistory', param).then((res) => {
          if (res == null) {
            this.tips(this.$vuetify.lang.t('$vuetify.historyData.noData'), 'red')
            this.loading = false;
            return
          }
          if (this.type == 'line') {
            this.initLineChart(
              'GNSSChart',
              res,
              this.historyOptionsForm.itemName,
              this.getUnitByItemName(this.historyOptionsForm.itemName)
            );
          } else if (this.type == 'waterfull') {
            this.initWaterfullChart('GNSSChart',
              res,
              this.historyOptionsForm.itemName,
              this.getUnitByItemName(this.historyOptionsForm.itemName)
            );
          }
          this.loading = false;
          this.csvData = []
          this.csvData.push(["time", param.item_name])
          for (let data of res) {
            let arrs = [timestampToTime(data.ts), data.d];
            this.csvData.push(arrs);
          }
        });
      }
    },
    change (obj) {
      this.types = []
      var param = {
        station_id: obj.id
      }
      // 普通用户根据权限显示
      // ordinary users are displayed according to permissions
      if (this.role == 'OU') {
        for (var item of permission[obj.id]) {
          console.log(item)
          this.types.push({
            text: item,
            value: item,
          });
        }
      } else {
        axiosTool.get('listItem', param).then((res) => {
          if (res == null) {
            return
          }
          for (var item of res) {
            this.types.push({
              text: item.name,
              value: item.name,
            });
          }
        });
      }
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
    normalData (name) {
      let data = {
        name: name,
        x: [],
        y: [],
        type: 'scattergl',
        mode: 'lines+markers',
        turboThreshold: 0,
      };
      return data;
    },
    // 图表初始化
    // init chart
    initLineChart (id, res, title, unit) {
      var array = new Array();
      var xObj = this.normalData(title);
      for (var data of res) {
        xObj.x.push(new Date(data.ts));
        xObj.y.push(data.d);
      }
      array.push(xObj);
      var chart = {
        title: title,
        type: this.historyOptionsForm,
        // 折线属性 name:折线名称 key:对应数据的key
        // polyline attributes name: polyline name, key :data key 
        lines: [],
        unit: unit,
      };
      Plotly.newPlot(
        id,
        array,
        this.normalLayout(chart.title, chart.unit),
        plotConfig
      );
    },
    // 配置瀑布图
    // fall chart setting
    initWaterfullChart (id, res, title, unit) {
      let uDiffY = this.collectYdata(res)
      var xData = []
      for (var data of res) {
        xData.push(new Date(data.ts));
      }
      let data_u = this.waterfallData(title, xData, uDiffY, unit)
      let layout_u = this.waterfallLayout(title)
      Plotly.newPlot(id, data_u, layout_u, plotConfig)
    },
    // 获取Y方向上数据的差值
    // get difference between the current data and the previous data in y
    collectYdata (data) {
      let yDiff = []
      if (data.length > 1) {
        for (var i = 1; i < data.length; i++) {
          yDiff.push(data[i].d - data[i - 1].d)
        }
      }
      return yDiff
    },
    // 瀑布图布局配置
    // fall chart layout setting
    waterfallLayout (title) {
      let layout = {
        title: {
          text: title,
        },
        yaxis: {
          type: 'linear',
          fixedrange: true,
        },
        autosize: true,
        showlegend: false,
      }
      return layout
    },
    // 瀑布图数据配置
    // fall chart data config
    waterfallData (name, xData, yData, unit) {

      let data = [
        {
          name: name,
          type: 'waterfall',
          orientation: 'v',
          x: xData,
          textposition: 'outside',
          y: yData,
          connector: {
            line: {
              color: 'rgb(63, 63, 63)',
            },
          },
          unit: unit,
          increasing: { marker: { color: 'blue' } },
          decreasing: { marker: { color: 'orange' } },
        },
      ]
      return data
    },
    tips (msg, color) {
      this.msg = msg
      this.color = color
      this.snackbar = true
    },
    exportCsv () {
      if (this.csvData.length <= 0) {
        this.tips(this.$vuetify.lang.t('$vuetify.historyData.noData'), 'red')
        return;
      }
      var data = this.csvData;
      console.log(data.length);
      // Building the CSV from the Data two-dimensional array
      // Each column is separated by ";" and new line "\n" for next row
      var csvContent = "";
      data.forEach(function (infoArray, index) {
        let dataString = infoArray.join(",");
        csvContent += index < data.length ? dataString + "\n" : dataString;
      });

      // The download function takes a CSV string, the filename and mimeType as parameters
      // Scroll/look down at the bottom of this snippet to see how download is called
      var download = function (content, fileName, mimeType) {
        var a = document.createElement("a");
        mimeType = mimeType || "application/octet-stream";

        if (navigator.msSaveBlob) {
          // IE10
          navigator.msSaveBlob(
            new Blob([content], {
              type: mimeType
            }),
            fileName
          );
        } else if (URL && "download" in a) {
          //html5 A[download]
          a.href = URL.createObjectURL(
            new Blob([content], {
              type: mimeType
            })
          );
          a.setAttribute("download", fileName);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          location.href =
            "data:application/octet-stream," + encodeURIComponent(content); // only this mime type is supported
        }
      };

    //  let start = new Date(this.historyOptionsForm.start).getTime() / 1000;
    //  let end = new Date(this.historyOptionsForm.end).getTime() / 1000;
      let name =
        this.historyOptionsForm.station.text +
        "/" +
        this.historyOptionsForm.itemName +
    //    "/" +
    //    timestampToTime(start) +
    //    "/" +
    //    timestampToTime(end) +
        ".csv";
      download(csvContent, name, "text/csv;encoding:utf-8");
    }
  },
  watch: {
    //监听语言切换功能 每次切换时改变数据类型列表的语言
    // Monitor language switch , change data type list language when language switch 
    '$vuetify.lang.current': function () {
      if (!this.historyOptionsForm.station == '') {
        this.types = []
      }
      this.getDataTypeObj()
      this.change(this.historyOptionsForm.station)
    }
  }
};
// //将时间戳转化为日期格式
// timestamp transform yyyy-mm-dd hh:mm:ss
function timestampToTime (timestamp) {
  var date = new Date(timestamp);
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
</script>
<style scoped>
.height {
  min-height: 86vh;
}
</style>

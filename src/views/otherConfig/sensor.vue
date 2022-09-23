<!-- 用来进行传感器维护的页面 -->
<!-- sensor maintenance -->

<template>
  <v-container fluid>
    <v-card style="min-height: 86vh" class="px-2">
      <v-row>
        <!-- 新建按钮 -->
        <!-- create button  -->
        <v-col cols="12" md="2" lg="1">
          <v-btn color="primary" dark class="mb-2" @click="create">{{
            $vuetify.lang.t("$vuetify.sensorConfig.btn.newBtnName")
          }}</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <!-- 搜索框 -->
        <!-- search -->
        <v-col cols="12" md="4" lg="3">
          <v-text-field :placeholder="$vuetify.lang.t('$vuetify.sensorConfig.search')" v-model="search" solo>
          </v-text-field>
        </v-col>
      </v-row>
      <!-- 表格 -->
      <!-- table -->
      <v-data-table :headers="getHeaders()" :items="sensorRecordList" :search="search" class="elevation-1"
        :footer-props="{ 'items-per-page-options': [5, 10, 15] }">
        <template v-slot:[`item.record`]="{ item }">
          <!-- 维护信息太长 在tooltip里显示 -->
          <!--maintenance info too long  show all in tooltip-->
          <v-tooltip top v-if="item.recordSubString !== ''">
            <template v-slot:activator="{ on }">
              <span v-on="on">
                {{ item.recordSubString }}
              </span>
            </template>
            <span>{{ item.record }}</span>
          </v-tooltip>
          <span v-else>{{ item.record }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" v-on="on" @click="editItem(item)" :disabled="item.disabled">
                mdi-pencil
              </v-icon>
            </template>
            <span>{{ $vuetify.lang.t("$vuetify.sensorConfig.modify") }}</span>
          </v-tooltip>
        </template>

      </v-data-table>
    </v-card>
    <!-- 编辑对话框 -->
    <!-- edit info -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-select :items="deviceIds" item-text="identifier" item-value="stationId" :label="
                    $vuetify.lang.t('$vuetify.sensorConfig.form.deviceId')
                  " :rules="
                    rule($vuetify.lang.t('$vuetify.sensorConfig.form.deviceId'))
                  " v-model="form.stationId" @change="getSensorNamesByDeviceId" :readonly="editedIndex != -1">
                </v-select>

              </v-col>
              <v-col cols="12">
                <v-select :items="sensorNames" :label="
                    $vuetify.lang.t('$vuetify.sensorConfig.form.sensorName')
                  " :rules="
                    rule(
                      $vuetify.lang.t('$vuetify.sensorConfig.form.sensorName')
                    )
                  " v-model="form.sensorName" :readonly="editedIndex != -1"></v-select>
              </v-col>
              <v-col cols="12">
                <v-col cols="12">
                  <v-textarea :label="
                      $vuetify.lang.t('$vuetify.sensorConfig.form.textReason')
                    " no-resize rows="3" clearable clear-icon="mdi-close-circle" counter :rules="
                      descriptionRule(
                        $vuetify.lang.t('$vuetify.sensorConfig.form.textReason')
                      )
                    " v-model="form.description"></v-textarea>
                </v-col>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">{{ $vuetify.lang.t("$vuetify.sensorConfig.btn.cancel") }}
          </v-btn>
          <v-btn color="blue darken-1" text @click="submitForm">
            {{ $vuetify.lang.t("$vuetify.sensorConfig.btn.submit") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 通知工具 -->
    <!-- tips -->
    <v-snackbar v-model="snackbar" :color="color" :timeout="3000" :top="true">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>
<script>
//import dateTimePicker from "../components/DatetimePicker"; //日期插件 Date plugin
import axios from "axios"; //基于Promise的HTTP客户端 Promise-based HTTP client
import commonCfg from "../../config/common";

let vm;
export default {
  data () {
    return {
      //tab: null,
      dialog: false, //是否显示对话框 controller dialog display
      search: "", //搜索字符串 search string
      form: {
        stationId: "", //站id station id
        sensorName: "", //传感器名称 sensor name
        //maintenanceTime: "", //上一次维护时间 last maintenance time
        description: "", //原因描述 maintenance info
        id: -1,
      },
      snackbar: false,
      color: "error",
      text: "",
      sensorList: [], //所有传感器列表 List of all sensors
      editedIndex: -1, //新建/修改标志 新建：-1 create/edit new_station:-1
      deviceIds: [], //设备列表 device list 
      sensorNames: [], //传感器名称列表 sensor name list
      stationList: [], //站点ID station id list
      sensorRecordList: [], // 传感器维护纪录列表 List of sensor maintenance records
      // stationList: [], //站列表 station list
    };
  },
  // components: {
  //   dateTimePicker,
  // },
  async created () {
    vm = this;
    await vm.getAllStations()
    vm.getSensorRecordList();
    vm.getSensorList();

  },
  computed: {
    //根据editedIndex的值 判断是新建/修改 标题
    // check 'editedIndex' controll  title is create or edit
    formTitle () {
      return vm.editedIndex === -1
        ? vm.$vuetify.lang.t("$vuetify.sensorConfig.formTitleNew")
        : vm.$vuetify.lang.t("$vuetify.sensorConfig.formTitleUpdate");
    },
  },
  methods: {
    //获得所有站点数据
    // get all station list
    async getAllStations () {
      let res = await axios.get(commonCfg.listStation);
      try {
        console.log(res)
        vm.stationList = res.data;
      } catch (error) {
        console.log(error);
        vm.stationList = [];
      }
    },
    //获得表格标题
    // get table title
    getHeaders () {
      return [
        {
          text: vm.$vuetify.lang.t("$vuetify.sensorConfig.form.deviceId"),
          align: "start",
          value: "identifier",
        },
        {
          text: vm.$vuetify.lang.t("$vuetify.sensorConfig.form.sensorName"),
          value: "device_name",
        },
        {
          text: vm.$vuetify.lang.t("$vuetify.sensorConfig.table.createdTime"),
          value: "createdTimeString",
        },
        {
          text: vm.$vuetify.lang.t("$vuetify.sensorConfig.table.updatedTime"),
          value: "updatedTimeString",
        },
        {
          text: vm.$vuetify.lang.t("$vuetify.sensorConfig.form.textReason"),
          value: "record",
          sortable: false,
        },
        {
          text: vm.$vuetify.lang.t("$vuetify.sensorConfig.table.operation"),
          value: "actions",
          sortable: false,
        },
      ];
    },
    //描述原因的验证规则
    //Validation rules describing the reason
    descriptionRule (type) {
      return [
        (v) =>
          !!v ||
          type + vm.$vuetify.lang.t("$vuetify.sensorConfig.formValidate"), //不能为空 not empty
        (v) =>
          (!!v && v.length <= 1000) || //不能超过字符限制 Cannot exceed character limit
          vm.$vuetify.lang.t("$vuetify.sensorConfig.charactersRestrictions"),
      ];
    },
    //验证规则
    // verification rules
    rule (type) {
      return [
        (v) =>
          !!v ||
          type + vm.$vuetify.lang.t("$vuetify.sensorConfig.formValidate"), //不能为空 not empty
      ];
    },
    //新建对话框
    // create dialog
    create () {
      vm.dialog = true;
      if (vm.$refs.form) vm.$refs.form.resetValidation(); //清空验证 clear verification
      vm.resetFrom();
      vm.editedIndex = -1;
    },
    //重置表单
    // root form
    resetFrom () {
      vm.form.stationId = "";
      vm.form.sensorName = "";
      vm.form.description = "";
      vm.form.id = -1;
      vm.sensorNames = [];
    },
    //关闭对话框
    // close dialog
    close () {
      vm.dialog = false;
      vm.$refs.form.resetValidation(); //清空验证 clear verification
      vm.resetFrom();
      vm.editedIndex = -1;
    },
    //获得传感器列表
    // get sensor list 
    async getSensorList () {
      let res = await axios.get(commonCfg.listDevice);
      if (res.data == null) {
        return
      }
      try {
        vm.sensorList = res.data;
        if (!vm.sensorList) vm.sensorList = [];
      } catch (error) {
        console.log(error);
        vm.sensorList = [];
      }
      //传感器列表里除了有站id再放入站名和identifier
      //In the sensor list, in addition to the station id, put the station name and identifier
      for (let sensor of vm.sensorList) {
        let res = vm.stationList.filter(station => station.id == sensor.station_id);
        console.log(res)
        if (res.length > 0) {
          sensor['stationName'] = res[0].name;
          sensor['identifier'] = res[0].identifier;
        }
      }
      vm.sensorList = vm.sensorList.filter(v => v.stationName != null)
      //获得下拉框需要的站id和identifier
      //Get the station id and identifier required by the drop-down box
      for (let station of vm.stationList) {
        if (!station.upstream) {//station.upstream_id == 0
          vm.deviceIds.push({ identifier: station.identifier, stationId: station.id });
        }
      }

    },
    //通过站id获得传感器名称
    // get sernor name by station Id
    getSensorNamesByDeviceId () {
      let sensorRes = vm.sensorList.filter(
        (sensor) => sensor.station_id === vm.form.stationId
      );
      vm.sensorNames = [];
      for (let sensor of sensorRes) {
        vm.sensorNames.push(sensor.name);
      }
    },
    //获得传感器维护纪录列表
    // get sensor maintenance records
    async getSensorRecordList () {
      let res = await axios.get(commonCfg.listDeviceRecord);

      if (res.data == null) {
        return
      }
      console.log(res.data == null);
      try {
        vm.sensorRecordList = res.data;
        if (!vm.sensorRecordList) vm.sensorRecordList = [];
      } catch (error) {
        console.log(error);
        vm.sensorRecordList = [];
      }
      for (let sensor of vm.sensorRecordList) {
        //创建时间转化成时间字符串
        // create time transform to String
        sensor["createdTimeString"] =
          sensor.created_at === 0 ? "" : timestampToTime(sensor.created_at);
        //修改时间转化成时间字符串
        // edit time transform to String
        sensor["updatedTimeString"] =
          sensor.updated_at === 0 ? "" : timestampToTime(sensor.updated_at);
        //显示在表格上的纪录信息
        // display records in talbe
        sensor["recordSubString"] =
          sensor.record.length > 100 ? sensor.record.slice(0, 50) + "……" : "";
        let res = vm.stationList.filter(station => station.id == sensor.station_id);
        sensor['identifier'] = res[0].identifier;
        //sensor['disabled'] = res[0].upstream_id == 0 ? false : true
        //upstream:false代表本地连接 stands for local area connection
        sensor['disabled'] = res[0].upstream == false ? false : true
        //console.log(sensor['disabled'])
        console.log(res)
      }
    },
    //编辑传感器维护纪录 没有id则为创建
    // edit sensor maintenance records , create record without id
    async editSensorRecord (param) {
      let res = await axios.post(
        commonCfg.editDeviceRecord,
        param
      );
      try {
        return res.data;
      } catch (error) {
        console.log(error);
        return "error";
      }
    },
    //提交表单 submit Form
    async submitForm () {
      var isEmpty = vm.$refs.form.validate();
      if (!isEmpty) {
        //未通过表单验证
        // form verification not pass
        return;
      }
      vm.dialog = true;
      let param = {
        station_id: vm.form.stationId,
        device_name: vm.form.sensorName,
        record: vm.form.description,
      };
      if (vm.form.id != -1) {//代表正在编辑 否则表示正在新建 -1:create other is edit
        param['id'] = vm.form.id;
      }
      let res = await vm.editSensorRecord(param);
      if (res === "ok") {
        vm.tips(
          vm.$vuetify.lang.t("$vuetify.sensorConfig.tips.saveSuccess"),
          "success"
        );
        await vm.getSensorRecordList();
      } else {
        vm.tips(
          vm.$vuetify.lang.t("$vuetify.sensorConfig.tips.saveFail"),
          "error"
        );
      }
      vm.close();
    },
    //当前记录显示
    // show now record
    editItem (item) {
      vm.editedIndex = vm.sensorRecordList.indexOf(item);
      vm.form = {
        stationId: item.station_id,
        sensorName: item.device_name,
        description: item.record,
        id: item.id
      };
      vm.getSensorNamesByDeviceId();
      vm.dialog = true;
    },
    //提示工具
    // tips 
    tips (text, color) {
      vm.text = text; //文本 text
      vm.snackbar = true; //是否显示 whether to display
      vm.color = color; //颜色 color
    },
  },
};
//将时间戳转化为日期格式
//  timestamp transform yyyy-mm-dd hh:mm:ss
function timestampToTime (timestamp) {
  var date = new Date(timestamp); // millisecond
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
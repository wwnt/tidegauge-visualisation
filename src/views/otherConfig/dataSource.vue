<template>
  <v-container fluid>

    <v-card style="min-height: 86vh" class="pa-2">
      <v-card-text>

        <v-data-table :headers="getHeader()" :items="dataSourcesList" class="elevation-1">

          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>{{
            $vuetify.lang.t('$vuetify.otherConfig.tabs.tab2')
          }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="addDataSource()">{{
            $vuetify.lang.t('$vuetify.userconfig.create')
          }}</v-btn>
            </v-toolbar>
          </template>
          <!-- 根据状态显示不同颜色 -->
          <!-- Display different colors according to status -->
          <template v-slot:[`item`]="{item}">
            <tr>
              <td class="text-start">{{item.username}}</td>
              <td class="text-start">{{item.login}}</td>
              <td class="text-start">{{item.sync}}</td>
              <td class="text-start">{{item.latest_snapshot}}</td>
              <td class="text-start">{{item.data_history}}</td>
              <td class="text-start">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon small class="mr-2" v-on="on" @click="editDataSource(item)">
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>{{$vuetify.lang.t('$vuetify.otherConfig.modify')}}</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon small class="mr-2" v-on="on" @click="deleteDataSource(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>{{$vuetify.lang.t('$vuetify.otherConfig.delete')}}</span>
                </v-tooltip>
              </td>
            </tr>
          </template>

        </v-data-table>

      </v-card-text>
    </v-card>

    <!-- 配置表单 -->
    <!-- form config -->
    <v-dialog v-model="dialog" max-width="600px" style="z-index:99999">
      <v-card>
        <v-card-title>
          <span class="headline">{{dialogTitle}}</span>
        </v-card-title>
        <v-card-text>

          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.dataSource.check')" v-model="form.login" 
                  :rules="rule($vuetify.lang.t('$vuetify.dataSource.check'))">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.dataSource.sync')" v-model="form.sync"
                  :rules="rule($vuetify.lang.t('$vuetify.dataSource.sync'))">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.dataSource.camera')" v-model="form.camera"
                  :rules="rule($vuetify.lang.t('$vuetify.dataSource.camera'))">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.dataSource.data_history')"
                    v-model="form.data_history" :rules="rule($vuetify.lang.t('$vuetify.dataSource.data_history'))">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.dataSource.username')" v-model="form.username"
                  :rules="rule($vuetify.lang.t('$vuetify.dataSource.username'))">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.dataSource.password')" v-model="form.password"
                    type="password" :rules="rule($vuetify.lang.t('$vuetify.dataSource.password'))">
                  </v-text-field>
                </v-col>
                <!-- <v-col cols="12">
                  <v-switch :label=" $vuetify.lang.t('$vuetify.thresholdConfig.isActive')" v-model="form.status">
                  </v-switch>
                </v-col> -->
              </v-row>
            </v-container>
          </v-form>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">{{
            $vuetify.lang.t('$vuetify.userconfig.cancel')
          }}</v-btn>
          <v-btn color="blue darken-1" text @click="update()">{{
            $vuetify.lang.t('$vuetify.userconfig.save')
          }}</v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" :timeout="3000" :top="true">
      {{ text }}
    </v-snackbar>
  </v-container>
</template>
<script>
import axiosTool from '@/api/axios.js';
var wsConn
let vm
export default {
  data () {
    return {
      // 表单
      // form
      form: {
        id: '',
        sync: '',
        camera: '',
        login: '',
        username: '',
        password: '',
        data_history: '',

      },
      // 提示
      // tips
      snackbar: false,
      color: "error",
      text: "",

      dialogTitle: '',
      // 表单显示
      // show form 
      dialog: false,
      // 数据源
      // data source
      dataSourcesList: []
    };
  },
  created () {
    vm = this
  },
  mounted () {
    this.listDataSoutce()
  },
  computed: {

  },
  methods: {
    test () {
      wsConn.onopen = this.handleWSOpen;
    },
    // getStatus (status) {
    //   if (status) {
    //     return 'light-blue lighten-2'
    //   }
    //   return ''
    // },
    //验证规则
    // verification rules
    rule (type) {
      return [
        (v) =>
          !!v ||
          type + vm.$vuetify.lang.t("$vuetify.sensorConfig.formValidate"), //不能为空 not empty
      ];
    },
    getHeader () {
      return [
        { text: this.$vuetify.lang.t('$vuetify.dataSource.username'), value: "username" },
        {
          text: this.$vuetify.lang.t('$vuetify.dataSource.check'),
          align: "start",
          value: "login",
        },
        { text: this.$vuetify.lang.t('$vuetify.dataSource.sync'), value: "sync" },
        { text: this.$vuetify.lang.t('$vuetify.dataSource.camera'), value: "latest_snapshot" },
        { text: this.$vuetify.lang.t('$vuetify.dataSource.data_history'), value: "data_history" },
        { text: this.$vuetify.lang.t('$vuetify.dataSource.operation'), value: 'actions', sortable: false }
      ]
    },
    listDataSoutce () {
      axiosTool.get('listUpstream').then(res => {
        console.log(res)
        if (res == null) {
          this.dataSourcesList = []
          return
        }
        this.dataSourcesList = res
      })
    },
    // 修改配置 
    // edit config
    editDataSource (item) {
      this.dialogTitle = this.$vuetify.lang.t("$vuetify.dataSource.editConfig")
      this.dialog = true
      this.form = {
        id: item.id,
        login: item.login,
        sync: item.sync,
        camera: item.latest_snapshot,
        data_history: item.data_history,
        username: item.username,
        password: item.password,
        //status: item.status
      }
      console.log(this.form)
    },
    update () {
      var isEmpty = vm.$refs.form.validate();
      if (!isEmpty) {
        //未通过表单验证
        // form verification not pass
        return;
      }
      let param = {
        id: this.form.id,
        login: this.form.login,
        sync: this.form.sync,
        latest_snapshot: this.form.camera,
        data_history: this.form.data_history,
        username: this.form.username,
        password: this.form.password,
      }
      axiosTool.post('editUpstream', param).then(res => {
        if (res == 'ok') {
          console.log(res)
          vm.dialog = false
          this.listDataSoutce()
          vm.tips(
            vm.$vuetify.lang.t("$vuetify.sensorConfig.tips.saveSuccess"),
            "success"
          );
        }
      })
    },
    // 新建数据源
    // create data source
    addDataSource () {
      this.dialogTitle = this.$vuetify.lang.t("$vuetify.dataSource.addConfig")
      this.dialog = true
      this.form = {
        login: '',
        sync: '',
        camera: '',
        data_history: '',
        username: '',
        password: '',
        //status: ''
      }
      if (vm.$refs.form) vm.$refs.form.resetValidation(); //清空验证 clear verification
    },
    deleteDataSource (item) {
      this.$dialog.confirm({
        text: this.$vuetify.lang.t('$vuetify.dataSource.confirmDeluser'),
        title: this.$vuetify.lang.t('$vuetify.dataSource.del'),
        cancel: this.$vuetify.lang.t('$vuetify.account.btn.cancel'),
        actions: [
          {
            text: this.$vuetify.lang.t('$vuetify.account.btn.cancel'),
            color: 'blue',
            key: 'false',
          },
          {
            text: this.$vuetify.lang.t('$vuetify.account.btn.confirm'),
            color: 'blue',
            key: true,
          },
        ],
      }).then((type) => {
        if (type) {
          axiosTool.post('delUpstream', { id: item.id }).then(res => {
            if (res == 'ok') {
              console.log(res)
              vm.dialog = false
              this.listDataSoutce()
              vm.tips(
                vm.$vuetify.lang.t("$vuetify.sensorConfig.tips.saveSuccess"),
                "success"
              );
            }
          })
        }
      })
    },
    tips (text, color) {
      console.log(text,color)
      vm.text = text;
      vm.snackbar = true;
      vm.color = color;
    },
    handleWSOpen () {
      console.log("connection success...");
    },
  },
};

</script>
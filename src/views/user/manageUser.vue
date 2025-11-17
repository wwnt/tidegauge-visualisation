<template>
  <!-- 用户配置 -->
  <!-- user config  -->
  <v-container fluid>
    <!-- 用户表格 -->
    <!-- user table  -->
    <v-card style="min-height: 86vh" class="pa-2">
      <v-data-table :headers="getHeaders()" :items="desserts" :single-expand="singleExpand" item-key="name"
        :footer-props="{
      itemsPerPageOptions: [5,10,15,20]
    }" class="elevation-1">

        <!-- 上方插槽 -->
        <!-- top slot -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{
            $vuetify.lang.t('$vuetify.userconfig.title')
          }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="add">{{
            $vuetify.lang.t('$vuetify.userconfig.create')
          }}</v-btn>
          </v-toolbar>
        </template>

        <!-- 操作按钮 -->
        <!--  operation button-->
        <template v-slot:[`item.operation`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" v-on="on" @click="showData(item)">
                mdi-eye
              </v-icon>
            </template>
            <span>{{$vuetify.lang.t('$vuetify.userconfig.check')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-1" v-on="on" @click="edit(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>{{$vuetify.lang.t('$vuetify.userconfig.edit_user')}}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" v-on="on" @click="deleteUser(item)">
                mdi-delete
              </v-icon>
            </template>
            <span>{{$vuetify.lang.t('$vuetify.userconfig.delete')}}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <!-- 权限查看窗口 -->
    <!-- vie permission dialog -->
    <v-dialog v-model="dataDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dataTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-treeview v-if="showTreeItem.length>0" :items="showTreeItem"></v-treeview>
          <div v-else> {{   $vuetify.lang.t('$vuetify.userconfig.noPermission')}} </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dataDialog = false">{{
            $vuetify.lang.t('$vuetify.userconfig.close')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 用户编辑 -->
    <!-- edit user info -->
    <v-dialog v-model="userInfoDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.userconfig.username')"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.account.nameRules')]" v-model="form.name" value
                    required :disabled="disable">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.userconfig.mail')"
                    :disabled="form.group==$vuetify.lang.t('$vuetify.userconfig.superAdmin')"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.userconfig.mailRequire'), v => /.+@.+\..+/.test(v) || $vuetify.lang.t('$vuetify.userconfig.mailValid'),]"
                    v-model="form.email" required>
                  </v-text-field>
                </v-col>
                <!-- 角色选择 -->
                <!-- choose roles -->
                <v-col cols="12" sm="6">
                  <v-select v-model="form.group" :items="[{
                    value:$vuetify.lang.t('$vuetify.userconfig.user'),
                    text:$vuetify.lang.t('$vuetify.userconfig.user'),
                  },{
                    value:$vuetify.lang.t('$vuetify.userconfig.superAdmin'),
                    text:$vuetify.lang.t('$vuetify.userconfig.superAdmin'),
                    disabled:true
                  },{
                    value:$vuetify.lang.t('$vuetify.userconfig.admin'),
                    text:$vuetify.lang.t('$vuetify.userconfig.admin'),
                  }
                  ]" :label="$vuetify.lang.t('$vuetify.userconfig.group')"
                    :disabled="form.group==$vuetify.lang.t('$vuetify.userconfig.superAdmin')"
                    :rules="[v => !!v || $vuetify.lang.t('$vuetify.userconfig.groupRules')]" required></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="$vuetify.lang.t('$vuetify.userconfig.password')" v-model="form.password"
                    :disabled="form.group==$vuetify.lang.t('$vuetify.userconfig.superAdmin')" type="password"
                    :rules="[v => (type!='add'||!!v) || $vuetify.lang.t('$vuetify.userconfig.groupRules')]">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <div style="margin-bottom:8px">{{$vuetify.lang.t('$vuetify.userconfig.data_permission')}}</div>
                  <tree-select style="width: 100%" v-model="form.itemPermission" :tree-data="items"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :disabled="form.group==$vuetify.lang.t('$vuetify.userconfig.superAdmin')||form.group==$vuetify.lang.t('$vuetify.userconfig.admin')"
                    :placeholder="$vuetify.lang.t('$vuetify.userconfig.data_permission')" allow-clear treeCheckable
                    tree-default-expand-all></tree-select>
                </v-col>
                <v-col cols="12">
                  <div style="margin-bottom:8px">{{$vuetify.lang.t('$vuetify.userconfig.cameraPermissions')}}</div>
                  <tree-select style="width: 100%" v-model="form.cameraPermisson" :tree-data="cameraItems"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :disabled="form.group==$vuetify.lang.t('$vuetify.userconfig.superAdmin')||form.group==$vuetify.lang.t('$vuetify.userconfig.admin')"
                    :placeholder="$vuetify.lang.t('$vuetify.userconfig.data_permission')" allow-clear treeCheckable
                    tree-default-expand-all></tree-select>
                </v-col>
                <v-col cols="12">
                  <v-switch v-model="form.realTime" :label="$vuetify.lang.t('$vuetify.userconfig.snapshotPermissions')"
                    :disabled="form.group==$vuetify.lang.t('$vuetify.userconfig.superAdmin')||form.group==$vuetify.lang.t('$vuetify.userconfig.admin')">
                  </v-switch>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="userInfoDialog = false">{{
            $vuetify.lang.t('$vuetify.userconfig.cancel')
          }}</v-btn>
          <v-btn color="blue darken-1" text @click="create(type)">{{
            $vuetify.lang.t('$vuetify.userconfig.save')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- tips -->
    <v-snackbar v-model="snackbar" top :color='color'>
      {{msg}}
    </v-snackbar>

  </v-container>
</template>
<script>

import treeSelect from 'ant-design-vue/lib/tree-select'; // 加载 JS load js
import 'ant-design-vue/lib/tree-select/style/css'; // 加载 load
import 'ant-design-vue/lib/input/style/css'; // 加载 CSS load css
import axiosTool from '@/api/axios.js';
var vm = null;
// 权限 roles
var rolesMap = new Map()
// station name-> id
var stationMap = new Map()
// id -> station name
var idMap = new Map()
// var allItems = []
export default {
  data () {
    return {
      // 权限查看窗口
      // show permission dialog
      dataDialog: false,
      // 权限查看窗口中的title
      // title in permission dialog
      dataTitle: '',
      // 禁止修改用户名
      // disable edit username
      disable: false,
      // 编辑用户窗口显示
      // show edit user info dialog
      userInfoDialog: false,
      // 权限选择
      // permission tree
      showTreeItem: [],
      // tips
      msg: '',
      color: '',
      snackbar: false,
      // 正在编辑的用户
      // editing user
      clickUser: '',
      // 修改/新增用户
      // edit/create user
      title: '',
      // 添加或修改
      // edit or add
      type: 'add',
      // 编辑用户表单
      // form of edit user
      form: {
        id: '',
        name: '',
        email: '',
        password: '',
        group: '',
        itemPermission: [], // 设备数据权限  item permission
        cameraPermisson: [], // 摄像头历史数据权限  camera history data permission 
        realTime: true //实时监控权限 camera realtime permission
      },
      // allItems: [],
      singleExpand: false,
      // table

      // 表格数据
      // table data
      desserts: [],
      // 用于选择数据权限
      // item permission lists
      items: [],
      // 用于选择摄像头权限
      // camera permission lists
      cameraItems: [],
    };
  },
  props: ['allItems'],
  components: {
    treeSelect,
  },
  watch: {
    'form.name': function () {
      this.form.name = this.form.name.toLowerCase()
    },
  },
  mounted () {
    vm = this;
    rolesMap.set(2, this.$vuetify.lang.t('$vuetify.userconfig.superAdmin'))
    rolesMap.set(1, this.$vuetify.lang.t('$vuetify.userconfig.admin'))
    rolesMap.set(0, this.$vuetify.lang.t('$vuetify.userconfig.user'))
    this.listUsers();

    this.$nextTick(() => {
      vm.listStations()

    })
  },
  methods: {
    // 获取表格Header
    // get table header
    getHeaders () {
      return [
        {
          text: this.$vuetify.lang.t('$vuetify.userconfig.username'),
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: this.$vuetify.lang.t('$vuetify.userconfig.mail'), value: 'email' },
        { text: this.$vuetify.lang.t('$vuetify.userconfig.group'), value: 'group' },
        { text: this.$vuetify.lang.t('$vuetify.userconfig.operation'), value: 'operation', sortable: false, },
      ]
    },
    // 获取站点数据
    // get station data
    listStations () {
      axiosTool.get('listStation').then((res) => {
        for (var station of res) {
          stationMap.set(station.name, station.id)
          idMap.set(station.id + '', station.name)

        }
        vm.initItem(vm.allItems)
        vm.initCameraItem(res)
      })
    },
    // 获取所有用户数据
    // get users data
    listUsers () {
      this.desserts = []
      axiosTool.get('listUser').then((res) => {
        for (var item of res) {
          if (item.username != localStorage.username) {
            this.desserts.push({
              name: item.username,
              group: rolesMap.get(item.role),
              data: [],
              email: item.email,
              live_camera: item.live_camera
            })
          }

        }
      })
    },
    // 获取所有数据类型 提供权限显示
    // get all item data to display permission
    listItems () {
      axiosTool.get('listItem').then((res) => {
        vm.initItem(res)
        vm.allItems = res
        vm.initItem(vm.allItems)

      })
    },

    // 处理数据用于显示treeSelect
    // transform item data to display in treeSelect
    initItem2TreeData (data) {
      console.log(data)
      var result = []
      for (var item of data) {
        if (result.filter(v => v.name == item.identifier).length == 0) {
          result.push({
            id: stationMap.get(item.identifier),
            name: item.identifier,
            children: []
          })
        }
        var sernor = result.filter(v => v.name == item.identifier)
        if (sernor[0].children.filter(v => v.name == item.device_name).length == 0) {
          sernor[0].children.push({
            name: item.device_name,
            children: []
          })
        }
        var type = sernor[0].children.filter(v => v.name == item.device_name)
        type[0].children.push({
          text: item.name,
          //name: this.$vuetify.lang.t('$vuetify.historyData.dataType.' + item.type),
          name: item.name
        })
      }
      return result
    },
    /**
     * 处理item数据用于在treeSelect中显示
     * Process item data for display in treeSelect
     * transform item data
     * {
     *  value: '0-0-0', 
     *  title: String,
     *  children: []
     * }
     * 
     * 参考Ant Design of Vue tree Select
     * See Ant Design of Vue tree Select
     *  */
    initItem (data) {
      console.log(this.items)
      var i = 0
      for (var item of data) {
        if (this.items.filter(v => v.id == item.station_id).length == 0) {
          this.items.push({
            value: i,
            id: item.station_id,
            title: idMap.get(item.station_id),
            children: []
          })
          i++
        }
        var sernor = this.items.filter(v => v.id == item.station_id)
        if (sernor[0].children.filter(v => v.title == item.device_name).length == 0) {
          sernor[0].children.push({
            value: sernor[0].value + '-' + sernor[0].children.length,
            title: item.device_name,
            children: []
          })
        }
        var type = sernor[0].children.filter(v => v.title == item.device_name)
        type[0].children.push({
          value: type[0].value + '-' + type[0].children.length,
          name: item.name,
          //title: this.$vuetify.lang.t('$vuetify.historyData.dataType.' + item.type),
          title: item.name
        })
      }
    },
    initCameraItem (stationList) {
      let i = 0
      for (let station of stationList) {
        console.log(station)
        if (station.cameras == null) {
          continue
        }
        let children = []
        let j = 0;
        for (let camera of station.cameras) {
          children.push({
            value: i + '-' + j,
            title: camera,
            children: []
          })
          j++
        }
        this.cameraItems.push({
          value: i + '',
          id: station.id,
          title: station.name,
          children: children
        })
        console.log(this.cameraItems)
        i++
      }
      console.log(this.cameraItems)

    },
    // 添加用户
    // add user
    create () {
      if (this.$refs.form.validate()) {
        console.log(this.form.itemPermission)
        let param = {
          username: this.form.name,
          email: this.form.email,
          role: this.form.group == this.$vuetify.lang.t('$vuetify.userconfig.admin') ? 1 : 0,
          password: this.form.password,
          live_camera: this.form.group == this.$vuetify.lang.t('$vuetify.userconfig.admin') ? true : this.form.realTime
        }
        axiosTool.post('editUser', param).then((res) => {

          if (res == 'ok') {
            let msg = this.$vuetify.lang.t('$vuetify.userconfig.editSuccess')
            //如果是添加修改tips的内容
            // if edit user change tips msg
            if (this.type == 'add') {
              msg = this.$vuetify.lang.t('$vuetify.account.createSuccess')
              this.clickUser = this.form.name
            }
            this.listUsers()
            // 如果不是管理员就进行权限的更新
            // if not admin ,update permission data
            if (param.role == 0) {
              this.updateItemPermission(msg)
              console.log(msg)
              this.updateCameraPermission(msg)
            } else {
              this.tips(msg, 'success')
            }

          } else {
            console.log(res)
            this.tips(this.$vuetify.lang.t('$vuetify.account.create_error'), 'error')
          }

        })
        this.userInfoDialog = false;
      }
    },
    // 查看权限
    // view permission
    showData (item) {
      var param = {
        username: item.name
      }
      if (item.group == this.$vuetify.lang.t('$vuetify.userconfig.admin') || item.group == this.$vuetify.lang.t('$vuetify.userconfig.superAdmin')) {
        this.showTreeItem = this.initItem2TreeData(vm.allItems)
        this.dataDialog = true
      } else {
        // 获取用户的权限
        // get user permission
        axiosTool.get('listPermission', param).then((res) => {
          var showPermissionData = [];
          for (var item in res) {
            let treeData = {
              name: idMap.get(item),
              id: item,
              children: []
            }
            // 添加item
            // add item
            for (var itemName of res[item]) {
              var sernsorData = vm.allItems.filter(v => v.station_id == item && v.name == itemName)
              if (sernsorData.length == 0) {
                continue
              }
              if (treeData.children.filter(v => v.name == sernsorData[0].device_name).length == 0) {
                treeData.children.push({
                  name: sernsorData[0].device_name,
                  children: []
                })
              }
              console.log(sernsorData)
              treeData.children.filter(v => v.name == sernsorData[0].device_name)[0].children.push({
                //name: this.$vuetify.lang.t('$vuetify.historyData.dataType.' + sernsorData[0].type),
                name: sernsorData[0].name
              })
            }
            showPermissionData.push(treeData)
          }
          this.showTreeItem = showPermissionData
          this.dataDialog = true
        })
      }
    },
    // 获取权限
    // get permission
    async listPermisson (name) {
      var param = {
        username: name
      }
      var result = [];
      let res = await axiosTool.get('listPermission', param)
      for (var item in res) {
        var x = this.items.filter(v => v.id == item)
        if (x.length == 0) {
          continue
        }
        console.log(x)
        for (var type of res[item]) {
          for (var element of x[0].children) {
            var d = element.children.filter(v => v.name == type)
            if (d.length != 0) {
              result.push(d[0].value)
            }
          }
        }
      }

      console.log(result)
      return result
    },
    // 获取指定用户的摄像头权限
    // get one user's permission of camera 
    async listCameraPermission (name) {
      var param = {
        username: name
      }
      let result = []
      let res = await axiosTool.get('listCameraStatusPermission', param)
      for (var item in res) {
        var camera = this.cameraItems.filter(v => v.id == item)
        if(camera.length <= 0) continue
        for (var cameraName of res[item]) {
          for (var el of camera[0].children) {
            if (el.title == cameraName) {
              result.push(el.value)
            }
          }
        }
      }
      return result
    },
    // 将treeSelect选中的数据[0-0-0，0-0-1]转成[itemName]
    // transform [0-0-0] to [itemName]
    formateSelectItems (selectItems) {
      var test = {}
      for (var itemId of selectItems) {
        var id = itemId.split('-');
        console.log(test)
        if (test[this.items[id[0]].id] == null) {
          test[this.items[id[0]].id] = []
        }
        test[this.items[id[0]].id].push(this.items[id[0]].children[id[1]].children[id[2]].name)
      }
      console.log(test)
      return test;
    },
    // 将treeSelect选中的数据[0-0-0，0-0-1]转成[cameraName]
    // transform [0-0-0] to [cameraName]
    formateSelectCamera (selectCameraes) {
      var test = {}
      for (var cameraId of selectCameraes) {
        var id = cameraId.split('-');
        console.log(test)
        if (test[this.cameraItems[id[0]].id] == null) {
          test[this.cameraItems[id[0]].id] = []
        }
        console.log(this.cameraItems[id[0]].children[id[1]])
        test[this.cameraItems[id[0]].id].push(this.cameraItems[id[0]].children[id[1]].title)
      }
      console.log(test)
      return test;
    },
    // 新建 new
    add () {
      this.userInfoDialog = true;
      this.disable = false
      this.form = {
        id: '',
        name: '',
        email: '',
        password: '',
        group: '',
        itemPermission: [],
        realTime: true
      }
      this.title = this.$vuetify.lang.t('$vuetify.userconfig.create_user');
      this.type = 'add';
      if (vm.$refs.form) vm.$refs.form.resetValidation(); //清空验证 clear verification
    },
    // 修改 update
    async edit (item) {

      console.log(item)
      this.userInfoDialog = true;
      this.clickUser = item.name
      this.title = this.$vuetify.lang.t('$vuetify.userconfig.edit_user');
      this.type = 'edit';
      this.disable = true
      let result = await this.listPermisson(item.name);
      let cameraPermission = await this.listCameraPermission(item.name);
      console.log(cameraPermission)
      this.form = {
        name: item.name,
        group: item.group,
        email: item.email,
        itemPermission: result,
        cameraPermisson: cameraPermission,
        realTime: item.live_camera
      };
    },
    // 更新item权限
    // update item permission
    updateItemPermission (msg) {
      // 修改item权限 Modify item permissions
      if (this.form.itemPermission.length > 0) {
        var permission = this.formateSelectItems(this.form.itemPermission)
        console.log(this.clickUser)
        var param = {
          username: this.clickUser,
          scopes: permission
        }
        console.log(msg)
        axiosTool.post('editPermission', param).then((res) => {
          if (res == 'ok') {
            this.tips(msg, 'success')
          } else {
            this.tips(res, 'error')
          }
        })
      }
      // 删除item权限
      // delete item permission 
      else {
        var data = {
          username: this.clickUser,
          scopes: {}
        }
        console.log(msg)
        axiosTool.post('editPermission', data).then((res) => {
          if (res == 'ok') {
            this.tips(msg, 'success')
          } else {
            this.tips(this.$vuetify.lang.t('$vuetify.account.edit_error'), 'error')
          }
        })
      }
    },
    // 更新摄像头权限 Update camera permissions
    updateCameraPermission (msg) {
      var param = {
        username: this.clickUser,
        scopes: {}
      }
      if (this.form.cameraPermisson && this.form.cameraPermisson.length > 0) {
        var permission = this.formateSelectCamera(this.form.cameraPermisson)
        console.log(permission)
        param.scopes = permission
        console.log(msg)
      }
      axiosTool.post('editCameraStatusPermission', param).then((res) => {
        if (res == 'ok') {
          this.tips(msg, 'success')
        } else {
          this.tips(res, 'error')
        }
      })
    },
    // 删除用户 delete users
    deleteUser (item) {
      this.$dialog.confirm({
        text: this.$vuetify.lang.t('$vuetify.account.confirmDelUser'),
        title: this.$vuetify.lang.t('$vuetify.account.delUser'),
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
          let param = []
          param.push(item.name)
          axiosTool.post('delUser', param).then((res) => {
            console.log(res)
            this.tips(this.$vuetify.lang.t('$vuetify.account.deleteSuccess'), 'success')
            this.listUsers()
          })
        }
      })
    },

    tips (msg, color) {
      this.msg = msg
      this.color = color
      this.snackbar = true
    },
  },
};
</script>
<style scoped>
.height {
  min-height: 86vh;
}
</style>

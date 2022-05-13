//自定义中文翻译文件
import zhHans from 'vuetify/es5/locale/zh-Hans';

export default {
  ...zhHans, //继承 Vuetify 的翻译

  //添加自己的翻译
  login:{
    authorizationTitle:'我们重视您的隐私',
    authorizationInfo:'点解“接受所有Cookies”，即表示您同意在您的设备上存储Cookie，以用于验证用户身份并获取实时数据。',
    agree:'接受所有Cookies'
  },
  systemName: '验潮站管理系统',
  datetimePicker: {
    date: '日期',
    time: '时间',
    cancel: '取消',
    confirm: '确认',
    start_error: '请选择开始时间',
    end_error: '请选择结束时间'
  },
  account:{
    username:'用户名',
    password:'密码',
    nameRules:'请填写用户名',
    pwsRules:'请填写密码',
    signIn:'登录',
    account:'账号',
    logout:'登出',
    editAccount:'修改账号',
    authFailed:'认证失败',
    editSuccess:'修改成功',
    edit_error:'修改失败',
    createSuccess:'添加成功',
    create_error:'添加失败',
    accountSignUp:'用户注册',
    delUser:'删除用户',
    deleteSuccess:'删除成功',
    confirmDelUser:'请确认删除此用户！',
    btn:{
      confirm:'确认',
      cancel:'取消',
    }
  },
  
  menu: {
    stationList: '站点显示',
    stationDetail: '站点详情',
    historyData: '历史纪录',
    vedioQuery: '监控查询',
    userManagement: '用户管理',
    otherConfig: '其他配置',
    thresholdConfig: '阈值配置'
  },
  home:{
    messageCenter:'消息中心',
    allReaded:'全部已读',
    confirmRead:'确认已读',
    showUnread:'显示未读',
    showAll:'显示所有',
    aboutUs:'关于我们'
  },
  message:{
    time:'时间',
    status:'状态',
    itemName:'设备名称',
    thresholdExceeded:'超出阈值',
    nowValue:'现值为 ',
    authFailed:'认证失败'
  },
  stationList: {
    searchPlaceholder: '按站名搜索',
  },
  stationDetail: {
    form: {
      stationName: '站名',
      latlng: '坐标',
      location: '位置',
      partner: '合作伙伴(邮箱)',
      contact: '联系方式',
      deviceId: '设备ID',
    },
    formValidate: ' 不能为空',
    ip: 'IP地址',
    btn: {
      new: '新建',
      cancel: '取消',
      submit: '提交',
      del: '删除',
    },
    showItemData: {
      comboboxLabel: "请选择要显示的数据",
      online: '在线',
      offline: "离线",
      noData: '暂无数据'
    },
    delConfirm:{
      text: '是否要删除此站点?',
      title: '删除站点',
      text1:'此站点有数据，是否确认删除此站点',
      title1:'请确认删除有数据的站点',
      actions: {
        cancelText: '取消',
        confirmText: '确定'
      }
    },
    tips: {
      delFail: '删除失败',
      delSuccess: '删除成功',
      newFail: '新建失败',
      editFail: '编辑失败',
      saveSuccess: '保存成功',
      authFail: '认证失败',
      noAuth: '没有权限',
      notAllowedDelete: '站有数据，不允许删除'
    }
  },
  historyData: {
    form: {
      stationName: '站名',
      cameraName: '摄像头',
      dataType: '数据类型',
      selectType:'查询方式',
      startTime: '开始时间',
      endTime: '结束时间',
      line: '折线图',
      waterfall: '瀑布图',
    },
    btn: {
      query: '查询',
      export: '导出csv',
    },
    dataType: {
      AirHumidity: '空气湿度',
      AirTemperature: '空气温度',
      WindDirection: '风向',
      WindSpeed: '风速',
      AirPressure: '大气压',
      Precipitation: '降水量',
      WaterTemperature: '水温',
      WaterSalinity: '盐度',
      WaterHeight: '水面高度',
      Visibility: '能见度',
      air_pressure:'大气压',
      air_temperature:'空气温度',
      air_humidity:'空气湿度',
      wind_direction:'风向',
      water_distance:'水面距离',
      rain_gauge:'雨量',
      wind_speed:'风速',
      water_level:'水面高度',
      water_salinity:'盐度',
      water_temperature:'水温',
      water_total_dissolved_solids:'水总溶解固体',
      water_conductivity:'水电导率',
      air_visibility:'能见度',
      precipitation_detection: '降水量检测',
      rain_intensity: '降雨强度'
    },
    noData: '暂无数据',
    timeError: '请填写正确时间',
    stationNameRequire: '请选择站点名称',
    cameraNameRequire:'请选择摄像头',
    typeRequire: '请选择数据类型',
  },
  otherConfig: {
    tabs: {
      tab1: '传感器',
      tab2: '数据源',
    },
    modify: '修改',
    delete: '删除',
  },
  sensorConfig: {
    search: '搜索',
    modify: '修改',
    delete: '删除',
    formTitleNew: '新建传感器纪录',
    formTitleUpdate: '修改传感器纪录',
    form: {
      deviceId: '设备ID',
      sensorName: '传感器名',
      lastMaintenanceTime: '上一次维护时间',
      textReason: '描述'
    },
    btn: {
      cancel: '取消',
      submit: '保存',
      newBtnName: '新建'
    },
    table: {
      operation: '操作',
      createdTime: '创建时间',
      updatedTime: '修改时间',
    },
    timeValidate: '时间不能为空',
    tips: {
      saveSuccess: '保存成功',
      saveFail: '保存失败',
    },
    charactersRestrictions: '最多不超过1000个字符',
    formValidate: ' 不能为空',
  },
  dataSource:{
    test:'测试',
    save:'保存',
    check:'验证',
    sync:'同步',
    camera:'摄像头',
    data_history:'历史数据',
    username:'用户名',
    password:'密码',
    operation:'操作',
    editConfig:'修改配置',
    addConfig:'新建配置',
    del:'删除数据源',
    confirmDeluser:'请确认删除此数据源！'
  },
  userconfig: {
    tabs: {
      tab1: '账号管理',
      tab2: '账号申请',
      tab3: '权限申请',
    },
    title: '用户管理',
    create: '新建',
    check: '查看权限',
    edit: '修改权限',
    delete: '删除',
    close: '关闭',
    user: '用户',
    superAdmin: '超级管理员',
    admin: '管理员',
    cancel: '取消',
    save: '确认',
    create_user: '新建用户',
    edit_user: '修改用户',
    username: '用户名称',
    resetPws: '重置密码',
    mail: '邮箱',
    mailRequire: '请填写邮箱',
    mailValid: '邮箱格式错误',
    group: '组',
    groupRules: '请选择组',
    password: '密码',
    data_permission: '数据权限',
    editSuccess:'修改成功',
    editFailed:'修改失败',
    data: '数据',
    operation: '操作',
    noPermission:'暂无权限',
    confirmPassword:'确认密码',
    confirmPasswordRules:'两次密码不一致',
    applicationFailed:'申请失败',
    applicationSuccess:'申请成功,结果将通过邮箱通知您',
  
  },
  accountRequest:{
    agree:'同意',
    markAllAgree:'同意标记',
    refuse:'拒绝',
    markAllRefuse:'拒绝标记',
    agreeSuccess:'同意成功',
    agreeFiled:'同意失败',
    refuseSuccess:'拒绝成功',
    refuseFiled:'拒绝失败',
    refuseUserApply:'拒绝用户申请',
    registrationCode:'注册码',
    confirmRefuseUserApply:'请确认拒绝此用户申请！',
  },
  thresholdConfig: {
    newBtn: '新建',
    search: '搜索',
    modify: '修改',
    delete: '删除',
    formTitleNew: '新建阈值',
    formTitleUpdate: '修改阈值',
    form: {
      stationName: '站名',
      sensorName: '传感器名',
      itemName: '数据类型',
      minVal: '最小值',
      maxVal: '最大值'
    },
    isActive: '是否启用',
    btn: {
      cancel: '取消',
      submit: '保存',
    },
    table: {
      threshold: '阈值',
      operation: '操作',
    },
    formValidate: ' 不能为空',
  },
  showData: {
    signOutBtn: '退出',
    overlayer: {
      title: '覆盖物',
      data: '站点展示',
      threedHeight: '立体海洋高度',
      mapSeaHeight: '地图海洋高度'
    },
    settingDialog: {
      title: '播放设置',
      realTimeDataSetting:'站点数据设置',
      selectStation:'选择站点',
      showStation:'IOC站点',
      glossStation:'GLOSS站点',
      unit: '秒',
      cancelBtn: '取消',
      saveBtn: '保存',
      secondsValue: '秒数值',
      formValidate: '不能为空',
      positiveNumber: '必须为正数',
      saveError: '保存失败！请正确设置播放参数'
    },
    mapSeaHeight: {
      playBtn: '播放',
      pauseBtn: '停止',
      information: '当前展示的数据是由卫星测得的海洋ADT数据。数据以1/8精度，取起始年份的1月份数据进行渲染。'
    },
    glossDataTooltip:{
      dateUpdatedFaster: '和数据源更新日期相比，数据更新较快的站',
      dateUpdatedSlower: '和数据源更新日期相比，数据更新较慢的站'
    },
    screenGuide:{
      first: '欢迎使用大屏展示系统',
      second: '设置展示模型顺序与时长',
      third: '选择展示站点类型',
      forth: '退出大屏展示',
      selectStationDatas: '选择要播放的站',
      stationLegend: '站点图例参考',
      playCustomStation: '显示我们自己站的数据',
      nextBtn: '下一步',
      upBtn: '上一步',
      finishBtn: '完成',
      isShowNavigationTitle:'是否显示页面导航',
      isShowNavigationText:'点击"确认"，将再次显示页面导航；否则点击"取消"',
      confirmBtn:'确认',
      cancelBtn:'取消'
    },
    stationsInfo:{
      introduction:'当前共有290个GLOSS站，其中285个为有效站。在这些站中来自不同数据源的海平面历史数据个数大致为：PSMSL，30.8万；UHSLC，1.76亿；VLIZ，11.98亿；SONEL，93.96万。目前可以查到最早的纪录来自于法国1846年1月份的GLOSS站，且该站目前仍有数据更新。'
    },
    sonelLegends: {
      workBest: '该站工作正常：数据可用 ',
      workBetter: '该站检测到问题但数据可用',
      workBad: '该站不工作',
      noExits: '该站不存在',
      fromCountry: '该站不由法国管理'
    }
  },
  video:{
    realTime:'实时查询',
    connect_error:'数据获取失败，摄像头连接异常',
    show9images:'查询最后9张'
  }
};

//自定义英语翻译文件
//Custom English translation files
import en from 'vuetify/es5/locale/en';

export default {
  ...en, //继承 Vuetify 的翻译 Inherit Vuetify's translation
  login:{
    authorizationTitle:'We value your privacy',
    authorizationInfo:'By clicking “Accept All Cookies”, you agree to the storing of cookies on your device to verify user identity and obtain real-time data。',
    agree:'Accept All Cookies'
  },
  //添加自己的翻译 Add your own translation
  systemName: 'Tidegauge Management System',
  datetimePicker: {
    date: 'Date',
    time: 'Time',
    cancel: 'cancel',
    confirm: 'confirm',
    start_error: 'Start time is required',
    end_error: 'End time is required'
  },
  account:{
    username:'Username',
    password:'Password',
    nameRules:'Username is required',
    pwsRules:'Password is required',
    signIn:'Sign In',
    account:'Account',
    logout:'Log Out',
    editAccount:'Edit Account',
    authFailed:'Authentication Failed',
    editSuccess:'Edit Success',
    edit_error:'Edit Failed',
    createSuccess:'Create Success',
    create_error:'Create Failed',
    accountSignUp:'Account Sign Up',
    delUser:'Delete User',
    deleteSuccess:'Delete Success',
    confirmDelUser:'Please confirm to delete this user!',
    btn:{
      confirm:'confirm',
      cancel:'cancel',
    }
  },
  menu: {
    stationList: 'station display',
    stationDetail: 'station detail',
    historyData: 'history data',
    vedioQuery: 'video query',
    userManagement: 'user management',
    otherConfig: 'other configuration',
    thresholdConfig: 'threshold configuration'
  },
  home:{
    messageCenter:'Message Center',
    allReaded:'Mark All Read',
    confirmRead:'Confirm Read',
    showUnread:'Show Unread',
    showAll:'Show All',
    aboutUs:'About Us'
  },
  message:{
    time:'Time',
    status:'Status',
    itemName:'Item Name',
    thresholdExceeded:'Threshold Exceeded',
    nowValue:'Now Value ',
    authFailed:'Auth Failed'
  },
  stationList: {
    searchPlaceholder: 'search by station name',
  },
  stationDetail: {
    form: {
      stationName: 'station name',
      latlng: 'coordinate',
      location: 'location',
      partner: 'partner email',
      contact: 'contact details',
      deviceId: 'device id',
    },
    formValidate: ' cannot be empty',
    ip: 'ip address',
    btn: {
      new: 'new',
      cancel: 'cancel',
      submit: 'submit',
      del: 'delete',
    },
    showItemData: {
      comboboxLabel: "Please select the data to display",
      online: 'online',
      offline: "offline",
      noData: 'No data available'
    },
    delConfirm: {
      text: 'Do you want to delete this station?',
      title: 'Delete station',
      text1:'This station has data,are you sure to delete it',
      title1:'Please confirm to delete the station with data',
      actions: {
        cancelText: 'cancel',
        confirmText: 'confirm'
      }
    },
    tips: {
      delFail: 'delete failed',
      delSuccess: 'delete success',
      newFail: 'create failed',
      editFail: 'edit failed',
      saveSuccess: 'save success',
      authFail: 'authentication failed',
      noAuth: 'No authority',
      notAllowedDelete: 'The station has data, it is not allowed to delete'
    }
  },
  historyData: {
    form: {
      stationName: 'station name',
      cameraName: 'camera name',
      dataType: 'data type',
      selectType:'Select Type',
      startTime: 'starting time',
      endTime: 'ending time',
      line: 'line chart',
      waterfall: 'waterfall chart',
    },
    btn: {
      query: 'query',
      export: 'export csv',
    },
    dataType: {
      AirHumidity: 'AirHumidity',
      AirTemperature: 'AirTemperature',
      WindDirection: 'WindDirection',
      WindSpeed: 'WindSpeed',
      AirPressure: 'AirPressure',
      Precipitation: 'Precipitation',
      WaterTemperature: 'WaterTemperature',
      WaterSalinity: 'WaterSalinity',
      WaterHeight: 'WaterHeight',
      Visibility: 'Visibility',
      air_pressure:'AirPressure',
      air_temperature:'AirTemperature',
      air_humidity:'AirHumidity',
      wind_direction:'WindDirection',
      rain_gauge:'RainGauge',
      wind_speed:'WindSpeed',
      water_level:'WaterHeight',
      water_distance:'waterDistance',
      water_salinity:'WaterSalinity',
      water_temperature:'WaterTemperature',
      water_total_dissolved_solids:'WaterTotalDissolvedSolids',
      water_conductivity:'WaterConductivity',
      air_visibility:'Visibility',
      // air_temperature:''
      precipitation_detection: 'PrecipitationDetection',
      rain_intensity: 'RainIntensity'

    },
    noData: 'No Data',
    timeError: 'Invalid time',
    stationNameRequire: 'StationName is required',
    cameraNameRequire:'CameraName is required',
    typeRequire: 'Type is required',
  },
  otherConfig: {
    tabs: {
      tab1: 'sensor',
      tab2: 'Data Source',
    },
    modify: 'modify',
    delete: 'delete',
  },
  sensorConfig: {
    search: 'search',
    modify: 'modify',
    delete: 'delete',
    formTitleNew: 'Create sensor record',
    formTitleUpdate: 'Modify sensor record',    
    form: {
      deviceId: 'device id',
      sensorName: 'sensor name',
      lastMaintenanceTime: 'last maintenance time',
      textReason: 'description'
    },
    btn: {
      cancel: 'cancel',
      submit: 'submit',
      newBtnName: 'new'
    },
    table: {
      operation: 'operation',
      createdTime: 'created time',
      updatedTime: 'updated time',
    },
    timeValidate: 'time cannot be empty',
    tips: {
      saveSuccess: 'save success',
      saveFail: 'save failed',
    },
    charactersRestrictions: 'Max 1000 characters',
    formValidate: ' cannot be empty',
  },
  dataSource:{
    test:'Test',
    save:'Save',
    check:'Check',
    sync:'Sync',
    camera:'Camera',
    data_history:'Data History',
    username:'Username',
    password:'Password',
    operation:'operation',
    editConfig:'Edit Config',
    addConfig:'Add Config',
    del:'Delete Data Source',
    confirmDeluser:'Please confirm to delete this Data Source!',
    upstreamUrl: 'upstream url'
  },
  userconfig: {
    tabs: {
      tab1: 'Account Management',
      tab2: 'Account Request',
      tab3: 'Access Request',
    },
    title: 'USER MANAGEMENT',
    create: 'CREATE',
    check: 'CHECK PERMISSIONS',
    edit: 'EDIT PERMISSIONS',
    delete: 'DELETE',
    close: 'CLOSE',
    user: 'USER',
    superAdmin: 'SUPER ADMIN',
    admin: 'ADMIN',
    cancel: 'CANCEL',
    save: 'SAVE',
    create_user: 'CREATE USER',
    edit_user: 'EDIT USER',
    resetPws: 'RESET PASSWORD',
    username: 'USERNAME',
    mail: 'EMAIL',
    mailRequire: 'E-mail is required',
    mailValid: 'E-mail must be valid',
    group: 'GROUP',
    groupRules: 'Group is required',
    password: 'PASSWORD',
    data_permission: 'ADD DATA PERMISSION',
    data: 'DATA',
    editSuccess:'Edit Success',
    editFailed:'Edit Failed',
    operation: 'OPERATION',
    noPermission:'No Permission',
    confirmPassword:'Confirm Password',
    confirmPasswordRules:"Those passwords didn't match.",
    applicationFailed:'Application failed',
    applicationSuccess:'Application success! The result will be notified to you by email',
    cameraPermissions: 'Camera permissions',
    snapshotPermissions: 'Real-time snapshot permissions'

  },
  accountRequest:{
    agree:'agree',
    markAllAgree:'Mark All Agree',
    refuse:'Refuse',
    markAllRefuse:'Mark All Refuse',
    agreeSuccess:'Agree Success',
    agreeFiled:'Agree Filed',
    refuseSuccess:'Refuse Success',
    refuseFiled:'Refuse Filed',
    refuseUserApply:'Refuse User Apply',
    registrationCode:'Registration Code',
    confirmRefuseUserApply:'Confirm Refuse User Apply'
  },
  thresholdConfig: {
    newBtn: 'new',
    search: 'search',
    modify: 'modify',
    delete: 'delete',
    formTitleNew: 'Create threshold',
    formTitleUpdate: 'Modify threshold',
    form: {
      stationName: 'station name',
      sensorName: 'sensor name',
      itemName: 'data type',
      minVal: 'min value',
      maxVal: 'max value'
    },
    isActive: 'Is it activated',
    btn: {
      cancel: 'cancel',
      submit: 'submit',
    },
    table: {
      threshold: 'threshold',
      operation: 'operation',
    },
    formValidate: ' cannot be empty',
  },
  showData: {
    signOutBtn: 'sign out',
    overlayer: {
      title: 'overlayers',
      data: 'Station Display',
      threedHeight: '3d Ocean Height',
      mapSeaHeight: 'Map Ocean Height',
      seaHeightPhoto: 'Sea Level Picture Display',
    },
    settingDialog: {
      title: 'Playing Setting',
      realTimeDataSetting:'Station Data Setting',
      selectStation:'Select station',
      showStation:'IOC Station',
      glossStation: 'GLOSS Station',
      unit: 'S',
      cancelBtn: 'cancel',
      saveBtn: 'save',
      secondsValue: 'Second value',
      formValidate: ' cannot be empty',
      positiveNumber: 'must be positive number',
      saveError: 'Save failed! Please set the playback parameters correctly'
    },
    mapSeaHeight: {
      playBtn: 'play',
      pauseBtn: 'stop',
      information: 'The data currently displayed is marine ADT data measured by satellites. The data is rendered with 1/8 precision and the January data of the starting year is used for rendering. '
    },
    glossDataTooltip:{
      dateUpdatedFaster: 'Stations with the faster data update compared with the update date of the data source',
      dateUpdatedSlower: 'Stations with the slower data update compared with the update date of the data source'
    },
    screenGuide:{
      first: 'Welcome to use the large screen display system',
      second: 'Set the display model order and duration',
      third: 'Choose display station type',
      forth:'Exit the large screen display',
      selectStationDatas: 'Choose the station you want to play',
      stationLegend: 'Station legend reference',
      playCustomStation: 'Show the data of our own station',
      nextBtn: 'Next step',
      upBtn: 'Previous',
      finishBtn: 'Finish',
      isShowNavigationTitle:'Whether to display page navigation',
      isShowNavigationText:'Click to "confirm", the page navigation will be displayed again; otherwise, click to "cancel"',
      confirmBtn:'confirm',
      cancelBtn:'cancel'
    },
    stationsInfo:{
      introduction: 'There are currently 290 GLOSS stations, of which 285 are valid stations. The number of sea level historical data from different data sources in these stations is roughly: PSMSL, 308,000; UHSLC, 176 million; VLIZ, 1.198 billion; SONEL, 939,600. The earliest record that can be found is from the GLOSS station in January 1846 in France, and the station still has data updates.'
    },
    sonelLegends: {
      workBest: 'The station works properly : data are available',
      workBetter: 'Problem(s) detected but data are available',
      workBad: "The station doesn't work",
      noExits: 'he station no longer exists',
      fromCountry: 'The station is not managed by France'
    },
    photo: {
      seaLevel: 'Global sea level',
      playBtn: 'Play',
      pauseBtn: 'Pause',
      viewReport: 'View report'
    }
  },
  video:{
    realTime:'Real Time',
    connect_error:'Data acquisition failed, and the camera connection is abnormal',
    show9images:'show 9 Images'
  }
};

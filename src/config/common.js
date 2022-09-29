//this is the config file
var commonUrl = 'http://localhost/tide/api/'//this is the generic api url

//When modifying, you only need to modify the above an address corresponding to the server background address.

const config = {
  //api url
  commonUrl: commonUrl,//api路径 api path

  dataWs: commonUrl.replace('http','ws') + 'ws/data?token=',//real-time data url
  statusWs: commonUrl.replace('http','ws') + 'ws/global?token=',//global status url
 
  listStation: commonUrl + 'listStation',
  editStation: commonUrl + 'editStation',
  listItem:  commonUrl +  'listItem',
  delStation: commonUrl +  'delStation',
  listPermission: commonUrl +  'listPermission',
  seaHeightData: commonUrl +  'seaHeightData',
  getSeaLevelList: commonUrl +  'getSeaLevelList',
  getGlossDataList: commonUrl +  'getGlossDataList',
  IOCHistory: commonUrl +  'IOCHistory',
  dataHistory: commonUrl +  'dataHistory',
  getSonelDataList: commonUrl +  'getSonelDataList',
  getPsmslDataList: commonUrl +  'getPsmslDataList',
  listDevice: commonUrl +  'listDevice',
  listDeviceRecord: commonUrl +  'listDeviceRecord',
  editDeviceRecord: commonUrl +  'editDeviceRecord',
  login: commonUrl + 'login',
  logout: commonUrl + 'logout',

  //language pack
  langs: {
    'zhHans': '中文',
    'en': 'English'
  },
  //Large screen display 
  largeScreen: {
    logoUrl: require('../assets/sealogo.png')// logo url
  }

}
export default config
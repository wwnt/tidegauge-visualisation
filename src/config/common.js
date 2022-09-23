var commonUrl = 'https://test.navi-tech.net/api/tgm/'
var wsUrl = 'wss://test.navi-tech.net/tmws/'

module.exports = {
  commonUrl: commonUrl,//api路径 api path

  webSocket: wsUrl + 'data',//websocket url
  status: wsUrl + 'global',//global status url

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
  editDeviceRecord: commonUrl +  'editDeviceRecord'


}
//this is the api config file
var commonUrl = 'http://test.navi-tech.net/tm/'//this is the generic api url
var wsUrl = 'ws://test.navi-tech.net/tmws/'//this is the generic websocket url
//When modifying, you only need to modify the above two addresses corresponding to the server background address.

const url = {
  commonUrl: commonUrl,//api路径 api path

  dataWs: wsUrl + 'data?token=',//websocket url
  statusWs: wsUrl + 'global?token=',//global status url
 
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
  logout: commonUrl + 'logout'

}
export default url
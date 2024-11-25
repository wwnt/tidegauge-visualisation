//this is the config file

 var commonUrl = 'https://oceans.navi-tech.net/api/'//this is the generic api url

//const protocol = window.location.protocol; // 获取协议，值为 'http:' 或 'https:' Get the protocol, the value is 'http:' or 'https:'
//const hostname = window.location.hostname; // 获取域名 Get a domain name
//const port = window.location.port; // 获取端口（如果有的话）Get the port (if any)

// 构建 API 基础地址 Build the API base address
//const commonUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}/api/`;
// 根据当前协议动态选择 WebSocket 协议 Dynamically select the WebSocket protocol based on the current protocol
//const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
//const wsBaseUrl = `${wsProtocol}//${hostname}${port ? `:${port}` : ''}/api/ws/`;

//When modifying, you only need to modify the above an address corresponding to the server background address.

const config = {
  //api url
  commonUrl: commonUrl,//api路径 api path

  dataWs: commonUrl.replace('https','wss') + 'ws/data?token=',//real-time data url
  statusWs: commonUrl.replace('https','wss') + 'ws/global?token=',//global status url
  //dataWs: wsBaseUrl + 'data?token=',
  //statusWs: wsBaseUrl + 'global?token=',
 
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
    'en': 'English',
    'pt': 'Portuguese'
  },
  //Large screen display 
  largeScreen: {
    logoUrl: require('../assets/sealogo.png')// logo url
  },

  seaHeightPhoto: 'https://oceans.navi-tech.net/sea_height_photo/',
  reportUrl: 'https://oceans.navi-tech.net/report/',
  //seaHeightPhoto: `${protocol}//${hostname}${port ? `:${port}` : ''}/sea_height_photo/`,//海平面图片所在的文件夹 The folder where the sea level images are located
  //reportUrl: `${protocol}//${hostname}${port ? `:${port}` : ''}/report/`,//报告路径 report url
  seaHeightPhotoStartYear: 1993,
  seaHeightPhotoEndYear: 2022,
  seaHeightPhotoLessMonths: 8
}
export default config
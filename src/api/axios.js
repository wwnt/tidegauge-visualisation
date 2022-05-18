import axios from 'axios';
import qs from 'qs';
import router from '../router/index';
import commonCfg from "../config/common";

// 配置API接口地址
// Configure the API interface address
let commonUrl = commonCfg.commonUrl;
let version = commonCfg.urlVersion;

// http request 拦截器
// http request interceptor
axios.interceptors.request.use(
  (config) => {
    if (localStorage.token) {
      if (config.url !== 'token/1.0' && config.url !== 'validate/1.0') {
        config.headers.Authorization = `Bearer ${localStorage.token}`;
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// http response 拦截器
// http response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          // 401 Clear the token information and jump to the login page
          //store.dispatch(USER_SIGNOUT)
          if (localStorage.token) {
            document.cookie = "token=''; path=/"; //清除cookie里的token Clear the token in the cookie
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
          }
          console.log(router);
          router.replace({
            path: '/login', //跳转到登录页面 Jump to login page
            // query: { redirect: router.currentRoute.fullPath } // 登陆跳转之前页面 Login to the previous page
          });
      }
    }
    return Promise.reject(error.response.data);
  }
);

function apiAxios(method, url, params) {
  return axios({
    method: method,
    url: `${url}${version}`,
    data: method === 'POST' || method === 'PUT' ? params : null, //作为请求正文发送的数据 Data sent as request body
    params: method === 'GET' || method === 'DELETE' ? params : null, //与请求一起发送的URL参数 URL parameters sent with the request
    baseURL: commonUrl,
    withCredentials: false,
    // paramsSerializer:  url === 'edittemp' ? function (params) {
    //   return qs.stringify(params, {arrayFormat: 'indices'})
    // } : null ,

    // headers:
    //   url === 'token' || 'validate'
    //     ?
    //     {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       'Authorization': ''
    //     }
    //     :
    //     {
    //       'Content-Type': 'application/json'
    //     }
  })
    .then(function(res) {
      //从apiAxios函数中的axios调用返回promise
      //Return promise from axios call in apiAxios function
      return res.data;
    })
    .catch(function(err) {
      if (err.error === 'invalid_grant') {
        //401 error
        console.log('用户名或密码错误;wrong user name or password');
      }
    });
}
function getImage(method, url, params) {
  return axios({
    url:`${url}${version}`,
    method: method,
    responseType: 'arraybuffer',
    baseURL: commonUrl,
    params
  }).then(function(res) {
    //从apiAxios函数中的axios调用返回promise
    //Return promise from axios call in apiAxios function
    return res.data;
  })
  .catch(function(err) {
    if (err.error === 'invalid_grant') {
      //401 error
      console.log('用户名或密码错误;wrong user name or password');
    }
  });
}
// 返回在vue模板中的调用接口
// Return the calling interface in the vue template
export default {
  get: function(url, params) {
    return apiAxios('GET', url, params);
  },
  getImg:function(url, params){
    return getImage('GET', url, params);
  },
  post: function(url, params) {
    if (
      url === 'delGNSS' ||
      url === 'edittemp' ||
      url === 'delThreshold' ||
      url === 'delSpot' ||
      url === 'delUpstream'
    ) {
      params = qs.stringify(params); //以 x-www-form-urlencoded 格式发送数据；不用qs的话以 application/json格式发送 Send data in x-www-form-urlencoded format; send data in application/json format without qs
    }
    return apiAxios('POST', url, params);
  },
  put: function(url, params) {
    return apiAxios('PUT', url, params);
  },
  delete: function(url, params) {
    return apiAxios('DELETE', url, params);
  },
  login: function(url, params) {
    params = qs.stringify(params); //对象格式化为字符串 Object formatted as string
    console.log(params);
    return apiAxios('POST', url, params);
  },
  validate: function(url, params) {
    params = qs.stringify(params);
    return apiAxios('POST', url, params);
  },
  logout: function(url, params) {
    params = qs.stringify(params);
    return apiAxios('POST', url, params);
  },
};

import Vue from 'vue';
import VueRouter from 'vue-router';
import axiosTool from '../api/axios'
import Login from '../views/login';
import registered from '../views/registered';
//import ShowData from '../views/showData';
import bigScreenMapStations from '../views/bigScreen/mapStations.vue'
import globeSeaHeight from '../views/bigScreen/globeSeaHeight.vue'
import mapSeaHeight from '../views/bigScreen/mapSeaHeight.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '',
        name: 'stationList',
        component: () => import('../views/stationList.vue'),
        meta: { requireAuth: true, roles: ['SA', 'GA', 'OU'] } 
      },
      {
        path: 'stationList',
        name: 'stationList',
        component: () => import('../views/stationList.vue'),
        meta: { requireAuth: true, roles: ['SA', 'GA', 'OU'] } 
      },
      {
        path: 'stationDetail/:id',
        name: 'stationDetail',
        component: () => import('../views/stationDetail.vue'),
        meta: { requireAuth: true, roles: ['SA', 'GA', 'OU'] } 
      },
      // {
      //   path: 'data',
      //   name: 'Data',
      //   component: () => import('../views/data.vue'),
      // },
      {
        path: 'video',
        name: 'Video',
        component: () => import('../views/video.vue'),
        meta: { requireAuth: true, roles: ['SA', 'GA', 'OU'] } 
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/user/user.vue'),
        meta: { requireAuth: true, roles: ['SA', 'GA'] } ,
        children:[
          {
            path: 'manageUser',
            name: 'manageUser',
            component: () => import('../views/user/manageUser.vue'),
            meta: { requireAuth: true, roles: ['SA', 'GA'] } 
          },
          // {
          //   path: 'accessRequest',
          //   name: 'accessRequest',
          //   component: () => import('../views/user/accessRequest.vue'),
          //   meta: { requireAuth: true, roles: ['SA', 'GA'] } 
          // },
          {
            path: 'accountRequest',
            name: 'accountRequest',
            component: () => import('../views/user/accountRequest.vue'),
            meta: { requireAuth: true, roles: ['SA', 'GA'] } 
          }
        ]
      },
      {
        path: 'history',
        name: 'History',
        component: () => import('../views/history.vue'),
        meta: { requireAuth: true, roles: ['SA', 'GA', 'OU'] } 
      },
      {
        path: 'otherConfig',
        name: 'otherConfig',
        component: ()=> import('../views/otherConfig/navigation.vue'),
        meta: { requireAuth: true, roles: ['SA', 'GA'] } ,
        children:[
          {
            path: 'sensor',
            name: 'sensor',
            component: ()=> import('../views/otherConfig/sensor.vue'),
          },
          {
            path: 'dataSource',
            name: 'dataSource',
            component: ()=> import('../views/otherConfig/dataSource.vue'),
          }
        ]
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  // {
  //   path: '/showData',
  //   name: 'ShowData',
  //   component: ShowData,
  // },
  {
    path: '/showData',
    name: 'ShowData',
    component: () => import('../views/bigScreen/main.vue'),
    children: [
      {
        path: '',
        components: {
          mapStations: bigScreenMapStations,
          globeSeaHeight: globeSeaHeight,
          mapSeaHeight: mapSeaHeight
        }
      }
    ]
  },
  {
    path:'/registered',
    name:'registered',
    component: registered,
  }
];

const router = new VueRouter({
  //mode: 'history',
  // base: process.env.BASE_URL,s
  routes,
});


//全局有效 跳转之前执行
router.beforeEach((to, from, next) => {
  let vm = router.app
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      //console.log(to)
      if (localStorage.token) {  // 判断当前的token是否存在
          axiosTool
              .validate("validate", { token: localStorage.token })
              .then(res => {
                  if (res.active == true) {
                      //get the user information and store the role
                      axiosTool.get('userInfo')
                          .then(res => {
                              //console.log(res)
                              localStorage.email = res.email
                              localStorage.username = res.username
                              localStorage.role = res.role
                              localStorage.live_camera=res.live_camera
                              let role;
                              if (res.role == 2) {
                                  role = 'SA';//"SuperAdmin";
                              }
                              else if (res.role == 1) {
                                  role = 'GA';//"GroupAdmin"; 
                                  // vm.$root.groupIdForLoginUser = res.groupId;//当前组管理员的组id
                              } else {
                                  role = 'OU';//"OrdinaryUser"                                  
                              }
                              vm.$root.role = role;
                              if (to.meta.roles.indexOf(role) != -1) {//角色存在于有权限的角色列表里
                                  next();
                              } else {
                                  next(false);//拦截，使其跳回原页面
                              }
                              console.log(vm.$root.role)
                          })
                  } else {
                      next({
                          path: '/login',
                          query: { redirect: to.fullPath }
                      })
                  }
              });
      }
      else {
          next({
              path: '/login',
              query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，跳转到该路由
          })
      }
  }
  else {
      next();
  }
})

export default router;

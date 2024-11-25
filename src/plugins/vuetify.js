/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import zhHans from '../lang/zh-Hans'; //中文 Chinese
import en from '../lang/en'; //英语 English
import treeSelect from 'ant-design-vue/lib/tree-select'; // 加载 JS load js
import '@mdi/font/css/materialdesignicons.css'
import pt from '../lang/portu'
Vue.use(Vuetify);
Vue.use(treeSelect);
// Vue.component('my-component', {
//   methods: {
//     changeLocale(type) {
//       this.$vuetify.lang.current = type;
//     },
//   },
// });

console.log(navigator.language || navigator.userLanguage)
let currentLang = ''
if(localStorage.lang) {
  currentLang = localStorage.lang
}else {
  let navLang = navigator.language || navigator.userLanguage//浏览器默认语言 Browser default language
  if(navLang.startsWith('zh')) {
    navLang = 'zhHans'
  }else if(navLang.startsWith('en')){
    navLang = 'en'
  }else if(navLang.startsWith('pt')){
    navLang = 'pt'
  }else {
    navLang = 'en'
  }
  currentLang = navLang
}

export default new Vuetify({
  lang: {
    locales: { zhHans, en, pt },
    current: currentLang
  },
  icons: {
    iconfont: 'mdi'
  },
});

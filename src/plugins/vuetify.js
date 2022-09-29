/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import zhHans from '../lang/zh-Hans'; //中文 Chinese
import en from '../lang/en'; //英语 English
import treeSelect from 'ant-design-vue/lib/tree-select'; // 加载 JS load js
Vue.use(Vuetify);
Vue.use(treeSelect);
// Vue.component('my-component', {
//   methods: {
//     changeLocale(type) {
//       this.$vuetify.lang.current = type;
//     },
//   },
// });
export default new Vuetify({
  lang: {
    locales: { zhHans, en },
    current: localStorage.lang == null ? 'zhHans' : localStorage.lang,
  },
});

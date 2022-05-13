<template>
  <!-- 用户配置 -->
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3" lg="2">
        <v-card style="min-height: 86vh">
          <v-navigation-drawer width="100%" permanent floating>
            <v-tabs vertical>
              <v-tab to='/user/manageUser'>{{ this.$vuetify.lang.t('$vuetify.userconfig.tabs.tab1')}}</v-tab>
              <v-tab to='/user/accountRequest'>
                <v-badge :content="messages" :value="messages" color="red">
                  {{$vuetify.lang.t("$vuetify.userconfig.tabs.tab2")}}
                </v-badge>
              </v-tab>
            </v-tabs>
          </v-navigation-drawer>
        </v-card>
      </v-col>

      <!-- 子组件 -->
      <v-col cols="12" md="9" lg="10">
        <router-view style="padding-top:0px" :allItems="allItems" @updateMessages="updateMessages">
        </router-view>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axiosTool from '@/api/axios.js';
export default {
  data () {
    return {
      messages: 0
    }
  },
  mounted () {
    this.getApplyUser()
  },
  props: ['allItems'],
  methods: {
    getApplyUser () {
      let param = {
        application: true
      }
      axiosTool.get('listUser', param).then(res => {
        if (res == null) {
          res = []
        }
        this.messages = res.length
      })
    },
    updateMessages () {
      this.getApplyUser()
      this.$emit('updateMessages')
    },
  }
}
</script>
<style scoped>
a.v-tab--active.v-tab {
  color: blue;
}
</style>
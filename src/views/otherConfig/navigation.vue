<template>
  <!-- 用户配置 -->
  <!-- user config -->
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3" lg="2">
        <v-card style="min-height: 86vh">

          <v-navigation-drawer width="100%" permanent floating>
            <v-tabs vertical>
              <v-tab to='/otherConfig/sensor'>{{ this.$vuetify.lang.t('$vuetify.otherConfig.tabs.tab1')}}</v-tab>
              <v-tab to='/otherConfig/dataSource'>
                {{$vuetify.lang.t("$vuetify.otherConfig.tabs.tab2")}}
              </v-tab>
            </v-tabs>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <!-- 子组件 -->
      <!-- child component -->
      <v-col cols="12" md="9" lg="10">
        <router-view style="padding-top:0px"></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {

    }
  }
}
</script>
<style scoped>
a.v-tab--active.v-tab {
  color: blue;
}
</style>
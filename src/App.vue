<template>
  <router-view></router-view>

</template>

<script>
//import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    //HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>
<style>
.header-row {
  background: linear-gradient(
    180deg,
    #1e5799 0,
    #2989d8 50%,
    #207cca 51%,
    #7db9e8
  );
}
/* 
.leaflet-popup-content-wrapper,
.leaflet-popup-tip, */
.card-color {
  background: #000337 !important;
  border: solid 1px #4cbaff;
  box-shadow: inset 0px 0px 32px 0px rgba(131, 218, 255, 0.3) !important;
}
.header-bar {
  background: #000337 !important;

  box-shadow: inset 0px 0px 32px 0px rgba(131, 218, 255, 0.3) !important;
}
</style>
